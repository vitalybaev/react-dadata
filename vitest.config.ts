import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: ["./setupTests.ts"],
		coverage: {
			reporter: ["text", "json", "clover", "lcov"],
			include: ["src/"],
			exclude: ["**/__tests__/**/*.*"],
		},
    css: true,
	},
});
