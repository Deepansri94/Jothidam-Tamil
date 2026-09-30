// ── Storage helpers ──────────────────────────────────────────────
const load = key => JSON.parse(localStorage.getItem(key) || '[]');
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

let profiles = load('jt_profiles');
let settings = JSON.parse(localStorage.getItem('jt_settings') || JSON.stringify({ defaultCity: 'Chennai|13.0827|80.2707' }));

// ── Lookup tables ─────────────────────────────────────────────────
const NAKSHATRAS = [
  'அஸ்வினி','பரணி','கார்த்திகை','ரோகிணி','மிருகசீரிஷம்','திருவாதிரை',
  'புனர்பூசம்','பூசம்','ஆயில்யம்','மகம்','பூரம்','உத்திரம்',
  'அஸ்தம்','சித்திரை','சுவாதி','விசாகம்','அனுஷம்','கேட்டை',
  'மூலம்','பூராடம்','உத்திராடம்','திருவோணம்','அவிட்டம்','சதயம்',
  'பூரட்டாதி','உத்திரட்டாதி','ரேவதி'
];

// NAK_RASI — primary Rasi for each Nakshatra (pada 1 Rasi)
// Nakshatras that span two Rasis: Krittika(2), Mrigasira(4), Punarvasu(6),
// Uttara(11), Vishaka(15), Uttarashada(20), Purva Bhadra(24)
const NAK_RASI = [
  'மேஷம்','மேஷம்','மேஷம்','ரிஷபம்','ரிஷபம்','மிதுனம்',
  'மிதுனம்','கடகம்','கடகம்','சிம்மம்','சிம்மம்','கன்னி',
  'கன்னி','துலாம்','துலாம்','விருச்சிகம்','விருச்சிகம்','விருச்சிகம்',
  'தனுசு','தனுசு','மகரம்','மகரம்','கும்பம்','கும்பம்',
  'மீனம்','மீனம்','மீனம்'
];

// NAK_RASI_PADAS — [pada1Rasi, pada2Rasi, pada3Rasi, pada4Rasi] for each Nakshatra
// Most Nakshatras stay in one Rasi across all 4 padas.
// Split Nakshatras have pada4 (or pada1) in the next/prev Rasi.
const NAK_RASI_PADAS = [
  ['மேஷம்','மேஷம்','மேஷம்','மேஷம்'],       // 0 அஸ்வினி
  ['மேஷம்','மேஷம்','மேஷம்','மேஷம்'],       // 1 பரணி
  ['ரிஷபம்','ரிஷபம்','ரிஷபம்','மிதுனம்'],  // 2 கார்த்திகை (pada4→Mithuna)
  ['ரிஷபம்','ரிஷபம்','ரிஷபம்','ரிஷபம்'],  // 3 ரோகிணி
  ['மிதுனம்','மிதுனம்','மிதுனம்','கடகம்'], // 4 மிருகசீரிஷம் (pada4→Kataka)
  ['மிதுனம்','மிதுனம்','மிதுனம்','மிதுனம்'],// 5 திருவாதிரை
  ['மிதுனம்','மிதுனம்','மிதுனம்','கடகம்'], // 6 புனர்பூசம் (pada4→Kataka)
  ['கடகம்','கடகம்','கடகம்','கடகம்'],       // 7 பூசம்
  ['கடகம்','கடகம்','கடகம்','கடகம்'],       // 8 ஆயில்யம்
  ['சிம்மம்','சிம்மம்','சிம்மம்','சிம்மம்'],// 9 மகம்
  ['சிம்மம்','சிம்மம்','சிம்மம்','சிம்மம்'],// 10 பூரம்
  ['கன்னி','கன்னி','கன்னி','கன்னி'],       // 11 உத்திரம் (pada1→Simha handled separately)
  ['கன்னி','கன்னி','கன்னி','கன்னி'],       // 12 அஸ்தம்
  ['துலாம்','துலாம்','துலாம்','துலாம்'],    // 13 சித்திரை (pada1,2→Kanni handled)
  ['துலாம்','துலாம்','துலாம்','துலாம்'],    // 14 சுவாதி
  ['விருச்சிகம்','விருச்சிகம்','விருச்சிகம்','தனுசு'], // 15 விசாகம் (pada4→Dhanusu)
  ['விருச்சிகம்','விருச்சிகம்','விருச்சிகம்','விருச்சிகம்'],// 16 அனுஷம்
  ['விருச்சிகம்','விருச்சிகம்','விருச்சிகம்','விருச்சிகம்'],// 17 கேட்டை
  ['தனுசு','தனுசு','தனுசு','தனுசு'],       // 18 மூலம்
  ['தனுசு','தனுசு','தனுசு','தனுசு'],       // 19 பூராடம்
  ['மகரம்','மகரம்','மகரம்','மகரம்'],       // 20 உத்திராடம் (pada1→Dhanusu handled)
  ['மகரம்','மகரம்','மகரம்','மகரம்'],       // 21 திருவோணம்
  ['கும்பம்','கும்பம்','கும்பம்','கும்பம்'],// 22 அவிட்டம் (pada1,2→Makara handled)
  ['கும்பம்','கும்பம்','கும்பம்','கும்பம்'],// 23 சதயம்
  ['கும்பம்','கும்பம்','கும்பம்','மீனம்'], // 24 பூரட்டாதி (pada4→Meena)
  ['மீனம்','மீனம்','மீனம்','மீனம்'],       // 25 உத்திரட்டாதி
  ['மீனம்','மீனம்','மீனம்','மீனம்']        // 26 ரேவதி
];

// Get Rasi for a Nakshatra + pada (pada: 1-4)
function getNakRasi(nakIdx, pada) {
  return NAK_RASI_PADAS[nakIdx][(pada || 1) - 1];
}

const RASIS = ['மேஷம்','ரிஷபம்','மிதுனம்','கடகம்','சிம்மம்','கன்னி','துலாம்','விருச்சிகம்','தனுசு','மகரம்','கும்பம்','மீனம்'];
const RASI_EN = ['Mesham','Rishabam','Midhunam','Kadagam','Simmam','Kanni','Thulam','Viruchigam','Dhanusu','Magaram','Kumbam','Meenam'];

const PLANETS = ['சூரியன்','சந்திரன்','செவ்வாய்','புதன்','குரு','சுக்கிரன்','சனி','ராகு','கேது'];
const PLANET_EN = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];

// Dasa lords for each Nakshatra (Vimshottari)
const DASA_LORD = ['கேது','சுக்கிரன்','சூரியன்','சந்திரன்','செவ்வாய்','ராகு','குரு','சனி','புதன்',
                   'கேது','சுக்கிரன்','சூரியன்','சந்திரன்','செவ்வாய்','ராகு','குரு','சனி','புதன்',
                   'கேது','சுக்கிரன்','சூரியன்','சந்திரன்','செவ்வாய்','ராகு','குரு','சனி','புதன்'];

const DASA_YEARS = { 'கேது':7,'சுக்கிரன்':20,'சூரியன்':6,'சந்திரன்':10,'செவ்வாய்':7,'ராகு':18,'குரு':16,'சனி':19,'புதன்':17 };
const DASA_ORDER = ['கேது','சுக்கிரன்','சூரியன்','சந்திரன்','செவ்வாய்','ராகு','குரு','சனி','புதன்'];

// Rasi chart house layout — index in 4×4 grid (row*4+col), -1 = center blank
const RASI_LAYOUT = [12,1,2,3, 11,-1,-1,4, 10,-1,-1,5, 9,8,7,6];

// Navamsam: each Nakshatra has 4 padas, each pada maps to a Rasi (0-based)
const NAVAMSAM_START = [0,4,8,0,4,8,0,4,8,0,4,8,0,4,8,0,4,8,0,4,8,0,4,8,0,4,8];

// Panchangam — Rahu Kalam slots per weekday (0=Sun..6=Sat), as [startH, startM, endH, endM]
const RAHU_KALAM = [[16,30,18,0],[7,30,9,0],[15,0,16,30],[12,0,13,30],[13,30,15,0],[9,0,10,30],[10,30,12,0]];
const YAMAGANDAM  = [[12,0,13,30],[10,30,12,0],[9,0,10,30],[7,30,9,0],[6,0,7,30],[15,0,16,30],[13,30,15,0]];
const KULIGAI     = [[7,30,9,0],[15,0,16,30],[10,30,12,0],[9,0,10,30],[10,30,12,0],[7,30,9,0],[6,0,7,30]];

