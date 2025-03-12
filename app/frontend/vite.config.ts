import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
            include: ["util"],
            // Whether to polyfill specific globals.
            globals: {
                Buffer: false, // can also be 'build', 'dev', or false
                global: false,
                process: true
            }
        })
    ],
    build: {
        outDir: "../backend/static",
        emptyOutDir: true,
        sourcemap: true
    },
    resolve: {
        preserveSymlinks: true,
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    server: {
        proxy: {
            "/realtime": {
                target: "ws://localhost:8765",
                ws: true,
                rewriteWsOrigin: true
            }
        }
    },
    assetsInclude: ["src/assets/**/*"]
});
