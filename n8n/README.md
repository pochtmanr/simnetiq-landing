# n8n support-email workflow

Support form flow: `/support` form → `POST /api/support` → row stored in
Supabase `support_requests` → webhook fired to n8n → n8n emails the team.

## The auto-reply was removed — ACTION REQUIRED in n8n

The workflow used to send a second email, from `support@simnetiq.store`, to
whatever address the form was filled in with. That address is attacker-supplied
and unverified, so anyone could make our mail server deliver mail to a stranger:
classic backscatter. The cost is not theoretical — it is the reputation of
`simnetiq.store`, and once that domain is blocklisted the replies we send to
*real* customers start bouncing.

`simnetiq-support-workflow.json` in this folder no longer contains the
"Auto-reply to user" node. **The live n8n workflow still does until someone
changes it**, so re-import the file (or open the workflow and delete that node,
reconnecting "Email team" → "Respond 200"). Re-importing is the safer of the
two.

If an acknowledgement to the user is wanted later, the honest way is to send it
only to an address that has been proved to belong to the sender — e.g. a signed
confirmation link — not to whatever the form said. The `/support` page already
shows a confirmation on screen, which is what most people are actually after.

## Import

1. In n8n (https://n8n.dopplervpn.org): **Workflows → ⋯ → Import from File**
   and select `simnetiq-support-workflow.json`.
2. Open the **Send Email** node ("Email team") and pick your existing SMTP
   credential — the one already used for `support@simnetiq.store` in your other
   workflows.
3. Open the **Check secret** node and replace `REPLACE-WITH-RANDOM-SECRET`
   with a real secret (`openssl rand -hex 24`). Put the same value in
   `N8N_WEBHOOK_SECRET` in `.env.local` and in the Vercel env vars.
4. **Activate** the workflow (toggle top-right). Activation switches the
   webhook from the test URL to the production URL.

## Webhook URL for the env file

```
N8N_SUPPORT_WEBHOOK_URL=https://n8n.dopplervpn.org/webhook/simnetiq-support
```

(While testing an inactive workflow, n8n listens on
`https://n8n.dopplervpn.org/webhook-test/simnetiq-support` instead, and only
for one call after you press "Listen for test event".)

## Workflow structure

```
Webhook (POST /webhook/simnetiq-support)
  └─ Check secret (x-webhook-secret header matches N8N_WEBHOOK_SECRET)
       ├─ true  → Email team (support@simnetiq.store, reply-to = user)
       │           → Respond 200 {"ok":true}
       └─ false → Respond 403 {"ok":false}
```

## Payload sent by the site

```json
{
  "id": "uuid of the Supabase row",
  "created_at": "2026-07-06T12:34:56.789Z",
  "name": "Alex",
  "email": "user@example.com",
  "topic": "Billing & credits",
  "message": "…"
}
```

Notes:

- "Email team" sets `Reply-To` to the user's address, so replying to the
  notification in your mail client answers the user directly. This is the only
  mail the workflow sends, and it goes to an address we control.
- The site no longer fires the webhook for a duplicate submission — the same
  (email, message) pair inside 10 minutes is deduped in Postgres by
  `submit_support_request()`, so a double-tap on Send does not mail you twice.
- A webhook failure never loses a request — every submission is stored in
  Supabase first; the n8n step only handles email.
- Test end-to-end with:

```bash
curl -X POST https://n8n.dopplervpn.org/webhook/simnetiq-support \
  -H 'Content-Type: application/json' \
  -H 'x-webhook-secret: YOUR-SECRET' \
  -d '{"id":"test","created_at":"2026-07-06T00:00:00Z","name":"Test","email":"you@example.com","topic":"Bug report","message":"Test message"}'
```

---

# n8n support-reply workflow

Answering a ticket from `/admin/support`: operator writes a reply → `POST
/api/admin/support/reply` → `admin_support_reply()` records it (as that
operator, checked by `is_admin()`) → webhook fired to n8n → n8n emails the
customer from `support@simnetiq.store` (BCC to the same inbox, so the team has
a copy) → the route records whether the send worked.

This does not bring back the backscatter problem above: nothing is sent
automatically. Each email is one reply that a signed-in operator (password +
TOTP) wrote to one stored ticket, and it is audit-logged.

## Import

1. **Workflows → ⋯ → Import from File** → `simnetiq-reply-workflow.json`.
2. **Email customer** node: pick the same SMTP credential as the other workflow.
3. **Check secret** node: use the same secret as `N8N_WEBHOOK_SECRET`.
4. **Activate** it, then set in Vercel (and `.env.local`):

```
N8N_SUPPORT_REPLY_WEBHOOK_URL=https://n8n.dopplervpn.org/webhook/simnetiq-support-reply
```

Until that variable is set, replies are saved and shown as "not emailed", and
the panel offers the operator's own mail app instead.

## Payload sent by the site

```json
{
  "type": "reply",
  "request_id": "uuid of the ticket",
  "reply_id": "uuid of the support_replies row",
  "to": "user@example.com",
  "name": "Alex",
  "locale": "en",
  "subject": "Re: Billing & credits — SMS Code support",
  "body": "the operator's reply",
  "original_message": "what the customer wrote"
}
```
