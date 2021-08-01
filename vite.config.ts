import reactRefresh from '@vitejs/plugin-react-refresh';
import { UserConfig, ConfigEnv } from "vite";
import commonjsExternals from "vite-plugin-commonjs-externals";

const externals = [
  /^electron(\/.+)?$/,
  "fs"
];

export default ({ command }: ConfigEnv): UserConfig => {
  if (command === "serve") {
    return {
      root: "src/renderer",
      plugins: [
        reactRefresh(),
        commonjsExternals({ externals })
      ],
      server: {
        port: process.env.PORT === undefined ? 3000 : +process.env.PORT,
      }
    };
  } else {
    return {
      root: "src/renderer",
      base: "",
      build: {
        outDir: `${__dirname}/build/renderer`,
        assetsDir: "",
        sourcemap: true,
        minify: false
      }
    };
  }
};
