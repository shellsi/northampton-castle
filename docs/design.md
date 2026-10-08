# Northampton Castle: A 3D Interactive History — Design Document

Status: draft v0.1 · Companion to [`research.md`](research.md) (source keys such as [HER-IB]
refer to that file).

The first build is a personal web app, including phones, with captions and no narration.
The model in that app is a schematic of the dimensions below, not a measured survey.

## 1. Vision

Almost nothing of Northampton Castle survives. It was once one of England's foremost royal
castles, where Becket was tried and parliaments sat, and it was demolished in 1879 for a railway
station. This project rebuilds it in the browser and lets people **move through nine centuries
on one site**: from Saxon earthworks, through the royal castle at its height, its slighting and
decay, to the station and park that stand there today.

The experience has two jobs:

1. **Make the lost castle tangible.** Visitors should be able to stand in the Great Hall, walk
   the curtain wall, and look down into a 9 m-deep ditch.
2. **Be honest about the evidence.** Most of the castle is inferred. Every reconstructed element
   shows how we know about it (excavated, documented, drawn, or inferred), so the experience
   teaches how history is pieced together as well as what happened.

### Audiences

| Audience | Need | Primary mode |
| --- | --- | --- |
| Local residents and curious visitors | "What was here?" in a few minutes | Guided story tours |
| Visitors on site (Castle Park, station) | Orient against what they can see now | Mobile "Then & Now" view |
| Schools (KS2–KS3: Normans, medieval kings, Becket) | Structured, curriculum-friendly content | Story tours + teacher notes |
| Enthusiasts, FONC, researchers | Detail, sources, competing interpretations | Free explore + evidence layer |

### Non-goals (first release)

- Not a game. There is no combat, scoring or avatar customisation.
- No VR/AR headset build. A phone-camera AR "window" is a later stretch goal (§11).
- No user accounts, comments or user-generated content.
- No claim to be the definitive reconstruction. It is an evidence-led interpretation.

## 2. Design pillars

1. **One site, many times.** The landscape stays fixed; time is the main control.
2. **Show your working.** Certainty is visible, and sources are one tap away.
3. **Stories over facts.** Content is organised around moments with people in them (Becket's
   trial, the 1264 assault, the 1879 demolition), not dates on a list.
4. **Anchored to today.** It must always be possible to see where something was relative to the
   station, St Andrew's Road and the postern gate.
5. **Runs anywhere.** Works in a mid-range phone browser on park Wi-Fi or 4G, with no install.

## 3. Core experience

### 3.1 The time slider

A persistent timeline along the bottom of the screen with **eight snapshot eras**. Moving
between eras morphs the scene: walls rise or crumble, the ditch fills, trees grow, the railway
arrives.

