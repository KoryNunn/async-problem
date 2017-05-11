'use strict';

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');
const readFile      = require('./common/read-file-promise');
const S             = require('./common/sanctuary');


async function main() {
  const readFileRel = S.compose(readFile, join(process.argv[2]));
  let index;
  try {
    index = await readFileRel('index.txt');
  } catch (err) {
    exit1(err);
  }
  Promise.all(S.map(readFileRel, S.lines(index)))
  .then(S.joinWith(''))
  .then(exit0, exit1);
}

if (process.mainModule.filename === __filename) main();
