# App Review Explanation — iFarted

## For Apple App Store Review (and Google Play)

### What is iFarted?

iFarted is a **pure-play comedic utility** modeled on the 2014 **Yo!** app. The product IS the punchline: a friend's phone lights up with a deadpan push notification reading **"I farted."** There is no feed, no inbox, no typing — the notification itself is the entire message.

This is **Yo! (2014) with flatulence**: Yo's own feature summary ("send individual notifications to other users, simply containing the word 'Yo'... additionally send their location") is essentially our brief.

### Context-Based Messaging (Why "Too Simple" is Actually the Point)

> "We like to call it context-based messaging. You understand by the context what is being said." — Or Arbel, Yo creator, via CNET (2014)

- **One fixed phrase**: "I farted." — zero typing, always
- **Meaning comes from context**: who sent it, when, and where (optional location)
- A fart at 8am from your partner means "good morning"
- A fart from a co-worker while you're in a meeting means "get me out"
- A fart with location pin at a restaurant means "I'm here, where are you?"

**Apple initially rejected Yo for being "too simple."** It then exploded after Product Hunt (20k users month one, 1M+ downloads by June 2014, 100M+ Yos sent by Sept 2014). The simplicity IS the feature — like Yo, we are a single-purpose communication tool.

### How It Works (User Flow)

1. **Onboarding (<60s)**: Claim unique @username, optional phone for contacts matching (opt-in), invite code/deep link alternative, request notification permission with plain language
2. **Home**: List of your people (most-recently active first, Yo-style) + big send action + "attach my location" toggle + AdMob banner
3. **Send**: Tap a person → instant delivery feedback ("Fart delivered 🫢"), optionally with location
4. **Recipient**: Push notification = **title: sender's name, body: "I farted.", custom fart sound** (Yo sent text + audio alert). Tap → app: no location = deadpan "whoever farted" screen with one-tap "fart back"; with location = map pin + one-tap fart back
5. **Settings**: Remove Ads IAP + Restore, notification sound on/off, phone-discovery toggle, account, privacy note
6. **Ad-free**: Owning entitlement unmounts ad containers everywhere

### Ephemerality (No Inbox/History by Design)

No message history/inbox/feed. The notification IS the message; the app only shows latest fart from a person to keep recipient list ordered. Nothing to scroll, nothing to archive. This is intentional, mirroring Yo's ephemeral design.

### Why Monetization From Day One (Yo Died Without It)

Yo shut down in 2016 ("autopilot") for lack of revenue — cautionary tale. iFarted has monetization from day one:

- **Free tier**: AdMob ads (non-personalized first, no ATT complexity)
- **Paid tier**: One-time non-consumable Remove Ads IAP ($1.99 suggestion), restorable, store-billed (not out-of-band)

### Anti-Spam / Anti-Harassment (Yo Hack Lessons)

Yo was hacked in June 2014 (Isaiah Turner) exposing phone numbers + enabling spam/spoofing. Our mitigations:

- Every endpoint requires Bearer apiKey (256-bit random, SHA-256 hashed at rest)
- Username search returns only non-PII (id/username/displayName, never phone)
- Contacts matching uses hash-normalized numbers, only reveals matches to users who enabled discovery, not stored raw
- Server-side rate limits: 30 farts/hour per sender, 20/hour per recipient per sender, plus block list
- Push is user-initiated and targeted at known recipient (anti-spam + store policy)
- Invite deep links carry random unguessable code (A-Z, 2-9, no O/0/I/1), not phone numbers
- No P2P push — always backend → Expo Push Service → APNs/FCM

### Permissions Justification

- **Notifications**: Core functionality — "I farted." is delivered via push, notification IS message, ephemeral by design. Requested at first run with plain language.
- **Location (When-In-Use)**: Optional per-message toggle — "Attach my current location to a fart so your friend can see where you farted." iOS purpose string via app.json, Android runtime permission lazily only when toggle tapped. Per-message opt-in, only to chosen recipient, not logged in analytics.
- **Contacts (iOS/Android)**: Optional — "Find friends who already use iFarted from your contacts (opt-in only)." Opt-in, hashed server-side, only reveals matches who enabled discovery. Privacy-safe.

### Technical Details

- **Mobile**: React Native via Expo managed workflow + TypeScript, one codebase iOS+Android, expo-router, Zustand, expo-notifications, expo-location, react-native-maps, react-native-google-mobile-ads, react-native-purchases (RevenueCat favored)
- **Backend**: Lightweight Bun + Hono + SQLite (bun:sqlite), Node-runnable fallback, relay → Expo Push API → APNs/FCM, no Firebase Functions/Firestore, no raw APNs/FCM management server-side
- **Build**: EAS Build cloud (Linux box → iOS via EAS cloud), development builds for push testing (Expo Go has Android push limitations)
- **Sound**: Custom notification sound <30s for iOS (fart.caf) + Android channel sound (fart.mp3), bundled, referenced in push payload `sound`
- **Android FCM**: Needs Firebase project for FCM client credentials (google-services.json) even though backend uses Expo Push API — secret injected at EAS build time, never committed

### What We Adopted From Yo (Research in memory-bank/research/yo-app.md)

| Yo | iFarted |
|---|---|
| Single fixed word "Yo", zero typing | Single fixed phrase "I farted.", zero typing |
| Push = "Yo" + audio alert | Push body "I farted." + custom fart sound |
| Contact list, tap to send | Home = recipient list, tap → send + one-tap fart back |
| Context-based messaging | Same framing |
| Username addressing | All three: username search + contacts opt-in + invite code/link |
| Location attach (Oct 2014) | Per-message location toggle → map pin |
| No revenue model → died | AdMob + Remove Ads IAP from day one |

### Test Accounts

For review, use:

- Username: `reviewer_apple` / `reviewer_google`
- Or register new via onboarding — <60s, no phone required

We have 2 test devices ready for push testing (EAS dev builds).

### Contact

- Developer: [Your Name]
- Email: [Your Email]
- Privacy Policy: https://ifarted.app/privacy
- Terms: https://ifarted.app/terms

### Summary

iFarted is not "too simple" — it is **intentionally minimal**, a context-based messaging experiment in the spirit of Yo! (2014). The single phrase carries meaning via context (who, when, where). It has real utility as a comedic, lightweight ping between friends, partners, roommates. It has monetization, anti-spam, privacy-safe design, and respects platform policies.

Thank you for reviewing!
