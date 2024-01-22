const fs = require('fs').promises;
const path = require('path');

async function copyFolderAsync(source, target) {
    try {
        await fs.mkdir(target, { recursive: true });

        const files = await fs.readdir(source);

        for (const file of files) {
            const currentSource = path.join(source, file);
            const currentTarget = path.join(target, file);

            const stats = await fs.stat(currentSource);

            if (stats.isDirectory()) {
                await copyFolderAsync(currentSource, currentTarget);
            } else {
                await fs.copyFile(currentSource, currentTarget);
            }
        }
    } catch (err) {
        throw err;
    }
}

async function buildPage() {
    try {
        const distDir = 'project-dist';
        await fs.mkdir(distDir, { recursive: true });

        const sourcePath = path.join(__dirname, 'assets');
        const destinationPath = path.join(__dirname, 'project-dist', 'assets');
        await copyFolderAsync(sourcePath, destinationPath);
        console.log('Folder copied successfully!');

        const stylesPath = path.join(__dirname, 'styles');
        const styleFiles = await fs.readdir(stylesPath);
        const styleContent = await Promise.all(styleFiles.map(async file => {
            const filePath = path.join(stylesPath, file);
            return await fs.readFile(filePath, 'utf-8');
        }));
        const styleDestinationPath = path.join(__dirname, 'project-dist', 'style.css');
        await fs.writeFile(styleDestinationPath, styleContent.join(''));

        const templatePath = path.join(__dirname, 'template.html');
        let templateContent = await fs.readFile(templatePath, 'utf-8');

        const regex = /{{(.*?)}}/g;
        const matches = templateContent.match(regex);

        if (matches) {
            await Promise.all(matches.map(async match => {
                const componentName = match.replace(/[{}]/g, '');
                const componentPath = path.join(__dirname, 'components', `${componentName}.html`);

                try {
                    const componentContent = await fs.readFile(componentPath, 'utf-8');
                    templateContent = templateContent.replace(new RegExp(`{{${componentName}}}`, 'g'), componentContent);
                } catch (error) {
                    console.error(`Помилка читання компоненту ${componentName}: ${error}`);
                }
            }));
        }

        const indexPath = path.join(__dirname, 'project-dist', 'index.html');
        await fs.writeFile(indexPath, templateContent, 'utf-8');
        console.log('HTML-сторінка створена успішно.');
    } catch (error) {
        console.error('Помилка:', error);
    }
}

buildPage();
//=================================

// async function copyFolderAsync(source, target) {
//     try {
//         // Перевіряємо наявність папки target перед створенням
//         await fs.mkdir(target, { recursive: true });

//         const files = await fs.readdir(source);

//         for (const file of files) {
//             const currentSource = path.join(source, file);
//             const currentTarget = path.join(target, file);

//             const stats = await fs.stat(currentSource);

//             if (stats.isDirectory()) {
//                 await copyFolderAsync(currentSource, currentTarget);
//             } else {
//                 // Використовуємо fs.promises.copyFile для копіювання файлів
//                 await fs.copyFile(currentSource, currentTarget);
//             }
//         }
//     } catch (err) {
//         throw err;
//     }
// }

// async function buildPage() {
//     try {
//         // Створюємо папку project-dist
//         const distDir = 'project-dist';
//         await fs.mkdir(distDir, { recursive: true });

//         // Копіюємо папку assets у project-dist
//         const sourcePath = path.join(__dirname, 'assets');
//         const destinationPath = path.join(__dirname, 'project-dist', 'assets');
//         await copyFolderAsync(sourcePath, destinationPath);
//         console.log('Folder copied successfully!');

//         // Компілюємо стилі з styles папки в один файл і розміщуємо його в project-dist/style.css
//         const stylesPath = path.join(__dirname, 'styles');
//         const styleFiles = await fs.readdir(stylesPath);
//         const styleContent = await Promise.all(styleFiles.map(async file => {
//             const filePath = path.join(stylesPath, file);
//             return await fs.readFile(filePath, 'utf-8');
//         }));
//         const styleDestinationPath = path.join(__dirname, 'project-dist', 'style.css');
//         await fs.writeFile(styleDestinationPath, styleContent.join(''));

//         // Читаємо та зберігаємо вміст шаблону
//         const templatePath = path.join(__dirname, 'template.html');
//         let templateContent = await fs.readFile(templatePath, 'utf-8');

//         // Замінюємо шаблонні теги вмістом компонентних файлів
//         const regex = /{{(.*?)}}/g;
//         const matches = templateContent.match(regex);

//         if (matches) {
//             await Promise.all(matches.map(async match => {
//                 const componentName = match.replace(/[{}]/g, '');
//                 const componentPath = path.join(__dirname, 'components', `${componentName}.html`);
//                 const componentContent = await fs.readFile(componentPath, 'utf-8');
//                 templateContent = templateContent.replace(new RegExp(`{{${componentName}}}`, 'g'), componentContent);
//             }));
//         }

//         // Записуємо змінений шаблон у index.html файл у папці project-dist
//         const indexPath = path.join(__dirname, 'project-dist', 'index.html');
//         await fs.writeFile(indexPath, templateContent, 'utf-8');
//         console.log('HTML-сторінка створена успішно.');
//     } catch (error) {
//         console.error('Помилка:', error);
//     }
// }

// // Викликаємо функцію buildPage()
// buildPage();

