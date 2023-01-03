/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			lineClamp: { 7: '7' },
			zIndex: { 1: '1', 2: '2', 3: '3' },
			colors: {
				primary: 'var(--primary-color)',
				secondary: 'var(--secondary-color)',
				background: 'var(--background-color)',
				'accent-blue': 'var(--accent-color-blue)',
				'accent-pink': 'var(--accent-color-pink)'
			}
		},
	},
	plugins: [
		require('@tailwindcss/line-clamp')
	],
}
