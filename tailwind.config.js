/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			lineClamp: { 7: '7' },
			colors: {
				primary: 'var(--primary-color)',
				secondary: 'var(--secondary-color)',
				background: 'var(--background-color)'
			}
		},
	},
	plugins: [
		require('@tailwindcss/line-clamp')
	],
}
