'use strict';

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');
const readFile      = require('./common/read-file-promise');
const S             = require('./common/sanctuary');


async function main() {
  const readFileRelative = S.compose(readFile, join(process.argv[2]));
  let index;
  try {
    index = await readFileRelative('index.txt');
  } catch (err) {
    exit1(err);
  }
  Promise.all(S.map(readFileRelative, S.lines(index)))
  .then(S.joinWith(''))
  .then(exit0, exit1);
}

if (process.mainModule.filename === __filename) main();
