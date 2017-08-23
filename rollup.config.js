import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';

export default {
    entry: 'src/index.js',
    format: 'umd',
    moduleName: 'revuejs',
    dest: 'dist/index.js',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            externalHelpers: false,
            babelrc: false,
            presets: [
                [
                    'es2015',
                    {
                        'modules': false
                    }
                ]
            ]
        }),
        cleanup()
    ]
};
