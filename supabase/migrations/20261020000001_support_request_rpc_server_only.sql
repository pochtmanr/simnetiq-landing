-- Make submit_support_request callable from the server only.
--
-- The anon key is public (NEXT_PUBLIC_…), so granting the RPC to anon let
-- anyone call /rest/v1/rpc/submit_support_request directly and skip the
-- /api/support route entirely: no origin check, honeypot, Turnstile or
-- message validation. On 2026-10-20 15 probe rows arrived that way.
--
-- ORDER MATTERS — apply this only after BOTH:
--   1. SUPABASE_SERVICE_ROLE_KEY is set in Vercel production, and
--   2. the route change that sends it (app/api/support/route.ts) is deployed.
-- Applied earlier, every support submission fails with "couldn't save".
--
-- Apply manually (Supabase dashboard -> SQL Editor). Do not `db push`.

begin;

revoke execute on function public.submit_support_request(text,text,text,text,text,text,text,jsonb)
  from anon, authenticated;
grant execute on function public.submit_support_request(text,text,text,text,text,text,text,jsonb)
  to service_role;

commit;

notify pgrst, 'reload schema';
