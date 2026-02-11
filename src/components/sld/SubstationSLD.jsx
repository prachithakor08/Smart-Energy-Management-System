export default function SubstationSLD({ substations }) {
  const getColor = (status) => {
    if (status === "CRITICAL") return "#ff4d4f";
    if (status === "WARNING") return "#faad14";
    return "#52c41a";
  };

  const getClass = (status) => {
    if (status === "CRITICAL") return "blink-critical";
    if (status === "WARNING") return "pulse-warning";
    return "";
  };

  // Fixed node positions (SLD layout)
  const positions = [
    [100, 60],  // 0 - Substation 1
    [250, 60],  // 1 - Substation 2
    [400, 60],  // 2 - Substation 3
    [550, 60],  // 3 - Substation 4

    [100, 160], // 4 - Substation 5
    [250, 160], // 5 - Substation 6
    [400, 160], // 6 - Substation 7
    [550, 160], // 7 - Substation 8

    [325, 240], // 8 - Substation 9
    [475, 240]  // 9 - Substation 10
  ];

  // Explicit grid connections (VERY IMPORTANT)
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
    <svg width="100%" height="300">
      {/* CONNECTION LINES */}
      {connections.map(([from, to], i) => (
        <line
          key={i}
          x1={positions[from][0]}
          y1={positions[from][1]}
          x2={positions[to][0]}
          y2={positions[to][1]}
          stroke="#94a3b8"
          strokeWidth="2"
        />
      ))}

      {/* SUBSTATION NODES */}
      {substations.map((s, i) => {
        const [x, y] = positions[i];

        return (
         <g key={s.id} className={getClass(s.status)}>
  {/* Substation outer box */}
  <rect
    x={x - 20}
    y={y - 20}
    width="40"
    height="40"
    rx="4"
    fill={getColor(s.status)}
    stroke="#1f2937"
    strokeWidth="1.5"
  />

  {/* Busbar line */}
  <line
    x1={x - 15}
    y1={y}
    x2={x + 15}
    y2={y}
    stroke="white"
    strokeWidth="3"
  />

  {/* Vertical breaker line */}
  <line
    x1={x}
    y1={y - 12}
    x2={x}
    y2={y + 12}
    stroke="white"
    strokeWidth="2"
  />

  {/* Substation Name */}
  <text
    x={x}
    y={y + 35}
    textAnchor="middle"
    fontSize="12"
    fill="#1f2937"
  >
    {s.name}
  </text>
</g>

        );
      })}
    </svg>
  );
}