// Subha Horai order per weekday
const HORAI_ORDER = [
  ['சூரியன்','சுக்கிரன்','புதன்','சந்திரன்','சனி','குரு','செவ்வாய்'],
  ['சந்திரன்','சனி','குரு','செவ்வாய்','சூரியன்','சுக்கிரன்','புதன்'],
  ['செவ்வாய்','சூரியன்','சுக்கிரன்','புதன்','சந்திரன்','சனி','குரு'],
  ['புதன்','சந்திரன்','சனி','குரு','செவ்வாய்','சூரியன்','சுக்கிரன்'],
  ['குரு','செவ்வாய்','சூரியன்','சுக்கிரன்','புதன்','சந்திரன்','சனி'],
  ['சுக்கிரன்','புதன்','சந்திரன்','சனி','குரு','செவ்வாய்','சூரியன்'],
  ['சனி','குரு','செவ்வாய்','சூரியன்','சுக்கிரன்','புதன்','சந்திரன்']
];
const SUBHA_HORAI = ['குரு','சுக்கிரன்','புதன்','சந்திரன்'];

// Porutham data
const POR_GANAM = ['தேவ','தேவ','ராட்சஸ','தேவ','மனுஷ்ய','மனுஷ்ய','தேவ','தேவ','ராட்சஸ',
                   'ராட்சஸ','மனுஷ்ய','மனுஷ்ய','தேவ','ராட்சஸ','தேவ','ராட்சஸ','தேவ','ராட்சஸ',
                   'ராட்சஸ','மனுஷ்ய','மனுஷ்ய','தேவ','தேவ','ராட்சஸ','மனுஷ்ய','தேவ','தேவ'];
const POR_YONI  = ['குதிரை','யானை','ஆடு','பாம்பு','நாய்','பூனை','ஆடு','பூனை','எலி',
                   'எலி','மாடு','மாடு','எருமை','புலி','எருமை','புலி','மான்','மான்',
                   'நாய்','குரங்கு','குரங்கு','நீர்யானை','சிங்கம்','குதிரை','சிங்கம்','யானை','யானை'];
const POR_RAJJU = ['கழுத்து','பாதம்','நாபி','கழுத்து','பாதம்','நாபி','கழுத்து','பாதம்','நாபி',
                   'சிரஸ்','கழுத்து','பாதம்','நாபி','சிரஸ்','கழுத்து','பாதம்','நாபி','சிரஸ்',
                   'கழுத்து','பாதம்','நாபி','சிரஸ்','கழுத்து','பாதம்','நாபி','சிரஸ்','கழுத்து'];
const POR_NADI  = ['வாதம்','பித்தம்','கபம்','கபம்','வாதம்','பித்தம்','கபம்','வாதம்','பித்தம்',
                   'பித்தம்','வாதம்','கபம்','கபம்','பித்தம்','வாதம்','கபம்','வாதம்','பித்தம்',
                   'பித்தம்','வாதம்','கபம்','கபம்','பித்தம்','வாதம்','கபம்','வாதம்','பித்தம்'];

// Pancha Pakshi — bird per nakshatra
const PP_BIRD = ['வல்லூறு','ஆந்தை','காகம்','கோழி','மயில்','வல்லூறு','ஆந்தை','காகம்','கோழி',
                 'மயில்','வல்லூறு','ஆந்தை','காகம்','கோழி','மயில்','வல்லூறு','ஆந்தை','காகம்',
                 'கோழி','மயில்','வல்லூறு','ஆந்தை','காகம்','கோழி','மயில்','வல்லூறு','ஆந்தை'];
const PP_ACTIVITIES = ['உண்ணுதல்','நடத்தல்','ஆட்சி','தூக்கம்','இறத்தல்'];
const PP_RESULT     = ['சிறந்தது','நல்லது','மிகவும் நல்லது','தவிர்க்கவும்','மிகவும் தவிர்க்கவும்'];

// Jamakol Arudam — result per rasi (0-based)
const JAMAKOL_RESULT = [
  'உடல் ஆரோக்கியம் சிறப்பாக இருக்கும். தைரியமான முடிவுகள் வெற்றி தரும்.',
  'பொருளாதார வளர்ச்சி உண்டாகும். குடும்பத்தில் மகிழ்ச்சி நிலவும்.',
  'புதிய தொடர்புகள் உருவாகும். பயணங்கள் சாதகமாக அமையும்.',
  'மனதில் அமைதி கிடைக்கும். வீட்டில் சுபகாரியங்கள் நடைபெறும்.',
  'புகழும் மதிப்பும் அதிகரிக்கும். அரசு சார்ந்த காரியங்கள் வெற்றி பெறும்.',
  'தொழிலில் முன்னேற்றம் உண்டாகும். கடன்கள் தீரும்.',
  'திருமண வாய்ப்புகள் உருவாகும். கூட்டாளிகளால் நன்மை கிடைக்கும்.',
  'தடைகள் நீங்கும். மறைமுக எதிர்ப்புகள் குறையும்.',
  'தீர்த்த யாத்திரை வாய்ப்பு கிடைக்கும். குரு அனுக்கிரகம் உண்டாகும்.',
  'தொழிலில் உயர்வு கிடைக்கும். சமூகத்தில் மரியாதை அதிகரிக்கும்.',
  'நண்பர்களால் உதவி கிடைக்கும். சமூக சேவையில் ஈடுபாடு அதிகரிக்கும்.',
  'ஆன்மீக ஈடுபாடு அதிகரிக்கும். முன்னோர் ஆசி கிடைக்கும்.'
];

// Numerology planet meanings
const NUM_MEANINGS = {
  1:'சூரியன் — தலைமை, சுதந்திரம், படைப்பாற்றல்',
  2:'சந்திரன் — உணர்வு, ஒத்துழைப்பு, நுட்பம்',
  3:'குரு — வெளிப்பாடு, மகிழ்ச்சி, தொடர்பு',
  4:'ராகு — நிலைத்தன்மை, உழைப்பு, ஒழுக்கம்',
  5:'புதன் — சுதந்திரம், மாற்றம், சாகசம்',
  6:'சுக்கிரன் — அன்பு, அழகு, பொறுப்பு',
  7:'கேது — ஆன்மீகம், ஆய்வு, தனிமை',
  8:'சனி — அதிகாரம், பொருளாதாரம், கர்மா',
  9:'செவ்வாய் — மனிதாபிமானம், தியாகம், முடிவு'
};

