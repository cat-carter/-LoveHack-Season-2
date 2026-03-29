import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { Cursor } from "./Cursor.jsx";
import { TitleScene } from "./scenes/TitleScene.jsx";
import { LoginScene } from "./scenes/LoginScene.jsx";
import { StaffPortalScene } from "./scenes/StaffPortalScene.jsx";
import { IncidentFormScene } from "./scenes/IncidentFormScene.jsx";
import { AdminDashScene } from "./scenes/AdminDashScene.jsx";
import { CaseDetailScene } from "./scenes/CaseDetailScene.jsx";
import { OSHAFormScene } from "./scenes/OSHAFormScene.jsx";
import { NotificationsScene } from "./scenes/NotificationsScene.jsx";
import { OutroScene } from "./scenes/OutroScene.jsx";

// ─── Scene timing (stretched to match 2:03 narration = 3690 frames) ─────────
// 0    – 120   Title            (4s)
// 120  – 450   Login→Staff      (11s)
// 450  – 780   Staff Portal     (11s)
// 780  – 1350  Incident Form    (19s)
// 1350 – 1650  Admin Login      (10s)
// 1650 – 2010  Admin Dashboard  (12s)
// 2010 – 2670  Case Detail      (22s)
// 2670 – 3120  OSHA 301         (15s)
// 3120 – 3480  Notifications    (12s)
// 3480 – 3690  Outro            (7s)
// Total: 3690 frames = 123s = 2:03

// ─── Cursor waypoints (absolute video coords 1920×1080) ──────────
const WAYPOINTS = [
  // Idle on title
  { frame: 0,    x: 960,  y: 600 },
  { frame: 119,  x: 960,  y: 600 },

  // Login: move to email
  { frame: 150,  x: 1370, y: 440 },
  { frame: 175,  x: 1370, y: 440, click: true },
  // move to password
  { frame: 210,  x: 1370, y: 530 },
  { frame: 235,  x: 1370, y: 530, click: true },
  // move to Frontline Staff demo button
  { frame: 310,  x: 1265, y: 730 },
  { frame: 340,  x: 1265, y: 730, click: true },

  // Staff portal: hover "New Incident Report"
  { frame: 490,  x: 770,  y: 505 },
  { frame: 520,  x: 770,  y: 505 },
  // click it
  { frame: 550,  x: 770,  y: 505, click: true },

  // Incident form: injury type dropdown
  { frame: 620,  x: 960,  y: 395 },
  { frame: 650,  x: 960,  y: 395, click: true },
  // select musculoskeletal
  { frame: 720,  x: 960,  y: 440 },
  { frame: 745,  x: 960,  y: 440, click: true },
  // location field
  { frame: 800,  x: 960,  y: 480 },
  { frame: 825,  x: 960,  y: 480, click: true },
  // description textarea
  { frame: 900,  x: 960,  y: 570 },
  { frame: 925,  x: 960,  y: 570, click: true },
  // submit button
  { frame: 1180, x: 960,  y: 785 },
  { frame: 1210, x: 960,  y: 785, click: true },

  // Back to login → Admin button
  { frame: 1440, x: 1575, y: 730 },
  { frame: 1470, x: 1575, y: 730, click: true },

  // Admin dashboard: hover high-severity case row
  { frame: 1750, x: 960,  y: 468 },
  { frame: 1790, x: 960,  y: 468, click: true },

  // Case detail: triage panel loads, cursor moves down
  { frame: 1940, x: 960,  y: 450 },
  { frame: 2080, x: 960,  y: 620 },
  // assign reviewer select
  { frame: 2200, x: 900,  y: 710 },
  { frame: 2230, x: 900,  y: 710, click: true },
  // assign button
  { frame: 2310, x: 1090, y: 710 },
  { frame: 2340, x: 1090, y: 710, click: true },

  // OSHA: cursor moves to "Open OSHA 301" button
  { frame: 2730, x: 1095, y: 510 },
  { frame: 2770, x: 1095, y: 510, click: true },
  // watch form fields populate
  { frame: 2860, x: 760,  y: 500 },
  { frame: 2960, x: 760,  y: 600 },
  { frame: 3040, x: 760,  y: 700 },

  // Notifications: move to Send Update
  { frame: 3210, x: 1200, y: 640 },
  { frame: 3240, x: 1200, y: 640, click: true },
  // see confirmation
  { frame: 3320, x: 960,  y: 700 },

  // Outro
  { frame: 3480, x: 960,  y: 540 },
  { frame: 3630, x: 960,  y: 540 },
];

export function IncidentIQVideo() {
  return (
    <AbsoluteFill style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", overflow: "hidden" }}>
      <Sequence from={0}    durationInFrames={120}>  <TitleScene /> </Sequence>
      <Sequence from={120}  durationInFrames={330}>  <LoginScene staffClick={340} adminClick={null} /> </Sequence>
      <Sequence from={450}  durationInFrames={330}>  <StaffPortalScene /> </Sequence>
      <Sequence from={780}  durationInFrames={570}>  <IncidentFormScene /> </Sequence>
      <Sequence from={1350} durationInFrames={300}>  <LoginScene staffClick={null} adminClick={120} /> </Sequence>
      <Sequence from={1650} durationInFrames={360}>  <AdminDashScene /> </Sequence>
      <Sequence from={2010} durationInFrames={660}>  <CaseDetailScene /> </Sequence>
      <Sequence from={2670} durationInFrames={450}>  <OSHAFormScene /> </Sequence>
      <Sequence from={3120} durationInFrames={360}>  <NotificationsScene /> </Sequence>
      <Sequence from={3480} durationInFrames={210}>  <OutroScene /> </Sequence>

      {/* Narration audio — place narration.mp3 in incidentiq-video/public/ */}
      <Audio src={staticFile("narration.mp3")} />

      {/* Global cursor overlay */}
      <Cursor waypoints={WAYPOINTS} />
    </AbsoluteFill>
  );
}
