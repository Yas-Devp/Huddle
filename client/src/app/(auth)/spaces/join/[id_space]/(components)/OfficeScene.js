export default function OfficeScene() {
  return (
    <svg
      viewBox="0 0 1000 1070"
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="floorBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#92918d" />
          <stop offset=".55" stopColor="#8a8985" />
          <stop offset="1" stopColor="#83827e" />
        </linearGradient>
        <radialGradient id="floorLight" cx=".38" cy=".22" r=".9">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".13" />
          <stop offset=".55" stopColor="#ffffff" stopOpacity=".03" />
          <stop offset="1" stopColor="#000000" stopOpacity=".08" />
        </radialGradient>
        <radialGradient id="vignette" cx=".5" cy=".46" r=".78">
          <stop offset=".58" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity=".22" />
        </radialGradient>
        <linearGradient id="wallShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" stopOpacity=".28" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="deskTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbfaf6" />
          <stop offset=".6" stopColor="#f1f0eb" />
          <stop offset="1" stopColor="#e7e6e0" />
        </linearGradient>
        <linearGradient id="woodTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a5754c" />
          <stop offset=".45" stopColor="#8e5f3a" />
          <stop offset="1" stopColor="#75492c" />
        </linearGradient>
        <linearGradient id="woodVert" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b07a4e" />
          <stop offset=".5" stopColor="#9b673f" />
          <stop offset="1" stopColor="#855330" />
        </linearGradient>
        <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8ec4dd" />
          <stop offset=".55" stopColor="#4a80a1" />
          <stop offset="1" stopColor="#305a75" />
        </linearGradient>
        <pattern
          id="brick"
          width="68"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <rect width="68" height="32" fill="#d8c5b5" />
          <rect x="1" y="1" width="32" height="14" rx="1" fill="#a96b54" />
          <rect x="36" y="1" width="31" height="14" rx="1" fill="#9d634e" />
          <rect x="-16" y="17" width="32" height="14" rx="1" fill="#a06650" />
          <rect x="19" y="17" width="32" height="14" rx="1" fill="#ad7058" />
          <rect x="54" y="17" width="30" height="14" rx="1" fill="#9a604b" />
        </pattern>
        <pattern
          id="glassBubbles"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="24"
            cy="24"
            r="15"
            fill="none"
            stroke="#ffffff"
            strokeOpacity=".32"
            strokeWidth="2"
          />
          <circle
            cx="38"
            cy="38"
            r="8"
            fill="none"
            stroke="#ffffff"
            strokeOpacity=".16"
            strokeWidth="1.4"
          />
        </pattern>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow
            dx="0"
            dy="9"
            stdDeviation="8"
            floodColor="#241f1b"
            floodOpacity=".24"
          />
        </filter>
        <filter id="lightShadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow
            dx="0"
            dy="5"
            stdDeviation="5"
            floodColor="#241f1b"
            floodOpacity=".18"
          />
        </filter>
        <clipPath id="meetingTableClip">
          <polygon points="748,104 1008,124 1000,294 738,272" />
        </clipPath>
        <g id="chair">
          <ellipse
            cx="0"
            cy="14"
            rx="30"
            ry="21"
            fill="#1f1b17"
            opacity=".13"
          />
          <g
            stroke="#8f8e89"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".9"
          >
            <path d="M0 7-24 21" />
            <path d="M0 7 24 21" />
            <path d="M0 7-28-4" />
            <path d="M0 7 28-4" />
            <path d="M0 7V-11" />
          </g>
          <g fill="#5f5e5a">
            <circle cx="-24" cy="21" r="3.4" />
            <circle cx="24" cy="21" r="3.4" />
            <circle cx="-28" cy="-4" r="3.4" />
            <circle cx="28" cy="-4" r="3.4" />
            <circle cx="0" cy="-11" r="3.4" />
          </g>
          <rect
            x="-17"
            y="-35"
            width="34"
            height="22"
            rx="8"
            fill="#e7e6e1"
            stroke="#c9c8c2"
            strokeWidth="1.4"
          />
          <rect
            x="-20"
            y="-11"
            width="40"
            height="31"
            rx="11"
            fill="#f3f2ed"
            stroke="#d4d3cd"
            strokeWidth="1.5"
          />
          <rect x="-28" y="-3" width="7" height="18" rx="3" fill="#d9d8d2" />
          <rect x="21" y="-3" width="7" height="18" rx="3" fill="#d9d8d2" />
        </g>
        <g id="darkChair">
          <ellipse
            cx="0"
            cy="14"
            rx="30"
            ry="21"
            fill="#1f1b17"
            opacity=".16"
          />
          <g stroke="#4d4d52" strokeWidth="3" strokeLinecap="round">
            <path d="M0 7-24 21" />
            <path d="M0 7 24 21" />
            <path d="M0 7-28-4" />
            <path d="M0 7 28-4" />
            <path d="M0 7V-11" />
          </g>
          <g fill="#38383d">
            <circle cx="-24" cy="21" r="3.4" />
            <circle cx="24" cy="21" r="3.4" />
            <circle cx="-28" cy="-4" r="3.4" />
            <circle cx="28" cy="-4" r="3.4" />
            <circle cx="0" cy="-11" r="3.4" />
          </g>
          <rect
            x="-17"
            y="-35"
            width="34"
            height="22"
            rx="8"
            fill="#28282c"
            stroke="#44444a"
            strokeWidth="1.2"
          />
          <rect
            x="-20"
            y="-11"
            width="40"
            height="31"
            rx="11"
            fill="#323237"
            stroke="#4a4a50"
            strokeWidth="1.2"
          />
          <rect x="-28" y="-3" width="7" height="17" rx="3" fill="#242428" />
          <rect x="21" y="-3" width="7" height="17" rx="3" fill="#242428" />
        </g>
        <g id="palm">
          <ellipse cx="0" cy="31" rx="23" ry="8" fill="#1e1a16" opacity=".18" />
          <path d="M-11 6h22l-3 26h-16Z" fill="#b8643f" />
          <rect x="-13" y="6" width="26" height="6" rx="2.5" fill="#cc7c53" />
          <g fill="#3f7d38" opacity=".95">
            {[-20, 18, 56, 94, 132, 170, 208, 246, 284, 322].map((angle) => (
              <path
                key={angle}
                d="M0 8C-4-9-7-24 0-38 7-24 4-9 0 8Z"
                transform={`rotate(${angle})`}
              />
            ))}
          </g>
          <g fill="#61a24d">
            {[-4, 40, 84, 128, 172, 216, 260, 304].map((angle) => (
              <path
                key={angle}
                d="M0 4C-2-6-4-16 0-28 4-16 2-6 0 4Z"
                transform={`rotate(${angle})`}
                opacity=".85"
              />
            ))}
          </g>
          <circle r="4" fill="#2c5a28" />
        </g>
      </defs>

      {/* Floor */}
      <rect width="1000" height="1070" fill="url(#floorBase)" />
      <g stroke="#282521" strokeOpacity=".055" strokeWidth="1.2">
        {[160, 320, 480, 640, 800].map((x) => (
          <path key={`v-${x}`} d={`M${x} 0V1070`} />
        ))}
        {[120, 260, 400, 540, 680, 820, 960].map((y) => (
          <path key={`h-${y}`} d={`M0 ${y}H1000`} />
        ))}
      </g>
      <g fill="#1f1c19" opacity=".028">
        <ellipse cx="180" cy="600" rx="150" ry="90" />
        <ellipse cx="760" cy="760" rx="170" ry="100" />
        <ellipse cx="500" cy="940" rx="210" ry="70" />
      </g>
      <rect width="1000" height="1070" fill="url(#floorLight)" />

      {/* Top wall */}
      <rect x="0" y="0" width="1000" height="40" fill="url(#brick)" />
      <rect x="0" y="37" width="1000" height="5" fill="#6d665f" opacity=".45" />
      <rect x="0" y="42" width="1000" height="30" fill="url(#wallShade)" />

      {/* Top-left desk */}
      <g filter="url(#softShadow)">
        <rect
          x="26"
          y="8"
          width="320"
          height="112"
          rx="8"
          fill="url(#deskTop)"
        />
        <path
          d="M26 112h320v8a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8Z"
          fill="#d7d6d0"
        />
        <rect x="160" y="-38" width="140" height="66" rx="7" fill="#26262b" />
        <rect x="166" y="-33" width="128" height="46" rx="4" fill="#3d5f75" />
        <path d="M216 28h28v9h-28Z" fill="#c6c5bf" />
        <rect x="222" y="35" width="16" height="12" rx="3" fill="#b8b7b1" />
        <rect x="115" y="44" width="150" height="44" rx="5" fill="#29292e" />
        <g stroke="#4d4d55" strokeWidth="1.2" opacity=".9">
          {[52, 60, 68, 76, 84].map((y) => (
            <path key={y} d={`M123 ${y}H257`} />
          ))}
          {[140, 165, 190, 215, 240].map((x) => (
            <path key={x} d={`M${x} 47V85`} />
          ))}
        </g>
        <rect x="278" y="52" width="17" height="26" rx="9" fill="#e5e4df" />
        <rect x="281" y="56" width="11" height="7" rx="3.5" fill="#c8c7c1" />
        <ellipse cx="324" cy="58" rx="9" ry="6" fill="#ecebe6" />
        <ellipse cx="324" cy="56" rx="6" ry="4" fill="#6f5947" />
      </g>
      <use href="#chair" transform="translate(206 160)" />
      <use href="#palm" transform="translate(438 66) scale(1.45)" />
      <use href="#palm" transform="translate(622 62) scale(1.35)" />

      {/* Central partition */}
      <g filter="url(#softShadow)">
        <rect x="520" y="-12" width="28" height="410" fill="#eeede7" />
        <rect x="520" y="-12" width="6" height="410" fill="#fbfaf5" />
        <rect x="542" y="-12" width="6" height="410" fill="#d7d6d0" />
        <rect x="520" y="390" width="28" height="8" rx="2" fill="#bcbab4" />
      </g>

      {/* Meeting table */}
      <g filter="url(#softShadow)">
        <polygon
          points="748,104 1008,124 1000,294 738,272"
          fill="url(#woodTop)"
        />
        <g clipPath="url(#meetingTableClip)">
          <g
            transform="rotate(3 870 200)"
            stroke="#5d3d25"
            strokeWidth="1.6"
            opacity=".4"
          >
            <path d="M720 136H1030M720 172H1030M720 208H1030M720 244H1030M720 280H1030" />
          </g>
          <ellipse
            cx="900"
            cy="160"
            rx="190"
            ry="48"
            fill="#ffffff"
            opacity=".05"
          />
          <ellipse
            cx="850"
            cy="278"
            rx="190"
            ry="42"
            fill="#2c1b10"
            opacity=".11"
          />
        </g>
        <polygon
          points="748,104 1008,124 1000,294 738,272"
          fill="none"
          stroke="#c39767"
          strokeOpacity=".35"
          strokeWidth="2"
        />
      </g>
      <use
        href="#darkChair"
        transform="translate(880 68) rotate(174) scale(.95)"
      />
      <use
        href="#darkChair"
        transform="translate(1006 196) rotate(96) scale(.9)"
      />
      <use
        href="#darkChair"
        transform="translate(880 322) rotate(6) scale(.92)"
      />
      <g filter="url(#lightShadow)">
        <ellipse cx="806" cy="146" rx="27" ry="15" fill="#a9342b" />
        <ellipse cx="806" cy="142" rx="24" ry="12" fill="#c2463a" />
        <ellipse cx="806" cy="142" rx="19" ry="8" fill="#7d241e" />
        <circle cx="798" cy="140" r="6" fill="#d8503f" />
        <circle cx="812" cy="142" r="5" fill="#b8392e" />
        <ellipse cx="906" cy="186" rx="38" ry="21" fill="#e9e2d3" />
        <ellipse cx="906" cy="184" rx="31" ry="15" fill="#f4eee1" />
        <circle cx="892" cy="182" r="8" fill="#e5af4c" />
        <circle cx="892" cy="182" r="3" fill="#b77d24" />
        <circle cx="908" cy="187" r="7" fill="#e58d8d" />
        <circle cx="908" cy="187" r="2.6" fill="#c45b5b" />
        <circle cx="921" cy="180" r="6" fill="#e3c27a" />
        <ellipse cx="858" cy="154" rx="9" ry="7" fill="#f1eee6" />
        <ellipse cx="858" cy="152" rx="6" ry="4.5" fill="#8d6a4c" />
        <ellipse cx="836" cy="168" rx="8" ry="6" fill="#ece8df" />
      </g>

      {/* Center desk */}
      <g filter="url(#softShadow)">
        <rect
          x="390"
          y="212"
          width="128"
          height="170"
          rx="6"
          fill="url(#deskTop)"
        />
        <path
          d="M390 366h128v10a6 6 0 0 1-6 6H396a6 6 0 0 1-6-6Z"
          fill="#d9d8d2"
        />
        <rect x="430" y="240" width="34" height="100" rx="4" fill="#2a2a2f" />
        <g stroke="#505058" strokeWidth="1.1" opacity=".9">
          {[248, 256, 264, 272, 280, 288, 296, 304, 312, 320, 328, 336].map(
            (y) => (
              <path key={y} d={`M435 ${y}H459`} />
            ),
          )}
          {[444, 452].map((x) => (
            <path key={x} d={`M${x} 244V340`} />
          ))}
        </g>
        <rect
          x="478"
          y="226"
          width="24"
          height="120"
          rx="5"
          fill="#26262b"
          transform="rotate(-4 490 286)"
        />
        <rect
          x="482"
          y="232"
          width="15"
          height="106"
          rx="2.5"
          fill="url(#screen)"
          transform="rotate(-4 490 286)"
        />
        <rect x="474" y="352" width="10" height="12" rx="3" fill="#e5e4df" />
      </g>
      <use
        href="#chair"
        transform="translate(357 280) rotate(-90) scale(1.02)"
      />

      {/* Partition wall */}
      <g filter="url(#lightShadow)">
        <rect x="240" y="398" width="8" height="136" rx="3" fill="#c0905f" />
        <rect x="392" y="398" width="8" height="136" rx="3" fill="#c0905f" />
        <rect x="668" y="398" width="8" height="136" rx="3" fill="#c0905f" />
        <rect x="958" y="398" width="8" height="136" rx="3" fill="#c0905f" />
        <rect
          x="248"
          y="404"
          width="144"
          height="120"
          rx="2"
          fill="#dbe4e1"
          fillOpacity=".22"
          stroke="#3c423f"
          strokeWidth="5"
        />
        <rect
          x="248"
          y="404"
          width="144"
          height="120"
          fill="url(#glassBubbles)"
        />
        <rect
          x="676"
          y="404"
          width="282"
          height="120"
          rx="2"
          fill="#dbe4e1"
          fillOpacity=".22"
          stroke="#3c423f"
          strokeWidth="5"
        />
        <rect
          x="676"
          y="404"
          width="282"
          height="120"
          fill="url(#glassBubbles)"
        />
        <path d="M817 404v120" stroke="#3c423f" strokeWidth="5" />
        <rect x="240" y="396" width="160" height="7" rx="3" fill="#d0a06d" />
        <rect x="668" y="396" width="298" height="7" rx="3" fill="#d0a06d" />
      </g>

      {/* Kitchenette */}
      <g filter="url(#softShadow)" transform="translate(0 -68)">
        <rect x="400" y="468" width="276" height="58" fill="url(#brick)" />
        <rect x="400" y="462" width="276" height="9" fill="#805948" />
        <rect x="420" y="486" width="236" height="9" rx="2" fill="#f5f2e9" />
        <g>
          <ellipse cx="448" cy="481" rx="7" ry="3" fill="#f7f3e9" />
          <ellipse cx="466" cy="481" rx="7" ry="3" fill="#f0ece1" />
          <ellipse cx="484" cy="481" rx="7" ry="3" fill="#f7f3e9" />
          <ellipse cx="502" cy="481" rx="7" ry="3" fill="#eae5d9" />
          <ellipse cx="520" cy="481" rx="7" ry="3" fill="#f7f3e9" />
          <ellipse cx="538" cy="481" rx="7" ry="3" fill="#f0ece1" />
          <ellipse cx="556" cy="481" rx="7" ry="3" fill="#f7f3e9" />
        </g>
        <rect x="392" y="520" width="296" height="18" rx="5" fill="#f2f0e9" />
        <rect x="402" y="538" width="276" height="70" rx="2" fill="#e7e4dc" />
        <rect x="402" y="538" width="276" height="7" fill="#d6d2c8" />
        <rect x="428" y="554" width="96" height="16" rx="3" fill="#d3cfc4" />
        <rect x="536" y="554" width="116" height="16" rx="3" fill="#dbd7cc" />
        <path d="M462 546v46M604 546v46" stroke="#cdc8bd" strokeWidth="2" />
        <g>
          <rect x="438" y="492" width="118" height="30" rx="5" fill="#232326" />
          <rect x="444" y="496" width="106" height="18" rx="3" fill="#3a3a3e" />
          <g stroke="#85858b" strokeWidth="2">
            <path d="M452 500v12M464 500v12M476 500v12M488 500v12M500 500v12M512 500v12M524 500v12M536 500v12" />
          </g>
          <circle cx="452" cy="518" r="3" fill="#b9b9bf" />
          <circle cx="468" cy="518" r="3" fill="#b9b9bf" />
          <circle cx="484" cy="518" r="3" fill="#b9b9bf" />
        </g>
        <g>
          <rect x="570" y="492" width="54" height="36" rx="5" fill="#29292d" />
          <rect x="576" y="497" width="42" height="9" rx="2" fill="#b9bcc2" />
          <circle cx="586" cy="518" r="3" fill="#d7d9dd" />
          <circle cx="596" cy="518" r="3" fill="#d7d9dd" />
          <rect x="610" y="512" width="7" height="16" rx="3" fill="#171719" />
          <ellipse cx="632" cy="525" rx="9" ry="4" fill="#f1ede4" />
          <ellipse cx="632" cy="523" rx="6" ry="2.6" fill="#7b5942" />
        </g>
        <rect x="404" y="608" width="272" height="10" rx="3" fill="#c69a6b" />
        <rect x="484" y="618" width="172" height="14" rx="3" fill="#b98a5a" />
        <rect
          x="492"
          y="632"
          width="156"
          height="48"
          rx="4"
          fill="url(#woodTop)"
        />
        <path
          d="M500 680v22M640 680v22M508 676h124"
          stroke="#2b2b2e"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <ellipse cx="558" cy="650" rx="18" ry="10" fill="#e9e2d4" />
        <ellipse cx="558" cy="648" rx="12" ry="6" fill="#c65b3f" />
      </g>

      {/* Planter */}
      <g transform="translate(-24 -16)">
        <g filter="url(#softShadow)">
          <rect x="388" y="738" width="384" height="66" rx="7" fill="#f1eee5" />
          <rect x="398" y="748" width="364" height="46" rx="3" fill="#6c523e" />
          <rect x="398" y="748" width="364" height="7" rx="2" fill="#7d6048" />
          <g fill="#d9d3c5">
            <circle cx="420" cy="786" r="2.2" />
            <circle cx="452" cy="790" r="1.8" />
            <circle cx="728" cy="788" r="2.2" />
            <circle cx="748" cy="782" r="1.6" />
          </g>
        </g>
        <use href="#palm" transform="translate(440 758) scale(1.1)" />
        <use href="#palm" transform="translate(534 768) scale(1.38)" />
        <use href="#palm" transform="translate(634 766) scale(1.25)" />
        <use href="#palm" transform="translate(724 756) scale(1.02)" />
      </g>

      {/* Sofa */}
      <g filter="url(#softShadow)" transform="translate(0 44)">
        <rect x="508" y="824" width="474" height="210" rx="24" fill="#f1ede2" />
        <rect x="522" y="836" width="446" height="54" rx="16" fill="#faf7ef" />
        <path d="M670 838v50M820 838v50" stroke="#ded8ca" strokeWidth="2" />
        <rect x="522" y="886" width="446" height="130" rx="14" fill="#f7f3e8" />
        <path d="M680 888v126M836 888v126" stroke="#e3ded1" strokeWidth="2" />
        <path d="M522 956h446" stroke="#e9e4d8" strokeWidth="2" />
        <rect x="500" y="852" width="42" height="170" rx="19" fill="#f7f3e9" />
        <rect x="948" y="852" width="42" height="170" rx="19" fill="#f7f3e9" />
        <path d="M506 866v144M982 866v144" stroke="#e3ded1" strokeWidth="2" />
      </g>
      <g filter="url(#lightShadow)" transform="translate(0 44)">
        <rect
          x="548"
          y="892"
          width="54"
          height="48"
          rx="13"
          fill="#2f7a78"
          transform="rotate(-7 575 916)"
        />
        <path
          d="m560 900 30 32M584 898l-26 30"
          stroke="#ffffff"
          strokeOpacity=".14"
          strokeWidth="2"
        />
        <rect
          x="650"
          y="906"
          width="52"
          height="46"
          rx="13"
          fill="#3b506e"
          transform="rotate(5 676 929)"
        />
        <rect
          x="764"
          y="898"
          width="50"
          height="46"
          rx="13"
          fill="#fbf8f0"
          transform="rotate(-4 789 921)"
        />
        <rect
          x="888"
          y="902"
          width="52"
          height="46"
          rx="13"
          fill="#2f7a78"
          transform="rotate(6 914 925)"
        />
      </g>

      {/* Bottom-left counter */}
      <g filter="url(#softShadow)" transform="translate(0 -20)">
        <rect x="0" y="732" width="176" height="30" fill="url(#brick)" />
        <rect x="0" y="760" width="176" height="124" fill="url(#woodVert)" />
        <rect x="0" y="758" width="176" height="8" fill="#d9a871" />
        <g stroke="#744923" strokeOpacity=".3" strokeWidth="1.4">
          <path d="M0 790h176M0 824h176M0 858h176" />
        </g>
        <rect x="26" y="786" width="28" height="38" rx="4" fill="#f2ecdf" />
        <path
          d="M32 794h16M32 800h16M32 806h10"
          stroke="#b9a888"
          strokeWidth="1.4"
        />
        <ellipse cx="104" cy="800" rx="13" ry="8" fill="#ece7dc" />
        <ellipse cx="104" cy="798" rx="8" ry="4.5" fill="#7a5842" />
      </g>
      <use href="#palm" transform="translate(30 1040) scale(1.12)" />

      {/* White bench */}
      <g filter="url(#softShadow)">
        <rect x="-20" y="986" width="236" height="110" rx="16" fill="#f2efe7" />
        <rect x="0" y="1000" width="196" height="80" rx="9" fill="#faf7ef" />
        <path d="M8 1012h180M8 1040h180" stroke="#e3ded1" strokeWidth="2" />
        <rect x="184" y="1008" width="10" height="50" rx="5" fill="#d9d3c5" />
      </g>

      {/* Game corner */}
      <g filter="url(#softShadow)">
        <g transform="translate(874 986) rotate(-4)">
          <rect width="224" height="120" rx="9" fill="url(#woodTop)" />
          <g stroke="#5d3d25" strokeWidth="1.4" opacity=".35">
            <path d="M0 26h224M0 56h224M0 86h224" />
          </g>
          <rect x="24" y="18" width="78" height="76" rx="4" fill="#f5f0e5" />
          <rect x="31" y="25" width="64" height="62" rx="3" fill="#e4d8c4" />
          <circle cx="63" cy="56" r="22" fill="#c9923d" opacity=".55" />
          <circle cx="63" cy="56" r="14" fill="#b23c32" opacity=".55" />
          <rect x="122" y="16" width="62" height="76" rx="4" fill="#b23b34" />
          <rect
            x="130"
            y="26"
            width="46"
            height="7"
            rx="3"
            fill="#f0d9b5"
            opacity=".75"
          />
          <rect
            x="130"
            y="40"
            width="34"
            height="6"
            rx="3"
            fill="#f0d9b5"
            opacity=".45"
          />
          <ellipse cx="186" cy="108" rx="22" ry="10" fill="#eeeae1" />
          <rect
            x="154"
            y="98"
            width="20"
            height="8"
            rx="3"
            fill="#e8e1d1"
            transform="rotate(12 164 102)"
          />
        </g>
      </g>
      <use
        href="#chair"
        transform="translate(840 1048) scale(.92) rotate(18)"
      />

      <rect width="1000" height="1070" fill="url(#vignette)" />
    </svg>
  );
}
