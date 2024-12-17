import esbuild from 'esbuild';
import { exec } from 'child_process';

console.log("Starting build...")

let ctx = await esbuild
    .context({
        entryPoints: ['./src/index.tsx'],
        bundle: process.argv.includes('--bundle'),
        outfile: './dist/index.js',
        platform: 'browser',
        target: 'es2020',
        sourcemap: process.argv.includes('--sourcemap'),
        minify: process.argv.includes('--minify'),
        loader: {
            '.ts': 'ts',
            '.tsx': 'tsx',
            '.css': 'text',
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        plugins: [{
            name: 'deploy-copy',
            setup(build) {
                build.onEnd(_ => {
                    exec('npm run deploy:copy', (err, stdout, stderr) => {
                        if (err) {
                            console.error('Error running deploy:copy:', err);
                        } else {
                            console.log('deploy:copy output:', stdout);
                            if (stderr) console.error(stderr);
                        }
                    });
                });
            },
        }]
    });

if (process.argv.includes('--watch')) {
    await ctx.watch();
} else {
    await ctx.rebuild();
    await ctx.dispose();
}
