# n8n support-email workflow

Support form flow: `/support` form → `POST /api/support` → row stored in
Supabase `support_requests` → webhook fired to n8n → n8n emails the team and
auto-replies to the user.

## Import

1. In n8n (https://n8n.dopplervpn.org): **Workflows → ⋯ → Import from File**
   and select `simnetiq-support-workflow.json`.
2. Open each of the two **Send Email** nodes ("Email team", "Auto-reply to
   user") and pick your existing SMTP credential — the one already used for
   `support@simnetiq.store` in your other workflows.
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
       │           → Auto-reply to user (from support@simnetiq.store)
       │             → Respond 200 {"ok":true}
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
  notification in your mail client answers the user directly.
- A webhook failure never loses a request — every submission is stored in
  Supabase first; the n8n step only handles email.
- Test end-to-end with:

```bash
curl -X POST https://n8n.dopplervpn.org/webhook/simnetiq-support \
  -H 'Content-Type: application/json' \
  -H 'x-webhook-secret: YOUR-SECRET' \
  -d '{"id":"test","created_at":"2026-07-06T00:00:00Z","name":"Test","email":"you@example.com","topic":"Bug report","message":"Test message"}'
```
