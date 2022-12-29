/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			lineClamp: {
				7: '7',
			}
		},
	},
	plugins: [
		require('@tailwindcss/line-clamp')
	],
}
