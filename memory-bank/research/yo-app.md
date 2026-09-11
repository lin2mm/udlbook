# Research Notes — "Yo!" (2014) and What We Copy for iFarted

*Researched 2026-09-09. Sources: Wikipedia "Yo (app)" (current revision, 2026) + CNET article "The million-dollar app that exists to say 'Yo'" (June 19, 2014), retrieved via Wayback Machine.*

## What Yo was
- iOS/Android/Windows Phone app released **April 1, 2014** by Israeli developer **Or Arbel**, built in **~8 hours** at the request of Moshe Hogeg (Mobli CEO), who wanted a **single-button app** to "call" his assistant/wife without picking up the phone.
- **Apple initially rejected it for being "too simple."** It exploded after appearing on Product Hunt. ~20k users in month one; 1M+ downloads by June 2014; 100M+ "Yos" sent by Sept 2014; ~$2.5M raised at a $5–10M valuation.
- Company **shut down in 2016** ("autopilot"); later kept alive via Patreon (2018). **It never had a real business model** — the cautionary tale for our ad + IAP plan.

## How it worked (verified quotes)
- Wikipedia's feature summary is *almost word-for-word our user's brief*: **"The app enabled users to send individual notifications to other users, simply containing the word 'Yo'. Users could additionally send their location."**
- Sending (CNET): **"You have a list of contacts. You tap one of those contacts, and they receive a notification saying simply, 'Yo', along with an audio alert of the word being spoken."**
- Positioning (Arbel via NYT/CNET): **"We like to call it context-based messaging. You understand by the context what is being said."** The same "Yo" means good morning, "thinking about you", "meeting's over", "are you up?" depending on context.
- **Addressing was by unique username** — e.g., a "worldcup" account yo'd followers whenever a team scored (later formalized via a public Yo API).
- Evolution: Aug 2014 → profiles, links, hashtags. **Oct 2014 → send your location.** June 2015 v2 → photos or location **"within 1 swipe and a tap from the home screen"** + groups (yo several friends with one tap).
- Notifications were **text + audio** (the word spoken aloud). No inbox/feed of messages — the notification *was* the message.

## Failures / lessons (what NOT to repeat)
1. **No monetization → died.** We monetize from day one: ads + one-time Remove Ads IAP.
2. **June 2014 security hack** (Isaiah Turner): anyone could retrieve *any user's phone number* and spam/spoof Yos → we must: auth on every endpoint, never leak PII from unauthenticated lookups, unguessable tokens, per-sender rate limits, block path, abuse monitoring.
3. **Apple review rejected "too simple"** → prepare a purpose/value explanation for App Review using the context-based messaging framing.
4. **Novelty decays fast** → single-purpose is the hook; retention levers are the friend-connection flow and monetization, not features.

## What we adopt ("do that")
| Yo | iFarted adaptation |
|---|---|
| Single fixed word "Yo", zero typing | Single fixed phrase **"I farted."**, zero typing |
| Push = "Yo" + audio alert | Push body "I farted." (+ sender display name); **custom audio notification sound** (iOS bundle sound <30s; Android notification-channel sound) |
| Contact list, tap to send | Home = recipient list, tap → send; **one-tap "fart back"** after receiving |
| Context-based messaging | Same framing: one phrase, meaning comes from context |
| Username addressing | **All three** connection methods: username search · phone contacts (opt-in) · invite code/link |
| Location attach (Oct 2014) | Per-message location toggle → map pin when recipient opens |
| Groups (v2, 2015) | Post-MVP stretch feature |
| No revenue model | AdMob ads + non-consumable Remove Ads IAP |

## Copy/UX defaults derived from Yo (pending final wording)
- Notification: **title = sender's display name, body = "I farted."**
- Home: recipient list (recent first), big primary send action; empty state nudges "Add friends".
- **No message history/inbox** — messages are the notifications themselves (ephemeral).
- Primary onboarding: claim a unique *@username*; optionally verify phone for contact matching; invite via code/link.