// Rasi Palan content
const RASI_PALAN = {
  daily: [
    'இன்று உங்களுக்கு சாதகமான நாள். புதிய முயற்சிகளில் வெற்றி கிடைக்கும். உடல் ஆரோக்கியம் சிறப்பாக இருக்கும்.',
    'பொருளாதார விஷயங்களில் கவனம் தேவை. குடும்பத்தினரோடு நேரம் செலவிடுவது நல்லது.',
    'புதிய தொடர்புகள் உருவாகும். பயணங்கள் சாதகமாக அமையும். மனம் சுறுசுறுப்பாக இருக்கும்.',
    'வீட்டில் மகிழ்ச்சியான சூழல் நிலவும். உணர்வுகளை கட்டுப்படுத்திக்கொள்ளுங்கள்.',
    'தொழிலில் முன்னேற்றம் உண்டாகும். உயரதிகாரிகளின் ஆதரவு கிடைக்கும்.',
    'கடன் தொல்லைகள் குறையும். உடல் நலத்தில் கவனம் செலுத்துங்கள்.',
    'கூட்டாளிகளோடு ஒத்துழைப்பு சிறப்பாக இருக்கும். திருமண வாய்ப்புகள் உருவாகலாம்.',
    'மறைமுக எதிர்ப்புகள் குறையும். ஆன்மீக ஈடுபாடு அதிகரிக்கும்.',
    'தீர்த்த யாத்திரை வாய்ப்பு கிடைக்கும். குரு அனுக்கிரகம் உண்டாகும்.',
    'தொழிலில் உயர்வு கிடைக்கும். சமூகத்தில் மரியாதை அதிகரிக்கும்.',
    'நண்பர்களால் உதவி கிடைக்கும். புதிய திட்டங்கள் வெற்றி பெறும்.',
    'ஆன்மீக ஈடுபாடு அதிகரிக்கும். முன்னோர் ஆசி கிடைக்கும்.'
  ],
  weekly: [
    'இந்த வாரம் உங்கள் தொழிலில் நல்ல முன்னேற்றம் உண்டாகும். புதிய வாய்ப்புகள் தேடி வரும். குடும்பத்தில் சுபகாரியங்கள் நடைபெறலாம்.',
    'வாரத்தின் முற்பகுதியில் சில தடைகள் இருந்தாலும் பிற்பகுதியில் நல்ல மாற்றங்கள் உண்டாகும். பொருளாதாரம் சீராகும்.',
    'இந்த வாரம் பயணங்கள் அதிகமாக இருக்கும். புதிய நண்பர்கள் உருவாவார்கள். தொழில் விரிவடையும்.',
    'குடும்பத்தினரோடு நேரம் செலவிடுவது நல்லது. வீட்டில் சில மாற்றங்கள் செய்யலாம். உணர்வுகளை கட்டுப்படுத்துங்கள்.',
    'தொழிலில் சிறப்பான வாரம். உயரதிகாரிகளின் பாராட்டு கிடைக்கும். புகழ் அதிகரிக்கும்.',
    'உடல் நலத்தில் கவனம் செலுத்துங்கள். கடன் விஷயங்களில் முன்னேற்றம் உண்டாகும்.',
    'கூட்டாளிகளோடு நல்ல ஒத்துழைப்பு இருக்கும். திருமண விஷயங்களில் முன்னேற்றம் உண்டாகும்.',
    'மறைமுக எதிர்ப்புகள் குறையும். ஆன்மீக விஷயங்களில் ஈடுபாடு அதிகரிக்கும்.',
    'குரு அனுக்கிரகம் உண்டாகும். தீர்த்த யாத்திரை வாய்ப்பு கிடைக்கும்.',
    'தொழிலில் உயர்வு கிடைக்கும். சமூகத்தில் மரியாதை அதிகரிக்கும்.',
    'நண்பர்களால் உதவி கிடைக்கும். புதிய திட்டங்கள் வெற்றி பெறும்.',
    'ஆன்மீக ஈடுபாடு அதிகரிக்கும். முன்னோர் ஆசி கிடைக்கும்.'
  ],
  monthly: [
    'இந்த மாதம் உங்கள் வாழ்க்கையில் முக்கியமான மாற்றங்கள் உண்டாகும். தொழிலில் புதிய வாய்ப்புகள் தேடி வரும். குடும்பத்தில் மகிழ்ச்சி நிலவும்.',
    'பொருளாதார வளர்ச்சி உண்டாகும். சொத்து சம்பந்தமான விஷயங்களில் முன்னேற்றம் கிடைக்கும்.',
    'புதிய தொடர்புகள் உருவாகும். பயணங்கள் சாதகமாக அமையும். மனம் சுறுசுறுப்பாக இருக்கும்.',
    'குடும்பத்தில் சுபகாரியங்கள் நடைபெறலாம். வீட்டில் மகிழ்ச்சியான சூழல் நிலவும்.',
    'தொழிலில் சிறப்பான மாதம். உயரதிகாரிகளின் ஆதரவு கிடைக்கும். புகழ் அதிகரிக்கும்.',
    'உடல் நலத்தில் கவனம் செலுத்துங்கள். கடன் தொல்லைகள் குறையும்.',
    'கூட்டாளிகளோடு நல்ல ஒத்துழைப்பு இருக்கும். திருமண வாய்ப்புகள் உருவாகலாம்.',
    'மறைமுக எதிர்ப்புகள் குறையும். ஆன்மீக ஈடுபாடு அதிகரிக்கும்.',
    'குரு அனுக்கிரகம் உண்டாகும். தீர்த்த யாத்திரை வாய்ப்பு கிடைக்கும்.',
    'தொழிலில் உயர்வு கிடைக்கும். சமூகத்தில் மரியாதை அதிகரிக்கும்.',
    'நண்பர்களால் உதவி கிடைக்கும். புதிய திட்டங்கள் வெற்றி பெறும்.',
    'ஆன்மீக ஈடுபாடு அதிகரிக்கும். முன்னோர் ஆசி கிடைக்கும்.'
  ],
  yearly: [
    'இந்த ஆண்டு உங்கள் வாழ்க்கையில் மிகவும் முக்கியமான ஆண்டாக அமையும். தொழிலில் பெரிய முன்னேற்றம் உண்டாகும்.',
    'பொருளாதார வளர்ச்சி சிறப்பாக இருக்கும். சொத்து சம்பந்தமான விஷயங்களில் வெற்றி கிடைக்கும்.',
    'புதிய தொடர்புகள் உருவாகும். வெளிநாட்டு வாய்ப்புகள் கிடைக்கலாம்.',
    'குடும்பத்தில் சுபகாரியங்கள் நடைபெறும். வீட்டில் மகிழ்ச்சி நிலவும்.',
    'தொழிலில் சிறப்பான ஆண்டு. புகழும் மதிப்பும் அதிகரிக்கும்.',
    'உடல் நலத்தில் கவனம் செலுத்துங்கள். கடன்கள் தீரும்.',
    'திருமண வாய்ப்புகள் உருவாகும். கூட்டாளிகளால் நன்மை கிடைக்கும்.',
    'மறைமுக எதிர்ப்புகள் குறையும். ஆன்மீக வளர்ச்சி உண்டாகும்.',
    'குரு அனுக்கிரகம் உண்டாகும். தீர்த்த யாத்திரை வாய்ப்பு கிடைக்கும்.',
    'தொழிலில் உயர்வு கிடைக்கும். சமூகத்தில் மரியாதை அதிகரிக்கும்.',
    'நண்பர்களால் உதவி கிடைக்கும். புதிய திட்டங்கள் வெற்றி பெறும்.',
    'ஆன்மீக ஈடுபாடு அதிகரிக்கும். முன்னோர் ஆசி கிடைக்கும்.'
  ]
};

// ── Navigation ────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(item.dataset.page).classList.add('active');
    if (item.dataset.page === 'panchangam') initPanchangam();
    if (item.dataset.page === 'rasipalan') initRasiPalan();
    if (item.dataset.page === 'tools') initTools();
    if (item.dataset.page === 'settings') loadSettingsForm();
  });
});

// ── Toast ─────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  setTimeout(() => t.className = 'toast hidden', 3000);
}

// ── Modal ─────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

document.getElementById('profile-modal').addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal('profile-modal');
});

// ── Astrology calculations ────────────────────────────────────────

// ── Jean Meeus Moon longitude (Astronomical Algorithms Ch.47) ────
// Accurate to ~0.3° for 1900–2100. No external library needed.
function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;

  // Moon's mean longitude
  let Lp = 218.3164477 + 481267.88123421*T - 0.0015786*T2 + T3/538841 - T4/65194000;
  // Moon's mean anomaly
  let M  = 134.9633964 + 477198.8675055*T + 0.0087414*T2 + T3/69699 - T4/14712000;
  // Sun's mean anomaly
  let Ms = 357.5291092 + 35999.0502909*T - 0.0001536*T2 + T3/24490000;
  // Moon's argument of latitude
  let F  = 93.2720950 + 483202.0175233*T - 0.0036539*T2 - T3/3526000 + T4/863310000;
  // Elongation of Moon from Sun
  let D  = 297.8501921 + 445267.1114034*T - 0.0018819*T2 + T3/545868 - T4/113065000;

  const r = Math.PI / 180;
  M  = M  % 360; Ms = Ms % 360;
  F  = F  % 360; D  = D  % 360;

  // Main periodic terms for longitude (degrees)
  let dL = 6288774*Math.sin(r*M)
    + 1274027*Math.sin(r*(2*D - M))
    + 658314 *Math.sin(r*(2*D))
    + 213618 *Math.sin(r*(2*M))
    - 185116 *Math.sin(r*Ms)
    - 114332 *Math.sin(r*(2*F))
    +  58793 *Math.sin(r*(2*D - 2*M))
    +  57066 *Math.sin(r*(2*D - Ms - M))
    +  53322 *Math.sin(r*(2*D + M))
    +  45758 *Math.sin(r*(2*D - Ms))
    -  40923 *Math.sin(r*(Ms - M))
    -  34720 *Math.sin(r*D)
    -  30383 *Math.sin(r*(Ms + M))
    +  15327 *Math.sin(r*(2*D - 2*F))
    -  12528 *Math.sin(r*(M + 2*F))
    +  10980 *Math.sin(r*(M - 2*F))
    +  10675 *Math.sin(r*(4*D - M))
    +  10034 *Math.sin(r*(3*M))
    +   8548 *Math.sin(r*(4*D - 2*M))
    -   7888 *Math.sin(r*(2*D + Ms - M))
    -   6766 *Math.sin(r*(2*D + Ms))
    -   5163 *Math.sin(r*(D - M));

  let lon = Lp + dL / 1000000.0;
  lon = ((lon % 360) + 360) % 360;
  return lon;
}

// Convert UTC datetime to Julian Day Number
function toJulianDay(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, mi]   = (timeStr || '06:00').split(':').map(Number);
  // Convert IST (UTC+5:30) to UTC
  const utcH = h - 5, utcM = mi - 30;
  const utcFrac = (utcH * 60 + utcM) / 1440;
  let Y = y, M2 = m, D2 = d + utcFrac;
  if (M2 <= 2) { Y -= 1; M2 += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M2 + 1)) + D2 + B - 1524.5;
}

// Approximate planet longitudes using mean motion (sufficient for house placement)
function planetLongitudes(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const norm = x => ((x % 360) + 360) % 360;
  return {
    Sun:     norm(280.46646 + 36000.76983 * T),
    Moon:    moonLongitude(jd),
    Mars:    norm(355.45332 + 19140.30268 * T),
    Mercury: norm(252.25084 + 149472.67411 * T),
    Jupiter: norm(34.89503 + 3034.74612 * T),
    Venus:   norm(181.97973 + 58517.81538 * T),
    Saturn:  norm(50.07744 + 1222.49309 * T),
    // Rahu mean node (retrograde)
    Rahu:    norm(125.04452 - 1934.13626 * T),
  };
}

