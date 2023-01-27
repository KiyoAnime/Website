import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	mode: 'jit',
	server: { port: 3000 },
	plugins: [solidPlugin(), tsconfigPaths()],
	build: {
		outDir: 'build',
		target: 'esnext',
		chunkSizeWarningLimit: 1000
	}
});
