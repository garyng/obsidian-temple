import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

let distDir = "notes/.obsidian/plugins/obsidian-temple/"

export default {
  input: "src/main.ts",
  output: {
    dir: distDir,
    sourcemap: "inline",
    format: "cjs",
    exports: "default",
  },
  external: ["obsidian"],
  plugins: [
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    copy({
      copyOnce: false,
      targets: [
        { src: "src/styles.css", dest: distDir },
        { src: "manifest.json", dest: distDir },
      ],
    }),
  ],
};
