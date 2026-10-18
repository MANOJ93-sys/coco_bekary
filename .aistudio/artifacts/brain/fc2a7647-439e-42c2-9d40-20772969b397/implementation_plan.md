# Coco Crumble — Interactive Storybook Bakery

A whimsical, nostalgic, storybook-inspired bakery web experience featuring the signature mascot Coco, three complete interactive games (Cake Chaos, Cake for Your Mood, Cake or Fake), a 6-scene interactive origin story, a configurable n8n chatbot, Web Audio sound effects, and playful early-web bonus features.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during interactive clarification and govern the system design:

- **Audio Feedback**: Built-in Web Audio API synthesizer generating organic, gentle bakery chimes, squishes, and pops with a global master mute toggle (defaulting to clean muted state with browser gesture unlock).
- **Mascot Styling**: High-detail, expressive multi-layer 2D SVG vector character for Coco featuring natural eye cursor tracking, idle blinking, facial reaction states, and a contextual speech bubble.
- **Data Persistence**: Client-side `localStorage` persistence with pre-seeded community notes for the Guestbook and an incrementing local Visitor Counter.
- **n8n Chatbot Integration**: Real configurable webhook architecture supporting an environment variable (`VITE_N8N_WEBHOOK_URL`) or an in-app setup modal, paired with robust network error handling, connection status testing, and helpful bakery fallback responses when disconnected.

---

## 1. Overview & Core Concept

**Coco Crumble** is designed as an imaginative storybook bakery rather than a corporate marketing site. Visitors are welcomed by Coco—a curious chibi baker with strawberry clips, a flour smudge on her nose, and her signature whisk—into a colorful world of confectionery creativity.

### Core Experience Loops
1. **Interactive Mascot Hub**: Coco greets visitors with reactive speech bubbles, eye-tracking, and clickable reactions.
2. **Cake Chaos Mini-Game**: A high-energy time-attack decorating game where players match customer design orders (frosting base, drizzle, toppings, decorations) before the timer runs out.
3. **Cake for Your Mood**: A personalized emotional confection finder mapping 6 feelings (Happy, Sleepy, Sad, Energetic, Romantic, Stressed) to illustrated signature cakes with whimsical explanations.
4. **Cake or Fake?**: A visual guessing challenge featuring verified hyper-realistic sculpted cakes vs. real everyday objects with immediate reveal animations, scorekeeping, and explanations.
5. **Interactive Origin Story**: A 6-chapter illustrated narrative walking through Coco's beginnings in Sugarberry Lane with participatory micro-interactions in every scene.
6. **Floating n8n Bakery Assistant**: A popup chat assistant wired for external n8n workflows with fallback guidance and suggested prompt chips.
7. **Playful Atmosphere & Easter Eggs**: Sparkle pointer trail, reactive Chaos Mode toggle, guestbook notes, visitor counter, and a hidden interactive secret.

---

## 2. User Experience & Visual Design

### Aesthetic Direction & Visual Identity
- **Visual Personality**: Nostalgic storybook warmth meets early-web delight—reminiscent of tactile scrapbooks, hand-piped icing, recipe stickers, and cozy bakery counters.
- **Palette & Surface Atmosphere (60-30-10 Rule)**:
  - **60% Canvas & Atmosphere**: Warm vanilla cream (`#FFFDF7`), soft flour ivory (`#FAF6EE`), and warm sugar parchment (`#F5EFEB`).
  - **30% Structural Surfaces & Cards**: Pastel strawberry pink (`#FFE4E9`), whipped cream white (`#FFFFFF`), pastel mint (`#E8F7F0`), gentle lavender (`#F3E8FF`), and rich chocolate brown typography (`#3D2314`).
  - **10% Focal Accents**: Ripe strawberry red (`#E63946`), golden honey amber (`#F4A261`), and confectionery cherry glaze (`#D81159`).
- **Typography**:
  - *Display / Titles*: `Plus Jakarta Sans` / `Outfit` with playful rounded weights, generous letter tracking, and balanced headline wraps.
  - *Body Prose*: Readable warm sans (`DM Sans` / `Plus Jakarta Sans`, 15–16px, 1.6 line height).
  - *Numbers & Timers*: `tabular-nums font-mono` for timer countdowns and game score counters.
