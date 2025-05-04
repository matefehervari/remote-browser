import { rollup } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

async function buildServiceWorker() {
  const bundle = await rollup({
    input: 'src/background/service-worker.ts',
    plugins: [typescript({
        tsconfig: './tsconfig.app.json'
    }),
    nodeResolve()],
  });

  await bundle.write({
    file: 'build/service-worker.js',
    format: 'iife',
  });

  await bundle.close();
}

buildServiceWorker();
