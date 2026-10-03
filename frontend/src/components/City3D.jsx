import { motion } from "framer-motion";

const buildings = [
  { x: "8%", height: 90, width: 48, delay: 0 },
  { x: "17%", height: 135, width: 58, delay: 0.2 },
  { x: "28%", height: 75, width: 45, delay: 0.4 },
  { x: "38%", height: 165, width: 65, delay: 0.1 },
  { x: "50%", height: 105, width: 52, delay: 0.5 },
  { x: "61%", height: 145, width: 58, delay: 0.3 },
  { x: "73%", height: 82, width: 46, delay: 0.6 },
  { x: "83%", height: 125, width: 55, delay: 0.2 },
];

function City3D() {
  return (
    <div className="city-visual">
      <div className="city-grid-floor" />

      {/* Connection lines */}
      <div className="city-connections">
        <span className="connection-line line-a" />
        <span className="connection-line line-b" />
        <span className="connection-line line-c" />
        <span className="connection-line line-d" />
      </div>

      {/* Buildings */}
      <div className="city-buildings">
        {buildings.map((building, index) => (
          <motion.div
            key={index}
            className="city-building"
            style={{
              left: building.x,
              height: building.height,
              width: building.width,
            }}
            initial={{ opacity: 0, y: 25 }}
            animate={{
              opacity: 1,
              y: [0, -3, 0],
            }}
            transition={{
              opacity: {
                duration: 0.8,
                delay: building.delay,
              },
              y: {
                duration: 4 + index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: building.delay,
              },
            }}
          >
            <div className="building-top" />

            <div className="building-windows">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} />
              ))}
            </div>

            <div className="building-side" />
          </motion.div>
        ))}
      </div>

      {/* Central AI Core */}
      <motion.div
        className="ai-core"
        animate={{
          scale: [1, 1.08, 1],
          boxShadow: [
            "0 0 25px rgba(34,211,238,.18)",
            "0 0 55px rgba(34,211,238,.38)",
            "0 0 25px rgba(34,211,238,.18)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="ai-core-inner">
          AI
        </div>
      </motion.div>

      {/* Floating data points */}
      <motion.span
        className="floating-node floating-one"
        animate={{
          y: [0, -18, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        className="floating-node floating-two"
        animate={{
          y: [0, 15, 0],
          opacity: [0.25, 0.9, 0.25],
        }}
        transition={{
          duration: 3.7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <motion.span
        className="floating-node floating-three"
        animate={{
          y: [0, -12, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Existing labels */}
      <div className="city-label label-one">
        <span className="status-dot" />
        <span>Connected City</span>
      </div>

      <div className="city-label label-two">
        <span className="status-dot" />
        <span>AI Monitoring</span>
      </div>

      <div className="smart-city-caption">
        <span className="caption-line" />
        <span>INTELLIGENT COMMUNITY NETWORK</span>
      </div>
    </div>
  );
}

export default City3D;