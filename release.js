import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import crypto from 'crypto';
const { format } = require('date-fns');  

const args = process.argv.slice(2);
const [version, outDir, zipName] = args;

const pluginData = yaml.load(fs.readFileSync('set-image-pornpics.yml', 'utf8'));

const zipData = fs.readFileSync(zipName);
const sha256Hash = crypto.createHash('sha256').update(zipData).digest('hex');
const formattedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

const manifestData = {
  id: pluginData.id,
  name: pluginData.name,
  version,
  date: formattedDate,
  path: `https://github.com/${process.env.GITHUB_REPOSITORY}/releases/download/v${version}/${zipName}`,
  sha256: sha256Hash
};

const outputYaml = yaml.dump(manifestData);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'plugin.yaml'), outputYaml);

console.log('Manifest file generated:', path.join(outDir, 'plugin.yaml'));