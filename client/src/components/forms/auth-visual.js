export default function AuthVisual() {
  return (
    <svg
      viewBox="0 0 760 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="auth-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b1426" />
          <stop offset="0.55" stopColor="#261a38" />
          <stop offset="1" stopColor="#120e1b" />
        </linearGradient>

        <linearGradient id="auth-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241a46" />
          <stop offset="0.55" stopColor="#4c2a8a" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>

        <linearGradient id="auth-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1528" />
          <stop offset="1" stopColor="#110d19" />
        </linearGradient>

        <linearGradient id="auth-desk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4c3866" />
          <stop offset="1" stopColor="#332647" />
        </linearGradient>

        <radialGradient id="auth-glow-a" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#7c3aed" stopOpacity="0.38" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="auth-glow-b" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f0c98f" stopOpacity="0.24" />
          <stop offset="1" stopColor="#f0c98f" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="auth-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f8f2ff" stopOpacity="0.4" />
          <stop offset="0.45" stopColor="#e9d5ff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#e9d5ff" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="auth-vignette" cx="50%" cy="45%" r="72%">
          <stop offset="0.55" stopColor="#0a0a0a" stopOpacity="0" />
          <stop offset="1" stopColor="#0a0a0a" stopOpacity="0.55" />
        </radialGradient>

        <pattern
          id="auth-city-windows"
          width="18"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <rect x="4" y="5" width="6" height="8" rx="1" fill="#f5d78e" opacity="0.75" />
        </pattern>

        <clipPath id="auth-window-clip">
          <rect x="104" y="122" width="552" height="384" rx="22" />
        </clipPath>
      </defs>

      <rect width="760" height="1000" fill="url(#auth-wall)" />
      <circle cx="630" cy="120" r="270" fill="url(#auth-glow-a)" />
      <circle cx="90" cy="860" r="280" fill="#4c1d95" opacity="0.18" />

      <rect x="86" y="104" width="588" height="420" rx="34" fill="#352847" />
      <rect x="104" y="122" width="552" height="384" rx="22" fill="url(#auth-sky)" />

      <g clipPath="url(#auth-window-clip)">
        <circle cx="560" cy="205" r="96" fill="url(#auth-moon)" />
        <circle cx="560" cy="205" r="38" fill="#f8f2ff" />
        <circle cx="548" cy="194" r="7" fill="#e9d5ff" opacity="0.55" />
        <circle cx="571" cy="215" r="5" fill="#e9d5ff" opacity="0.5" />
        <circle cx="557" cy="223" r="4" fill="#e9d5ff" opacity="0.45" />

        <circle cx="160" cy="176" r="2" fill="#f8f2ff" opacity="0.8" />
        <circle cx="222" cy="148" r="2.5" fill="#f8f2ff" opacity="0.6" />
        <circle cx="300" cy="188" r="1.8" fill="#f8f2ff" opacity="0.7" />
        <circle cx="360" cy="152" r="2.2" fill="#f8f2ff" opacity="0.55" />
        <circle cx="462" cy="180" r="1.8" fill="#f8f2ff" opacity="0.75" />
        <circle cx="500" cy="150" r="2" fill="#f8f2ff" opacity="0.5" />
        <circle cx="620" cy="282" r="2" fill="#f8f2ff" opacity="0.7" />

        <path
          d="M104 122h190l-118 384H104z"
          fill="#ffffff"
          opacity="0.035"
        />
        <path
          d="M326 122h58L266 506h-58z"
          fill="#ffffff"
          opacity="0.03"
        />

        <g>
          <rect x="116" y="352" width="84" height="154" rx="6" fill="#1b1430" />
          <rect x="124" y="360" width="68" height="146" fill="url(#auth-city-windows)" opacity="0.8" />

          <rect x="212" y="398" width="58" height="108" rx="5" fill="#241a3d" />
          <rect x="218" y="406" width="46" height="100" fill="url(#auth-city-windows)" opacity="0.55" />

          <rect x="282" y="312" width="92" height="194" rx="6" fill="#1e1537" />
          <rect x="290" y="320" width="76" height="186" fill="url(#auth-city-windows)" opacity="0.75" />
          <path d="M328 312v-30" stroke="#4c3b66" strokeWidth="3" />
          <circle cx="328" cy="278" r="3" fill="#f0c98f" opacity="0.9" />

          <rect x="386" y="368" width="66" height="138" rx="6" fill="#241a3d" />
          <rect x="394" y="376" width="50" height="130" fill="url(#auth-city-windows)" opacity="0.45" />

          <rect x="464" y="330" width="80" height="176" rx="6" fill="#1b1430" />
          <rect x="472" y="338" width="64" height="168" fill="url(#auth-city-windows)" opacity="0.7" />

          <rect x="556" y="386" width="64" height="120" rx="5" fill="#2a1e47" />
          <rect x="562" y="394" width="52" height="112" fill="url(#auth-city-windows)" opacity="0.5" />
        </g>

        <rect x="104" y="480" width="552" height="26" fill="#1a1230" opacity="0.65" />
      </g>

      <g clipPath="url(#auth-window-clip)">
        <rect x="372" y="122" width="12" height="384" fill="#332746" />
        <rect x="104" y="298" width="552" height="10" fill="#332746" />
      </g>
      <rect
        x="104"
        y="122"
        width="552"
        height="384"
        rx="22"
        fill="none"
        stroke="#4a3563"
        strokeWidth="2"
      />

      <path d="M196 0v154" stroke="#3d2f50" strokeWidth="3" />
      <path d="M160 154h72l-12 30h-48z" fill="#f0c98f" />
      <ellipse cx="196" cy="185" rx="24" ry="6" fill="#ffe4b0" opacity="0.8" />
      <circle cx="196" cy="220" r="104" fill="url(#auth-glow-b)" />

      <path d="M588 0v120" stroke="#3d2f50" strokeWidth="3" />
      <path d="M556 120h64l-10 26h-44z" fill="#f0c98f" />
      <ellipse cx="588" cy="147" rx="21" ry="5" fill="#ffe4b0" opacity="0.75" />
      <circle cx="588" cy="180" r="86" fill="url(#auth-glow-b)" />

      <rect x="0" y="744" width="760" height="18" fill="#2a1f3a" opacity="0.7" />
      <rect x="0" y="760" width="760" height="240" fill="url(#auth-floor)" />

      <ellipse cx="380" cy="864" rx="296" ry="74" fill="#241a34" />
      <ellipse
        cx="380"
        cy="864"
        rx="250"
        ry="56"
        fill="#2b1f3e"
        opacity="0.85"
      />
      <ellipse
        cx="380"
        cy="864"
        rx="206"
        ry="40"
        fill="none"
        stroke="#3a2b51"
        strokeWidth="2"
        strokeDasharray="6 12"
        opacity="0.7"
      />

      <ellipse cx="380" cy="836" rx="238" ry="30" fill="#0d0a14" opacity="0.35" />

      <rect x="198" y="540" width="78" height="112" rx="30" fill="#3a2b51" />
      <rect x="480" y="532" width="78" height="120" rx="30" fill="#3a2b51" />

      <circle cx="252" cy="528" r="30" fill="#f1c7a3" />
      <path
        d="M222 528c0-25 13-42 30-42s30 17 30 42c-7-13-17-20-30-20s-23 7-30 20z"
        fill="#2b1d2b"
      />
      <path
        d="M224 522c0-22 12-36 28-36s28 14 28 36"
        stroke="#2b1d2b"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="218" y="518" width="9" height="18" rx="4.5" fill="#2b1d2b" />
      <path
        d="M252 558c-4 10-3 22 3 32"
        stroke="#2b1d2b"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="256" cy="592" r="4" fill="#2b1d2b" />
      <path d="M214 664c0-57 17-90 38-90s38 33 38 90z" fill="#a78bfa" />
      <path
        d="M232 616c12 10 26 20 46 27"
        stroke="#f1c7a3"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      <circle cx="512" cy="520" r="29" fill="#c98a63" />
      <path
        d="M483 520c0-24 13-40 29-40s29 16 29 40c-5-12-15-19-29-19s-24 7-29 19z"
        fill="#2a1a20"
      />
      <circle cx="542" cy="492" r="11" fill="#2a1a20" />
      <path
        d="M512 549c4 11 3 20-2 29"
        stroke="#2a1a20"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M476 664c0-55 16-88 36-88s36 33 36 88z" fill="#e8a6a0" />
      <path
        d="M522 616c-12 10-26 18-44 25"
        stroke="#c98a63"
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />

      <rect x="90" y="666" width="580" height="28" rx="14" fill="url(#auth-desk)" />
      <rect x="118" y="694" width="524" height="78" rx="16" fill="#332647" />
      <path d="M154 722h452" stroke="#443257" strokeWidth="2" opacity="0.75" />
      <rect x="360" y="731" width="40" height="6" rx="3" fill="#5b4574" />
      <rect x="140" y="772" width="18" height="92" rx="8" fill="#231a32" />
      <rect x="602" y="772" width="18" height="92" rx="8" fill="#231a32" />

      <rect x="256" y="650" width="118" height="16" rx="8" fill="#1c1428" />
      <rect x="272" y="586" width="88" height="64" rx="10" fill="#171020" />
      <rect x="280" y="594" width="72" height="46" rx="5" fill="#6d28d9" />
      <rect x="286" y="601" width="28" height="17" rx="2" fill="#a78bfa" opacity="0.6" />
      <rect x="318" y="601" width="28" height="17" rx="2" fill="#a78bfa" opacity="0.4" />
      <circle cx="316" cy="591" r="2" fill="#a78bfa" opacity="0.8" />

      <rect x="430" y="656" width="110" height="14" rx="7" fill="#1c1428" />
      <rect x="444" y="598" width="82" height="58" rx="9" fill="#171020" />
      <rect x="451" y="605" width="68" height="42" rx="4" fill="#4c1d95" />
      <rect x="457" y="611" width="26" height="15" rx="2" fill="#c4b5fd" opacity="0.55" />
      <rect x="487" y="611" width="26" height="15" rx="2" fill="#c4b5fd" opacity="0.35" />
      <circle cx="485" cy="602" r="2" fill="#a78bfa" opacity="0.8" />

      <rect x="386" y="638" width="20" height="26" rx="5" fill="#f0c98f" />
      <path
        d="M406 646h7a6 6 0 0 1 0 12h-7"
        stroke="#f0c98f"
        strokeWidth="4"
        fill="none"
      />
      <rect
        x="604"
        y="646"
        width="40"
        height="12"
        rx="3"
        fill="#e8a6a0"
        transform="rotate(-7 624 652)"
      />

      <path d="M42 700h66l-10 54h-46z" fill="#a8674f" />
      <rect x="36" y="690" width="78" height="16" rx="8" fill="#bf7a5e" />
      <path d="M75 692c0-54 4-94 8-126" stroke="#3f9d7d" strokeWidth="5" fill="none" />
      <path d="M74 640c-24-16-34-38-26-58 22 2 38 24 26 58z" fill="#4fa989" />
      <path d="M80 614c-2-28 10-48 32-54 6 24-8 48-32 54z" fill="#5cbf9a" />
      <path d="M70 674c-24-6-38-24-36-44 22-2 40 14 36 44z" fill="#5cbf9a" />
      <path d="M84 586c4-26 20-42 42-42 0 24-16 40-42 42z" fill="#3f9d7d" />

      <path d="M650 716h80l-12 64h-56z" fill="#a8674f" />
      <rect x="644" y="704" width="92" height="18" rx="9" fill="#bf7a5e" />
      <path d="M690 706c-2-58 0-104 4-138" stroke="#3f9d7d" strokeWidth="5" fill="none" />
      <path d="M692 646c-28-12-42-34-36-58 26 0 44 22 36 58z" fill="#4fa989" />
      <path d="M694 612c6-30 24-48 48-50-2 26-20 46-48 50z" fill="#3f9d7d" />
      <path d="M688 678c-26 0-44-14-48-36 26-6 48 8 48 36z" fill="#5cbf9a" />
      <path d="M696 582c2-28 16-46 38-48 2 24-14 42-38 48z" fill="#5cbf9a" />

      <g>
        <rect x="142" y="418" width="98" height="48" rx="24" fill="#f8f4ff" />
        <path d="M196 462l10 18 8-20z" fill="#f8f4ff" />
        <circle cx="174" cy="442" r="4" fill="#8b5cf6" />
        <circle cx="191" cy="442" r="4" fill="#c4b5fd" />
        <circle cx="208" cy="442" r="4" fill="#e9d5ff" />
      </g>

      <g>
        <rect x="524" y="382" width="76" height="46" rx="23" fill="#a78bfa" />
        <path d="M550 426l-9 16-2-18z" fill="#a78bfa" />
        <path
          d="M562 412c-9-7-14-11-14-16a6.5 6.5 0 0 1 11-4l3 3 3-3a6.5 6.5 0 0 1 11 4c0 5-5 9-14 16z"
          fill="#f8f4ff"
        />
      </g>

      <rect width="760" height="1000" fill="url(#auth-vignette)" />
    </svg>
  );
}
