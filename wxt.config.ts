import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-solid", "@wxt-dev/i18n/module"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    permissions: ["storage"],
    optional_permissions: ["bookmarks"],
    action: {},
    default_locale: "en",
  },
  srcDir: "src",
  outDir: "dist",
  publicDir: "static",
});