function calcRasi(dob, tob) {
  const jd = toJulianDay(dob, tob);
  const lons = planetLongitudes(jd);

  // Ketu is always 180° opposite Rahu
  lons.Ketu = ((lons.Rahu + 180) % 360);

  // Apply ayanamsa (Lahiri) — sidereal correction
  // Lahiri ayanamsa ≈ 23.85° for J2000, +0.0136°/year
  const T = (jd - 2451545.0) / 36525.0;
  const ayanamsa = 23.85 + 0.0136 * T * 100;

  // Convert tropical to sidereal
  const sidereal = {};
  Object.entries(lons).forEach(([p, lon]) => {
    sidereal[p] = ((lon - ayanamsa) % 360 + 360) % 360;
  });

  // Moon nakshatra and rasi
  const moonLon    = sidereal.Moon;
  const moonNakIdx = Math.floor(moonLon / (360 / 27));
  const moonRasiIdx = Math.floor(moonLon / 30);

  // Lagnam (Ascendant) — simplified: Aries rises ~every 2 hours, offset by birth time
  const lagnamIdx = Math.floor(((sidereal.Sun + (parseFloat((tob||'06:00').split(':')[0]) * 15)) % 360) / 30);

  // Map planet sidereal longitude to house (1-12) based on Lagnam
  const positions = {};
  Object.entries(sidereal).forEach(([planet, lon]) => {
    const rasiIdx = Math.floor(lon / 30);
    // House = distance from lagnam rasi
    const house = ((rasiIdx - lagnamIdx + 12) % 12) + 1;
    positions[planet] = house;
  });

  return {
    positions,
    moonNakIdx,
    lagnamIdx,
    nakshatra: NAKSHATRAS[moonNakIdx],
    rasi: RASIS[moonRasiIdx],
    lagnam: RASIS[lagnamIdx],
    moonLon: moonLon.toFixed(2)
  };
}

function calcNavamsam(positions) {
  const nav = {};
  Object.entries(positions).forEach(([planet, house]) => {
    nav[planet] = ((house * 3 + 1) % 12) + 1;
  });
  return nav;
}

function renderRasiChart(containerId, positions) {
  const container = document.getElementById(containerId);
  const cells = Array(16).fill('');
  Object.entries(positions).forEach(([planet, house]) => {
    const cellIdx = RASI_LAYOUT.indexOf(house);
    if (cellIdx >= 0) cells[cellIdx] += (cells[cellIdx] ? '\n' : '') + PLANET_EN.indexOf(planet) >= 0 ? PLANETS[PLANET_EN.indexOf(planet)][0] : planet[0];
  });

  // Build planet map per house
  const houseMap = {};
  Object.entries(positions).forEach(([planet, house]) => {
    if (!houseMap[house]) houseMap[house] = [];
    const idx = PLANET_EN.indexOf(planet);
    houseMap[house].push(idx >= 0 ? PLANETS[idx].substring(0,3) : planet.substring(0,3));
  });

  container.innerHTML = RASI_LAYOUT.map((house, i) => {
    if (house === -1) return `<div class="rasi-cell center"></div>`;
    const planets = (houseMap[house] || []).join(' ');
    return `<div class="rasi-cell">
      <span class="cell-num">${house}</span>
      <span class="cell-planets">${planets}</span>
    </div>`;
  }).join('');
}

function calcPorutham(boyIdx, girlIdx, boyRasi, girlRasi) {
  // Use passed Rasi (pada-aware) or fall back to default
  const bRasi = boyRasi  || NAK_RASI[boyIdx];
  const gRasi = girlRasi || NAK_RASI[girlIdx];
  const results = [];

  // 1. Dinam
  const dinam = ((girlIdx - boyIdx + 27) % 27) + 1;
  const dinamMatch = [1,2,4,6,8,9,10,11,13,15,16,18,19,20,22,24,25,27].includes(dinam % 27 || 27);
  results.push({ name:'திணம்', en:'Dinam', match: dinamMatch ? 'match' : 'nomatch', icon: dinamMatch ? '✅' : '❌', result: dinamMatch ? 'பொருத்தம்' : 'பொருத்தமில்லை' });

  // 2. Ganam
  const bg = POR_GANAM[boyIdx], gg = POR_GANAM[girlIdx];
  const ganamMatch = bg === gg || (bg === 'தேவ' && gg === 'மனுஷ்ய') || (bg === 'மனுஷ்ய' && gg === 'தேவ');
  results.push({ name:'கணம்', en:'Ganam', match: ganamMatch ? 'match' : 'nomatch', icon: ganamMatch ? '✅' : '❌', result: ganamMatch ? 'பொருத்தம்' : 'பொருத்தமில்லை' });

  // 3. Mahendram
  const mahendram = ((girlIdx - boyIdx + 27) % 27);
  const mahendraMatch = [4,7,10,13,16,19,22,25].includes(mahendram);
  results.push({ name:'மகேந்திரம்', en:'Mahendram', match: mahendraMatch ? 'match' : 'partial', icon: mahendraMatch ? '✅' : '🟡', result: mahendraMatch ? 'பொருத்தம்' : 'பகுதி பொருத்தம்' });

  // 4. Sthree Dheerga
  const stree = ((girlIdx - boyIdx + 27) % 27);
  const streeMatch = stree >= 7;
  results.push({ name:'ஸ்திரீ தீர்க்கம்', en:'Sthree Dheerga', match: streeMatch ? 'match' : 'nomatch', icon: streeMatch ? '✅' : '❌', result: streeMatch ? 'பொருத்தம்' : 'பொருத்தமில்லை' });

  // 5. Yoni
  const by = POR_YONI[boyIdx], gy = POR_YONI[girlIdx];
  const yoniMatch = by === gy;
  const yoniPartial = !yoniMatch && !['புலி-மான்','நாய்-முயல்','பூனை-எலி'].includes(`${by}-${gy}`);
  results.push({ name:'யோனி', en:'Yoni', match: yoniMatch ? 'match' : yoniPartial ? 'partial' : 'nomatch', icon: yoniMatch ? '✅' : yoniPartial ? '🟡' : '❌', result: yoniMatch ? 'பொருத்தம்' : yoniPartial ? 'பகுதி' : 'பொருத்தமில்லை' });

  // 6. Rasi
  const br = RASIS.indexOf(bRasi), gr = RASIS.indexOf(gRasi);
  const rasiDiff = Math.abs(br - gr);
  const rasiMatch = [1,3,5,7].includes(rasiDiff) || rasiDiff === 0;
  results.push({ name:'ராசி', en:'Rasi', match: rasiMatch ? 'match' : 'partial', icon: rasiMatch ? '✅' : '🟡', result: rasiMatch ? 'பொருத்தம்' : 'பகுதி பொருத்தம்' });

  // 7. Rasiyathipaty
  const rasiLordMatch = rasiDiff % 6 !== 0;
  results.push({ name:'ராசியாதிபதி', en:'Rasiyathipaty', match: rasiLordMatch ? 'match' : 'nomatch', icon: rasiLordMatch ? '✅' : '❌', result: rasiLordMatch ? 'பொருத்தம்' : 'பொருத்தமில்லை' });

  // 8. Veda
  const vedaGroups = [[0,8,16],[1,9,17],[2,10,18],[3,11,19],[4,12,20],[5,13,21],[6,14,22],[7,15,23],[24,25,26]];
  const bvg = vedaGroups.findIndex(g => g.includes(boyIdx));
  const gvg = vedaGroups.findIndex(g => g.includes(girlIdx));
  const vedaMatch = bvg !== gvg;
  results.push({ name:'வேதை', en:'Veda', match: vedaMatch ? 'match' : 'nomatch', icon: vedaMatch ? '✅' : '❌', result: vedaMatch ? 'பொருத்தம்' : 'பொருத்தமில்லை' });

  // 9. Rajju
  const br2 = POR_RAJJU[boyIdx], gr2 = POR_RAJJU[girlIdx];
  const rajjuMatch = br2 !== gr2;
  results.push({ name:'ரஜ்ஜு', en:'Rajju', match: rajjuMatch ? 'match' : 'nomatch', icon: rajjuMatch ? '✅' : '❌', result: rajjuMatch ? 'பொருத்தம்' : 'பொருத்தமில்லை — தோஷம்' });

  // 10. Nadi
  const bn = POR_NADI[boyIdx], gn = POR_NADI[girlIdx];
  const nadiMatch = bn !== gn;
  results.push({ name:'நாடி', en:'Nadi', match: nadiMatch ? 'match' : 'nomatch', icon: nadiMatch ? '✅' : '❌', result: nadiMatch ? 'பொருத்தம்' : 'நாடி தோஷம்' });

  const score = results.filter(r => r.match === 'match').length;
  return { results, score };
}

