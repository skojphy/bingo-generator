import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		// vitest는 src/ 내부의 .test.ts/.spec.ts만 실행 (E2E는 절대 실행 X)
		include: [
			"src/**/*.test.ts",
			"src/**/*.spec.ts"
		]
	},
});
