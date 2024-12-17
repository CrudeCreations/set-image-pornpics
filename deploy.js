import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import ncp from 'ncp';
import { rimraf } from 'rimraf';

// Fix import naming from ESModule behaviour
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set ncp to use a small concurrency to speed up copying
ncp.ncp.limit = 16;

function clearFolder(folderPath) {
    return new Promise((resolve, reject) => {
        rimraf(folderPath).then(() => {
            fs.mkdir(folderPath, { recursive: true }, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function copyFiles(src, dest) {
    return new Promise((resolve, reject) => {
        ncp.ncp(src, dest, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

async function deploy(destinationFolder) {
    try {
        const distFolder = path.join(__dirname, 'dist');
        await clearFolder(destinationFolder);
        console.log('Destination folder cleared.');

        await copyFiles(path.join(__dirname, 'plugin'), path.join(distFolder, 'plugin'));
        console.log('Plugin folder copied successfully.');

        await copyFiles(path.join(__dirname, 'set-image-pornpics.yml'), path.join(distFolder, 'set-image-pornpics.yml'));
        console.log('set-image-pornpics.yml copied successfully.');

        await copyFiles(path.join(__dirname, 'src', 'main.css'), path.join(distFolder, 'main.css'));
        console.log('main.css copied successfully.');

        await copyFiles(distFolder, destinationFolder);
        console.log('Dist folder copied successfully.');

        console.log('Deployment complete.');
    } catch (err) {
        console.error('Error during deployment:', err);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error('Usage: node deploy.js <destination_folder>');
    process.exit(1);
}
const destinationFolder = path.resolve(args[0]);
deploy(destinationFolder);