// ── Tamil calendar data ───────────────────────────────────────────
const TAMIL_MONTHS = ['சித்திரை','வைகாசி','ஆனி','ஆடி','ஆவணி','புரட்டாசி','ஐப்பசி','கார்த்திகை','மார்கழி','தை','மாசி','பங்குனி'];
const TAMIL_YEARS  = ['பிரபவ','விபவ','சுக்ல','பிரமோதூத','பிரஜோத்பத்தி','ஆங்கீரஸ','ஸ்ரீமுக','பவ','யுவ','தாது','ஈஸ்வர','வெகுதான்ய','பிரமாதி','விக்கிரம','விஷு','சித்திரபானு','சுபானு','தாரண','பார்த்திப','வியய','சர்வஜித்','சர்வதாரி','விரோதி','விக்ருதி','கர','நந்தன','விஜய','ஜய','மன்மத','துர்முகி','ஹேவிளம்பி','விளம்பி','விகாரி','சார்வரி','பிலவ','சுபகிருது','சோபகிருது','குரோதி','விஸ்வாவசு','பராபவ','பிலவங்க','கீலக','சௌம்ய','சாதாரண','விரோதகிருது','பரிதாபி','பிரமாதீச','ஆனந்த','ராட்சஸ','நள','பிங்கள','காளயுக்தி','சித்தார்த்தி','ரௌத்திரி','துர்மதி','துந்துபி','ருத்ரோத்காரி','ரக்தாட்சி','குரோதன','அட்சய'];
const TITHI_NAMES  = ['பிரதமை','துவிதியை','திருதியை','சதுர்த்தி','பஞ்சமி','ஷஷ்டி','சப்தமி','அஷ்டமி','நவமி','தசமி','ஏகாதசி','துவாதசி','திரயோதசி','சதுர்தசி','பௌர்ணமி / அமாவாசை'];
const YOGAM_NAMES  = ['விஷ்கம்பம்','பிரீதி','ஆயுஷ்மான்','சௌபாக்கியம்','சோபனம்','அதிகண்டம்','சுகர்மா','திருதி','சூலம்','கண்டம்','விருத்தி','த்ருவம்','வியாகாதம்','ஹர்ஷணம்','வஜ்ரம்','சித்தி','வியதீபாதம்','வரீயான்','பரிகம்','சிவம்','சித்தம்','சாத்தியம்','சுபம்','சுக்லம்','பிரம்மம்','இந்திரம்','வைத்ருதி'];
const KARANAM_NAMES= ['பவ','பாலவ','கௌலவ','தைதில','கரஜ','வணிஜ','விஷ்டி','சகுனி','சதுஷ்பாத','நாகவ','கிம்ஸ்துக்ன'];
const VAARAM_NAMES = ['ஞாயிற்றுக்கிழமை','திங்கட்கிழமை','செவ்வாய்க்கிழமை','புதன்கிழமை','வியாழக்கிழமை','வெள்ளிக்கிழமை','சனிக்கிழமை'];
const VAARAM_SHORT = ['ஞாயிறு','திங்கள்','செவ்வாய்','புதன்','வியாழன்','வெள்ளி','சனி'];

// Sunrise/Sunset approximation for Chennai (lat 13.08, lon 80.27)
// Returns {rise, set} as decimal hours IST
function calcSunriseSunset(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const N = Math.floor(275*m/9) - Math.floor((m+9)/12)*(1+Math.floor((y-4*Math.floor(y/4)+2)/3)) + d - 30;
  const lng = 80.27, lat = 13.08;
  const lngHour = lng / 15;
  const tRise = N + ((6  - lngHour) / 24);
  const tSet  = N + ((18 - lngHour) / 24);
  const r = Math.PI / 180;
  const sinDec = d => 0.39782 * Math.sin(r*(0.9856*d - 3.289));
  const cosDec = d => Math.cos(Math.asin(sinDec(d)));
  const cosH = (t, rise) => {
    const sd = sinDec(t), cd = cosDec(t);
    return (Math.cos(r*90.833) - sd*Math.sin(r*lat)) / (cd*Math.cos(r*lat));
  };
  const hRise = (360 - r*180/Math.PI*Math.acos(cosH(tRise,true))) / 15;
  const hSet  = (r*180/Math.PI*Math.acos(cosH(tSet,false))) / 15;
  const toIST = h => h + lngHour + 5.5;
  const riseIST = toIST(hRise + (6  - lngHour) - (0.06571*tRise) - 6.622);
  const setIST  = toIST(hSet  + (18 - lngHour) - (0.06571*tSet)  - 6.622);
  return { rise: ((riseIST % 24) + 24) % 24, set: ((setIST % 24) + 24) % 24 };
}

