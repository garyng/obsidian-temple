import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";

let notesDir = "notes/.obsidian/plugins/obsidian-temple/";
let distDir = "dist/";
let outputConfig = {
  sourcemap: "inline",
  format: "cjs",
  exports: "default",
};

export default {
  input: "src/main.ts",
  output: [
    {
      dir: distDir,
      ...outputConfig,
    },
    {
      dir: notesDir,
      ...outputConfig,
    }
  ],
  external: ["obsidian"],
  plugins: [
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    copy({
      copyOnce: false,
      targets: [
        { src: "src/styles.css", dest: [distDir, notesDir] },
        { src: "manifest.json", dest: [distDir, notesDir] },
      ],
    }),
  ],
};
