# i2 Ministries — Complete Website

A fully redesigned static website for i2 Ministries, ready to deploy on Vercel.

## What's Included

```
i2-site/
├── index.html          → Homepage (/)
├── about.html          → About / Dr. Joshua Lingel (/about, /joshua-lingel)
├── mission.html        → The Mission (/the-mission)
├── get-trained.html    → Get Trained (/get-trained)
├── donate.html         → Donate (/donate)
├── donate-form.html    → Donate Form (/donate-form) → links to GivingFuel
├── contact.html        → Contact Us (/contact) → emails to info@i2ministries.org
├── images/             → All images (empty until you run download-images.sh)
├── vercel.json         → URL routing, caching headers
├── download-images.sh  → Pulls all images from current WordPress site
├── .gitignore
└── README.md
```

## External Services (unchanged, separate domains)
- resources.i2ministries.org → Shopify store
- i2ministries-emfci.com → Every Muslim for Christ Initiative site
- mmwu.org → Mission Muslim World University
- thewadi.org → WADI video training platform
- i2ministries.givingfuel.com → GivingFuel donation processing
- PayPal donation button (existing hosted button)
- FormSubmit.co → Contact form email delivery

---

## DEPLOYMENT INSTRUCTIONS

### Prerequisites
- A GitHub account (free: github.com)
- A Vercel account (free: vercel.com — sign in with GitHub)
- Git installed on your computer
- Terminal / command line access (Terminal on Mac, PowerShell on Windows)

---

### STEP 1: Download & Extract This Project

Extract the `i2-site.tar.gz` file you downloaded from Claude:

**Mac/Linux:**
```bash
tar -xzf i2-site.tar.gz
cd i2-site
```

**Windows (PowerShell):**
```powershell
tar -xzf i2-site.tar.gz
cd i2-site
```

---

### STEP 2: Download Images from WordPress

This script pulls all 29 images from the current WordPress CDN into the local `images/` folder:

```bash
bash download-images.sh
```

You should see a checkmark for each file. When done it will say how many files were downloaded. Verify the `images/` folder has files in it:

```bash
ls images/
```

You should see files like `hero-video-thumb.jpg`, `joshua-lingel.jpg`, `gallery-01.jpg`, etc.

---

### STEP 3: Create a GitHub Repository

```bash
git init
git add .
git commit -m "i2 Ministries website redesign"
```

Then go to github.com, click "New Repository", name it `i2-site` (or whatever you want), and follow the instructions to push:

```bash
git remote add origin https://github.com/YOUR-USERNAME/i2-site.git
git branch -M main
git push -u origin main
```

---

### STEP 4: Deploy to Vercel

**Option A — Via Vercel Dashboard (easiest):**
1. Go to vercel.com/new
2. Click "Import Git Repository"
3. Select your `i2-site` repo
4. Click "Deploy" — no settings to change, it auto-detects static HTML
5. Wait ~30 seconds. Done.

**Option B — Via CLI:**
```bash
npx vercel
```
Follow the prompts. It will give you a `.vercel.app` URL.

---

### STEP 5: Verify the Site

Vercel will give you a URL like `i2-site-abc123.vercel.app`. Visit it and check:
- [ ] Homepage loads with nav, hero, stats, training cards, endorsements
- [ ] All images load (if not, re-run download-images.sh)
- [ ] Click through every nav link — all 7 pages should work
- [ ] Test the contact form — submit a test message
- [ ] Test donate buttons — should open GivingFuel / PayPal in new tabs
- [ ] Test on mobile — hamburger menu, responsive layout

---

### STEP 6: Activate the Contact Form

The first time someone submits the contact form, FormSubmit.co will send a **confirmation email** to `info@i2ministries.org`. Someone needs to click the link in that email to verify the address. After that, all future form submissions go through automatically.

**To trigger this:**
1. Go to your deployed site → /contact
2. Fill out the form with a test message
3. Check info@i2ministries.org inbox for the FormSubmit verification email
4. Click the confirmation link
5. Submit the form again — this one will actually deliver

---

### STEP 7: Connect Your Domain (when ready)

**In Vercel:**
1. Go to your project dashboard on vercel.com
2. Settings → Domains
3. Add `i2ministries.org`
4. Add `www.i2ministries.org`

**At Your Domain Registrar (wherever i2ministries.org is registered):**

Update DNS records to:
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

Vercel will auto-provision an SSL certificate. The site should be live on your domain within a few minutes.

**IMPORTANT:** Only do this step when you're ready to take the WordPress site offline. While both are running on the same domain, only one can be active.

---

## NOTES

### Contact Form Bot Protection
The contact form has 4 layers of anti-bot protection:
1. **Honeypot fields** — hidden inputs that only bots fill (triggers silent fake success)
2. **Time gate** — submissions under 3 seconds are blocked (bots are instant)
3. **Math verification** — random addition problem (e.g., "What is 4 + 7?")
4. **FormSubmit _honey parameter** — server-side bot detection by FormSubmit

### Donate Form
The /donate-form page links out to GivingFuel's hosted form at `i2ministries.givingfuel.com/partners`. This is intentional — GivingFuel blocks iframe embedding from unknown domains. The donate flow is:
- /donate (info page) → /donate-form (choose method) → GivingFuel or PayPal (new tab)

### Future Updates
To update content, edit the HTML files, commit, and push to GitHub. Vercel auto-deploys on every push to main.

```bash
git add .
git commit -m "Updated content"
git push
```
Vercel deploys in ~10 seconds.

### Adding New Pages
1. Create a new .html file
2. Add a rewrite rule to vercel.json
3. Add a nav link to the new page (update the nav in all .html files)
4. Push to GitHub

