export const BAILEY_W = 148;
export const BAILEY_D = 99;
export const HW = BAILEY_W / 2;
export const HD = BAILEY_D / 2;

export const eras = [
  {
    id: "saxon",
    year: "c. 1050",
    label: "Saxon town",
    blurb: "An earthwork above the Nene, before the castle",
  },
  {
    id: "timber",
    year: "c. 1100",
    label: "Timber castle",
    blurb: "Simon de Senlis's earth and timber castle",
  },
  {
    id: "becket",
    year: "1164",
    label: "Becket's trial",
    blurb: "A new stone curtain, and a council in the hall",
  },
  {
    id: "siege",
    year: "1264",
    label: "Castle falls",
    blurb: "Henry III takes the town and the castle",
  },
  {
    id: "peak",
    year: "c. 1300",
    label: "Royal castle",
    blurb: "Hall, chambers, and towers at their fullest",
  },
  {
    id: "civilwar",
    year: "1643",
    label: "Civil War",
    blurb: "Parliament holds the castle; a gun on the Ring",
  },
  {
    id: "orchard",
    year: "c. 1720",
    label: "Orchard",
    blurb: "Slighted walls, a gaol, then cherry trees",
  },
  {
    id: "demolition",
    year: "1879",
    label: "Demolition",
    blurb: "The railway takes the castle down",
  },
  {
    id: "today",
    year: "Today",
    label: "Station",
    blurb: "Castle Station's site, and the park beside it",
  },
] as const;

export type EraId = (typeof eras)[number]["id"];

export type Confidence =
  | "survives"
  | "excavated"
  | "recorded"
  | "documented"
  | "inferred";

export const confidenceMeta: Record<
  Confidence,
  { label: string; swatch: string; meaning: string }
> = {
  survives: {
    label: "Still standing",
    swatch: "#e6d3b0",
    meaning: "You can still see this",
  },
  excavated: {
    label: "Excavated",
    swatch: "#3f8f62",
    meaning: "Found by archaeology",
  },
  recorded: {
    label: "Recorded",
    swatch: "#3d6fbf",
    meaning: "Drawn or described before it was destroyed",
  },
  documented: {
    label: "In the records",
    swatch: "#d0893a",
    meaning: "Named in medieval documents; the position is estimated",
  },
  inferred: {
    label: "Inferred",
    swatch: "#8d8882",
    meaning: "A reasoned guess, shown so it can be doubted",
  },
};

export type Mood = "day" | "evening" | "dawn" | "night" | "overcast";

export function moodFor(era: EraId): Mood {
  if (era === "becket") return "evening";
  if (era === "siege") return "dawn";
  if (era === "demolition") return "overcast";
  return "day";
}

export const skyFor: Record<Mood, string> = {
  day: "#d5e0e6",
  evening: "#e7b48a",
  dawn: "#f0d2c2",
  night: "#1c2836",
  overcast: "#c5c8c2",
};

export type Vec3 = [number, number, number];

export const anchors = {
  hall: [0, 0, -6] as Vec3,
  greatChamber: [-26, 0, -6] as Vec3,
  longChamber: [26, 0, -6] as Vec3,
  queens: [0, 0, -22] as Vec3,
  kitchen: [8, 0, 16] as Vec3,
  apartments: [36, 0, -32] as Vec3,
  keepNw: [-46, 0, -22] as Vec3,
  keepNe: [40, 0, -30] as Vec3,
  southTower: [0, 0, HD] as Vec3,
  westWall: [-HW, 4, 0] as Vec3,
  ditch: [0, 2, -HD - 28] as Vec3,
  northGate: [0, 4, -HD] as Vec3,
  postern: [-HW, 3, 22] as Vec3,
  chapel: [48, 0, -8] as Vec3,
  outer: [0, 2, -HD - 78] as Vec3,
  barbican: [0, 3, -HD - 36] as Vec3,
  river: [-150, 1, 0] as Vec3,
  priory: [70, 0, -150] as Vec3,
  town: [210, 0, 20] as Vec3,
  earthwork: [20, 2, 10] as Vec3,
  station: [-6, 4, 16] as Vec3,
  posternToday: [-28, 2, 72] as Vec3,
  bankToday: [86, 2, -8] as Vec3,
  poles: [54, 2, 36] as Vec3,
};

