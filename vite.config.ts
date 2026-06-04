import {defineConfig} from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./test/setup.ts",
    },
    build: {
        lib: {
            entry: "src/index.tsx",
            name: "Gamutt",
            formats: ["es", "cjs"],
            fileName: (format) => `gamutt.${format}.js`,
            cssFileName: "gamutt",
        },
        rollupOptions: {
            external: [/^react($|\/)/, /^react-dom($|\/)/],
        },
    },
});
