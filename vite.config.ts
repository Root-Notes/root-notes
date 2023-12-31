import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";
import Unfonts from "unplugin-fonts/vite";
import svgr from "vite-plugin-svgr";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr(),
        electron({
            main: {
                // Shortcut of `build.lib.entry`.
                entry: "electron/main.ts",
            },
            preload: {
                // Shortcut of `build.rollupOptions.input`.
                // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
                input: path.join(__dirname, "electron/preload.ts"),
            },
            // Ployfill the Electron and Node.js built-in modules for Renderer process.
            // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
            renderer: {},
        }),
        Unfonts({
            google: {
                families: [
                    {
                        name: "Roboto",
                        styles: "wght@100;300;400;500;700;900",
                    },
                    {
                        name: "Roboto Mono",
                        styles: "wght@100;300;400;500;700;900",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@root-notes/common": fileURLToPath(
                new URL("../common/@root-notes/common/src", import.meta.url)
            ),
            "@root-notes/root-doc": fileURLToPath(
                new URL("../root-doc/root-doc/src", import.meta.url)
            ),
        },
    },
});