- **Top Bar Contract**:
  - Clean 3-zone layout:
    1. Single brand wordmark (`Coco Crumble 🍓`)
    2. Single-line navigation links (`Story`, `Cake Chaos`, `Mood Cake`, `Cake or Fake`, `Guestbook`)
    3. Global audio toggle (`Sound On/Off`) and Chaos Mode trigger.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Coco Crumble 🍓]          Story · Cake Chaos · Mood Cake · Cake or Fake · Guestbook      [🔊 Sound] [✨ Chaos] │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

### Mascot Architecture: Layered Responsive SVG vs Static PNG
- **Decision**: Build Coco as a modular SVG component containing coordinate-tracked iris elements, eyelid blink animations, interchangeable mouth/eyebrow expression states (Curious, Delighted, Surprised, Thinking), and floating strawberry clips.
- **Rationale**: Eliminates blur on high-DPI screens, zero network latency, prevents broken external asset dependencies, and enables continuous mathematical cursor tracking without awkward whole-body tilting.

### Cake or Fake: Structured Question Dataset
- **Decision**: Curate a dedicated verified question bank pairing high-quality realistic object/sculpture items with explicit boolean flags, rich hints, and historical bakery reveals.
- **Rationale**: Ensures questions never randomly produce false truths or mismatched answers; players receive accurate educational/fun feedback after every round.

### Audio Architecture: Web Audio API Synthesizer
- **Decision**: Procedurally synthesize chime, pop, splat, victory, and click frequencies directly in browser memory without relying on external `.mp3` / `.wav` assets that can fail network fetches.
- **Rationale**: Instantaneous playback, 0KB asset weight, 100% offline-tolerant, and strict compliance with browser autoplay constraints.

### n8n Chatbot Integration: Dual-Mode Webhook Bridge
- **Decision**: Create a dedicated chat service that attempts communication with a configured webhook (`VITE_N8N_WEBHOOK_URL` or runtime input modal) and provides clear diagnostics, suggested questions, and simulated bakery guidance when the webhook URL is unset.
- **Rationale**: Meets the exact requirement of having a real integration point without crashing or faking AI output when external credentials are absent.

---

## 4. Technical Architecture & Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           App.tsx                                               │
│   (Global State: Audio Engine, Active Activity View, Chaos Mode, Mascot Position, Visitor Count)│
└────────────────────────────────┬───────────────────────────────────────────────┬────────────────┘
                                 │                                               │
        ┌────────────────────────┴───────────────────────┐                       │
        ▼                                               ▼                       ▼
┌──────────────────┐                            ┌──────────────────┐    ┌─────────────────┐
│    TopNav.tsx    │                            │    CocoMascot    │    │ SparkleCursor   │
│ (Links, Audio,   │                            │ (SVG Rig, Eyes,  │    │ (Subtle pointer │
│  Chaos Mode)     │                            │  Speech Bubble)  │    │  particles)     │
└──────────────────┘                            └──────────────────┘    └─────────────────┘
        │
        ├────────────────────────────────────────────────────────────────────────┐
        ▼                                                                        ▼
