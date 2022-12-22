import fs from 'fs';

export { saveProof, readProof };

function saveProof(item: any, name: string) {
  fs.writeFileSync(name + '.json', JSON.stringify(item));
}

function readProof(filename: string): JSON {
  let rawData = fs.readFileSync(`${filename}.json`);
  return JSON.parse(rawData.toString());
}
