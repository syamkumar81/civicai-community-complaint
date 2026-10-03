import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Truck,
  Users,
  Radio,
  Sparkles,
  Wifi,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function CivicCommunityHero({ mode = "citizen" }) {
  const [activeHoverNode, setActiveHoverNode] = useState(null);
  const isAdmin = mode === "admin";

  return (
    <div className="civic-hero-wrap">
      {/* SCENE AMBIENT GLOW BACKDROP */}
      <div className="civic-hero-atmosphere" />

      {/* TOP SCENE HUD BAR */}
      <div className="civic-scene-hud-top">
        <div className="civic-hud-tag-live">
          <span className="civic-hud-beacon">
            <span className="civic-hud-beacon-core" />
            <span className="civic-hud-beacon-ring" />
          </span>
          <span className="civic-hud-tag-title">
            {isAdmin ? "Municipal Governance & Dispatch Grid" : "Connected Smart Community"}
          </span>
        </div>

        <div className="civic-hud-telemetry-badge">
          <Wifi size={11} className="civic-hud-wifi-icon" />
          <span>{isAdmin ? "Admin Protocol: Active & Synced" : "Municipal Grid:  Online"}</span>
        </div>
      </div>

      {/* UNIFIED VECTOR COMMUNITY & CIVIC ECOSYSTEM CANVAS */}
      <div className="civic-hero-svg-canvas">
        <svg
          viewBox="0 0 760 410"
          className="civic-ecosystem-svg"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Ambient gradients */}
            <radialGradient id="skyRadial" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#082244" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#041022" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020814" stopOpacity="0.95" />
            </radialGradient>

            <linearGradient id="hubGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0e3a64" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#061c33" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#03101e" stopOpacity="0.98" />
            </linearGradient>

            <linearGradient id="hubSpireGlow" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="roadSurfaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#081b30" />
              <stop offset="50%" stopColor="#051222" />
              <stop offset="100%" stopColor="#030b15" />
            </linearGradient>

            <linearGradient id="roadLaneNeon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="amberFlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="dispatchFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="lampConeGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="bldgGlassA" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0c2340" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#05101d" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="bldgGlassB" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d2847" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#061424" stopOpacity="0.95" />
            </linearGradient>

            <filter id="sceneGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP SKY */}
          <rect width="760" height="410" fill="url(#skyRadial)" />

          {/* DISTANT CYBERNETIC SKYLINE SILHOUETTES */}
          <g className="distant-skyline" opacity="0.45">
            {/* Tower 1 */}
            <rect x="35" y="90" width="36" height="120" fill="#041224" stroke="#0ea5e9" strokeOpacity="0.2" strokeWidth="0.8" />
            <line x1="53" y1="65" x2="53" y2="90" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="53" cy="64" r="1.5" fill="#f43f5e" />

            {/* Tower 2 */}
            <rect x="80" y="115" width="28" height="95" fill="#05162a" stroke="#0ea5e9" strokeOpacity="0.2" strokeWidth="0.8" />
            
            {/* Tower 3 */}
            <rect x="116" y="80" width="42" height="130" fill="#041224" stroke="#0ea5e9" strokeOpacity="0.25" strokeWidth="0.8" />
            <line x1="137" y1="52" x2="137" y2="80" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.6" />
            <circle cx="137" cy="51" r="1.5" fill="#38bdf8" />

            {/* Tower 4 */}
            <rect x="168" y="125" width="30" height="85" fill="#05162a" stroke="#0ea5e9" strokeOpacity="0.18" strokeWidth="0.8" />

            {/* Skybridge linking Towers 3 & 4 */}
            <rect x="156" y="135" width="14" height="4" fill="#0b2442" stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="0.6" />

            {/* Distant Center Towers */}
            <rect x="290" y="105" width="32" height="105" fill="#041224" stroke="#0ea5e9" strokeOpacity="0.2" strokeWidth="0.8" />
            <rect x="330" y="85" width="46" height="125" fill="#05172c" stroke="#0ea5e9" strokeOpacity="0.25" strokeWidth="0.8" />
            <line x1="353" y1="58" x2="353" y2="85" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.5" />
            <circle cx="353" cy="57" r="1.5" fill="#f43f5e" />

            {/* Distant East Skyline */}
            <rect x="580" y="110" width="34" height="100" fill="#041224" stroke="#0ea5e9" strokeOpacity="0.2" strokeWidth="0.8" />
            <rect x="624" y="75" width="48" height="135" fill="#06182e" stroke="#0ea5e9" strokeOpacity="0.3" strokeWidth="0.8" />
            <line x1="648" y1="46" x2="648" y2="75" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.6" />
            <circle cx="648" cy="45" r="1.5" fill="#22d3ee" />
            <rect x="682" y="120" width="32" height="90" fill="#041224" stroke="#0ea5e9" strokeOpacity="0.2" strokeWidth="0.8" />

            {/* Distant Window Lights Matrix */}
            <g fill="#38bdf8" opacity="0.35">
              <rect x="42" y="105" width="2" height="2" /><rect x="48" y="105" width="2" height="2" /><rect x="56" y="105" width="2" height="2" />
              <rect x="42" y="118" width="2" height="2" /><rect x="48" y="118" width="2" height="2" /><rect x="56" y="118" width="2" height="2" />
              <rect x="124" y="95" width="2.5" height="2.5" /><rect x="132" y="95" width="2.5" height="2.5" /><rect x="140" y="95" width="2.5" height="2.5" />
              <rect x="124" y="112" width="2.5" height="2.5" /><rect x="140" y="112" width="2.5" height="2.5" />
              <rect x="634" y="90" width="2.5" height="2.5" /><rect x="644" y="90" width="2.5" height="2.5" /><rect x="654" y="90" width="2.5" height="2.5" />
              <rect x="634" y="106" width="2.5" height="2.5" /><rect x="644" y="106" width="2.5" height="2.5" /><rect x="654" y="106" width="2.5" height="2.5" />
            </g>
          </g>

          {/* PERSPECTIVE GROUND MATRIX & NEON ROADS */}
          <g className="civic-ground-grid">
            {/* Ground Base Fill */}
            <path
              d="M 0 210 L 760 210 L 760 410 L 0 410 Z"
              fill="url(#roadSurfaceGrad)"
            />

            {/* Subtle Perspective Coordinate Lines */}
            <g stroke="#0ea5e9" strokeOpacity="0.08" strokeWidth="1">
              <line x1="0" y1="230" x2="760" y2="230" />
              <line x1="0" y1="260" x2="760" y2="260" />
              <line x1="0" y1="300" x2="760" y2="300" />
              <line x1="0" y1="350" x2="760" y2="350" />
              <line x1="120" y1="210" x2="40" y2="410" />
              <line x1="280" y1="210" x2="220" y2="410" />
              <line x1="480" y1="210" x2="520" y2="410" />
              <line x1="640" y1="210" x2="710" y2="410" />
            </g>

            {/* MAIN SMART CIVIC BOULEVARD (Diagonal Perspective Arterial Road) */}
            <path
              d="M -20 380 Q 240 330 460 295 T 780 250 L 780 295 Q 520 330 260 375 L -20 420 Z"
              fill="#061220"
              stroke="#0284c7"
              strokeWidth="1.2"
              strokeOpacity="0.35"
            />

            {/* Road Edge Neon Guide (Upper Edge) */}
            <path
              d="M -20 380 Q 240 330 460 295 T 780 250"
              stroke="url(#roadLaneNeon)"
              strokeWidth="2"
              fill="none"
              filter="url(#softGlow)"
            />

            {/* Center Dashed Autonomous Transit Lane Line */}
            <path
              d="M -20 400 Q 250 352 490 312 T 780 272"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="14 12"
              strokeOpacity="0.75"
              fill="none"
            />

            {/* Lower Road Edge Guide */}
            <path
              d="M -20 420 Q 260 375 520 330 T 780 295"
              stroke="#0369a1"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              fill="none"
            />

            {/* CROSS STREET TOWARDS MUNICIPAL HUB */}
            <path
              d="M 430 298 L 470 215 L 530 215 L 505 290 Z"
              fill="#081729"
              stroke="#0284c7"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            <line x1="475" y1="294" x2="500" y2="215" stroke="#38bdf8" strokeDasharray="6 6" strokeWidth="1.5" strokeOpacity="0.6" />

            {/* Smart Crosswalk Stripes at Intersection */}
            <g stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="2.5">
              <line x1="390" y1="316" x2="400" y2="336" />
              <line x1="400" y1="314" x2="410" y2="334" />
              <line x1="410" y1="312" x2="420" y2="332" />
              <line x1="420" y1="310" x2="430" y2="330" />
            </g>
          </g>

          {/* =========================================================
              ZONE 1: SMART RESIDENTIAL & CITIZEN COMMUNITY SECTOR (LEFT)
          ========================================================= */}
          <g className="community-sector-left">
            {/* Eco Smart Residential Tower */}
            <g
              className="interactive-building"
              onMouseEnter={() => setActiveHoverNode("residential")}
              onMouseLeave={() => setActiveHoverNode(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Main Body */}
              <rect x="42" y="165" width="112" height="135" rx="4" fill="url(#bldgGlassA)" stroke="#0ea5e9" strokeWidth="1.2" strokeOpacity="0.4" />
              
              {/* Stepped Upper Level */}
              <rect x="58" y="138" width="80" height="28" rx="3" fill="#081c33" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.3" />
              
              {/* Rooftop Solar Grid */}
              <g stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.6">
                <rect x="64" y="142" width="20" height="8" rx="1" fill="#0369a1" fillOpacity="0.4" />
                <rect x="88" y="142" width="20" height="8" rx="1" fill="#0369a1" fillOpacity="0.4" />
                <rect x="112" y="142" width="20" height="8" rx="1" fill="#0369a1" fillOpacity="0.4" />
              </g>

              {/* Balconies / Glowing Living Windows Matrix */}
              <g fill="#38bdf8" opacity="0.6">
                {/* Row 1 */}
                <rect x="54" y="178" width="16" height="8" rx="1" fillOpacity="0.9" />
                <rect x="76" y="178" width="16" height="8" rx="1" fillOpacity="0.4" />
                <rect x="98" y="178" width="16" height="8" rx="1" fillOpacity="0.85" />
                <rect x="120" y="178" width="16" height="8" rx="1" fillOpacity="0.3" />
                
                {/* Row 2 */}
                <rect x="54" y="196" width="16" height="8" rx="1" fillOpacity="0.4" />
                <rect x="76" y="196" width="16" height="8" rx="1" fillOpacity="0.95" />
                <rect x="98" y="196" width="16" height="8" rx="1" fillOpacity="0.3" />
                <rect x="120" y="196" width="16" height="8" rx="1" fillOpacity="0.8" />

                {/* Row 3 */}
                <rect x="54" y="214" width="16" height="8" rx="1" fillOpacity="0.85" />
                <rect x="76" y="214" width="16" height="8" rx="1" fillOpacity="0.3" />
                <rect x="98" y="214" width="16" height="8" rx="1" fillOpacity="0.9" />
                <rect x="120" y="214" width="16" height="8" rx="1" fillOpacity="0.4" />

                {/* Row 4 */}
                <rect x="54" y="232" width="16" height="8" rx="1" fillOpacity="0.3" />
                <rect x="76" y="232" width="16" height="8" rx="1" fillOpacity="0.8" />
                <rect x="98" y="232" width="16" height="8" rx="1" fillOpacity="0.4" />
                <rect x="120" y="232" width="16" height="8" rx="1" fillOpacity="0.85" />
              </g>

              {/* Ground Entrance / Lobby Glass Atrium */}
              <rect x="74" y="260" width="48" height="40" rx="2" fill="#042a4e" fillOpacity="0.6" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="98" y1="260" x2="98" y2="300" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" />
              <rect x="80" y="268" width="12" height="18" fill="#38bdf8" fillOpacity="0.7" />
              <rect x="104" y="268" width="12" height="18" fill="#38bdf8" fillOpacity="0.7" />
            </g>

            {/* Smart Citizen Kiosk / Transit Shelter */}
            <g className="citizen-kiosk" transform="translate(142, 290)">
              {/* Canopy */}
              <path d="M 0 0 L 32 -6 L 36 2 L 4 8 Z" fill="#0e3a64" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />
              {/* Support post */}
              <line x1="6" y1="6" x2="6" y2="36" stroke="#0ea5e9" strokeWidth="2" strokeOpacity="0.8" />
              <line x1="30" y1="2" x2="30" y2="34" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.6" />
              {/* Interactive Screen Display */}
              <rect x="10" y="10" width="16" height="22" rx="2" fill="#051f38" stroke="#38bdf8" strokeWidth="1" />
              <rect x="12" y="13" width="12" height="10" rx="1" fill="#22d3ee" fillOpacity="0.8" />
              <line x1="13" y1="26" x2="23" y2="26" stroke="#38bdf8" strokeWidth="1" />
              <line x1="13" y1="29" x2="19" y2="29" stroke="#38bdf8" strokeWidth="0.8" />
            </g>

            {/* Citizen Figure Reporting (Stylized Smart Citizen) */}
            <g className="citizen-figure" transform="translate(182, 310)">
              {/* Shadow on pavement */}
              <ellipse cx="6" cy="38" rx="8" ry="3" fill="#020814" fillOpacity="0.7" />
              {/* Citizen Body */}
              <circle cx="6" cy="6" r="3.5" fill="#f8fafc" />
              {/* Torso */}
              <path d="M 3 10 L 9 10 L 10 24 L 2 24 Z" fill="#38bdf8" />
              {/* Legs */}
              <line x1="4" y1="24" x2="3" y2="36" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="8" y1="24" x2="9" y2="36" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
              {/* Arm with glowing phone/tablet device */}
              <path d="M 8 13 L 14 16 L 13 20" stroke="#f8fafc" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Glowing Phone Screen emitting report */}
              <rect x="12" y="15" width="4" height="6" rx="1" fill="#22d3ee" filter="url(#softGlow)" />
            </g>

            {/* REPORT TRANSMISSION WAVE FROM CITIZEN TO INCIDENT PIN */}
            <path
              d="M 197 325 Q 210 328 220 340"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              strokeOpacity="0.8"
              fill="none"
            />
          </g>

          {/* =========================================================
              CIVIC INCIDENT #1: ACTIVE ROAD HAZARD (POTHOLE / SENSOR)
          ========================================================= */}
          <g
            className="incident-active-hazard"
            onMouseEnter={() => setActiveHoverNode("hazard")}
            onMouseLeave={() => setActiveHoverNode(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Pavement Defect / Sensor Ring */}
            <ellipse cx="230" cy="358" rx="18" ry="7" fill="#1e180d" stroke="#d97706" strokeWidth="1.2" strokeOpacity="0.6" />
            <path d="M 220 357 L 226 359 L 234 356 L 240 358" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />

            {/* Pulsing Concentric Radar Rings */}
            <circle cx="230" cy="344" r="14" fill="none" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.3">
              <animate attributeName="r" values="8;20;8" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.7;0.1;0.7" dur="2.4s" repeatCount="indefinite" />
            </circle>

            <circle cx="230" cy="344" r="7" fill="#f59e0b" fillOpacity="0.3" filter="url(#softGlow)" />
            <circle cx="230" cy="344" r="3.5" fill="#f59e0b" />

            {/* Anchor Vertical Vector Line */}
            <line x1="230" y1="344" x2="230" y2="310" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.8" />

            {/* HUD FLOATING INCIDENT CHIP */}
            <g transform="translate(170, 272)">
              {/* Glass background */}
              <rect x="0" y="0" width="130" height="34" rx="7" fill="#0a121e" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1.2" strokeOpacity="0.8" filter="url(#softGlow)" />
              {/* Alert icon badge */}
              <rect x="6" y="6" width="22" height="22" rx="5" fill="#f59e0b" fillOpacity="0.18" />
              <path d="M 17 11 L 23 22 L 11 22 Z" fill="#f59e0b" />
              <circle cx="17" cy="18" r="0.8" fill="#030712" />
              <rect x="16.5" y="14" width="1" height="2.8" rx="0.5" fill="#030712" />

              {/* Text label */}
              <text x="33" y="16" fill="#fef08a" fontSize="8.5" fontWeight="700" letterSpacing="0.04em">
                #CR-2841 ROAD HAZARD
              </text>
              <text x="33" y="27" fill="#94a3b8" fontSize="7.5" fontWeight="600">
                Citizen Reported · P1 Auto-Route
              </text>
            </g>
          </g>

          {/* =========================================================
              AI NEURAL ROUTING TELEMETRY HIGHWAY (Incident -> Hub)
          ========================================================= */}
          <g className="ai-telemetry-routing-path">
            {/* Main Glowing Bezier Vector Curve */}
            <path
              id="aiComplaintPath"
              d="M 230 310 C 270 230, 370 190, 440 185"
              stroke="url(#amberFlowGrad)"
              strokeWidth="2.5"
              fill="none"
              filter="url(#softGlow)"
              strokeDasharray="6 4"
            />

            {/* Animated Data Packet 1 Traversing Path */}
            <circle r="4" fill="#38bdf8" filter="url(#sceneGlow)">
              <animateMotion
                path="M 230 310 C 270 230, 370 190, 440 185"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Animated Data Packet 2 */}
            <circle r="3" fill="#f59e0b" filter="url(#softGlow)">
              <animateMotion
                path="M 230 310 C 270 230, 370 190, 440 185"
                dur="2.8s"
                begin="1.4s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Telemetry Process Chip along the line */}
            <g transform="translate(305, 206)">
              <rect x="0" y="0" width="86" height="20" rx="10" fill="#051324" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="0.9" strokeOpacity="0.6" />
              <circle cx="9" cy="10" r="3" fill="#38bdf8">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text x="16" y="13" fill="#bae6fd" fontSize="7" fontWeight="700" letterSpacing="0.05em">
                AI TRIAGE: 0.6s
              </text>
            </g>
          </g>

          {/* =========================================================
              ZONE 2: CIVICAI MUNICIPAL OPERATIONS & GOVERNMENT HUB (CENTER)
          ========================================================= */}
          <g
            className="municipal-hub-sector"
            onMouseEnter={() => setActiveHoverNode("hub")}
            onMouseLeave={() => setActiveHoverNode(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Ambient Upward Volumetric Glow from Hub */}
            <polygon
              points="450 120, 530 120, 560 20, 420 20"
              fill="url(#hubSpireGlow)"
              opacity="0.22"
            />

            {/* Main Command Building Body */}
            <rect
              x="425"
              y="120"
              width="145"
              height="165"
              rx="6"
              fill="url(#hubGlassGrad)"
              stroke="#38bdf8"
              strokeWidth="1.6"
              strokeOpacity="0.55"
              filter="url(#softGlow)"
            />

            {/* Building Architectural Step Tier */}
            <rect
              x="445"
              y="95"
              width="105"
              height="28"
              rx="4"
              fill="#08223d"
              stroke="#0ea5e9"
              strokeWidth="1.2"
              strokeOpacity="0.5"
            />

            {/* Glass Curtain Window Strips */}
            <g stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.35">
              <line x1="435" y1="140" x2="560" y2="140" />
              <line x1="435" y1="160" x2="560" y2="160" />
              <line x1="435" y1="180" x2="560" y2="180" />
              <line x1="435" y1="200" x2="560" y2="200" />
              <line x1="435" y1="220" x2="560" y2="220" />
              <line x1="435" y1="240" x2="560" y2="240" />

              {/* Vertical Louvers */}
              <line x1="465" y1="125" x2="465" y2="250" />
              <line x1="500" y1="125" x2="500" y2="250" />
              <line x1="535" y1="125" x2="535" y2="250" />
            </g>

            {/* Integrated Civic Intelligence Atrium & Antenna (Crown of Building) */}
            <g transform="translate(497, 85)">
              {/* Spire Mast */}
              <line x1="0" y1="10" x2="0" y2="-25" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.9" />
              
              {/* Pulsing Broadcast Rings */}
              <circle cx="0" cy="-25" r="8" fill="none" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.4">
                <animate attributeName="r" values="3;16;3" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2.2s" repeatCount="indefinite" />
              </circle>
              
              <circle cx="0" cy="-25" r="2.5" fill="#38bdf8" filter="url(#softGlow)" />

              {/* Radar Atrium Dome */}
              <ellipse cx="0" cy="10" rx="24" ry="9" fill="#042a4e" stroke="#38bdf8" strokeWidth="1.4" strokeOpacity="0.7" />
              
              {/* Rotating Digital Scanning Beam */}
              <line x1="0" y1="10" x2="18" y2="7" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.8">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 10"
                  to="360 0 10"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </line>
            </g>

            {/* Building Header Signage & Telemetry Monitor */}
            <rect x="440" y="128" width="115" height="18" rx="3" fill="#04182c" stroke="#0ea5e9" strokeWidth="0.8" strokeOpacity="0.6" />
            <circle cx="449" cy="137" r="2.5" fill="#10b981" />
            <text x="456" y="140" fill="#f8fafc" fontSize="7.5" fontWeight="800" letterSpacing="0.08em">
              CIVICAI MUNICIPAL HUB
            </text>

            {/* Central Operations Holographic Screen */}
            <rect x="445" y="152" width="105" height="42" rx="4" fill="#061e38" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5" />
            
            {/* Live City Grid Map on Screen */}
            <g stroke="#38bdf8" strokeOpacity="0.5" strokeWidth="0.8">
              <line x1="452" y1="162" x2="495" y2="162" />
              <line x1="452" y1="172" x2="540" y2="172" />
              <line x1="452" y1="182" x2="520" y2="182" />
              <line x1="472" y1="156" x2="472" y2="188" />
              <line x1="512" y1="156" x2="512" y2="188" />
            </g>
            <circle cx="472" cy="172" r="3" fill="#f59e0b" filter="url(#softGlow)" />
            <circle cx="512" cy="162" r="3" fill="#10b981" filter="url(#softGlow)" />

            <text x="452" y="190" fill="#67e8f9" fontSize="6.5" fontWeight="700" letterSpacing="0.06em">
              AUTO-DISPATCH ENGINE: ACTIVE
            </text>

            {/* Ground Level Municipal Depot Entrance */}
            <rect x="460" y="245" width="75" height="40" rx="3" fill="#030e1a" stroke="#0ea5e9" strokeWidth="1.2" strokeOpacity="0.5" />
            <rect x="468" y="252" width="28" height="33" fill="#07223c" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" />
            <rect x="500" y="252" width="28" height="33" fill="#07223c" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="468" y1="268" x2="528" y2="268" stroke="#38bdf8" strokeDasharray="3 3" strokeWidth="1" strokeOpacity="0.6" />
          </g>

          {/* =========================================================
              AI DISPATCH TELEMETRY (Hub -> Public Works Response Unit)
          ========================================================= */}
          <g className="ai-dispatch-routing">
            {/* Curved Dispatch Stream from Hub to Vehicle */}
            <path
              d="M 465 240 Q 420 270 380 305"
              stroke="url(#dispatchFlowGrad)"
              strokeWidth="2.2"
              fill="none"
              strokeDasharray="5 4"
              filter="url(#softGlow)"
            />

            {/* Moving Dispatch Packet */}
            <circle r="3.5" fill="#22d3ee" filter="url(#softGlow)">
              <animateMotion
                path="M 465 240 Q 420 270 380 305"
                dur="2.2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Dispatch Badge */}
            <g transform="translate(378, 255)">
              <rect x="0" y="0" width="76" height="18" rx="9" fill="#081c30" fillOpacity="0.9" stroke="#10b981" strokeWidth="0.9" strokeOpacity="0.7" />
              <circle cx="8" cy="9" r="2.5" fill="#10b981" />
              <text x="15" y="12" fill="#a7f3d0" fontSize="6.5" fontWeight="700" letterSpacing="0.04em">
                DISPATCH #04
              </text>
            </g>
          </g>

          {/* =========================================================
              PUBLIC SERVICE RAPID-RESPONSE VEHICLE (Unit #04 on Road)
          ========================================================= */}
          <g
            className="service-vehicle"
            transform="translate(315, 310)"
            onMouseEnter={() => setActiveHoverNode("vehicle")}
            onMouseLeave={() => setActiveHoverNode(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Vehicle Ground Shadow */}
            <ellipse cx="32" cy="22" rx="34" ry="7" fill="#020814" fillOpacity="0.8" />

            {/* Vehicle Chassis (Modern EV Municipal Van) */}
            <path
              d="M 4 14 L 14 6 L 46 6 L 56 12 L 62 14 L 62 20 L 2 20 Z"
              fill="#0b2c4d"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
            {/* Windshield & Side Windows */}
            <path d="M 16 8 L 32 8 L 32 14 L 12 14 Z" fill="#22d3ee" fillOpacity="0.75" />
            <path d="M 36 8 L 52 12 L 50 14 L 36 14 Z" fill="#22d3ee" fillOpacity="0.7" />

            {/* Municipal Livery Stripe */}
            <rect x="4" y="15" width="56" height="3" fill="#f59e0b" />

            {/* Wheels */}
            <circle cx="16" cy="20" r="5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="16" cy="20" r="2" fill="#38bdf8" />
            <circle cx="48" cy="20" r="5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="48" cy="20" r="2" fill="#38bdf8" />

            {/* Glowing Headlight Cones facing left toward Hazard */}
            <polygon points="4 15, -20 10, -20 22" fill="#38bdf8" fillOpacity="0.25" />
            <circle cx="4" cy="16" r="1.5" fill="#f8fafc" filter="url(#softGlow)" />

            {/* Rooftop Utility Service Light Beacon */}
            <rect x="26" y="3" width="10" height="3" rx="1.5" fill="#f59e0b" filter="url(#softGlow)">
              <animate attributeName="fill" values="#f59e0b;#38bdf8;#f59e0b" dur="1s" repeatCount="indefinite" />
            </rect>

            {/* Floating Tag above vehicle */}
            <g transform="translate(0, -18)">
              <rect x="0" y="0" width="78" height="15" rx="4" fill="#071b2d" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="0.8" />
              <text x="6" y="10" fill="#e0f2fe" fontSize="6.5" fontWeight="700">
                Unit #04 · En Route (4m)
              </text>
            </g>
          </g>

          {/* =========================================================
              ZONE 3: SMART PUBLIC INFRASTRUCTURE & UTILITY GRID (RIGHT)
          ========================================================= */}
          <g className="infrastructure-sector-right">
            {/* Smart Infrastructure Substation Body */}
            <g
              className="interactive-station"
              onMouseEnter={() => setActiveHoverNode("infrastructure")}
              onMouseLeave={() => setActiveHoverNode(null)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x="605"
                y="180"
                width="118"
                height="105"
                rx="4"
                fill="url(#bldgGlassB)"
                stroke="#0ea5e9"
                strokeWidth="1.2"
                strokeOpacity="0.45"
              />

              {/* Roof Sensors & Digital Antenna Array */}
              <line x1="625" y1="180" x2="625" y2="155" stroke="#38bdf8" strokeWidth="1.2" />
              <circle cx="625" cy="154" r="1.5" fill="#10b981" />
              <line x1="660" y1="180" x2="660" y2="148" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="660" cy="147" r="2" fill="#38bdf8" />
              <line x1="695" y1="180" x2="695" y2="160" stroke="#38bdf8" strokeWidth="1.2" />
              <circle cx="695" cy="159" r="1.5" fill="#10b981" />

              {/* Substation Telemetry Bar & Clean Power Core */}
              <rect x="618" y="194" width="92" height="16" rx="3" fill="#041a2e" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.6" />
              <circle cx="628" cy="202" r="2" fill="#10b981" />
              <text x="636" y="205" fill="#6ee7b7" fontSize="7" fontWeight="700" letterSpacing="0.04em">
                INFRA GRID: ONLINE
              </text>

              {/* Energy Storage Cells with Level Gauges */}
              <g fill="#082845" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4">
                <rect x="620" y="222" width="22" height="42" rx="2" />
                <rect x="650" y="222" width="22" height="42" rx="2" />
                <rect x="680" y="222" width="22" height="42" rx="2" />
              </g>

              {/* Battery level fill bars (Emerald) */}
              <rect x="623" y="234" width="16" height="26" fill="#10b981" fillOpacity="0.75" />
              <rect x="653" y="228" width="16" height="32" fill="#10b981" fillOpacity="0.85" />
              <rect x="683" y="238" width="16" height="22" fill="#10b981" fillOpacity="0.7" />
            </g>

            {/* Smart Streetlight with Restored Telemetry */}
            <g className="smart-streetlight" transform="translate(590, 240)">
              {/* Lamp Pole with curved neck */}
              <path d="M 0 50 L 0 8 Q 0 0 12 0 L 16 0" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeOpacity="0.8" />
              {/* Light Fixture */}
              <rect x="12" y="-2" width="12" height="5" rx="1.5" fill="#38bdf8" />
              {/* Downward Light Cone Illuminating Pavement */}
              <polygon points="18 3, -8 75, 44 75" fill="url(#lampConeGrad)" />
            </g>
          </g>

          {/* =========================================================
              CIVIC RESOLUTION #2: RESTORED INFRASTRUCTURE (VERIFIED)
          ========================================================= */}
          <g
            className="incident-resolved"
            onMouseEnter={() => setActiveHoverNode("resolved")}
            onMouseLeave={() => setActiveHoverNode(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Pavement Verified Sensor Glow */}
            <ellipse cx="655" cy="345" rx="16" ry="6" fill="#042318" stroke="#10b981" strokeWidth="1.2" strokeOpacity="0.5" />

            {/* Soft Breathing Emerald Halo */}
            <circle cx="655" cy="328" r="14" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.3">
              <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite" />
            </circle>

            <circle cx="655" cy="328" r="7" fill="#10b981" fillOpacity="0.25" filter="url(#softGlow)" />
            <circle cx="655" cy="328" r="3.5" fill="#10b981" />

            {/* Vertical Anchor Vector Line */}
            <line x1="655" y1="328" x2="655" y2="295" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.8" />

            {/* HUD FLOATING RESOLUTION CHIP */}
            <g transform="translate(585, 258)">
              {/* Glass background */}
              <rect x="0" y="0" width="138" height="34" rx="7" fill="#081816" fillOpacity="0.9" stroke="#10b981" strokeWidth="1.2" strokeOpacity="0.8" filter="url(#softGlow)" />
              {/* Checkmark icon badge */}
              <rect x="6" y="6" width="22" height="22" rx="5" fill="#10b981" fillOpacity="0.2" />
              <circle cx="17" cy="17" r="7" fill="#10b981" />
              <path d="M 14 17 L 16.5 19.5 L 20.5 14.5" stroke="#041812" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

              {/* Text label */}
              <text x="33" y="16" fill="#d1fae5" fontSize="8.5" fontWeight="700" letterSpacing="0.04em">
                #CR-2839 GRID RESTORED
              </text>
              <text x="33" y="27" fill="#6ee7b7" fontSize="7.5" fontWeight="600">
                Resolved · Verified by Sensor
              </text>
            </g>
          </g>

          {/* =========================================================
              SUBSURFACE CIVIC TELEMETRY FIBER (Connecting Hub to Grid)
          ========================================================= */}
          <path
            d="M 525 285 Q 580 310 655 328"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeOpacity="0.6"
            fill="none"
          />
        </svg>
      </div>

      {/* BOTTOM WORKFLOW PROGRESSION RIBBON */}
      <div className="civic-workflow-ribbon">
        <div className="civic-step-item">
          <div className="civic-step-icon step-report">
            <Users size={12} />
          </div>
          <div className="civic-step-meta">
            <span className="civic-step-phase">1. Report</span>
            <span className="civic-step-label">{isAdmin ? "Citizen Complaint Submitted" : "Citizen Complaint Submitted"}</span>
          </div>
        </div>

        <div className="civic-step-connector">
          <ArrowRight size={11} />
        </div>

        <div className="civic-step-item">
          <div className="civic-step-icon step-ai">
            <Sparkles size={12} />
          </div>
          <div className="civic-step-meta">
            <span className="civic-step-phase">2. AI PRIORITY</span>
            <span className="civic-step-label">{isAdmin ? "Auto-Prioritization" : "ML Priority Prediction"}</span>
          </div>
        </div>

        <div className="civic-step-connector">
          <ArrowRight size={11} />
        </div>

        <div className="civic-step-item">
          <div className="civic-step-icon step-dispatch">
            <Truck size={12} />
          </div>
          <div className="civic-step-meta">
            <span className="civic-step-phase">3. ROUTING</span>
            <span className="civic-step-label">{isAdmin ? "Complaint Assigned" : "Complaint Assigned"}</span>
          </div>
        </div>

        <div className="civic-step-connector">
          <ArrowRight size={11} />
        </div>

        <div className="civic-step-item">
          <div className="civic-step-icon step-resolved">
            <CheckCircle2 size={12} />
          </div>
          <div className="civic-step-meta">
            <span className="civic-step-phase">4. Resolution</span>
            <span className="civic-step-label">{isAdmin ? "Issue Resolved & Tracked" : "Issue Resolved & Tracked"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