| # | Era | Date shown | What the scene shows | Overall confidence |
| --- | --- | --- | --- | --- |
| 0 | Before the castle | c.1050 | Late Saxon town edge, earthwork, river meadows | Low |
| 1 | Norman earthwork castle | c.1100 | Senlis's bank, ditch and timber palisade; possible motte in the NW quarter | Low–medium |
| 2 | Royal castle | 1164 | Stone curtain (newly built), early hall complex; **Becket's trial** | Medium |
| 3 | Siege and repair | 1264–66 | Failing west wall propped with timber; assault on the town; rebuilt buttressed west wall | Medium |
| 4 | High medieval peak | c.1300 | Full hall complex, glazed royal chambers, eight towers, barbican, outer bailey | Medium |
| 5 | Civil War stronghold | 1643 | Earth bulwarks for artillery, cannon on the paved Ring | Medium |
| 6 | Ruin, gaol and orchard | c.1720–1800 | Slighted walls, gaol in the south tower, cherry orchard (after Tillemans 1719 and *Gentleman's Magazine* 1800) | Medium–high |
| 7 | Demolition | 1879 | Railway navvies, antiquarians recording the west wall, postern being dismantled | High |
| 8 | Today | 2026 | Station, St Andrew's Road, Castle Park bank, heritage poles, rebuilt postern | High |

Between snapshots the slider scrubs continuously. Elements fade in or out at their documented
dates (for example, the Great Hall shows fire damage from 1318 until its 1329 repair).

### 3.2 Modes

**A. Story tours (default for first-time visitors).** Short, narrated camera journeys of 2–4
minutes each, made of 5–8 "beats". The user can pause at any beat to look around freely, then
resume. Launch set:

1. **"A Castle for Northampton"**: from Saxon town to Senlis's castle (eras 0 → 2).
2. **"The Archbishop on Trial"**: Becket, October 1164. The camera follows Becket's described
   route: dismounting at the hall door, through the hall into the lower inner chamber, while the
   king sits in the upper chamber and messengers go back and forth; then the night escape.
   [HE-GH]
3. **"Forty Horses Wide"**: April 1264. Royalist engines at Beckets Park, Prince Edward's
   outflanking ride, the priory-wall breach, Simon the Younger thrown and captured, the castle's
   surrender the next morning. [B1264]
4. **"Kings at Home"**: Henry III's glazing and painted windows, the queen's chamber, the 1318
   fire.
5. **"The Last Days"**: Civil War cannon on the Ring, slighting in 1662, the gaol, orchards,
   and 1879. Ends at the rebuilt postern today.

**B. Free explore.** Orbit, pan and zoom over the site at any era. Tap a hotspot to open a
**detail card**: name, short description, dates, confidence badge, sources, and where relevant a
historical image (Speed map crop, Tillemans view, 1879 photograph).

**C. Walk mode.** First-person eye-height navigation inside the inner bailey and along the wall
walk. On desktop: WASD/arrow keys and mouse look. On touch: a virtual joystick plus drag-to-look,
or tap-to-move to marked points.

**D. Then & Now.** A split or swipe view comparing any era with today from the same camera
position. A top-down map view overlays the castle footprint on modern streets, the station and
the 2025 heritage poles. On mobile with location permission, a "You are here" marker appears
when the user is on site.

### 3.3 The evidence layer

A toggle (always visible, keyboard shortcut `E`) recolours the scene by how we know:

| Badge | Colour | Meaning | Examples |
| --- | --- | --- | --- |
| Survives | Solid stone texture | Visible today | Postern gate, east bank fragment |
| Excavated | Green | Found archaeologically | Ditch profile, NE royal apartments, kitchen range, revetment wall |
| Recorded | Blue | Seen and recorded before destruction (1879 and earlier) | West wall and buttresses, south tower |
| Documented | Amber | Known from written records, position estimated | Great Hall complex, New Tower, chapel of St George |
| Inferred | Grey wireframe/translucent | Reasoned reconstruction | Keep, barbican superstructure, timber palisade, outer bailey wall |

Detail cards for disputed elements include a **"Competing ideas"** section with switchable
alternatives. Launch alternatives:

- Keep on the NE side (Hartshorne) vs on the NW mound (Law 1863).
- Inner bailey outline: "nearly circular" vs "sub-rectangular".

## 4. Content model

All historical content lives in versioned data files, not in code, so historians can edit it
without touching the renderer.

```text
content/
  eras.yaml            # era id, date range, label, summary, default camera
  elements.yaml        # every modelled feature
  hotspots.yaml        # clickable points: position, element ref, card copy
  tours/
    becket-1164.yaml   # ordered beats: camera path, era, narration, captions
  sources.yaml         # bibliography keyed to research.md
  media/               # historical images, audio narration, licences
```

Example element record:

```yaml
- id: south-tower
  name: South Tower ("The Ring")
  model: towers/south-ring.glb
  exists: { from: 1153, to: 1879 }
  states:
    - { from: 1153, to: 1642, variant: medieval }
    - { from: 1643, to: 1662, variant: artillery-platform }
    - { from: 1663, to: 1879, variant: ruin-gaol }
  confidence: recorded
  sources: [HER-IB]
  summary: >
    A round tower with narrow loop lights on the south side of the inner bailey.
    Paved for cannon in 1643 and later used as the county prison.
```

The **time engine** checks every element against the current year to decide visibility, which
variant to show, and the transition (rise/fade/collapse). Tours and the free slider use the same
engine.

## 5. 3D reconstruction approach

### 5.1 Terrain

- Base: Environment Agency LiDAR DTM (1 m, Open Government Licence) for the modern ground
  surface, refined with the MOLA 2018 topographic survey if it can be obtained.
- Historical terrain is made by sculpting deltas onto the modern surface: removing station
  platforms and cuttings, restoring the bank (18 m wide × 6 m high), cutting the ditch (27 m ×
  9 m), and restoring the Nene branch on the west.
- The Nene channel is modelled per era (it was moved and culverted in the 19th century).

### 5.2 Footprint and georeferencing

- Work in OSGB36 / British National Grid metres, with the scene origin at SP 7486 6055 (inner
  bailey centre).
- Georeference the historical maps (Speed 1610, Noble & Butlin 1746, *Gentleman's Magazine*
  1800, Law 1863, the first OS 1:500 town plan) against modern OS OpenMap and the station
  footprint.
- Fit the inner bailey to the 486 × 324 ft (148 × 99 m) dimensions and the curtain positions
  recorded on the south and west sides.

### 5.3 Architecture

- Build as modular kits in Blender: curtain wall sections with plinth, round and rectangular
  towers, buttresses, crenellation, timber hoarding, roofs, and a hall-and-chamber kit.
- Use regional materials: **Northamptonshire ironstone** (orange-brown) rubble with limestone
  ashlar dressings, matching the reused castle stone in the station wall.
- Reference comparable surviving buildings for detail where Northampton is silent: the Great
  Hall at Oakham Castle (c.1180–90) for the hall interior, and Rockingham Castle for the royal
  Northamptonshire castle context. Each borrowed detail is tagged *inferred*.
- The postern gate should be photogrammetry-scanned on site as the one directly captured
  artefact. It is the "anchor of truth".

### 5.4 People and life

- Low-poly, stylised figures in crowd groups, with no detailed faces. This keeps cost down and
  avoids an uncanny look.
- Ambient life per era: guards on the wall walk, smoke from the kitchen range, livestock and
  orchard pickers in the ruin era, navvies and steam in 1879.
- Story-tour characters are shown as silhouettes with captioned narration.

### 5.5 Lighting and atmosphere

- Time of day and season chosen per era for mood: the Becket trial on an October evening, the
  1264 assault at dawn, 1879 on an overcast day with smoke.
- One baked-plus-dynamic lighting setup, so the look stays consistent while scrubbing.

## 6. Interface

### 6.1 Layout

```text
┌───────────────────────────────────────────────────────────┐
│ ☰  Northampton Castle            [Evidence ◐] [Then/Now]  │
│                                                           │
│                      3D viewport                          │
│                                     ┌──────────────────┐  │
│                                     │ Detail card      │  │
│                                     │ South Tower      │  │
│                                     │ ● Recorded       │  │
│                                     │ 1153 – 1879      │  │
│                                     │ …  [Sources]     │  │
│                                     └──────────────────┘  │
│ [Tours] [Explore] [Walk]                                  │
│ ◀ 1050 ─●─ 1100 ─●─ 1164 ─●─ 1264 ─●─ 1300 … 1879 ─ 2026 ▶│
└───────────────────────────────────────────────────────────┘
```

- **Mobile:** detail cards become a bottom sheet; the slider becomes horizontally swipeable
  era chips with a fine-scrub handle.
- **First launch:** a 10-second fly-in over today's station that "rewinds" into the castle, then
  offers "Take a tour" or "Explore".

### 6.2 Accessibility

- Every story tour has captions and a text-only transcript.
- Keyboard-operable throughout: Tab moves through hotspots, arrow keys move the slider.
- Respect `prefers-reduced-motion`: cut between eras instead of morphing, and use no
  camera-shake.
- The evidence colours are paired with distinct patterns and icons, so they work for
  colour-blind users.
- A **"no-3D" fallback** for devices without WebGL2: an illustrated scrolling timeline using
  pre-rendered stills of each era.
- Target WCAG 2.2 AA for all 2D interface.

## 7. Technical architecture

| Layer | Choice | Rationale |
| --- | --- | --- |
| App shell | Next.js (TypeScript), static export | Static hosting, SEO-friendly landing and per-era pages |
| 3D | React Three Fiber + drei on Three.js (WebGL2; WebGPU when available) | Mature, large ecosystem, works on mobile |
| UI | Tailwind + shadcn/ui | Accessible primitives for cards, sheets and dialogs |
| State | Zustand (current year, mode, selection, evidence toggle) | Small; shared by the renderer and the UI |
| Content | YAML → validated JSON at build time (Zod schemas) | Historians edit text; the build catches errors |
| Assets | glTF/GLB with Draco/Meshopt compression and KTX2 textures | Small downloads and GPU-friendly textures |
| Streaming | Per-era asset bundles, lazy-loaded; neighbouring eras prefetched | Fast first load |
| Audio | Web Audio; narration as Opus files | Small files |
| Hosting | Static CDN (e.g. Vercel / Netlify) | No server needed |
| Analytics | Privacy-respecting and cookieless (e.g. Plausible) | Learn which tours are completed without consent banners |

### Performance budgets

| Metric | Target |
| --- | --- |
| Initial download before first interaction | ≤ 8 MB |
| Per-era bundle | ≤ 15 MB |
| Draw calls | ≤ 150 (mobile) |
| Triangles on screen | ≤ 500k (mobile), 2M (desktop) |
| Frame rate | 60 fps desktop, ≥ 30 fps on a mid-range phone |
| Time to interactive (4G) | ≤ 5 s |

Use LODs per kit piece, instancing for wall and crenellation modules, and impostors for distant
town buildings.

## 8. Example content: the Becket tour beats

| Beat | Era / time | Camera | Narration (draft) |
| --- | --- | --- | --- |
| 1 | 1164, evening | High over the town, pushing to the castle | "October 1164. The King's great council has gathered at Northampton Castle, and the Archbishop of Canterbury has been summoned to answer to it." |
| 2 | 1164 | North gate causeway | "Thomas Becket rides in across the ditch. Once Henry II's closest friend, he is now his most stubborn opponent." |
| 3 | 1164 | Hall door | "He dismounts at the door of the hall, carrying his own cross, a challenge everyone understands." |
| 4 | 1164 | Inside the Great Hall → inner chamber | "He waits in a lower room. Above, in the upper chamber, the King and his barons debate his fate. Messengers hurry between them." *Evidence pop: "Hall, inner chamber and upper chamber are named in contemporary accounts; their layout here is inferred."* |
| 5 | 1164 | Hall | "Condemned, Becket refuses the judgement and walks out through a jeering crowd." |
| 6 | 1164, night | Following a lantern to the west | "That night, disguised as a monk, he slips away. Within weeks he is in France, and six years of exile have begun." |
| 7 | 2026 | Same spot today | "This is where the hall stood — under the car park east of the station." |

Narration is drafted for specialist review before recording (§10).

## 9. Delivery plan (by scope, not time)

**Phase 0 — Foundations.** Get the key sources (§7 of the research notes), georeference the
maps, and set up the terrain pipeline. Build the content schema and the time engine with
greybox geometry for eras 2, 4 and 8. *Exit criteria:* the slider scrubs between three eras of
greybox geometry on a mid-range phone at 30 fps or better.

**Phase 1 — Vertical slice.** Full art for **era 4 (c.1300)** and **era 8 (today)**; the
evidence layer; free explore with about 15 hotspots; one story tour (**Becket**); Then & Now;
the no-3D fallback. *Exit criteria:* reviewed by at least one specialist and tested with 5–8
members of the public.

**Phase 2 — Full timeline.** The remaining eras, the remaining four tours, walk mode, and the
on-site location marker.

**Phase 3 — Extensions (optional).** Phone-camera AR at the postern and the Castle Park bank;
schools pack; Welsh/Polish/other community-language captions; museum kiosk build.

## 10. Partners and review

| Partner | Role |
| --- | --- |
| Friends of Northampton Castle (FONC) | Local knowledge, community reach, alignment with the 2012 reconstruction and 2025 pole trail |
| MOLA Northampton | Excavation and survey data; archaeological review |
| Northamptonshire HER (West Northamptonshire Council) | Records, map scans, data licensing |
| Northampton Museum & Art Gallery | Finds imagery (including chess pieces), possible kiosk host |
| Network Rail / station operator | Permission and placement for on-site signage and QR codes |
| Academic medievalist | Review of the narration, especially Becket and 1264 |

Any reconstruction marked *documented* or *inferred* needs sign-off from an archaeological
reviewer before it ships.

## 11. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Thin evidence, leading to "made-up" criticism | Credibility | The evidence layer, competing-ideas toggles and specialist review are core features, not extras |
| Key reports unpublished or hard to access | Accuracy of the layout | Request Chapman 2021, Soden 2016 and MOLA data early; design data files so the layout can be revised without rebuilding art |
| Map and image licensing | Can't show historical images | Prefer public-domain material (Speed, Tillemans, *Gentleman's Magazine*); log licences in `media/` |
| Mobile performance | Poor on-site experience | Budgets in §7, per-era streaming, no-3D fallback |
| Art scope creep across eight eras | Unfinished product | Modular kits shared across eras; ruin eras are variants of the medieval kit |
| Contradicting FONC or local interpretation | Community friction | Involve FONC from Phase 0; credit their work |

## 12. Success measures

- More than 60% of visitors who start a tour finish it.
- More than 30% of sessions turn on the evidence layer at least once.
- On-site sessions (with location permission) are recorded from Castle Park and the station.
- Visitors can correctly answer "Where did the Great Hall stand relative to the station?" more
  often after a session than before (short optional quiz).
- Specialist reviewers report no factual errors in tour narration.

## 13. Open questions

1. Is the primary deployment the web, a museum kiosk, or both? This affects the performance
   targets and walk mode.
2. Should eras 0 and 1 (Saxon and timber castle), which have the weakest evidence, ship in the
   first release or be held back?
3. Is professional voice narration in scope, or should the first release use captions only?
4. Should the project seek partnership funding (e.g. National Lottery Heritage Fund), which
   would shape the partner and evaluation requirements?
5. Is there appetite for a physical tie-in, such as QR codes on the heritage poles that open
   the matching viewpoint?
