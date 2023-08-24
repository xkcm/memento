import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import del from "rollup-plugin-delete";

import pkg from "./package.json" assert { type: "json" };

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.exports.import,
        format: "es",
        exports: "named",
      },
      {
        file: pkg.exports.require,
        format: "cjs"
      }
    ],
    plugins: [
      typescript({
        tsconfig: "tsconfig.build.json",
        compilerOptions: {
          declaration: true,
          declarationDir: "dts"
        }
      }),
      terser()
    ],
    external: ["uuid", "sha256", "@xkcm/better-errors"],
  },
  {
    input: "lib/dts/index.d.ts",
    output: {
      file: pkg.exports.types
    },
    plugins: [
      dts(),
      del({ targets: "lib/dts", hook: "buildEnd" })
    ],
  }
];

export default config;