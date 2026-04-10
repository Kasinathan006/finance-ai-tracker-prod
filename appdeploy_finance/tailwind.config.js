/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        { pattern: /bg-(cyan|emerald|red|purple)-500\/10/ },
        { pattern: /text-(cyan|emerald|red|purple)-400/ },
        { pattern: /bg-(cyan|emerald|red|purple)-500\/5/ },
        { pattern: /bg-(cyan|emerald|red|purple)-500\/10/ },
    ],
    theme: {
        extend: {
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
