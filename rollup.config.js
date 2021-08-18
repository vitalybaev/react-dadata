import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'];
export default {
  input: 'src/index.tsx',
  output: [
    { dir: 'output/cjs', format: 'cjs' },
    { dir: 'output/esm', format: 'esm' },
  ],
  plugins: [
    typescript(),
    // nodeResolve({ extensions }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      extensions,
    }),
  ],
};
