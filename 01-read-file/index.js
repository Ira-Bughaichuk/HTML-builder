const fs = require('fs');
const path = require('path');

const rr = fs.createReadStream(path.join(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});
rr.on('data', (chunk) => {
  console.log(chunk.toString());
});

rr.on('error', (err) => {
  console.error(`Error reading file: ${err}`);
});

rr.on('end', () => {
  console.log('Reading finished');
});

// 1- variant
/*fs.readFile(path.join(__dirname, 'text.txt'), 'utf-8', (err, data) => {
    if(err) throw err;
    console.log(data);
})

// Обробка неперехоплених виключень (uncaughtExceptions)
process.on('uncaughtException', err => {
    console.error(`Uncaught Exception: ${err}`);
    process.exit(1);
});
*/
