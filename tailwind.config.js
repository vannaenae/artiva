/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        artiva: {
          teal: {
            DEFAULT: '#16858F',
            dark: '#0E5B62',
            light: '#E6F4F5',
            hover: '#126C74',
            50: '#F2F9F9',
            100: '#E6F4F5',
            500: '#16858F',
            600: '#126C74',
            700: '#0E5B62',
            800: '#0B474D',
            900: '#072E32',
          },
          gold: {
            DEFAULT: '#F59E0B',
            dark: '#D97706',
            light: '#FEF3C7',
            50: '#FFFBEB',
            100: '#FEF3C7',
            500: '#F59E0B',
            600: '#D97706',
          },
          green: {
            DEFAULT: '#10B981',
            dark: '#059669',
            light: '#D1FAE5',
          },
          slate: {
            900: '#0F172A',
            800: '#1E293B',
            700: '#334155',
            600: '#475569',
            500: '#64748B',
            100: '#F1F5F9',
            50: '#F8FAFC',
          }
        }
      },
      boxShadow: {
        'artiva-sm': '0 1px 3px rgba(22, 133, 143, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'artiva-md': '0 4px 12px rgba(22, 133, 143, 0.12), 0 2px 4px rgba(15, 23, 42, 0.06)',
        'artiva-lg': '0 12px 24px rgba(22, 133, 143, 0.15), 0 4px 8px rgba(15, 23, 42, 0.08)',
        'artiva-glow': '0 0 20px rgba(22, 133, 143, 0.25)',
      },
      borderRadius: {
        'artiva': '12px',
        'artiva-lg': '16px',
        'artiva-pill': '9999px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        badgePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'badge-pulse': 'badgePulse 2s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
