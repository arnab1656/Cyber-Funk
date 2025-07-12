"use client"

import { useState, useEffect } from 'react';

const Loader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  const messages = [
    "INITIALIZING CYBER FUNK MATRIX...",
    "LOADING NEURAL INTERFACE...",
    "CONNECTING TO THE METAVERSE...",
    "SYSTEM STATUS: ONLINE",
    "WELCOME TO THE FUTURE..."
  ];

  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Cycle through messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="cyberpunk-loader">
      {/* Background Circuit Board */}
      <div className="circuit-board">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
                          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="50%" stopColor="#7c7c7c" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Animated circuit paths */}
          <path 
            d="M10,20 L30,20 L30,40 L50,40 L50,60 L70,60 L70,80 L90,80"
            stroke="url(#neonGradient)" 
            strokeWidth="0.5" 
            fill="none"
            filter="url(#glow)"
            className="circuit-path"
          />
          <path 
            d="M20,10 L40,10 L40,30 L60,30 L60,50 L80,50"
            stroke="url(#neonGradient)" 
            strokeWidth="0.5" 
            fill="none"
            filter="url(#glow)"
            className="circuit-path delay-1"
          />
          <path 
            d="M5,70 L25,70 L25,90 L45,90 L45,70 L65,70 L65,90 L85,90"
            stroke="url(#neonGradient)" 
            strokeWidth="0.5" 
            fill="none"
            filter="url(#glow)"
            className="circuit-path delay-2"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="loader-content">
        {/* Glitch Text Effect */}
        <div className={`glitch-text ${glitchActive ? 'glitch-active' : ''}`}>
          <h1 className="cyber-title">CYBER FUNK</h1>
          <h1 className="cyber-title glitch-layer-1">CYBER FUNK</h1>
          <h1 className="cyber-title glitch-layer-2">CYBER FUNK</h1>
        </div>

        {/* Loading Message */}
        <div className="loading-message">
          <span className="message-text">{messages[currentMessage]}</span>
          <span className="cursor">|</span>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="interactive-elements">
          <div className="neon-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cyberpunk-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #f1f1f1;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          overflow: hidden;
          font-family: 'Gilroy', monospace;
        }

        .circuit-board {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          z-index: 1;
        }

        .circuit-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: trace 3s ease-in-out infinite;
        }

        .circuit-path.delay-1 {
          animation-delay: 1s;
        }

        .circuit-path.delay-2 {
          animation-delay: 2s;
        }

        @keyframes trace {
          0% { stroke-dashoffset: 1000; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1000; }
        }

        .loader-content {
          position: relative;
          z-index: 2;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .glitch-text {
          position: relative;
        }

        .cyber-title {
          font-size: 4rem;
          font-weight: 900;
          color: #000;
          text-shadow: 
            0 0 10px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(0, 0, 0, 0.2);
          margin: 0;
          position: relative;
        }

        .glitch-layer-1,
        .glitch-layer-2 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-layer-1 {
          color: #7c7c7c;
          text-shadow: 
            0 0 10px rgba(124, 124, 124, 0.5),
            0 0 20px rgba(124, 124, 124, 0.3);
          animation: glitch-1 0.3s ease-in-out;
          opacity: 0;
        }

        .glitch-layer-2 {
          color: #000;
          text-shadow: 
            0 0 10px rgba(0, 0, 0, 0.5),
            0 0 20px rgba(0, 0, 0, 0.3);
          animation: glitch-2 0.3s ease-in-out;
          opacity: 0;
        }

        .glitch-active .glitch-layer-1 {
          animation: glitch-1 0.3s ease-in-out;
          opacity: 1;
        }

        .glitch-active .glitch-layer-2 {
          animation: glitch-2 0.3s ease-in-out;
          opacity: 1;
        }

        @keyframes glitch-1 {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes glitch-2 {
          0% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
          100% { transform: translate(0); }
        }

        .loading-message {
          font-size: 1.2rem;
          color: #7c7c7c;
          text-shadow: 0 0 5px rgba(124, 124, 124, 0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cursor {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .progress-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .progress-bar {
          width: 300px;
          height: 8px;
          background: rgba(0, 0, 0, 0.1);
          border: 2px solid #000;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #000, #7c7c7c, #000);
          border-radius: 2px;
          transition: width 0.3s ease;
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-text {
          font-size: 1.5rem;
          color: #000;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          font-weight: bold;
        }

        .interactive-elements {
          margin-top: 2rem;
        }

        .neon-dots {
          display: flex;
          gap: 1rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          background: #000;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .dot:nth-child(2) { animation-delay: 0.3s; }
        .dot:nth-child(3) { animation-delay: 0.6s; }
        .dot:nth-child(4) { animation-delay: 0.9s; }
        .dot:nth-child(5) { animation-delay: 1.2s; }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.5;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .cyber-title {
            font-size: 2.5rem;
          }
          
          .loading-message {
            font-size: 1rem;
          }
          
          .progress-bar {
            width: 250px;
          }
          
          .progress-text {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .cyber-title {
            font-size: 2rem;
          }
          
          .progress-bar {
            width: 200px;
          }
          
          .neon-dots {
            gap: 0.5rem;
          }
          
          .dot {
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;