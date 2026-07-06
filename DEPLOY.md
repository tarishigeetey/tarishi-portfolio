# Deployment to Vercel

Your portfolio is ready to deploy! Follow these steps to go live.

## Prerequisites

- GitHub account (for version control)
- Vercel account (free, sign in with GitHub)
- Groq account for live bot (free, optional but recommended)

---

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial portfolio commit"
git push origin main
```

Make sure `.env` is in `.gitignore` (it already is) so you never commit API keys.

---

## Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Click **"Deploy"** — Vercel will automatically:
   - Run `npm run build`
   - Serve `public/` as static files
   - Deploy `api/chat.js` as a serverless function
5. You'll get a live URL like `https://your-project.vercel.app`

Done! Your portfolio is now live with the **offline bot** (keyword-matched answers).

---

## Step 3 (Optional): Enable Live Bot with Groq

To upgrade from offline answers to real LLM responses:

### 3a. Get a Free Groq API Key

1. Go to https://console.groq.com/keys
2. Sign up with your email (no credit card required)
3. Copy your API key (starts with `gsk_`)
4. Keep this secret — never share or commit it

### 3b. Add to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** Paste your key from step 3a
4. Click **Save**

### 3c. Enable in Your Config

1. Open `src/config/portfolio.config.js`
2. Change:
   ```js
   botEndpoint: "/api/chat",
   ```
   (It's already set to this if you've been testing locally!)
3. Commit and push:
   ```bash
   git add src/config/portfolio.config.js
   git commit -m "Enable live bot with Groq"
   git push origin main
   ```
4. Vercel will automatically redeploy

### 3d. Test It

- Visit your live URL
- Scroll to "Ask the bot" section
- The status should now show **"● live — answered by an LLM"**
- Click a suggested question or type your own — you'll get real LLM answers!

---

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to **Domains**
2. Add your custom domain
3. Follow Vercel's DNS instructions

---

## Testing Before Deployment

Verify everything locally first:

```bash
# Make sure .env exists with your GROQ_API_KEY
GROQ_API_KEY=gsk_your_key_here

# Start the dev server
npm run dev

# Visit http://localhost:3001
# Test the bot — it should show "● live — answered by an LLM"
```

---

## Troubleshooting

### "Bot shows offline mode even after adding GROQ_API_KEY"

- **Local:** Restart `npm run dev` after editing `.env`
- **Vercel:** Redeploy after adding environment variables
  - Go to Deployments → Redeploy latest

### "500 error when asking the bot"

- Check that `GROQ_API_KEY` is set in Vercel environment variables
- Verify the key is valid at https://console.groq.com/keys
- Check Vercel logs: Deployments → Logs

### "Groq API rate limited"

- Groq's free tier allows ~30 requests/minute, ~14,400/day
- Your portfolio won't hit this — it's more than enough
- If needed, switch to Google Gemini (see note in `api/chat.js`)

---

## Customizing the Bot

The bot's personality and knowledge come from:

1. **System Prompt** — `api/chat.js` (controls tone, facts it knows)
2. **Canned Answers** — `src/config/portfolio.config.js` (`cannedChips[]`, used offline + fallback)
3. **Intro Message** — `src/config/portfolio.config.js` (`botIntro`)

Edit these to match your story, then `git push` to redeploy.

---

## Going Live: Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Live URL is working
- [ ] Portfolio content is accurate (`src/config/portfolio.config.js`)
- [ ] Avatar image is correct
- [ ] About modal displays correctly
- [ ] Bot works (optional: with live LLM)
- [ ] Custom domain added (optional)

---

## Next Steps

Your portfolio is live! Now:

1. Share the URL with recruiters
2. Update your resume/LinkedIn with the link
3. Add a `live:` note in README.md with your URL
4. Monitor bot responses and tweak the system prompt as needed

Good luck! 🚀