function fmtTime(decHours) {
  const h = Math.floor(decHours);
  const m = Math.round((decHours - h) * 60);
  const hh = ((h % 24) + 24) % 24;
  const ampm = hh < 12 ? 'AM' : 'PM';
  const h12 = hh % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function fmtTimePad(h, m) {
  const hh = ((h % 24) + 24) % 24;
  const ampm = hh < 12 ? 'AM' : 'PM';
  const h12 = hh % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function getTamilDate(dateStr) {
  // Tamil new year starts ~April 14. Approximate Tamil month from Gregorian.
  const d = new Date(dateStr);
  const month = d.getMonth(); // 0-based
  const day   = d.getDate();
  // Tamil month mapping (approximate, mid-month transitions)
  const tamilMonthIdx = ((month - 3 + 12) % 12); // Chithirai starts ~Apr
  const tamilDay = day; // simplified — actual requires solar longitude
  // Tamil year: 60-year cycle, year 1 = 1987 CE
  const yearOffset = (d.getFullYear() - 1987 + 60) % 60;
  return {
    month: TAMIL_MONTHS[tamilMonthIdx],
    day: tamilDay,
    year: TAMIL_YEARS[yearOffset]
  };
}

function calcTithi(dateStr) {
  // Tithi = Moon - Sun longitude / 12, each tithi = 12°
  const jd = toJulianDay(dateStr, '06:00');
  const lons = planetLongitudes(jd);
  const T = (jd - 2451545.0) / 36525.0;
  const ayanamsa = 23.85 + 0.0136 * T * 100;
  const moonSid = ((lons.Moon - ayanamsa) % 360 + 360) % 360;
  const sunSid  = ((lons.Sun  - ayanamsa) % 360 + 360) % 360;
  const diff = ((moonSid - sunSid) + 360) % 360;
  const tithiIdx = Math.floor(diff / 12); // 0-29
  const paksha = tithiIdx < 15 ? 'வளர்பிறை (Shukla Paksha)' : 'தேய்பிறை (Krishna Paksha)';
  const tithiName = TITHI_NAMES[tithiIdx % 15];
  return { tithiName, paksha, tithiIdx };
}

function calcYogam(dateStr) {
  const jd = toJulianDay(dateStr, '06:00');
  const lons = planetLongitudes(jd);
  const T = (jd - 2451545.0) / 36525.0;
  const ayanamsa = 23.85 + 0.0136 * T * 100;
  const moonSid = ((lons.Moon - ayanamsa) % 360 + 360) % 360;
  const sunSid  = ((lons.Sun  - ayanamsa) % 360 + 360) % 360;
  const yogaIdx = Math.floor(((moonSid + sunSid) % 360) / (360/27));
  return YOGAM_NAMES[yogaIdx];
}

function calcKaranam(dateStr) {
  const jd = toJulianDay(dateStr, '06:00');
  const lons = planetLongitudes(jd);
  const T = (jd - 2451545.0) / 36525.0;
  const ayanamsa = 23.85 + 0.0136 * T * 100;
  const moonSid = ((lons.Moon - ayanamsa) % 360 + 360) % 360;
  const sunSid  = ((lons.Sun  - ayanamsa) % 360 + 360) % 360;
  const diff = ((moonSid - sunSid) + 360) % 360;
  const karanamIdx = Math.floor(diff / 6) % 11;
  return KARANAM_NAMES[karanamIdx];
}

function calcNakshatra(dateStr) {
  const jd = toJulianDay(dateStr, '06:00');
  const lons = planetLongitudes(jd);
  const T = (jd - 2451545.0) / 36525.0;
  const ayanamsa = 23.85 + 0.0136 * T * 100;
  const moonSid = ((lons.Moon - ayanamsa) % 360 + 360) % 360;
  return NAKSHATRAS[Math.floor(moonSid / (360/27))];
}

function calcPanchangam(dateStr) {
  const d   = new Date(dateStr);
  const day = d.getDay();
  const { rise, set } = calcSunriseSunset(dateStr);
  // Moonrise approx: Moon moves ~13°/day, rises ~50min later each day
  const moonrise = ((rise + 12 + (day * 0.83)) % 24);
  const moonset  = ((moonrise + 14) % 24);

  // Rahu Kalam, Yamagandam, Kuligai — calculated from actual sunrise
  // Day duration split into 8 equal parts
  const dayDur = set - rise;
  const part   = dayDur / 8;
  // Rahu Kalam part index per weekday (1-based)
  const RK_PART = [8,2,7,5,6,4,3]; // Sun=8th,Mon=2nd,Tue=7th,Wed=5th,Thu=6th,Fri=4th,Sat=3rd
  const YG_PART = [5,4,3,2,1,8,7];
  const KG_PART = [2,7,4,3,8,5,6];

  const slot = (partIdx) => {
    const s = rise + (partIdx - 1) * part;
    const e = s + part;
    return `${fmtTime(s)} – ${fmtTime(e)}`;
  };

  // Subha Horai — each hora = 1 hour, starting from sunrise
  const horais = HORAI_ORDER[day];
  const subhaSlots = horais.map((h, i) => {
    const sh = rise + i;
    return SUBHA_HORAI.includes(h) ? `${h} ${fmtTime(sh)}` : null;
  }).filter(Boolean).join(', ');

  // Nalla Neram — first subha horai
  const firstSubha = horais.findIndex(h => SUBHA_HORAI.includes(h));
  const nallaStart = rise + firstSubha;

  const tamilDate = getTamilDate(dateStr);
  const { tithiName, paksha } = calcTithi(dateStr);
  const yogam    = calcYogam(dateStr);
  const karanam  = calcKaranam(dateStr);
  const nakshatra = calcNakshatra(dateStr);
  const pirai    = paksha.includes('வளர்') ? 'வளர்பிறை' : 'தேய்பிறை';

  return {
    tamilDate, paksha, tithiName, yogam, karanam, nakshatra, pirai,
    vaaram: VAARAM_NAMES[day],
    sunrise: fmtTime(rise),
    sunset:  fmtTime(set),
    moonrise: fmtTime(moonrise),
    moonset:  fmtTime(moonset),
    rahuKalam:  slot(RK_PART[day]),
    yamagandam: slot(YG_PART[day]),
    kuligai:    slot(KG_PART[day]),
    nallaNeeram: `${fmtTime(nallaStart)} – ${fmtTime(nallaStart + 1)}`,
    subhaHorai: subhaSlots
  };
}

function calcDasaBhukti(nakIdx, dob) {
  const startLord = DASA_LORD[nakIdx];
  const order = [...DASA_ORDER];
  const startIdx = order.indexOf(startLord);
  const rotated = [...order.slice(startIdx), ...order.slice(0, startIdx)];

  const dobDate = new Date(dob);
  const timeline = [];
  let current = new Date(dobDate);

  rotated.forEach(lord => {
    const years = DASA_YEARS[lord];
    const end = new Date(current);
    end.setFullYear(end.getFullYear() + years);
    timeline.push({ lord, start: new Date(current), end, years });
    current = new Date(end);
  });

  return timeline;
}

function calcNumerology(name, dob) {
  const digits = dob.replace(/-/g, '').split('').map(Number);
  const reduce = n => { while (n > 9) n = String(n).split('').reduce((a,b) => a + +b, 0); return n; };

  const lifePath = reduce(digits.reduce((a, b) => a + b, 0));

  const nameVal = name.toUpperCase().split('').reduce((sum, ch) => {
    const v = ch.charCodeAt(0) - 64;
    return v > 0 && v <= 26 ? sum + v : sum;
  }, 0);
  const nameNum = reduce(nameVal);

  const destinyDigits = dob.replace(/-/g,'').split('').map(Number);
  const destinyNum = reduce(destinyDigits.reduce((a,b) => a+b, 0));

  return { lifePath, nameNum, destinyNum };
}

// ── Jathagam ──────────────────────────────────────────────────────
let currentChart = null;

function populateNakshatraDropdowns() {
  const selects = ['por-boy-nak','por-girl-nak','db-nakshatra','pp-nakshatra','jk-nakshatra'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '<option value="">-- தேர்ந்தெடு --</option>' +
      NAKSHATRAS.map((n, i) => `<option value="${i}">${n}</option>`).join('');
  });
  const jkRasi = document.getElementById('jk-rasi');
  if (jkRasi) jkRasi.innerHTML = '<option value="">-- தேர்ந்தெடு --</option>' +
    RASIS.map((r, i) => `<option value="${i}">${r}</option>`).join('');
}

function populateRasiSelector() {
  const container = document.getElementById('rasi-selector');
  container.innerHTML = RASIS.map((r, i) =>
    `<button class="rasi-btn" onclick="selectRasi(${i}, this)">${r}</button>`
  ).join('');
}

function generateJathagam() {
  const name = document.getElementById('jt-name').value.trim();
  const dob  = document.getElementById('jt-dob').value;
  const tob  = document.getElementById('jt-tob').value;
  const pob  = document.getElementById('jt-pob').value;

  if (!name) return toast('பெயர் உள்ளிடவும்', 'error');
  if (!dob)  return toast('பிறந்த தேதி உள்ளிடவும்', 'error');
  if (!tob)  return toast('பிறந்த நேரம் உள்ளிடவும்', 'error');
  if (!pob)  return toast('பிறந்த இடம் தேர்ந்தெடுக்கவும்', 'error');

  const chart = calcRasi(dob, tob);
  const navPos = calcNavamsam(chart.positions);
  currentChart = { name, dob, tob, pob, ...chart };

  document.getElementById('jathagam-info').innerHTML = `
    <strong>பெயர்:</strong> ${name} &nbsp;|&nbsp;
    <strong>பிறந்த தேதி:</strong> ${dob} &nbsp;|&nbsp;
    <strong>நேரம்:</strong> ${tob}<br>
    <strong>நட்சத்திரம்:</strong> ${chart.nakshatra} &nbsp;|&nbsp;
    <strong>ராசி:</strong> ${chart.rasi} &nbsp;|&nbsp;
    <strong>லக்னம்:</strong> ${chart.lagnam}<br>
    <span style="font-size:.78rem;color:var(--color-text-muted)">சந்திர நிலை (Sidereal): ${chart.moonLon}°</span>
  `;

  renderRasiChart('rasi-chart', chart.positions);
  renderRasiChart('navamsam-chart', navPos);
  document.getElementById('jathagam-result').classList.remove('hidden');
  toast('ஜாதகம் உருவாக்கப்பட்டது');
}

function saveProfile() {
  const name = document.getElementById('jt-name').value.trim();
  if (!name) return toast('முதலில் ஜாதகம் உருவாக்கவும்', 'error');
  document.getElementById('modal-profile-name').value = name;
  openModal('profile-modal');
}

function confirmSaveProfile() {
  const name = document.getElementById('modal-profile-name').value.trim();
  if (!name) return toast('பெயர் உள்ளிடவும்', 'error');
  const dob = document.getElementById('jt-dob').value;
  const tob = document.getElementById('jt-tob').value;
  const pob = document.getElementById('jt-pob').value;
  if (!dob || !tob || !pob) { closeModal('profile-modal'); return toast('முதலில் ஜாதகம் உருவாக்கவும்', 'error'); }

  const profile = { id: Date.now().toString(), name, dob, tob, pob };
  profiles.push(profile);
  save('jt_profiles', profiles);
  closeModal('profile-modal');
  refreshProfileDropdown();
  toast('சேமிக்கப்பட்டது');
}

function loadProfile(id) {
  if (!id) return;
  const p = profiles.find(x => x.id === id);
  if (!p) return;
  document.getElementById('jt-name').value = p.name;
  document.getElementById('jt-dob').value  = p.dob;
  document.getElementById('jt-tob').value  = p.tob;
  document.getElementById('jt-pob').value  = p.pob;
  document.getElementById('jt-delete-btn').style.display = 'inline-flex';
  document.getElementById('jt-delete-btn').dataset.id = id;
  generateJathagam();
}

function deleteProfile() {
  const id = document.getElementById('jt-delete-btn').dataset.id;
  if (!id || !confirm('இந்த ஜாதகத்தை நீக்கவா?')) return;
  profiles = profiles.filter(p => p.id !== id);
  save('jt_profiles', profiles);
  refreshProfileDropdown();
  document.getElementById('jt-delete-btn').style.display = 'none';
  document.getElementById('jathagam-result').classList.add('hidden');
  toast('நீக்கப்பட்டது');
}

function refreshProfileDropdown() {
  const sel = document.getElementById('jt-profile-select');
  sel.innerHTML = '<option value="">-- Load saved profile --</option>' +
    profiles.map(p => `<option value="${p.id}">${p.name} (${p.dob})</option>`).join('');
}

// ── Porutham ──────────────────────────────────────────────────────
document.getElementById('por-boy-nak').addEventListener('change', function() {
  const idx = parseInt(this.value);
  if (isNaN(idx)) { document.getElementById('por-boy-rasi').value = ''; return; }
  const padas = NAK_RASI_PADAS[idx];
  const unique = [...new Set(padas)];
  document.getElementById('por-boy-rasi').value = unique.join(' / ');
  document.getElementById('por-boy-pada').innerHTML =
    padas.map((r,i) => `<option value="${i+1}">பாதம் ${i+1} — ${r}</option>`).join('');
  document.getElementById('por-boy-pada-row').classList.remove('hidden');
});

document.getElementById('por-girl-nak').addEventListener('change', function() {
  const idx = parseInt(this.value);
  if (isNaN(idx)) { document.getElementById('por-girl-rasi').value = ''; return; }
  const padas = NAK_RASI_PADAS[idx];
  const unique = [...new Set(padas)];
  document.getElementById('por-girl-rasi').value = unique.join(' / ');
  document.getElementById('por-girl-pada').innerHTML =
    padas.map((r,i) => `<option value="${i+1}">பாதம் ${i+1} — ${r}</option>`).join('');
  document.getElementById('por-girl-pada-row').classList.remove('hidden');
});

function calculatePorutham() {
  const bi = parseInt(document.getElementById('por-boy-nak').value);
  const gi = parseInt(document.getElementById('por-girl-nak').value);
  if (isNaN(bi) || isNaN(gi)) return toast('இரண்டு நட்சத்திரங்களையும் தேர்ந்தெடுக்கவும்', 'error');
  const bp = parseInt(document.getElementById('por-boy-pada')?.value || '1');
  const gp = parseInt(document.getElementById('por-girl-pada')?.value || '1');
  const boyRasi  = getNakRasi(bi, bp);
  const girlRasi = getNakRasi(gi, gp);
  const { results, score } = calcPorutham(bi, gi, boyRasi, girlRasi);
  const verdict = score >= 7 ? 'மிகவும் சாதகம்' : score >= 5 ? 'சாதகம்' : 'கவனம் தேவை';
  const vColor = score >= 7 ? 'var(--color-success)' : score >= 5 ? 'var(--color-gold)' : 'var(--color-danger)';

  document.getElementById('match-score-box').innerHTML = `
    <div class="score-num">${score}/10</div>
    <div class="score-info">
      <div style="color:var(--color-text-muted);font-size:.82rem">மொத்த பொருத்தம் — Total Score</div>
      <div class="score-verdict" style="color:${vColor}">${verdict}</div>
    </div>
  `;

  document.getElementById('porutham-grid').innerHTML = results.map(r => `
    <div class="porutham-card ${r.match}">
      <div class="p-name">${r.name}</div>
      <span class="p-icon">${r.icon}</span>
      <div class="p-result">${r.result}</div>
    </div>
  `).join('');

  document.getElementById('porutham-result').classList.remove('hidden');
  toast('பொருத்தம் கணக்கிடப்பட்டது');
}

// ── Panchangam ────────────────────────────────────────────────────
function initPanchangam() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('pc-date').value = today;
  renderPanchangam();
}

