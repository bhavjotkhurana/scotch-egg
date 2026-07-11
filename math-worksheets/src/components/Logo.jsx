export default function Logo({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 620 140"
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(10,10) scale(1.2)">
        <path
          d="M 50 13 C 66 13 78 39 78 58 C 78 77 65 87 50 87 C 35 87 22 77 22 58 C 22 39 34 13 50 13 Z"
          fill="#FBF6EC"
        />
        <path
          fillRule="evenodd"
          fill="#B5652A"
          d="M 50 2 A 48 48 0 0 1 50 98 A 48 48 0 0 1 50 2 Z M 50 13 C 66 13 78 39 78 58 C 78 77 65 87 50 87 C 35 87 22 77 22 58 C 22 39 34 13 50 13 Z"
        />
        <circle cx="50" cy="62" r="13" fill="#E7B86A" />
      </g>
      <text
        x="150"
        y="93"
        fontFamily="Lora, Georgia, serif"
        fontWeight="600"
        fontSize="72"
        fill="#3A2A1D"
      >
        Scotch Egg
      </text>
    </svg>
  );
}
