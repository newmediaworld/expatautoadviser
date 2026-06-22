/**
 * Vercel Serverless Function — POST /api/subscribe
 *
 * Unified Brevo ingress for ExpatAutoAdviser (SG + HK).
 *
 * Flow:
 *  - Client posts { email, sourcePage, sourceType, firstMagnet, city,
 *    source, guideTopic }
 *  - We add the contact to the EAA PENDING list with full attributes.
 *  - We immediately send the magnet delivery email via Brevo's
 *    transactional /v3/smtp/email endpoint, with inline HTML looked up
 *    from MAGNETS in ./magnets.js. No Brevo Automations or templates.
 *
 * Note: we skip double-opt-in. The lead magnet IS the consent — the
 * user typed their email to get the PDF.
 *
 * Contact attributes stored:
 *   SOURCE_PAGE   — e.g. "/singapore/buying-guide"
 *   SOURCE_TYPE   — "inline-cta" | "exit-intent" | "homepage-newsletter"
 *   SITE          — "expatautoadviser"
 *   CITY          — "singapore" | "hong-kong"
 *   FIRST_MAGNET  — magnet slug or ""
 *   GUIDE_TOPIC   — e.g. "buying", "leasing", "garage", "calculator",
 *                   "general" (enables topic-based email segmentation)
 *   SUBSCRIBED_AT — ISO timestamp
 *
 * Env vars required (set in Vercel):
 *   BREVO_API_KEY              — Brevo master API key
 *   BREVO_EAA_PENDING_LIST_ID  — numeric list ID of EAA pending list
 */

import { MAGNETS, buildMagnetEmailHtml, buildMagnetEmailText, EMAIL_SENDER, EMAIL_REPLY_TO } from './magnets.js';

/* ── Brevo attribute pre-declaration ──────────────────────
 * Brevo silently drops attributes that haven't been pre-declared in the
 * contact schema. We ensure GUIDE_TOPIC exists on every cold start.
 * The call is idempotent — Brevo returns 400 if it already exists.
 */
let _attrsDeclared = false;
async function ensureBrevoAttributes(apiKey) {
  if (_attrsDeclared) return;
  const attrs = ['GUIDE_TOPIC'];
  for (const name of attrs) {
    try {
      await fetch(
        `https://api.brevo.com/v3/contacts/attributes/normal/${name}`,
        {
          method: 'POST',
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({ type: 'text' }),
        }
      );
    } catch (_) {
      // Non-critical — if this fails the attribute may already exist
    }
  }
  _attrsDeclared = true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const {
      email,
      sourcePage,
      sourceType,
      firstMagnet,
      city,
      source,
      guideTopic,
    } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const pendingListId = Number(process.env.BREVO_EAA_PENDING_LIST_ID || 0);

    if (!apiKey || !pendingListId) {
      // Don't expose infra state to the client, but log loudly.
      console.error(
        'Brevo env missing: BREVO_API_KEY or BREVO_EAA_PENDING_LIST_ID'
      );
      return res.status(200).json({ ok: true });
    }

    // Ensure new attributes exist in Brevo schema (idempotent, cached).
    await ensureBrevoAttributes(apiKey);

    const normalisedCity = city === 'hk' ? 'hong-kong' : 'singapore';

    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [pendingListId],
        updateEnabled: true,
        attributes: {
          SOURCE_PAGE: sourcePage || source || 'unknown',
          SOURCE_TYPE: sourceType || 'inline-cta',
          SITE: 'expatautoadviser',
          CITY: normalisedCity,
          FIRST_MAGNET: firstMagnet || '',
          GUIDE_TOPIC: guideTopic || 'general',
          SUBSCRIBED_AT: new Date().toISOString(),
        },
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text().catch(() => '');
      console.error('Brevo subscribe failed:', brevoRes.status, errText);
    }

    // Decide which email to send:
    //  - If the client requested a specific magnet (firstMagnet is set),
    //    send that magnet's delivery email.
    //  - If this is a pure newsletter subscribe (firstMagnet is empty),
    //    send the city-appropriate welcome guide instead.
    const magnetKey = firstMagnet || '';
    let emailMagnetKey = magnetKey;
    let emailTags = [];

    if (magnetKey && MAGNETS[magnetKey]) {
      // Explicit magnet request — send that PDF
      emailTags = ['magnet-delivery', magnetKey];
    } else {
      // Pure subscribe — send the welcome guide for their chosen city
      emailMagnetKey =
        city === 'hk' ? 'eaa-hk-welcome-guide' : 'eaa-sg-welcome-guide';
      emailTags = ['welcome-email', emailMagnetKey];
    }

    const magnet = MAGNETS[emailMagnetKey];
    if (magnet) {
      try {
        const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({
            sender: EMAIL_SENDER,
            replyTo: EMAIL_REPLY_TO,
            to: [{ email }],
            subject: magnet.subject,
            htmlContent: buildMagnetEmailHtml(magnet, emailMagnetKey),
            textContent: buildMagnetEmailText(magnet, emailMagnetKey),
            tags: emailTags,
            // List-Unsubscribe header: Yahoo's strongest signal for
            // "legitimate transactional, do not spam-route". RFC 2369
            // mailto: form works across all major receivers.
            headers: {
              'List-Unsubscribe': `<mailto:unsubscribe@expatautoadviser.com?subject=unsubscribe%20${encodeURIComponent(email)}>`,
            },
            // Attach the PDF — confirmed working on Gmail.
            // Yahoo strips attachments from spam-folder emails;
            // List-Unsubscribe (above) handles Yahoo placement.
            attachment: [
              {
                url: `https://www.expatautoadviser.com${magnet.pdfPath}`,
                name: magnet.pdfPath.split('/').pop(),
              },
            ],
          }),
        });
        if (!emailRes.ok) {
          const errText = await emailRes.text().catch(() => '');
          console.error('Brevo email failed:', emailRes.status, errText);
          // Surface as 502 — contact already created above so the
          // form UX can still say "you're subscribed". Previously a
          // silent skip + ok:true that took Brevo dashboard inspection
          // to detect. Pattern: SHARED/lessons.md 2026-06-21.
          return res.status(502).json({
            error: 'Subscribed but magnet delivery failed — we will retry.',
            detail: `BREVO_SEND_FAILED:${emailRes.status}:${errText.slice(0, 200)}`,
            contactCreated: true,
          });
        }
      } catch (emailErr) {
        console.error('Brevo email exception:', emailErr);
        const msg = emailErr instanceof Error ? emailErr.message : String(emailErr);
        return res.status(502).json({
          error: 'Subscribed but magnet delivery failed — we will retry.',
          detail: `BREVO_SEND_EXCEPTION:${msg.slice(0, 200)}`,
          contactCreated: true,
        });
      }
    } else {
      // Unknown magnet key — caller bug. Return 400 with structured
      // detail. Previously a silent warn + ok:true; only visible by
      // checking Brevo dashboard for an absent send.
      console.warn(
        `No magnet config found for key: ${emailMagnetKey}. Email not sent.`
      );
      return res.status(400).json({
        error: 'Unknown magnet key',
        detail: `UNKNOWN_MAGNET_KEY:${emailMagnetKey}`,
        contactCreated: true,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    // Bug-class catch: bubble to 500. Returning ok:true here was
    // actively deceptive — programmer errors and network failures
    // looked successful. SHARED/lessons.md 2026-06-21.
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      error: 'Something went wrong. Please try again.',
      detail: msg.slice(0, 200),
    });
  }
}
