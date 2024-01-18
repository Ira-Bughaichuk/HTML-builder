const path = require('path');
const fs = require('fs').promises;

//отримати імена всіх файлів у вказаному каталозі.
const directoryStyles = path.join(__dirname, './styles');
const directoryDist = path.join(__dirname, './project-dist', 'bundle.css');

async function readDirectory() {
  try {
    const files = await fs.readdir(directoryStyles, { withFileTypes: true });
    const dataArr = [];
    for (const file of files) {
      if (!file.isDirectory()) {
        // чи є об'єкт файлом.
        const typeFile = path.extname(file.name); //розширення файлу
        if (typeFile === '.css') {
          const data = await fs.readFile(path.join(directoryStyles, file.name));
          dataArr.push(data);
        }
      }
    }
    await createFile(dataArr.join(''));
  } catch (err) {
    console.error(err);
  }
}

async function createFile(content) {
  try {
    // Переконатися, що папка існує
    const directoryPath = path.dirname(directoryDist);
    await fs.mkdir(directoryPath, { recursive: true });

    // Записати вміст у файл
    await fs.writeFile(directoryDist, content);
    console.log(`File "${directoryDist}" created successfully!`);
  } catch (err) {
    console.error(`Error creating file: ${err}`);
  }
}

readDirectory();
