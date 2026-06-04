import {defineConfig} from "vite";

// Dev harness: serves the preview/ app for working on gamutt itself.
export default defineConfig({
    root: "preview/",
    server: {
        host: "0.0.0.0",
        port: 5173,
    },
});