export type Hotspot = {
  id: string;
  name: string;
  eras: readonly EraId[];
  confidence: Confidence;
  position: Vec3;
  dates: string;
  summary: string;
  detail: string;
  sources: { label: string; href: string }[];
};

const her =
  "https://her.northamptonshire.gov.uk/Monument/MNN30858";
const wiki = "https://en.wikipedia.org/wiki/Northampton_Castle";
const fonc = "https://www.northamptoncastle.com/timeline/";
const hall =
  "https://historicengland.org.uk/listing/heritage-gateway/results/record/b1c5c25c-c821-4cba-b3a4-a16f7a3adf66/MNN30859";

export const hotspots: Hotspot[] = [
  {
    id: "earthwork",
    name: "Saxon earthwork",
    eras: ["saxon"],
    confidence: "inferred",
    position: anchors.earthwork,
    dates: "Before 1066",
    summary:
      "The early town stood on this ground, with some kind of Saxon or Danish earthwork.",
    detail:
      "Northampton began around Chalk Lane and St Peter's Street. Excavation under the later castle bank found late Saxon pottery, and work in 2012–13 found an Anglo-Saxon brooch, pottery, and an ironstone wall. The huts drawn here are only a way of picturing that. Their plan is not known.",
    sources: [
      { label: "Friends of Northampton Castle timeline", href: fonc },
      { label: "Wikipedia, Northampton Castle", href: wiki },
    ],
  },
  {
    id: "river",
    name: "River Nene",
    eras: [
      "saxon",
      "timber",
      "becket",
      "siege",
      "peak",
      "civilwar",
      "orchard",
      "demolition",
      "today",
    ],
    confidence: "documented",
    position: anchors.river,
    dates: "Throughout",
    summary: "A branch of the Nene guarded the west side of the castle.",
    detail:
      "The castle sat on a low hill falling toward the river. The ditch was cut down into clay, so it may always have held water, fed from the Nene. The channel was moved when the railway came. What you see is the medieval relationship: river to the west, town to the east, not a surveyed riverbank.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "ditch",
    name: "Inner bailey ditch",
    eras: ["timber", "becket", "siege", "peak", "civilwar", "orchard", "demolition"],
    confidence: "excavated",
    position: anchors.ditch,
    dates: "12th century – 19th century",
    summary: "About 27 metres wide and 9 metres deep where it was sectioned in 1961.",
    detail:
      "John Alexander's excavations found a ditch about 90 feet wide and 30 feet deep, cut through sandstone into Upper Lias clay. It was recut as late as the 17th century and was still substantially open around 1700. The early 19th century filled it about 16 feet deep, and the railway finished the job. A stretch about 16 metres wide still survives under the car park.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "north-gate",
    name: "North gate",
    eras: ["timber", "becket", "siege", "peak", "civilwar", "orchard", "demolition"],
    confidence: "documented",
    position: anchors.northGate,
    dates: "Medieval",
    summary: "The principal gate, on the north, with a causeway across the ditch.",
    detail:
      "Plans show the north gate and a causeway that replaced an earlier drawbridge. A survey of 1322–3 says two old gates needed repair. A geophysical survey in 2017 found possible traces of the north gate under the St Andrew's Road site. In May 1215 rebel barons besieged the castle and failed to take it. The gatehouse drawn here is a typical form, not a measured elevation.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "barbican",
    name: "Barbican",
    eras: ["becket", "siege", "peak", "civilwar"],
    confidence: "inferred",
    position: anchors.barbican,
    dates: "Medieval",
    summary: "An outwork north of the ditch, known from earthworks rather than walls.",
    detail:
      "E. F. Law's 1863 survey shows earthworks of a barbican north of the inner bailey moat. The walled passage drawn here is a guess at what those earthworks supported.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "outer",
    name: "Outer bailey",
    eras: ["timber", "becket", "siege", "peak", "civilwar"],
    confidence: "inferred",
    position: anchors.outer,
    dates: "Medieval",
    summary: "A second enclosure of about 3.5 acres, with no known medieval buildings.",
    detail:
      "A plan of 1743 gives the inner and outer baileys about 3.5 acres each, and the whole castle, defences included, about 15 acres. The outer bailey seems to have been open ground for mustering and for events such as tournaments. Its exact outline is poorly recorded, so this yard is only the idea of it. The 1460 battle of the Wars of the Roses was not fought here. It was near Delapré Abbey.",
    sources: [
      { label: "Inner bailey record", href: her },
      { label: "Friends of Northampton Castle timeline", href: fonc },
    ],
  },
  {
    id: "hall",
    name: "Great Hall",
    eras: ["becket", "siege", "peak", "civilwar", "orchard", "demolition"],
    confidence: "documented",
    position: anchors.hall,
    dates: "By 1164 – after 1329",
    summary: "Where Becket was tried, and later where the justices sat.",
    detail:
      "Accounts of the 1164 trial name the hall, a lower inner chamber, and an upper chamber where the king sat while messengers went between them. Henry III had round windows added in 1244, the roof panelled in 1249, and painted glass and a king's chair in the 1250s. The hall, the Long Chamber, and the Great Chamber burned around 1318 and were repaired by 1329 for the itinerant justices. King John is said to have visited about thirty times and, in 1205, to have moved the treasury here. Medieval chess pieces from the site are in Northampton Museum. The footprint of the hall has not been fixed; this position is the centre of the bailey.",
    sources: [
      { label: "Great Hall record", href: hall },
      { label: "Friends of Northampton Castle timeline", href: fonc },
    ],
  },
  {
    id: "great-chamber",
    name: "Great Chamber",
    eras: ["peak", "civilwar", "orchard"],
    confidence: "documented",
    position: anchors.greatChamber,
    dates: "13th century",
    summary: "The king's chamber, recorded to the west of the hall.",
    detail:
      "The floor of the Great Chamber and its wardrobe was repaired in 1235. A reading of the 1322–3 survey puts this chamber west of the hall and the queen's Long Chamber to the east, as parts of one range. That arrangement is followed here and should be treated as a hypothesis.",
    sources: [{ label: "Great Hall record", href: hall }],
  },
  {
    id: "long-chamber",
    name: "Long Chamber",
    eras: ["peak", "civilwar", "orchard"],
    confidence: "documented",
    position: anchors.longChamber,
    dates: "13th century",
    summary: "The queen's chamber, recorded to the east of the hall.",
    detail:
      "Orders between 1236 and 1253 glaze the queen's chamber and the king's wardrobe, and call for painted white glass in the hall windows nearest the queen's door. The Long Chamber was destroyed in the same fire as the hall, around 1318.",
    sources: [{ label: "Great Hall record", href: hall }],
  },
  {
    id: "queens",
    name: "Queen's rooms",
    eras: ["becket", "peak", "civilwar"],
    confidence: "documented",
    position: anchors.queens,
    dates: "12th–13th century",
    summary: "An upper chamber north of the hall, used in the Becket accounts.",
    detail:
      "At the trial, Becket waited in a lower room while Henry II sat in an upper chamber. Later works put the queen's chamber on the north side of the hall, with the king's wardrobe nearby. The block drawn against the hall is that relationship, not a recovered plan.",
    sources: [{ label: "Great Hall record", href: hall }],
  },
  {
    id: "kitchen",
    name: "Kitchen range",
    eras: ["peak", "civilwar", "orchard"],
    confidence: "excavated",
    position: anchors.kitchen,
    dates: "Medieval",
    summary: "A building in the 1960s trenches, a kitchen at least later in its life.",
    detail:
      "Alexander's excavation on the east side of the inner bailey found a building interpreted as a kitchen range in its later use, and another that may have been part of the great hall. The kitchens here stand south of the hall so the excavated east side can also show the royal rooms against the bank.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "apartments",
    name: "Royal apartments",
    eras: ["peak", "civilwar", "orchard"],
    confidence: "excavated",
    position: anchors.apartments,
    dates: "Henry III – 1318",
    summary: "Henry III's rooms, set into the bank and burned in 1318.",
    detail:
      "On the north-east the bailey bank was cut back and revetted in the 12th or early 13th century to make room for buildings. The royal apartments stood against that bank and were destroyed in the fire of about 1318. A 2019 test pit on the St Andrew's Road site found a surviving wall foundation.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "keep",
    name: "Keep",
    eras: ["timber", "becket", "siege", "peak", "civilwar", "orchard", "demolition"],
    confidence: "inferred",
    position: anchors.keepNw,
    dates: "By 1322, and perhaps much earlier",
    summary: "A keep is named in 1322–3. Nobody has fixed where it stood.",
    detail:
      "The 1322–3 survey mentions a keep as well as a new tower and six smaller towers. Hartshorne thought the keep was on the north-east. Law's 1863 survey shows a mound about 30 metres across in the north-west quarter, which may be the old motte. One reading of the Becket accounts is that the 'hall with chambers above' was the keep itself. Use the two placements in this card. Both are guesses.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "chapel",
    name: "Chapel of St George",
    eras: ["peak", "civilwar"],
    confidence: "inferred",
    position: anchors.chapel,
    dates: "By 1322",
    summary: "One of two chapels. St George's is the only dedication recorded.",
    detail:
      "The 1322–3 survey names a lower chapel and a further chapel, one of them dedicated to St George. No foundations have been tied to either, so this building only marks that the castle had a chapel.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "south-tower",
    name: "South tower, the Ring",
    eras: ["becket", "siege", "peak", "civilwar", "orchard", "demolition"],
    confidence: "recorded",
    position: anchors.southTower,
    dates: "Medieval – 1879",
    summary: "A round tower with narrow loops. Later a gun platform, then the gaol.",
    detail:
      "Antiquarian views show a circular tower on the south side. Speed's 1610 map draws it rectangular; the masonry was round, and the model follows the masonry. In 1643 it was paved for cannon, and in 1645 there was a brass gun on the Ring. It later served as the county prison and was destroyed in 1879. It is drawn larger than the other towers because the views single it out.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "west-wall",
    name: "West wall",
    eras: ["becket", "siege", "peak", "civilwar", "orchard", "demolition"],
    confidence: "recorded",
    position: anchors.westWall,
    dates: "c. 1153 – 1881",
    summary: "The wall that failed in the 1260s and was photographed, in a sense, by being drawn as it fell.",
    detail:
      "The stone curtain was probably begun between 1153 and 1164. By 1258 the west wall was collapsing and towers were roofless; the wall was propped with timber. It was in no state for a serious defence in 1264, which helps explain the short siege. It collapsed in 1266 and was rebuilt with heavy buttresses, the ones exposed in 1879. In Shakespeare's King John, Prince Arthur leaps from these walls. The real Arthur almost certainly died in France around 1203.",
    sources: [
      { label: "Inner bailey record", href: her },
      { label: "Wikipedia, Northampton Castle", href: wiki },
    ],
  },
  {
    id: "postern",
    name: "West postern",
    eras: ["timber", "becket", "siege", "peak", "civilwar", "orchard", "demolition"],
    confidence: "recorded",
    position: anchors.postern,
    dates: "Medieval",
    summary: "A small arch on the west side. The stones survive, but not here.",
    detail:
      "The postern has an arch of semi-Norman character and stood on the west side. When the station was built, the railway company took it down and rebuilt it in the boundary wall as a memorial, faced with castle ashlar. The arch you can visit is that rebuilt one. This mark is its medieval side of the castle, not its modern spot.",
    sources: [
      {
        label: "Postern record",
        href: "https://her.northamptonshire.gov.uk/Monument/MNN30864",
      },
    ],
  },
  {
    id: "priory",
    name: "St Andrew's Priory",
    eras: ["siege"],
    confidence: "inferred",
    position: anchors.priory,
    dates: "5 April 1264",
    summary: "The breach was in the priory garden wall, not in the castle.",
    detail:
      "On 5 April 1264 the royal army attacked the town's south gate. Prince Edward and Philip Basset rode around to the north-west and found a weak stretch in the garden wall of St Andrew's Priory. It collapsed, the chroniclers say, wide enough for forty horses abreast. Simon de Montfort the Younger was captured there. The priory is shown so the story has a place to point. It is not a reconstruction of the church.",
    sources: [
      {
        label: "Northamptonshire Battlefields Society",
        href: "https://northantsbattles.com/the-1264-battle/",
      },
    ],
  },
  {
    id: "station",
    name: "Northampton station",
    eras: ["today"],
    confidence: "survives",
    position: anchors.station,
    dates: "1879 – today",
    summary: "Castle Station was built on the castle in 1879 and rebuilt in 1963–64.",
    detail:
      "The main line had bypassed the town. In 1879 a loop brought the railway through the castle, and the London and North Western Railway demolished the remains for the station. The 1963–64 rebuild dropped the word Castle from the name, because by then it was the only station. The building drawn here is a stand-in for today's station, not a model of the architecture.",
    sources: [{ label: "Wikipedia, Northampton Castle", href: wiki }],
  },
  {
    id: "postern-today",
    name: "Rebuilt postern",
    eras: ["today"],
    confidence: "survives",
    position: anchors.posternToday,
    dates: "Rebuilt 1879",
    summary: "The only standing masonry, moved to the station entrance.",
    detail:
      "It stands by the station approach at Black Lion Hill, no longer at the top of the castle bank. The wall it sits in is faced with reused castle stone. It is a minor arch, and it is the one piece of the building you can touch.",
    sources: [{ label: "Wikipedia, Northampton Castle", href: wiki }],
  },
  {
    id: "bank-today",
    name: "Surviving bank",
    eras: ["today"],
    confidence: "survives",
    position: anchors.bankToday,
    dates: "Medieval earthwork",
    summary: "A short length of the inner bailey bank, east of St Andrew's Road.",
    detail:
      "About 25 metres of the eastern bank survives in the public open space, with a 5 metre stretch of mortared ironstone wall at its foot, exposed in the 1960s and read as a revetment. The round mound at the south end of that bank is modern. Walls and wells found in the 1960s are still largely buried under the grass. Heritage poles set out in Castle Park in July 2025 mark the wider perimeter.",
    sources: [
      { label: "Inner bailey record", href: her },
      { label: "Wikipedia, Northampton Castle", href: wiki },
    ],
  },
];

