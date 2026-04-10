# My Inner Family — Setup Guide
## You'll be live in about 15 minutes ⏱️

---

## STEP 1 — Get the files onto your computer

The project folder is called `my-inner-family`.
Download it from Claude, or copy it to your Desktop.

Then open your Terminal and run:

```bash
cd ~/Desktop/my-inner-family
npm install
```

This installs all the packages. Takes about 1 minute.

---

## STEP 2 — Create your Supabase project

1. Go to → https://supabase.com
2. Sign in (same account you used for My Inner Mind)
3. Click **"New Project"**
4. Name it: `my-inner-family`
5. Set a strong database password (save it somewhere)
6. Choose region: **US East** (same as My Inner Mind)
7. Click **Create Project** — takes ~2 minutes to spin up

---

## STEP 3 — Run the database schema

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` from the project folder
4. Copy ALL of it and paste it into the SQL Editor
5. Click **Run** (the green button)
6. You should see: ✅ Success — no errors

---

## STEP 4 — Get your Supabase keys

1. In Supabase, go to **Settings → API** (left sidebar)
2. Copy these two values:
   - **Project URL** (looks like: https://xxxx.supabase.co)
   - **anon / public** key (long string starting with "eyJ...")

---

## STEP 5 — Add your environment variables

1. In your project folder, find the file `.env.example`
2. Duplicate it and rename the copy to `.env.local`
3. Open `.env.local` and fill it in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

Save the file.

---

## STEP 6 — Run the app locally

```bash
npm run dev
```

Open your browser to → http://localhost:5173

You should see the My Inner Family landing page! 🌿

Test the full flow:
1. Create an account
2. Name your family
3. Create your member profile
4. Explore the home dashboard, journal, and gratitude wall

---

## STEP 7 — Deploy to Vercel

1. Push the project to a new GitHub repo:

```bash
git init
git add .
git commit -m "Initial My Inner Family scaffold"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-inner-family.git
git push -u origin main
```

2. Go to → https://vercel.com
3. Click **"Add New Project"**
4. Import your `my-inner-family` GitHub repo
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` → your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
6. Click **Deploy**

Your app will be live at something like:
→ `my-inner-family.vercel.app`

You can then add a custom domain like `myinnerfamily.halliewho.com` 
in Vercel → Settings → Domains.

---

## STEP 8 — Enable Email Auth in Supabase

1. In Supabase, go to **Authentication → Providers**
2. Make sure **Email** is enabled (it is by default)
3. Under **Authentication → Email Templates**, customize
   the confirmation email to match your Hallie Who branding

---

## What's been built ✅

| Screen | Status |
|--------|--------|
| Landing page | ✅ Done |
| Sign up / Sign in | ✅ Done |
| Onboarding (3 steps) | ✅ Done |
| Home dashboard | ✅ Done |
| Family Journal (list) | ✅ Done |
| Write a Journal Entry | ✅ Done |
| Gratitude Wall | ✅ Done |
| Badges page | ✅ Done |
| Family management | ✅ Done |
| Bottom navigation | ✅ Done |
| PWA (installable on iPhone) | ✅ Done |

---

## What's coming next (Phase 2) 🔜

- Kids mode with enchanted forest UI
- Family challenges + badge logic wired to real data
- Letters to the Future (write + unlock flow)
- Mood history charts
- Family invite via code (join existing family)
- Push notifications for mood check-ins
- Community Circles (Phase 3)

---

## If you get stuck

Message Claude with the exact error you see and 
we'll fix it together. You've done this before 
with My Inner Mind — you've got this. 🌿
