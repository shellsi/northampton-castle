import {
  gatePoint,
  places,
  posternPoint,
  southTowerPoint,
  westWallPoint,
} from "@/content/plan";

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
  hall: places.hall,
  hallQuery: places.hallQuery,
  greatChamber: places.greatChamber,
  longChamber: places.longChamber,
  queens: places.queens,
  kitchen: places.kitchen,
  apartments: places.apartments,
  barrow: places.barrow,
  southTower: [southTowerPoint[0], 6, southTowerPoint[2]] as Vec3,
  westWall: westWallPoint,
  ditch: places.ditch,
  northGate: gatePoint,
  postern: posternPoint,
  chapel: places.chapel,
  outer: places.outer,
  fort: places.fort,
  river: places.river,
  priory: places.priory,
  town: places.town,
  earthwork: places.earthwork,
  station: places.station,
  posternToday: places.posternToday,
  bankToday: places.bankToday,
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
    summary: "Where St Andrew's Road now enters the old bailey, with a causeway across the ditch.",
    detail:
      "On the MOLA plan the north gate sits slightly east of centre, and St Andrew's Road runs in through it. A causeway replaced an earlier drawbridge. A survey of 1322–3 says two old gates needed repair. A geophysical survey in 2017 found possible traces of the north gate under the road. In May 1215 rebel barons besieged the castle and failed to take it. The gatehouse drawn here is a typical form, not a measured elevation.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "fort",
    name: "The Fort",
    eras: ["timber", "becket", "siege", "peak", "civilwar", "orchard", "demolition", "today"],
    confidence: "recorded",
    position: anchors.fort,
    dates: "Surveyed 1863",
    summary: "A rounded earthwork north of the ditch, west of where the road now runs.",
    detail:
      "The MOLA plan marks a rounded bank called The Fort, surveyed in 1863, just north of the inner ditch. It may be the barbican whose earthworks Law recorded. Only the bank is drawn. There is no standing wall to put a passage on.",
    sources: [{ label: "Inner bailey record", href: her }],
  },
  {
    id: "outer",
    name: "Outer bailey",
    eras: ["timber", "becket", "siege", "peak", "civilwar"],
    confidence: "inferred",
    position: anchors.outer,
    dates: "Medieval",
    summary: "The enclosure south of the inner bailey. The station stands in it.",
    detail:
      "On the MOLA plan the outer bailey, labelled from an 1854 survey, lies south of the inner bailey. The station sits in its south-west corner, and a rebuilt postern stands near Black Lion Hill. No medieval buildings are recorded inside it. It reads as open ground for mustering. The 1460 battle of the Wars of the Roses was not fought here. It was near Delapré Abbey.",
    sources: [
      { label: "Inner bailey record", href: her },
      { label: "Friends of Northampton Castle timeline", href: fonc },
    ],
  },
  {
    id: "hall",
    name: "Great Hall",
    eras: ["becket", "siege", "peak", "civilwar", "orchard", "demolition"],
    confidence: "excavated",
    position: anchors.hall,
    dates: "By 1164 – after 1329",
    summary: "East of St Andrew's Road, in the 1961–64 trenches.",
    detail:
      "The MOLA plan labels the great hall in the yellow excavation zone east of St Andrew's Road, long north to south. Accounts of the 1164 trial name the hall, a lower inner chamber, and an upper chamber where the king sat while messengers went between them. Henry III had round windows added in 1244, the roof panelled in 1249, and painted glass and a king's chair in the 1250s. The hall, the Long Chamber, and the Great Chamber burned around 1318 and were repaired by 1329 for the itinerant justices. King John is said to have visited about thirty times and, in 1205, to have moved the treasury here. Medieval chess pieces from the site are in Northampton Museum. Roofs and the joins between rooms are still a reconstruction.",
    sources: [
      { label: "Great Hall record", href: hall },
      { label: "Friends of Northampton Castle timeline", href: fonc },
    ],
  },
  {
    id: "hall-query",
    name: "Hall?",
    eras: ["becket", "siege", "peak", "civilwar", "orchard"],
    confidence: "inferred",
    position: anchors.hallQuery,
    dates: "Uncertain",
    summary: "A building in the west half of the bailey. The plan itself puts a question mark on it.",
    detail:
      "The MOLA plan marks a separate range west of the station car park as 'hall?'. The excavated great hall is the building east of St Andrew's Road. This one is drawn so the doubt stays visible. It is not a second certain hall.",
    sources: [{ label: "Great Hall record", href: hall }],
  },
  {
    id: "great-chamber",
    name: "Great Chamber",
    eras: ["peak", "civilwar", "orchard"],
    confidence: "documented",
    position: anchors.greatChamber,
    dates: "13th century",
    summary: "The king's chamber, placed just west of the hall, toward the yard.",
    detail:
      "The floor of the Great Chamber and its wardrobe was repaired in 1235. A reading of the 1322–3 survey puts this chamber west of the hall and the queen's Long Chamber to the east. Here that puts it between St Andrew's Road and the excavated hall. The join is a hypothesis.",
    sources: [{ label: "Great Hall record", href: hall }],
  },
  {
    id: "long-chamber",
    name: "Long Chamber",
    eras: ["peak", "civilwar", "orchard"],
    confidence: "documented",
    position: anchors.longChamber,
    dates: "13th century",
    summary: "The queen's chamber, set against the east bank beside the hall.",
    detail:
      "Orders between 1236 and 1253 glaze the queen's chamber and the king's wardrobe, and call for painted white glass in the hall windows nearest the queen's door. The Long Chamber was destroyed in the same fire as the hall, around 1318. It is drawn on the bank side of the hall, east of the road.",
    sources: [{ label: "Great Hall record", href: hall }],
  },
  {
    id: "queens",
    name: "Queen's rooms",
    eras: ["becket", "peak", "civilwar"],
    confidence: "documented",
    position: anchors.queens,
    dates: "12th–13th century",
    summary: "An upper chamber on the north end of the hall, used in the Becket accounts.",
    detail:
      "At the trial, Becket waited in a lower room while Henry II sat in an upper chamber. Later works put the queen's chamber on the north side of the hall, with the king's wardrobe nearby. The block drawn on the north end of the east hall is that relationship, not a recovered plan.",
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
      "Alexander's excavation on the east side of the inner bailey found a building interpreted as a kitchen range in its later use, and another that may have been part of the great hall. The kitchen stands at the south end of that same trench, beside the hall.",
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
    id: "barrow",
    name: "Anglo-Saxon barrow",
    eras: ["saxon", "timber", "becket", "siege", "peak", "civilwar", "orchard", "demolition"],
    confidence: "recorded",
    position: anchors.barrow,
    dates: "Before the castle",
    summary: "A burial mound in the north of the inner bailey, west of the gate.",
    detail:
      "The MOLA plan marks an Anglo-Saxon barrow here, in the north of the inner bailey. It is not labelled a motte or a keep. A keep is named in the 1322–3 survey, with a new tower and six smaller towers, but this plan does not place it. The mound drawn is the barrow.",
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
      "The MOLA plan puts the original postern on the west wall of the inner bailey, toward the north-west. The arch is semi-Norman. When the station was built, the railway company took it down and rebuilt it in the boundary wall of the outer bailey, near Black Lion Hill, faced with castle ashlar. This mark is the medieval gate. The arch you can visit is the rebuilt one, further south.",
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
    summary: "The station stands in the outer bailey, south of the inner bailey.",
    detail:
      "The main line had bypassed the town. In 1879 a loop brought the railway through the castle, and the London and North Western Railway demolished the remains for the station. On the MOLA plan the tracks and the station occupy the outer bailey. The inner bailey is the station car park, with St Andrew's Road between the car park and the great hall. The 1963–64 rebuild dropped the word Castle from the name. The building drawn here is a stand-in, not a model of the architecture.",
    sources: [{ label: "Wikipedia, Northampton Castle", href: wiki }],
  },
  {
    id: "postern-today",
    name: "Rebuilt postern",
    eras: ["today"],
    confidence: "survives",
    position: anchors.posternToday,
    dates: "Rebuilt 1879",
    summary: "The only standing masonry, rebuilt by the station at Black Lion Hill.",
    detail:
      "It stands in the outer bailey, by the station approach at Black Lion Hill, not on the west wall where the medieval postern was. The wall it sits in is faced with reused castle stone. It is a minor arch, and it is the one piece of the building you can touch.",
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
        position: [160, 130, 210],
        target: [0, 0, 20],
        caption:
          "Before any castle, people were already here. The early town sat on this rise above a branch of the River Nene, around Chalk Lane and St Peter's Street, inside an earthwork.",
      },
      {
        eraId: "saxon",
        position: [36, 16, 32],
        target: [12, 1, 6],
        caption:
          "Under the later bank, diggers found late Saxon pottery. In 2012 a brooch, more pottery, and an ironstone wall came up. The houses in front of you are a sketch of that occupation. No plan of them survives.",
      },
      {
        eraId: "timber",
        position: [90, 55, 100],
        target: [10, 4, 0],
        caption:
          "After the Conquest a castle rose on the hill, first in earth and timber. Simon de Senlis, Earl of Northampton, is credited with the stone castle. It is missing from Domesday Book in 1086, and it was well underway when he left on crusade in 1095.",
      },
      {
        eraId: "becket",
        mood: "day",
        position: [130, 80, 140],
        target: [10, 6, 10],
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
        position: [140, 100, 190],
        target: [20, 4, 20],
        caption:
          "October 1164. Henry II has called a great council to Northampton Castle and summoned Thomas Becket, Archbishop of Canterbury, to answer before it.",
      },
      {
        eraId: "becket",
        position: [20, 16, -108],
        target: [28, 4, -53],
        caption:
          "Becket comes in from the north, across the ditch. He and the king had been close. By now Becket was the king's most stubborn opponent, and he arrived carrying his own cross.",
      },
      {
        eraId: "becket",
        position: [30, 8, 32],
        target: [50, 3, 6],
        caption:
          "He gets off his horse at the door of the hall. The cross is a challenge, and everyone in the yard can see it.",
      },
      {
        eraId: "becket",
        cutaway: true,
        position: [32, 34, 28],
        target: [50, 2, 6],
        caption:
          "He waits in a lower chamber. Above him, the king and the barons sit in an upper room. Messengers go back and forth. The hall, the lower room, and the upper room are all named in accounts of the trial. How they joined is inferred, which is why the roof is lifted off.",
      },
      {
        eraId: "becket",
        cutaway: true,
        position: [36, 28, 30],
        target: [50, 2, 6],
        caption:
          "The council condemns him. Becket refuses the judgement and walks out through a hostile crowd.",
      },
      {
        eraId: "becket",
        mood: "night",
        position: [-40, 14, -8],
        target: [-64, 4, -27],
        caption:
          "That night he leaves dressed as a monk. He reaches France, and six years of exile begin. Knights will kill him at Canterbury in 1170.",
      },
      {
        eraId: "today",
        mood: "day",
        position: [24, 42, 48],
        target: [48, 1, 8],
        caption:
          "The hall stood east of St Andrew's Road, beyond the car park. The station is in the outer bailey to the south. The only masonry still above ground is the postern the railway rebuilt by the station in 1879.",
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
        position: [30, 78, 230],
        target: [10, 0, 40],
        caption:
          "On 3 April 1264 Henry III raised his standard at Oxford and marched on Northampton. The castle was held for Simon de Montfort. The king came ready for a long siege.",
      },
      {
        eraId: "siege",
        position: [50, 24, 240],
        target: [48, 2, 188],
        caption:
          "The engines were set up on the meadows south of the town, on the ground now called Beckets Park. The camp in front of you is in the right direction. It is not a surveyed position.",
      },
      {
        eraId: "siege",
        position: [40, 32, -80],
        target: [96, 3, -158],
        caption:
          "At dawn on 5 April the main attack struck the south gate of the town. Prince Edward rode around to the north and found a weak place in the garden wall of St Andrew's Priory. The wall gave way. Chroniclers say the gap was wide enough for forty horses.",
      },
      {
        eraId: "siege",
        position: [-120, 22, 24],
        target: [-70, 5, 10],
        caption:
          "Simon de Montfort the Younger was pulled from his horse and captured at the breach. Most of the defenders fell back into the castle. They were buying little time: the west wall had been propped with timber since the late 1250s, and it would collapse outright in 1266.",
      },
      {
        eraId: "siege",
        position: [8, 16, -100],
        target: [28, 5, -53],
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
        position: [-28, 18, 96],
        target: [-16, 8, 57],
        caption:
          "In the Civil War the castle was held for Parliament. In 1643 the south tower, called the Ring, was paved so a cannon could stand on it. A brass gun on the Ring is recorded in 1645.",
      },
      {
        eraId: "orchard",
        position: [100, 48, 90],
        target: [8, 2, 16],
        caption:
          "In 1662 Charles II ordered the town walls and the castle defences slighted, because Northampton had sided with Parliament. The ruins were the county gaol until 1675. By about 1729 the interior was orchard and pasture, planted with cherries and gooseberries.",
      },
      {
        eraId: "demolition",
        position: [-110, 28, 30],
        target: [-70, 4, 12],
        caption:
          "The Crown sold the site in lots from 1813. The London and North Western Railway bought it in stages and, in 1879, demolished what remained for Castle Station, despite a county petition. Antiquarians stood in the cuttings and drew the west wall, its buttresses, and the south tower as they came down.",
      },
      {
        eraId: "today",
        position: [-36, 24, 198],
        target: [-8, 2, 160],
        caption:
          "The company rebuilt the postern into the station wall as a memorial. In July 2025, poles in Castle Park were set along the old perimeter. Between the postern, the bank east of St Andrew's Road, and the buried ditch, that is what is left.",
      },
    ],
  },
];

export const overviewCamera = {
  position: [150, 140, 230] as Vec3,
  target: [8, 0, 40] as Vec3,
};

export function eraById(id: EraId) {
  return eras.find((era) => era.id === id) ?? eras[4];
}

export function hotspotById(id: string) {
  return hotspots.find((hotspot) => hotspot.id === id) ?? null;
}
