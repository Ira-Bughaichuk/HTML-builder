const path = require('path');
const fs = require('fs').promises;

const directoryPath = path.join(__dirname, './secret-folder'); //отримати імена всіх файлів у вказаному каталозі.

async function readDirectory() {
  try {
    const files = await fs.readdir(directoryPath, { withFileTypes: true });
    for (const file of files) {
      const fileName = file.name;
      const isFile = file.isDirectory(); // чи є об'єкт файлом.
      if (!isFile) {
        const typeFile = path.extname(fileName); //розширення файлу
        const filePath = path.join(directoryPath, fileName);

        getStats(filePath, fileName, typeFile);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
async function getStats(filePath, fileName, typeFile) {
  try {
    const fileStats = await fs.stat(filePath);
    const sizeStats = fileStats.size / 1000;
    // console.log(`File ${fileName} and its expansion ${typeFile} has stats: ${JSON.stringify(fileStats, null, 2)}`);
    console.log(`${fileName} - ${typeFile} - ${sizeStats}kb`);
  } catch (err) {
    console.error(`Error getting stats for file ${fileName}: ${err}`);
  }
}

readDirectory();