export type Beat = {
  eraId: EraId;
  mood?: Mood;
  cutaway?: boolean;
  position: Vec3;
  target: Vec3;
  caption: string;
};

export type Tour = {
  id: string;
  title: string;
  minutes: string;
  summary: string;
  beats: Beat[];
};

export const tours: Tour[] = [
  {
    id: "founding",
    title: "A castle for Northampton",
    minutes: "2 min",
    summary: "From the Saxon town edge to the first stone walls.",
    beats: [
      {
        eraId: "saxon",
        position: [180, 120, 160],
        target: [10, 0, 0],
        caption:
          "Before any castle, people were already here. The early town sat on this rise above a branch of the River Nene, around Chalk Lane and St Peter's Street, inside an earthwork.",
      },
      {
        eraId: "saxon",
        position: [40, 18, 36],
        target: [16, 1, 8],
        caption:
          "Under the later bank, diggers found late Saxon pottery. In 2012 a brooch, more pottery, and an ironstone wall came up. The houses in front of you are a sketch of that occupation. No plan of them survives.",
      },
      {
        eraId: "timber",
        position: [90, 55, 80],
        target: [-20, 4, -10],
        caption:
          "After the Conquest a castle rose on the hill, first in earth and timber. Simon de Senlis, Earl of Northampton, is credited with the stone castle. It is missing from Domesday Book in 1086, and it was well underway when he left on crusade in 1095.",
      },
      {
        eraId: "becket",
        mood: "day",
        position: [130, 80, 120],
        target: [0, 6, 0],
        caption:
          "The stone curtain around the inner bailey was probably built between 1153 and 1164. The bank under it was vast: where it was sectioned, the original rampart was judged about 18 metres wide and 6 metres high. A scrap of the eastern bank is still in the park.",
      },
    ],
  },
  {
    id: "becket",
    title: "The archbishop on trial",
    minutes: "3 min",
    summary: "October 1164. Thomas Becket faces Henry II in the hall.",
    beats: [
      {
        eraId: "becket",
        position: [160, 110, 150],
        target: [0, 4, 0],
        caption:
          "October 1164. Henry II has called a great council to Northampton Castle and summoned Thomas Becket, Archbishop of Canterbury, to answer before it.",
      },
      {
        eraId: "becket",
        position: [18, 14, -92],
        target: [0, 3, -40],
        caption:
          "Becket comes in from the north, across the ditch. He and the king had been close. By now Becket was the king's most stubborn opponent, and he arrived carrying his own cross.",
      },
      {
        eraId: "becket",
        position: [14, 7, 22],
        target: [0, 3, -6],
        caption:
          "He gets off his horse at the door of the hall. The cross is a challenge, and everyone in the yard can see it.",
      },
      {
        eraId: "becket",
        cutaway: true,
        position: [-20, 32, 22],
        target: [0, 2, -10],
        caption:
          "He waits in a lower chamber. Above him, the king and the barons sit in an upper room. Messengers go back and forth. The hall, the lower room, and the upper room are all named in accounts of the trial. How they joined is inferred, which is why the roof is lifted off.",
      },
      {
        eraId: "becket",
        cutaway: true,
        position: [18, 26, 24],
        target: [0, 2, -8],
        caption:
          "The council condemns him. Becket refuses the judgement and walks out through a hostile crowd.",
      },
      {
        eraId: "becket",
        mood: "night",
        position: [-48, 12, 30],
        target: [-74, 4, 22],
        caption:
          "That night he leaves dressed as a monk. He reaches France, and six years of exile begin. Knights will kill him at Canterbury in 1170.",
      },
      {
        eraId: "today",
        mood: "day",
        position: [-10, 48, 110],
        target: [-4, 2, 8],
        caption:
          "The hall was on ground the station and its car parks now cover. The only masonry still above ground is the postern by the entrance, and the railway moved it here in 1879.",
      },
    ],
  },
  {
    id: "siege",
    title: "Forty horses wide",
    minutes: "3 min",
    summary: "April 1264. The town falls, then the castle.",
    beats: [
      {
        eraId: "siege",
        position: [40, 70, 180],
        target: [20, 0, -40],
        caption:
          "On 3 April 1264 Henry III raised his standard at Oxford and marched on Northampton. The castle was held for Simon de Montfort. The king came ready for a long siege.",
      },
      {
        eraId: "siege",
        position: [-20, 22, 130],
        target: [10, 0, 70],
        caption:
          "The engines were set up on the meadows south of the town, on the ground now called Beckets Park. The camp in front of you is in the right direction. It is not a surveyed position.",
      },
      {
        eraId: "siege",
        position: [20, 28, -90],
        target: [70, 2, -150],
        caption:
          "At dawn on 5 April the main attack struck the south gate of the town. Prince Edward rode around to the north and found a weak place in the garden wall of St Andrew's Priory. The wall gave way. Chroniclers say the gap was wide enough for forty horses.",
      },
      {
        eraId: "siege",
        position: [-110, 18, 20],
        target: [-74, 5, 0],
        caption:
          "Simon de Montfort the Younger was pulled from his horse and captured at the breach. Most of the defenders fell back into the castle. They were buying little time: the west wall had been propped with timber since the late 1250s, and it would collapse outright in 1266.",
      },
      {
        eraId: "siege",
        position: [16, 16, -80],
        target: [0, 5, -49],
        caption:
          "On the morning of 6 April the garrison surrendered. The castle was the king's again. The heavy buttresses on the west wall, recorded when the railway demolished them, belong to the rebuild that followed.",
      },
    ],
  },
  {
    id: "last",
    title: "Orchard, gaol, railway",
    minutes: "2 min",
    summary: "From the Civil War gun platform to the station.",
    beats: [
      {
        eraId: "civilwar",
        position: [24, 16, 78],
        target: [0, 8, 49],
        caption:
          "In the Civil War the castle was held for Parliament. In 1643 the south tower, called the Ring, was paved so a cannon could stand on it. A brass gun on the Ring is recorded in 1645.",
      },
      {
        eraId: "orchard",
        position: [70, 40, 70],
        target: [0, 2, 0],
        caption:
          "In 1662 Charles II ordered the town walls and the castle defences slighted, because Northampton had sided with Parliament. The ruins were the county gaol until 1675. By about 1729 the interior was orchard and pasture, planted with cherries and gooseberries.",
      },
      {
        eraId: "demolition",
        position: [-90, 24, 40],
        target: [-70, 4, 0],
        caption:
          "The Crown sold the site in lots from 1813. The London and North Western Railway bought it in stages and, in 1879, demolished what remained for Castle Station, despite a county petition. Antiquarians stood in the cuttings and drew the west wall, its buttresses, and the south tower as they came down.",
      },
      {
        eraId: "today",
        position: [-40, 28, 100],
        target: [-20, 2, 60],
        caption:
          "The company rebuilt the postern into the station wall as a memorial. In July 2025, poles in Castle Park were set along the old perimeter. Between the postern, the bank east of St Andrew's Road, and the buried ditch, that is what is left.",
      },
    ],
  },
];

export const overviewCamera = {
  position: [168, 128, 172] as Vec3,
  target: [0, 0, 0] as Vec3,
};

export function eraById(id: EraId) {
  return eras.find((era) => era.id === id) ?? eras[4];
}

export function hotspotById(id: string) {
  return hotspots.find((hotspot) => hotspot.id === id) ?? null;
}
