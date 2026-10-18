/** @type {import('tailwindcss').Config} */
// Colors resolve to the OKLCH tokens in /tokens.css so utilities and CSS share one source.
const token = (channels) => `oklch(var(${channels}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: token('--paper-lch'), 2: token('--paper-2-lch'), 3: token('--paper-3-lch'), 4: token('--paper-4-lch') },
        ink: { DEFAULT: token('--ink-lch'), 2: token('--ink-2-lch'), 3: token('--ink-3-lch') },
        accent: token('--accent-lch'),
        // brand names kept for existing markup; all map onto tokens
        night: token('--paper-lch'),
        glass: token('--paper-3-lch'),
        backblue: token('--paper-3-lch'),
        lavender: token('--ink-2-lch'),
        ice: token('--ice-lch'),
        lightblue: token('--ice-lch'),
        frost: token('--frost-lch'),
        ember: token('--accent-lch'),
        success: token('--success-lch'),
        danger: token('--danger-lch'),
        gold: token('--warning-lch'),
        rival: { kenn: '#ffb3b3', gramin: '#ffd27d', lenya: '#c9a0ff', masr: '#7ee0ff' }, // data colors (rivals.yaml)
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      transitionTimingFunction: {
        brand: 'var(--ease-out)',
      },
      zIndex: { nav: '40', menu: '50', modal: '60' },
    },
  },
  plugins: [],
};
