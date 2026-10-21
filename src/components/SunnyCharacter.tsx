import React from 'react';

export type SunnyMood =
  | 'idle'
  | 'wave'
  | 'eating'
  | 'teeth_dirty'
  | 'teeth_clean'
  | 'bathing'
  | 'bathing_clean'
  | 'hair_messy'
  | 'hair_combed'
  | 'cheer';

interface SunnyProps {
  mood?: SunnyMood;
  size?: number; // base pixel width
  className?: string;
  sparkle?: boolean;
}

export const SunnyCharacter: React.FC<SunnyProps> = ({
  mood = 'idle',
  size = 220,
  className = '',
  sparkle = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform duration-300 ${className}`}
      style={{ width: size, height: size * 1.15 }}
      aria-label="Sunny the friendly cartoon child"
      role="img"
    >
      <svg
        viewBox="0 0 240 280"
        className="w-full h-full drop-shadow-md select-none pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="sunnySkin" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFF1E0" />
            <stop offset="100%" stopColor="#FED7AA" />
          </radialGradient>
          <linearGradient id="sunnyHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C2D12" />
            <stop offset="50%" stopColor="#9A3412" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id="sunnyShirt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <filter id="cheekGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Ambient subtle sparkle stars when celebrated */}
        {(sparkle || mood === 'teeth_clean' || mood === 'hair_combed' || mood === 'cheer') && (
          <g className="animate-sparkle-spin origin-[120px_100px]">
            {/* Top right sparkle */}
            <path
              d="M195 45 Q195 55 205 55 Q195 55 195 65 Q195 55 185 55 Q195 55 195 45 Z"
              fill="#FBBF24"
            />
            {/* Top left sparkle */}
            <path
              d="M45 50 Q45 60 55 60 Q45 60 45 70 Q45 60 35 60 Q45 60 45 50 Z"
              fill="#F59E0B"
            />
          </g>
        )}

        {/* Shadow under Sunny */}
        <ellipse cx="120" cy="265" rx="70" ry="12" fill="#E2E8F0" opacity="0.8" />

        {/* Sunny's Body / Shirt */}
        <g id="body" className="animate-gentle-bounce origin-bottom">
          {mood === 'bathing' || mood === 'bathing_clean' ? (
            // In bath: shoulders with cute bath bubbles or towel
            <g id="bath-shoulders">
              <path
                d="M70 215 C70 195, 170 195, 170 215 C170 230, 70 230, 70 215 Z"
                fill="url(#sunnySkin)"
              />
              {/* Bath towel or foam rim */}
              <path
                d="M60 218 C75 208, 165 208, 180 218 C175 235, 65 235, 60 218 Z"
                fill="#FFFFFF"
                opacity="0.9"
              />
            </g>
          ) : (
            // Cheerful mint shirt
            <g id="shirt">
              <path
                d="M75 190 C75 170, 165 170, 165 190 L180 255 C180 262, 60 262, 60 255 Z"
                fill="url(#sunnyShirt)"
              />
              {/* Cute collar */}
              <path
                d="M95 185 C105 198, 135 198, 145 185"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {/* Little sunshine icon on shirt */}
              <circle cx="120" cy="225" r="9" fill="#FEF08A" />
              <circle cx="120" cy="225" r="6" fill="#FBBF24" />
            </g>
          )}

          {/* Arms according to mood */}
          {mood === 'wave' && (
            <g id="waving-arm" className="animate-wiggle origin-[175px_195px]">
              <path
                d="M165 190 Q190 160 205 130"
                stroke="url(#sunnySkin)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              {/* Waving hand */}
              <circle cx="205" cy="125" r="14" fill="url(#sunnySkin)" />
              <circle cx="212" cy="118" r="5" fill="url(#sunnySkin)" />
            </g>
          )}

          {mood === 'cheer' && (
            <g id="cheering-arms">
              {/* Left arm up */}
              <path
                d="M75 190 Q40 150 35 115"
                stroke="url(#sunnySkin)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <circle cx="35" cy="110" r="14" fill="url(#sunnySkin)" />
              {/* Right arm up */}
              <path
                d="M165 190 Q200 150 205 115"
                stroke="url(#sunnySkin)"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <circle cx="205" cy="110" r="14" fill="url(#sunnySkin)" />
            </g>
          )}

          {/* Head & Neck */}
          <path d="M108 175 L132 175 L130 195 L110 195 Z" fill="url(#sunnySkin)" />

          {/* Ears */}
          <circle cx="56" cy="120" r="14" fill="url(#sunnySkin)" />
          <circle cx="56" cy="120" r="8" fill="#FDBA74" opacity="0.6" />
          <circle cx="184" cy="120" r="14" fill="url(#sunnySkin)" />
          <circle cx="184" cy="120" r="8" fill="#FDBA74" opacity="0.6" />

          {/* Head Shape */}
          <ellipse cx="120" cy="120" rx="66" ry="68" fill="url(#sunnySkin)" />

          {/* Hair Base */}
          <g id="hair">
            {/* Back hair */}
            <path
              d="M56 120 C54 80, 75 52, 120 52 C165 52, 186 80, 184 120 C182 124, 180 85, 120 75 C60 85, 58 124, 56 120 Z"
              fill="url(#sunnyHair)"
            />

            {/* Front fringe / bangs */}
            <path
              d="M58 100 C70 65, 110 65, 122 85 C132 68, 170 70, 182 100 C175 88, 150 78, 120 78 C90 78, 65 88, 58 100 Z"
              fill="url(#sunnyHair)"
            />

            {/* Hair variations */}
            {mood === 'hair_messy' ? (
              // Messy flyaway wild tufts
              <g id="messy-tufts">
                <path
                  d="M110 54 Q100 28 85 36 Q100 48 108 55"
                  fill="url(#sunnyHair)"
                />
                <path
                  d="M125 52 Q130 20 148 28 Q138 45 130 54"
                  fill="url(#sunnyHair)"
                />
                <path
                  d="M55 90 Q30 80 40 102 Q50 95 58 96"
                  fill="url(#sunnyHair)"
                />
                <path
                  d="M185 90 Q210 82 200 102 Q190 95 182 96"
                  fill="url(#sunnyHair)"
                />
              </g>
            ) : (
              // Cute neat bouncy cowlick / neat hair
              <g id="neat-hair">
                <path
                  d="M115 53 C115 36, 130 36, 128 50 C128 52, 122 53, 115 53 Z"
                  fill="url(#sunnyHair)"
                />
                {mood === 'hair_combed' && (
                  // Shiny hair star clip
                  <g transform="translate(155, 68)">
                    <polygon
                      points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2"
                      fill="#F59E0B"
                    />
                  </g>
                )}
              </g>
            )}
          </g>

          {/* Rosy Cheeks */}
          <ellipse
            cx="80"
            cy="138"
            rx="11"
            ry="7"
            fill="#FB7185"
            opacity="0.65"
            filter="url(#cheekGlow)"
          />
          <ellipse
            cx="160"
            cy="138"
            rx="11"
            ry="7"
            fill="#FB7185"
            opacity="0.65"
            filter="url(#cheekGlow)"
          />

          {/* Eyebrows */}
          <path
            d="M78 95 Q90 90 102 96"
            stroke="#9A3412"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M138 96 Q150 90 162 95"
            stroke="#9A3412"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Eyes */}
          {mood === 'eating' ? (
            // Happy closed crescent eyes when tasting food: ^^
            <g id="eating-eyes">
              <path
                d="M78 116 Q90 105 102 116"
                stroke="#1E293B"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M138 116 Q150 105 162 116"
                stroke="#1E293B"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          ) : (
            // Big sparkling round cartoon eyes
            <g id="open-eyes">
              {/* Left eye */}
              <ellipse cx="90" cy="116" rx="10" ry="13" fill="#1E293B" />
              <circle cx="87" cy="112" r="4.5" fill="#FFFFFF" />
              <circle cx="93" cy="121" r="2" fill="#FFFFFF" />

              {/* Right eye */}
              <ellipse cx="150" cy="116" rx="10" ry="13" fill="#1E293B" />
              <circle cx="147" cy="112" r="4.5" fill="#FFFFFF" />
              <circle cx="153" cy="121" r="2" fill="#FFFFFF" />
            </g>
          )}

          {/* Nose */}
          <path
            d="M117 125 Q120 128 123 125"
            stroke="#EA580C"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Mouth according to state */}
          {mood === 'teeth_dirty' ? (
            // Open mouth showing teeth that need brushing (slightly yellowish or cute little food spots)
            <g id="dirty-teeth-mouth">
              <path
                d="M98 138 Q120 148 142 138 Q138 162 120 162 Q102 162 98 138 Z"
                fill="#991B1B"
              />
              {/* Top teeth with slight dull shade */}
              <rect x="106" y="139" width="28" height="8" rx="2" fill="#FEF3C7" />
              <line x1="113" y1="139" x2="113" y2="147" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="120" y1="139" x2="120" y2="147" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="127" y1="139" x2="127" y2="147" stroke="#E2E8F0" strokeWidth="1" />
              {/* Cute little berry or cookie spot */}
              <circle cx="111" cy="143" r="1.5" fill="#B45309" />
              <circle cx="124" cy="144" r="1.5" fill="#9A3412" />
            </g>
          ) : mood === 'teeth_clean' ? (
            // Big dazzling smile with brilliant sparkling white teeth
            <g id="clean-teeth-mouth">
              <path
                d="M95 136 Q120 148 145 136 Q142 165 120 165 Q98 165 95 136 Z"
                fill="#991B1B"
              />
              {/* Sparkly white teeth */}
              <rect x="103" y="138" width="34" height="9" rx="3" fill="#FFFFFF" />
              <line x1="111" y1="138" x2="111" y2="147" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="120" y1="138" x2="120" y2="147" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="129" y1="138" x2="129" y2="147" stroke="#CBD5E1" strokeWidth="1" />
              {/* Tooth glint */}
              <polygon
                points="128,135 130,139 134,140 130,141 128,145 126,141 122,140 126,139"
                fill="#38BDF8"
              />
            </g>
          ) : mood === 'eating' ? (
            // Cheerful munching mouth with tongue
            <g id="eating-mouth" className="animate-wiggle origin-center">
              <ellipse cx="120" cy="146" rx="14" ry="12" fill="#991B1B" />
              <path
                d="M112 148 Q120 156 128 148"
                fill="#FB7185"
              />
            </g>
          ) : (
            // Warm friendly open smile
            <g id="default-smile">
              <path
                d="M102 140 Q120 158 138 140"
                stroke="#1E293B"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Smile dimples */}
              <path
                d="M98 138 Q97 141 99 144"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M142 138 Q143 141 141 144"
                stroke="#1E293B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Bath Foam on head if bathing */}
          {mood === 'bathing' && (
            <g id="bath-foam" className="animate-float-bubble">
              <circle cx="100" cy="50" r="14" fill="#FFFFFF" opacity="0.95" />
              <circle cx="120" cy="42" r="16" fill="#FFFFFF" opacity="0.95" />
              <circle cx="140" cy="48" r="14" fill="#FFFFFF" opacity="0.95" />
              <circle cx="110" cy="34" r="10" fill="#E0F2FE" />
              <circle cx="130" cy="34" r="10" fill="#E0F2FE" />
            </g>
          )}

          {/* Clean Bath Shower Cap / Towel Crown if bathing_clean */}
          {mood === 'bathing_clean' && (
            <g id="bath-clean-towel">
              <path
                d="M80 55 Q120 20 160 55 Q145 65 120 60 Q95 65 80 55 Z"
                fill="#38BDF8"
                opacity="0.9"
              />
              <circle cx="120" cy="28" r="8" fill="#FBBF24" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
