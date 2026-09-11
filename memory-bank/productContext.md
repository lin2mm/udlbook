# Product Context — iFarted

## Why This Project Exists
Pure-play comedic utility. The product *is* the punchline: a friend's phone lights up with a deadpan push notification reading **"I farted."** There is no feed, no inbox, no typing — the notification itself is the entire message. This is **Yo!** (2014) with flatulence: Yo's own feature summary ("send individual notifications to other users, simply containing the word 'Yo'... additionally send their location") is essentially our brief.

The **location attachment** upgrades the joke ("I farted." *where?*) and drives opening the app to see the map pin — which is also where ads live.

## Positioning (stolen from Yo, verbatim philosophy)
**"Context-based messaging. You understand by the context what is being said."** — Or Arbel (Yo creator), via CNET. One phrase; the sender, the timing, and the optional location carry the meaning. A fart at 8am from your partner means "good morning." A fart from a co-worker while you're in a meeting means "get me out." This framing also doubles as our App Review explanation (Apple once rejected Yo for being "too simple").

## How It Should Work (UX Flow — Yo pattern)
1. **Onboarding (< 60s):**
 - Claim a unique *@username* (first-come-first-served, Yo/Twitter style).
 - Optional: add phone number → opt-in "find friends from contacts."
 - Alternative entry: open an **invite link/code** → auto-connect to inviter.
 - Request notification permission with a plain-language explanation.
2. **Home screen:** list of your people (most-recently active first) + big primary send action + "attach my location" toggle. Ad banner (default placement). Empty state pushes the **three add-friend paths** (search username / contacts / invite).
3. **Send:** tap a person → instant delivery feedback ("Fart delivered 🫢"). Optionally tap a **"with location"** toggle first.
4. **Recipient experience:** push = **title: sender's name, body: "I farted.", custom fart sound** (Yo sent text + an audio alert of the word). Tap → app:
 - no location → deadpan "whoever farted" screen with a **one-tap "fart back"**;
 - with location → map pin at the sender's location + one-tap fart back.
5. **Settings:** Remove Ads (IAP) + Restore Purchases, notification sound on/off, phone-discovery toggle, account (username, sign out), privacy note.
6. **Ad-free:** owning the entitlement unmounts ad containers everywhere.

## Ephemerality (Yo decision — resolved)
No message history/inbox/feed. The notification IS the message; the app only shows the *latest* fart from a person to keep the recipient list ordered. Nothing to scroll, nothing to archive.

## Experience Goals
- Setup < 60 seconds; sending = 1 tap (2 with location); zero typing, always.
- Tone: consistently dry/wry, never gross; the name + store listing set the tone.
- Privacy feels safe: location per-message and explicit; phone only used for opt-in matching.
- Add-a-friend is the retention lever — all three connection paths must be one or two taps from the empty state.

## Target Users
Friends, partners, roommates (teens/adults). Viral loop: receiving a fart notification is funny enough to screenshot/share → "send a fart to your friends."

## Key UX Risks / Notes
- **Empty network kills the app** → first-run add-a-friend flow is the most important screen.
- **Harassment vector** (Yo suffered spam/spoofing) → server-side rate limits + block; keep the recipient list explicit (you only receive farts from people you've added, pending acceptance for strangers).
- Ad placement must never block the joke (banner; no interstitial before sending).
