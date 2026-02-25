export default function SubstationSLD({ substations }) {

  const getStatusConfig = (status) => {
    switch (status) {
      case "CRITICAL":
        return {
          color: "#ff3b30",
          glow: "critical-glow"
        };
      case "WARNING":
        return {
          color: "#ff9f0a",
          glow: "warning-glow"
        };
      default:
        return {
          color: "#00d084",
          glow: ""
        };
    }
  };

  const positions = [
    [100, 80],
    [350, 80],
    [550, 80],
    [750, 80],

    [100, 300],
    [350, 300],
    [550, 300],
    [750, 300],

    [550, 470],
    [750, 470]
  ];

  const connections = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
    [6, 8],
    [7, 9]
  ];

 return (
  <div className="sld-container">
   <svg viewBox="0 0 900 600" width="100%" height="480">

        {/* CONNECTION LINES */}
        {connections.map(([from, to], i) => (
          <line
            key={i}
            x1={positions[from][0]}
            y1={positions[from][1]}
            x2={positions[to][0]}
            y2={positions[to][1]}
            stroke="#d1d5db"
            strokeWidth="2"
          />
        ))}

        {/* SUBSTATIONS */}
       {substations.slice(0, positions.length).map((s, i) => {
          const [x, y] = positions[i];
          const config = getStatusConfig(s.status);

          return (
            <g key={s.id} className={config.glow}>

              <circle
                cx={x}
                cy={y}
                r="40"
                fill="#ffffff"
                stroke={config.color}
                strokeWidth="3"
                style={{ transition: "all 0.5s ease" }}
              />

              {/* Inner core */}
             <circle
                cx={x}
                cy={y}
                r="20"
                fill={config.color}
                style={{ transition: "all 0.5s ease" }}
              />

              {/* Label */}
              <text
                x={x}
                y={y + 65}
                textAnchor="middle"
                fontSize="20"
                fontWeight="650"
                fill="#1f2937"
              >
                {s.name}
              </text>

              {/* Status Text */}
              <text
                x={x}
                y={y + 85}
                textAnchor="middle"
                fontSize="18"
                fill="#475569"
        
              >
                {s.status}
              </text>

            </g>
          );
        })}
      </svg>
    </div>
  );
}