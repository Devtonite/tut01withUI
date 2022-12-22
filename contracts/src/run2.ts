import { isReady, shutdown } from 'snarkyjs';
import { tic, toc } from './tictoc.js';
import { RpsGame } from './Rps.js';
import fs from 'fs';

await isReady;

// const rock = UInt32.from(0)
// const paper = UInt32.from(1)
// const scissors = UInt32.from(2)

tic('compiling');
const compileJSON = await RpsGame.compile();
fs.writeFileSync('compileJSON.json', JSON.stringify(compileJSON));
toc();

console.log('original val before write:');
console.log(compileJSON);
console.log(JSON.stringify(compileJSON));

let rawData = fs.readFileSync('compileJSON.json');
let readCompileJSON = JSON.parse(rawData.toString());

console.log('read val after write:');
console.log(rawData);
console.log(readCompileJSON);

await shutdown();
