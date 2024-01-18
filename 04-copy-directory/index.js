const fs = require('fs').promises;
const path = require('path');

async function copyFileSync(source, target) {
  const data = await fs.readFile(source);
  await fs.writeFile(target, data);
}

async function copyFolderAsync(source, target) {
  try {
    await fs.mkdir(target);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }

  const files = await fs.readdir(source);

  for (const file of files) {
    const currentSource = path.join(source, file);
    const currentTarget = path.join(target, file);

    const stats = await fs.stat(currentSource);

    if (stats.isDirectory()) {
      await copyFolderAsync(currentSource, currentTarget);
    } else {
      await copyFileSync(currentSource, currentTarget);
    }
  }
}

async function main() {
  const sourcePath = path.join(__dirname, 'files');
  const destinationPath = path.join(__dirname, 'copy-files');

  try {
    await copyFolderAsync(sourcePath, destinationPath);
    console.log('Folder copied successfully!');
  } catch (err) {
    console.error(`Error copying folder: ${err}`);
  }
}

main();
