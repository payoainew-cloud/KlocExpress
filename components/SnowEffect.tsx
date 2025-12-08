import React, { useEffect, useState } from 'react';

export const SnowEffect: React.FC = () => {
  // Generujemy płatki śniegu tylko po stronie klienta, aby uniknąć problemów z hydracją
  const [snowflakes, setSnowflakes] = useState<number[]>([]);

  useEffect(() => {
    setSnowflakes(Array.from({ length: 50 }, (_, i) => i));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>
        {`
          @keyframes snowfall {
            0% { transform: translateY(-10px) translateX(0); opacity: 0; }
            20% { opacity: 0.8; }
            100% { transform: translateY(100vh) translateX(20px); opacity: 0; }
          }
        `}
      </style>
      {snowflakes.map((i) => {
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 5 + 5}s`;
        const animationDelay = `${Math.random() * 5}s`;
        const size = `${Math.random() * 4 + 2}px`;
        
        return (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-80"
            style={{
              left,
              width: size,
              height: size,
              animation: `snowfall ${animationDuration} linear ${animationDelay} infinite`,
              top: '-10px'
            }}
          />
        );
      })}
    </div>
  );
};