┌─────────────────────────────────────────────────────────────────┐   ┌───────────────────────────┐
│                         Active Views                            │   │       CocoChatPanel       │
├──────────────────┬──────────────────┬───────────────────────────┤   │ (n8n Webhook Client,      │
│ LandingHero.tsx  │ OriginStory.tsx  │ CakeChaosGame.tsx         │   │  Message Stream, Fallback)│
│ (Hero, Welcome,  │ (6 Interactive   │ (Customer Order Matcher,  │   └───────────────────────────┘
│  Quick Launch)   │  Story Chapters) │  Timer, Score Evaluator)  │
├──────────────────┼──────────────────┼───────────────────────────┤
│ MoodCakeFinder   │ CakeOrFakeGame   │ GuestbookView.tsx         │
│ (6 Mood Paths,   │ (Guessing Rounds,│ (Local Persistent Notes,  │
│  Cake Reveals)   │  Score, Reveals) │  Form, Seeded Community)  │
└──────────────────┴──────────────────┴───────────────────────────┘
```

### State Store Structure
- **Audio State**: `muted: boolean`, `volume: number`, play function triggers (`playChime`, `playPop`, `playFrostingSplat`, `playVictoryFanfare`).
- **Game State (Cake Chaos)**:
  - `phase: 'MENU' | 'PLAYING' | 'RESULT'`
  - `timeRemaining: number` (seconds countdown)
  - `currentOrder: { baseFlavor: string, frostingColor: string, drizzle: string, toppings: string[] }`
  - `playerCake: { baseFlavor: string, frostingColor: string, drizzle: string, toppings: string[] }`
  - `score: { total: number, breakdown: { accuracy: number, timeBonus: number } }`
- **Game State (Cake or Fake)**:
  - `currentIndex: number`
  - `score: number`
  - `streak: number`
  - `selectedAnswer: boolean | null`
  - `revealed: boolean`
- **Origin Story State**:
  - `activeScene: 1 | 2 | 3 | 4 | 5 | 6`
  - `sceneInteractionsCompleted: Record<number, boolean>`
- **Guestbook & Visitor State**:
  - `entries: Array<{ id: string, name: string, message: string, timestamp: string, avatarEmoji: string }>`
  - `visitorCount: number` (synced to `localStorage.getItem('coco_crumbles_visits')`)
- **Easter Egg State**:
  - `discoveredEgg: boolean` (triggered by tapping Coco's strawberry hair clip 5 times or typing secret key combo `frosting`).

---

## 5. Implementation Phases & Verification Steps

### Phase 1: Foundation, Audio Synthesizer & Design Tokens
- Set app title and metadata in `index.html` and `metadata.json`.
- Configure Tailwind tokens for soft cream canvas, strawberry accents, and chocolate typography.
- Implement procedural `soundEngine.ts` using Web Audio API (gentle sine/triangle waves for chimes, square pops, noise bursts for sprinkles).

### Phase 2: Coco Mascot System
- Implement `CocoMascot.tsx`: Responsive SVG avatar with eye pupils tracking pointer coordinates within safe natural thresholds.
- Add idle breathing motion, natural blinking interval, and multi-expression states (Happy, Winking, Surprised, Cheerful).
- Provide floating speech bubble reacting to user page actions and direct clicks.

### Phase 3: Core Activities Implementation
- **Activity 1 — Cake Chaos**:
  - Implement dynamic customer ticket generator.
  - Interactive workbench with frosting selector, piping bag drizzle, topping trays, and cake platter preview.
  - 45-second timer with scoring matrix and high score persistence.
- **Activity 2 — Cake for Your Mood**:
  - Interactive mood selector with 6 distinct states.
  - Tailored recipe reveals with whimsical animations, flavor notes, and mood advice from Coco.
- **Activity 3 — Cake or Fake?**:
  - 6 curated photo rounds with dual "It's Cake!" and "It's Fake!" action buttons.
  - High-impact slice reveal animation, item backstory, and round tally.

### Phase 4: Interactive Origin Story
- 6-scene story reader with page-turn transitions and interactive scene triggers:
  - Scene 1: Click floating strawberries to reveal Coco's secret ingredients.
  - Scene 2: Click Grandma's mysterious recipe book to open glowing pages.
  - Scene 3: Tap mixing bowl to trigger a funny frosting explosion.
  - Scene 4: Mood selector preview connecting emotions to cake flavor.
  - Scene 5: Quick interactive cake-or-fake mini test.
  - Scene 6: Official grand opening celebration with confetti and "Enter Bakery" CTA.

### Phase 5: n8n Chatbot Integration & Bonus Features
- Implement floating chat drawer with `n8nChatService.ts`:
  - Configurable webhook URL via settings modal or `VITE_N8N_WEBHOOK_URL`.
  - Loading skeleton, graceful error messages, retry button, and canned prompt suggestions.
- Implement Bonus Features:
  - Sparkle cursor following mouse/touch (disabled on reduced motion).
  - Chaos Mode toggle injecting extra confetti, animated floating sweets, and vibrant energy.
  - Guestbook with sanitized inputs and seeded community cards.
  - Nostalgic visitor counter with local storage tracking.
  - Hidden Easter Egg: Click Coco's hair clip 5 times to unlock golden rainbow chef hat mode!

### Phase 6: Responsive Polish, Accessibility & Build Verification
- Test all touch targets $\ge 44\text{px}$ on mobile screens.
- Verify `prefers-reduced-motion` compliance.
- Run `compile_applet` and verify zero TypeScript, lint, or runtime errors.
