
const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');


const filePath = path.join(__dirname, 'text.txt');
const writeableStream = fs.createWriteStream(filePath);

const wr = readline.createInterface(process.stdin, process.stdout);

wr.setPrompt('Hello, it is new text !');
wr.prompt();

wr.on('line', (input) => {
    if (!input.includes('exit')) {
        writeableStream.write(`${input}\n`);
    } else {
        rl.close()
    }
});

wr.on('close', () => {
    console.log('\nWriting finished');
});


