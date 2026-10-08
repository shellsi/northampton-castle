# Northampton Castle

A browser history of Northampton Castle, the royal castle west of medieval Northampton that the railway demolished in 1879. Drag the model, move through nine moments from about 1050 to the station that stands there now, and follow four captioned stories. Nothing is read aloud.

The model is a schematic traced from a MOLA plan: a rounded inner bailey, the great hall east of St Andrew's Road, the outer bailey to the south under the station, and the former River Nene on the west. Every place is marked by how it is known: still standing, excavated, recorded before demolition, named in documents, or inferred. Heights and roofs are a reconstruction, not a measured survey.

The research notes and the design are in [`docs/research.md`](docs/research.md) and [`docs/design.md`](docs/design.md).

## Run it

```bash
npm install
npm run dev -- -p 43217
```

Open [http://127.0.0.1:43217](http://127.0.0.1:43217).

On a phone: one finger orbits, pinch zooms. The Places button lists everything you can open in the current year, which is easier than tapping the stakes.

## Keys

- Left and right arrows move through the years, or through a story if one is playing
- `E` toggles the evidence colours
- `C` lays today over the castle, or the castle of about 1300 over today
- Space pauses a story
