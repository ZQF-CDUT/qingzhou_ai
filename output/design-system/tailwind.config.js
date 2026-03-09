/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
  "primary": {
    "main": "#06b6d4",
    "light": "#22d3ee",
    "dark": "#0891b2",
    "contrast": "#ffffff"
  },
  "secondary": {
    "main": "#64748b",
    "light": "#94a3b8",
    "dark": "#475569"
  },
  "background": {
    "default": "#f1f5f9",
    "paper": "#ffffff",
    "dark": "#1e293b",
    "darker": "#0f172a"
  },
  "text": {
    "primary": "#1e293b",
    "secondary": "#64748b",
    "disabled": "#cbd5e1",
    "inverse": "#ffffff"
  },
  "border": {
    "default": "#e2e8f0",
    "light": "#f1f5f9",
    "dark": "#334155"
  },
  "functional": {
    "success": "#22c55e",
    "warning": "#f59e0b",
    "error": "#ef4444",
    "info": "#3b82f6"
  }
},
      borderRadius: {
  "none": "0",
  "sm": "0.125rem",
  "DEFAULT": "0.25rem",
  "md": "0.375rem",
  "lg": "0.5rem",
  "xl": "0.75rem",
  "2xl": "1rem",
  "full": "9999px"
},
      fontSize: {
  "xs": [
    "0.75rem",
    {
      "lineHeight": "1rem"
    }
  ],
  "sm": [
    "0.875rem",
    {
      "lineHeight": "1.25rem"
    }
  ],
  "base": [
    "1rem",
    {
      "lineHeight": "1.5rem"
    }
  ],
  "lg": [
    "1.125rem",
    {
      "lineHeight": "1.75rem"
    }
  ],
  "xl": [
    "1.25rem",
    {
      "lineHeight": "1.75rem"
    }
  ],
  "2xl": [
    "1.5rem",
    {
      "lineHeight": "2rem"
    }
  ],
  "3xl": [
    "1.875rem",
    {
      "lineHeight": "2.25rem"
    }
  ],
  "4xl": [
    "2.25rem",
    {
      "lineHeight": "2.5rem"
    }
  ]
},
      fontWeight: designSpec.typography.fontWeight,
      letterSpacing: designSpec.typography.letterSpacing,
      spacing: designSpec.spacing.spacing,
      gap: designSpec.spacing.gap,
      boxShadow: {
  "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  "DEFAULT": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  "inner": "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"
},
      fontFamily: designSpec.typography.fontFamily,
    },
  },
  plugins: [require("tailwindcss-animate")],
}