// https://vitejs.dev/config/
export default {
  server: {
    port: 8080,
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'h.fragment',
    jsxInject: "import { h } from '/src/jsx'",
  },
};