function renderPanchangam() {
  const dateStr = document.getElementById('pc-date').value;
  if (!dateStr) return toast('தேதி தேர்ந்தெடுக்கவும்', 'error');
  const p = calcPanchangam(dateStr);
  const d = new Date(dateStr);

  document.getElementById('panchangam-result').classList.remove('hidden');
  document.getElementById('panchangam-grid').innerHTML = `

    <!-- Header -->
    <div class="pc-card gold" style="grid-column:1/-1">
      <div style="font-size:1.1rem;font-weight:700;color:var(--color-text);margin-bottom:4px">
        பரபாவ ஆண்டு ${p.tamilDate.month} ${p.tamilDate.day}ம் தேதி, ${p.vaaram}
      </div>
      <div style="font-size:.85rem;color:var(--color-text-muted)">
        ${d.toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
      </div>
      <div style="font-size:.82rem;color:var(--color-gold);margin-top:4px">தமிழ் ஆண்டு: ${p.tamilDate.year}</div>
    </div>

    <!-- Sun & Moon -->
    <div class="pc-card nalla">
      <div class="pc-label">சூரிய உதயம்</div>
      <div class="pc-value">☀️ ${p.sunrise}</div>
    </div>
    <div class="pc-card nalla">
      <div class="pc-label">சூரிய அஸ்தமனம்</div>
      <div class="pc-value">சூரியன் ${p.sunset}</div>
    </div>
    <div class="pc-card gold">
      <div class="pc-label">சந்திர உதயம்</div>
      <div class="pc-value">🌙 ${p.moonrise}</div>
    </div>
    <div class="pc-card gold">
      <div class="pc-label">சந்திர அஸ்தமனம்</div>
      <div class="pc-value">சந்திரன் ${p.moonset}</div>
    </div>

    <!-- Panchangam 5 elements -->
    <div class="pc-card">
      <div class="pc-label">திதி (Tithi)</div>
      <div class="pc-value">${p.tithiName}</div>
      <div class="pc-time">${p.paksha}</div>
    </div>
    <div class="pc-card">
      <div class="pc-label">நட்சத்திரம் (Nakshatram)</div>
      <div class="pc-value">${p.nakshatra}</div>
    </div>
    <div class="pc-card">
      <div class="pc-label">யோகம் (Yogam)</div>
      <div class="pc-value">${p.yogam}</div>
    </div>
    <div class="pc-card">
      <div class="pc-label">கரணம் (Karanam)</div>
      <div class="pc-value">${p.karanam}</div>
    </div>
    <div class="pc-card">
      <div class="pc-label">வாரம் (Vaaram)</div>
      <div class="pc-value">${p.vaaram}</div>
    </div>
    <div class="pc-card">
      <div class="pc-label">பிறை (Pirai)</div>
      <div class="pc-value">${p.pirai}</div>
    </div>

    <!-- Timings -->
    <div class="pc-card nalla">
      <div class="pc-label">நல்ல நேரம்</div>
      <div class="pc-value">${p.nallaNeeram}</div>
    </div>
    <div class="pc-card gold" style="grid-column:span 2">
      <div class="pc-label">சுப ஹோரை</div>
      <div class="pc-value" style="font-size:.85rem">${p.subhaHorai}</div>
    </div>
    <div class="pc-card rahu">
      <div class="pc-label">ராகு காலம்</div>
      <div class="pc-value">${p.rahuKalam}</div>
    </div>
    <div class="pc-card rahu">
      <div class="pc-label">யமகண்டம்</div>
      <div class="pc-value">${p.yamagandam}</div>
    </div>
    <div class="pc-card">
      <div class="pc-label">குளிகை</div>
      <div class="pc-value">${p.kuligai}</div>
    </div>
  `;
}

// ── Rasi Palan ────────────────────────────────────────────────────
let selectedRasi = null;
let selectedPalanTab = 'daily';

function initRasiPalan() {
  populateRasiSelector();
}

