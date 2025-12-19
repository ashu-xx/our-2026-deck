# Local Development Setup

## Environment Variables
The `.env` file has been configured with dummy values for local testing:

```
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMn0.dummyKeyForLocalDevelopment
VITE_ADMIN_EMAIL=admin@example.com
```

## Dummy Login Credentials

Since these are dummy Supabase credentials, the authentication **will not work** against a real Supabase instance.

### Options for Local Development:

1. **Use Real Supabase Credentials** (Recommended)
   - Create a free Supabase project at https://supabase.com
   - Replace the dummy values in `.env` with your actual project URL and anon key
   - Set up users in Supabase Auth
   - Use real email/password to login

2. **Local Development Mode** (For testing without backend)
   - Enable the local dev mode in the code (see below)
   - Use any email/password combination
   - Will bypass Supabase authentication

## To Enable Local Dev Mode:
Add this to your `.env` file:
```
VITE_LOCAL_DEV_MODE=true
```

Then use these credentials:
- **Admin User**: `admin@example.com` / `password123`
- **Regular User**: `user@example.com` / `password123`

## Running the App
```bash
npm run dev
```

