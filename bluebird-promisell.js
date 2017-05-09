'use strict';

/* eslint func-call-spacing: "off", no-unexpected-multiline: "off" */

const P             = require('bluebird-promisell');

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');
const readFile      = require('./common/read-file-promise');
const S             = require('./common/sanctuary');


//    concatFiles :: (String -> String) -> Promise Error String
const concatFiles = path =>
  P.liftp1(S.joinWith(''))
          (P.liftp1(P.traversep(S.compose(readFile, path)))
                   (P.liftp1(S.lines)
                            (readFile(path('index.txt')))));


const main = () => {
  concatFiles(join(process.argv[2])).then(exit0, exit1);
};

if (process.mainModule.filename === __filename) main();