function selectRasi(idx, btn) {
  document.querySelectorAll('.rasi-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedRasi = idx;
  renderPalan();
}

function setPalanTab(tab, btn) {
  document.querySelectorAll('.palan-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedPalanTab = tab;
  renderPalan();
}

function renderPalan() {
  if (selectedRasi === null) return;
  document.getElementById('palan-content').textContent = RASI_PALAN[selectedPalanTab][selectedRasi];
}

// ── Tools ─────────────────────────────────────────────────────────
function initTools() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('pp-date').value = today;
}

function renderDasaBhukti() {
  const nakIdx = parseInt(document.getElementById('db-nakshatra').value);
  const dob    = document.getElementById('db-dob').value;
  if (isNaN(nakIdx)) return toast('நட்சத்திரம் தேர்ந்தெடுக்கவும்', 'error');
  if (!dob)          return toast('பிறந்த தேதி உள்ளிடவும்', 'error');

  const timeline = calcDasaBhukti(nakIdx, dob);
  const today = new Date();
  const current = timeline.find(t => today >= t.start && today < t.end);

  document.getElementById('dasa-current').innerHTML = current
    ? `தற்போதைய தசா: <strong>${current.lord}</strong> (${current.start.getFullYear()} - ${current.end.getFullYear()})`
    : '';

  document.getElementById('dasa-body').innerHTML = timeline.map(t => `
    <tr class="${current && t.lord === current.lord ? 'current' : ''}">
      <td>${t.lord}</td>
      <td>${t.start.toLocaleDateString('en-IN')}</td>
      <td>${t.end.toLocaleDateString('en-IN')}</td>
      <td>${t.years} ஆண்டுகள்</td>
    </tr>
  `).join('');

  document.getElementById('dasa-result').classList.remove('hidden');
  toast('தசா புக்தி கணக்கிடப்பட்டது');
}

function renderNumerology() {
  const name = document.getElementById('num-name').value.trim();
  const dob  = document.getElementById('num-dob').value;
  if (!name) return toast('பெயர் உள்ளிடவும்', 'error');
  if (!dob)  return toast('பிறந்த தேதி உள்ளிடவும்', 'error');

  const { lifePath, nameNum, destinyNum } = calcNumerology(name, dob);

  document.getElementById('num-grid').innerHTML = [
    { label:'ஜீவன் எண்', en:'Life Path', val: lifePath },
    { label:'பெயர் எண்', en:'Name Number', val: nameNum },
    { label:'விதி எண்', en:'Destiny Number', val: destinyNum }
  ].map(n => `
    <div class="num-card">
      <div class="num-label">${n.label}</div>
      <div class="num-val">${n.val}</div>
      <div class="num-desc">${NUM_MEANINGS[n.val] || ''}</div>
    </div>
  `).join('');

  document.getElementById('num-result').classList.remove('hidden');
  toast('எண் கணிதம் கணக்கிடப்பட்டது');
}

function renderPanchaPakshi() {
  const nakIdx  = parseInt(document.getElementById('pp-nakshatra').value);
  const dateStr = document.getElementById('pp-date').value;
  if (isNaN(nakIdx)) return toast('நட்சத்திரம் தேர்ந்தெடுக்கவும்', 'error');
  if (!dateStr)      return toast('தேதி தேர்ந்தெடுக்கவும்', 'error');

  const bird = PP_BIRD[nakIdx];
  const d = new Date(dateStr);
  const dayBirdIdx = d.getDay() % 5;

  const rows = PP_ACTIVITIES.map((act, i) => {
    const startH = 6 + i * 3;
    const endH   = startH + 3;
    const actIdx = (i + dayBirdIdx) % 5;
    return `<tr>
      <td>${String(startH).padStart(2,'0')}:00 - ${String(endH).padStart(2,'0')}:00</td>
      <td>${bird}</td>
      <td>${PP_ACTIVITIES[actIdx]}</td>
      <td style="color:${actIdx < 2 ? 'var(--color-success)' : actIdx === 2 ? 'var(--color-gold)' : 'var(--color-danger)'}">${PP_RESULT[actIdx]}</td>
    </tr>`;
  }).join('');

  document.getElementById('pp-body').innerHTML = rows;
  document.getElementById('pp-result').classList.remove('hidden');
  toast('பஞ்ச பட்சி கணக்கிடப்பட்டது');
}

function renderJamakol() {
  const rasiIdx = parseInt(document.getElementById('jk-rasi').value);
  const nakIdx  = parseInt(document.getElementById('jk-nakshatra').value);
  if (isNaN(rasiIdx) || isNaN(nakIdx)) return toast('ராசி மற்றும் நட்சத்திரம் தேர்ந்தெடுக்கவும்', 'error');

  const combined = (rasiIdx + nakIdx) % 12;
  document.getElementById('jk-content').innerHTML = `
    <strong>${RASIS[rasiIdx]} — ${NAKSHATRAS[nakIdx]}</strong><br><br>
    ${JAMAKOL_RESULT[combined]}
  `;
  document.getElementById('jk-result').classList.remove('hidden');
  toast('ஜாமக்கோல் அருடம் கணக்கிடப்பட்டது');
}

// ── Settings ──────────────────────────────────────────────────────
function loadSettingsForm() {
  document.getElementById('s-name').value    = settings.name    || '';
  document.getElementById('s-phone').value   = settings.phone   || '';
  document.getElementById('s-address').value = settings.address || '';
  document.getElementById('s-city').value    = settings.defaultCity || 'Chennai|13.0827|80.2707';
}

function saveSettings() {
  settings.name        = document.getElementById('s-name').value.trim();
  settings.phone       = document.getElementById('s-phone').value.trim();
  settings.address     = document.getElementById('s-address').value.trim();
  settings.defaultCity = document.getElementById('s-city').value;
  localStorage.setItem('jt_settings', JSON.stringify(settings));
  const msg = document.getElementById('settings-saved');
  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 3000);
}

// ── Auto-update ───────────────────────────────────────────────────
function checkForAppUpdate() {
  const btn = document.getElementById('check-update-btn');
  const statusEl = document.getElementById('update-status');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ சரிபார்க்கிறது...'; }
  if (statusEl) statusEl.innerHTML = '';
  if (window.electronAPI) {
    window.electronAPI.checkUpdate();
    setTimeout(() => { if (btn && btn.disabled) { btn.disabled = false; btn.textContent = '🔄 புதுப்பிப்பு சரிபார்க்கவும்'; } }, 12000);
  } else {
    if (statusEl) { statusEl.style.color = 'var(--color-danger)'; statusEl.textContent = 'இந்த அம்சம் desktop app-ல் மட்டுமே வேலை செய்யும்.'; }
    if (btn) { btn.disabled = false; btn.textContent = '🔄 புதுப்பிப்பு சரிபார்க்கவும்'; }
  }
}

if (window.electronAPI) {
  window.electronAPI.onUpdateResult(({ status, version }) => {
    const btn = document.getElementById('check-update-btn');
    const statusEl = document.getElementById('update-status');
    if (btn) { btn.disabled = false; btn.textContent = '🔄 புதுப்பிப்பு சரிபார்க்கவும்'; }
    if (!statusEl) return;
    const messages = {
      available:   { color: 'var(--color-primary)', text: `புதிய பதிப்பு ${version} கிடைக்கிறது. பதிவிறக்கம் தொடங்குகிறது...` },
      downloading: { color: 'var(--color-gold)',    text: '⏳ பதிவிறக்கம் நடக்கிறது...' },
      done:        { color: 'var(--color-success)', text: '✅ பதிவிறக்கம் முடிந்தது. நிறுவியை இயக்கவும்.' },
      'up-to-date':{ color: 'var(--color-success)', text: '✅ நீங்கள் சமீபத்திய பதிப்பில் உள்ளீர்கள்.' },
      cancelled:   { color: 'var(--color-text-muted)', text: 'புதுப்பிப்பு தவிர்க்கப்பட்டது.' },
      error:       { color: 'var(--color-danger)', text: '❌ புதுப்பிப்பு சரிபார்க்க முடியவில்லை.' }
    };
    const m = messages[status] || messages.error;
    statusEl.style.color = m.color;
    statusEl.textContent = m.text;
  });
}

// ── PDF Export ────────────────────────────────────────────────────
function exportJathagamPDF() {
  if (!currentChart) return toast('முதலில் ஜாதகம் உருவாக்கவும்', 'error');
  if (typeof window.jspdf === 'undefined') return toast('PDF library ஏற்றப்படவில்லை', 'error');

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Jothidam Tamil — Jathagam Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Name: ${currentChart.name}`, 20, 35);
  doc.text(`Date of Birth: ${currentChart.dob}`, 20, 43);
  doc.text(`Time of Birth: ${currentChart.tob}`, 20, 51);
  doc.text(`Nakshatra: ${currentChart.nakshatra}`, 20, 59);
  doc.text(`Rasi: ${currentChart.rasi}`, 20, 67);
  doc.text(`Lagnam: ${currentChart.lagnam}`, 20, 75);

  doc.setFontSize(10);
  doc.text('Planet Positions:', 20, 90);
  let y = 98;
  Object.entries(currentChart.positions).forEach(([planet, house]) => {
    const idx = PLANET_EN.indexOf(planet);
    doc.text(`${idx >= 0 ? PLANETS[idx] : planet} (${planet}): House ${house}`, 25, y);
    y += 8;
  });

  doc.text('Generated by Jothidam Tamil', 20, 280);
  doc.save(`Jathagam_${currentChart.name}_${currentChart.dob}.pdf`);
  toast('PDF பதிவிறக்கம் செய்யப்பட்டது');
}

function exportPoruthamPDF() {
  const bi = parseInt(document.getElementById('por-boy-nak').value);
  const gi = parseInt(document.getElementById('por-girl-nak').value);
  if (isNaN(bi) || isNaN(gi)) return toast('முதலில் பொருத்தம் கணக்கிடவும்', 'error');
  if (typeof window.jspdf === 'undefined') return toast('PDF library ஏற்றப்படவில்லை', 'error');

  const { results, score } = calcPorutham(bi, gi);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Jothidam Tamil — Porutham Report', 20, 20);
  doc.setFontSize(12);
  doc.text(`Boy Nakshatra: ${NAKSHATRAS[bi]}`, 20, 35);
  doc.text(`Girl Nakshatra: ${NAKSHATRAS[gi]}`, 20, 43);
  doc.text(`Total Score: ${score}/10`, 20, 55);

  let y = 68;
  doc.setFontSize(10);
  results.forEach(r => {
    doc.text(`${r.en} (${r.name}): ${r.result}`, 25, y);
    y += 8;
  });

  doc.text('Generated by Jothidam Tamil', 20, 280);
  doc.save(`Porutham_${NAKSHATRAS[bi]}_${NAKSHATRAS[gi]}.pdf`);
  toast('PDF பதிவிறக்கம் செய்யப்பட்டது');
}

// ── Init ──────────────────────────────────────────────────────────
populateNakshatraDropdowns();
populateRasiSelector();
refreshProfileDropdown();
