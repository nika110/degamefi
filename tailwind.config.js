// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        degamefi: {
          blue: {
            light: '#00A3E0',
            DEFAULT: '#0081B3',
            dark: '#006086',   // Darker blue for hover states
          },
          gray: {
            light: '#F5F5F5',  // Light gray for backgrounds
            DEFAULT: '#E0E0E0', // Default gray for borders
            dark: '#9E9E9E', 
            700: '#374151',
          800: '#1F2937',
          900: '#111827',  // Dark gray for text
          },
          white: '#FFFFFF',    // White for text and backgrounds
          black: '#000000',    // Black for text
        },
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'degamefi': '0 4px 6px -1px rgba(0, 129, 179, 0.1), 0 2px 4px -1px rgba(0, 129, 179, 0.06)',
      },
      borderRadius: {
        'degamefi': '0.5rem',
      },
    },
  },
  plugins: [],
};