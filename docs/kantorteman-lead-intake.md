# KantorTeman Lead Intake Integration

TemanUMKMKita contact submissions are stored locally first, then forwarded to KantorTeman as external leads.

## Required Backend Env

Set these in the shared-hosting backend `.env`:

```env
CRM_API_URL=https://api.kantorteman.my.id
CRM_API_KEY=<KantorTeman external_lead_api_key>
```

Do not put the real key in git or chat.

## Runtime Flow

```text
TemanUMKMKita /api/contact-form
-> contact_submissions row
-> background forward
-> KantorTeman /api/leads/external
```

Forward payload source:

```json
{
  "source": "website_temanumkmkita"
}
```

Auth header:

```http
X-API-Key: <CRM_API_KEY>
```

## Non-Secret Status Check

```bash
curl https://<temanumkmkita-api-domain>/api/integrations/kantorteman/lead-intake/status
```

Expected configured response:

```json
{
  "service": "temanumkmkita",
  "flow": "lead_intake",
  "status": "ok",
  "crm_configured": true,
  "crm_api_host": "api.kantorteman.my.id",
  "target_path": "/api/leads/external",
  "source": "website_temanumkmkita"
}
```

## Manual Upload Notes

Upload changed backend files to shared hosting:

- `backend/app/routers/contact.py`
- `backend/tests/test_contact_integration.py` only if tests are stored on the server

Restart the Python app after upload. Do not run seed/reset commands.
