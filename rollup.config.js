import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'src/index.js',
    format: 'umd',
    moduleName: 'Revuejs',
    dest: 'dist/index.js',
    plugins: [
        resolve({
            customResolveOptions: 'node_modules',
            jsnext: true,
            main: true
        }),
        commonjs({
            namedExports: {

            }
        }),
        babel({
            exclude: 'node_modules/**',
            externalHelpers: false,
            babelrc: false,
            runtimeHelpers: true,
            presets: [
                [
                    'es2015',
                    {
                        'modules': false
                    }
                ]
            ],
            plugins: ['transform-runtime']
        }),
        cleanup()
    ]
};
