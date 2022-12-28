import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	mode: 'jit',
	plugins: [solidPlugin(), tsconfigPaths()],
	server: {
		port: 3000,
	},
	build: {
		target: 'esnext',
	},
});
