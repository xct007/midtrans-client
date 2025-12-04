import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.ts"],
	treeshake: true,
	keepNames: true,
	splitting: false,
	clean: true,
	bundle: true,
	experimentalDts: true,
	target: "es2019",
	format: ["cjs", "esm"],
	skipNodeModulesBundle: true,
	esbuildPlugins: [
		esbuildPluginFilePathExtensions({
			cjsExtension: "js",
			esmExtension: "mjs",
		}),
	],
});
