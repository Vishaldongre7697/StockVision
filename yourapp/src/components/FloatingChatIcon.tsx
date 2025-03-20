import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SuhuAI() {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: 80, right: 15, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -5 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              color: "black",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "bold",
              position: "absolute",
              bottom: 60,
              whiteSpace: "nowrap"
            }}
          >
            Ask to Suhu
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -5 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              color: "black",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "bold",
              position: "absolute",
              bottom: 60,
              whiteSpace: "nowrap"
            }}
          >
            Suhu AI Activated
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        style={{
          position: "relative",
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #b3e5fc, #4fc3f7, #03a9f4, #0288d1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid black",
          boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.3)",
          outline: "none",
          cursor: "pointer",
          overflow: "hidden",
        }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(0, 255, 255, 1)" }}
        onClick={() => setIsClicked(!isClicked)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="cube-container">
          <div className="cube">
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face right"></div>
            <div className="face left"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        </div>
      </motion.button>

      <style jsx>{`
        .cube-container {
          width: 20px;
          height: 20px;
          perspective: 500px;
        }
        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 8s infinite linear;
        }
        .face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid white;
          background: rgba(255, 255, 255, 0.2);
        }
        .front { transform: translateZ(10px); }
        .back { transform: translateZ(-10px) rotateY(180deg); }
        .right { transform: rotateY(90deg) translateZ(10px); }
        .left { transform: rotateY(-90deg) translateZ(10px); }
        .top { transform: rotateX(90deg) translateZ(10px); }
        .bottom { transform: rotateX(-90deg) translateZ(10px); }
        @keyframes rotateCube {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
