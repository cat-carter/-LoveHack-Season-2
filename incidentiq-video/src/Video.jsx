import { AbsoluteFill, Sequence } from "remotion";
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

// ─── Scene timing ────────────────────────────────────────────────
// 0    – 90    Title            (3s)
// 90   – 390   Login→Staff      (10s)
// 390  – 690   Staff Portal     (10s)
// 690  – 1200  Incident Form    (17s)
// 1200 – 1500  Admin Login      (10s)
// 1500 – 1830  Admin Dashboard  (11s)
// 1830 – 2430  Case Detail      (20s)
// 2430 – 2850  OSHA 301         (14s)
// 2850 – 3150  Notifications    (10s)
// 3150 – 3300  Outro            (5s)
// Total: 3300 frames = 110s ≈ 1:50

// ─── Cursor waypoints (absolute video coords 1920×1080) ──────────
const WAYPOINTS = [
  // Idle on title
  { frame: 0,    x: 960,  y: 600 },
  { frame: 89,   x: 960,  y: 600 },

  // Login: move to email
  { frame: 120,  x: 1370, y: 440 },
  { frame: 145,  x: 1370, y: 440, click: true },
  // move to password
  { frame: 180,  x: 1370, y: 530 },
  { frame: 205,  x: 1370, y: 530, click: true },
  // move to Frontline Staff demo button
  { frame: 280,  x: 1265, y: 730 },
  { frame: 310,  x: 1265, y: 730, click: true },

  // Staff portal: hover "New Incident Report"
  { frame: 430,  x: 770,  y: 505 },
  { frame: 460,  x: 770,  y: 505 },
  // click it
  { frame: 490,  x: 770,  y: 505, click: true },

  // Incident form: injury type dropdown
  { frame: 560,  x: 960,  y: 395 },
  { frame: 590,  x: 960,  y: 395, click: true },
  // select musculoskeletal
  { frame: 630,  x: 960,  y: 440 },
  { frame: 655,  x: 960,  y: 440, click: true },
  // location field
  { frame: 710,  x: 960,  y: 480 },
  { frame: 735,  x: 960,  y: 480, click: true },
  // description textarea
  { frame: 810,  x: 960,  y: 570 },
  { frame: 835,  x: 960,  y: 570, click: true },
  // submit button
  { frame: 1090, x: 960,  y: 785 },
  { frame: 1120, x: 960,  y: 785, click: true },

  // Back to login → Admin button
  { frame: 1290, x: 1575, y: 730 },
  { frame: 1320, x: 1575, y: 730, click: true },

  // Admin dashboard: hover high-severity case row
  { frame: 1600, x: 960,  y: 468 },
  { frame: 1640, x: 960,  y: 468, click: true },

  // Case detail: triage panel loads, cursor moves down
  { frame: 1760, x: 960,  y: 450 },
  { frame: 1900, x: 960,  y: 620 },
  // assign reviewer select
  { frame: 2020, x: 900,  y: 710 },
  { frame: 2050, x: 900,  y: 710, click: true },
  // assign button
  { frame: 2130, x: 1090, y: 710 },
  { frame: 2160, x: 1090, y: 710, click: true },

  // OSHA: cursor moves to "Open OSHA 301" button
  { frame: 2490, x: 1095, y: 510 },
  { frame: 2530, x: 1095, y: 510, click: true },
  // watch form fields populate
  { frame: 2620, x: 760,  y: 500 },
  { frame: 2720, x: 760,  y: 600 },
  { frame: 2800, x: 760,  y: 700 },

  // Notifications: move to Send Update
  { frame: 2940, x: 1200, y: 640 },
  { frame: 2970, x: 1200, y: 640, click: true },
  // see confirmation
  { frame: 3050, x: 960,  y: 700 },

  // Outro
  { frame: 3150, x: 960,  y: 540 },
  { frame: 3300, x: 960,  y: 540 },
];

export function IncidentIQVideo() {
  return (
    <AbsoluteFill style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", overflow: "hidden" }}>
      <Sequence from={0}    durationInFrames={90}>   <TitleScene /> </Sequence>
      <Sequence from={90}   durationInFrames={300}>  <LoginScene staffClick={310} adminClick={null} /> </Sequence>
      <Sequence from={390}  durationInFrames={300}>  <StaffPortalScene /> </Sequence>
      <Sequence from={690}  durationInFrames={510}>  <IncidentFormScene /> </Sequence>
      <Sequence from={1200} durationInFrames={300}>  <LoginScene staffClick={null} adminClick={120} /> </Sequence>
      <Sequence from={1500} durationInFrames={330}>  <AdminDashScene /> </Sequence>
      <Sequence from={1830} durationInFrames={600}>  <CaseDetailScene /> </Sequence>
      <Sequence from={2430} durationInFrames={420}>  <OSHAFormScene /> </Sequence>
      <Sequence from={2850} durationInFrames={300}>  <NotificationsScene /> </Sequence>
      <Sequence from={3150} durationInFrames={150}>  <OutroScene /> </Sequence>

      {/* Global cursor overlay */}
      <Cursor waypoints={WAYPOINTS} />
    </AbsoluteFill>
  );
}
