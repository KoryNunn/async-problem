'use strict';

const fs            = require('fs');

const righto        = require('righto');
const S             = require('sanctuary');

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');


//    readFile :: String -> Righto String
const readFile = S.curry3(righto, fs.readFile, S.__, {encoding: 'utf8'});

//    concatFiles :: (String -> String) -> Righto String
const concatFiles = path =>
  righto.sync(S.joinWith(''),
              righto.all(righto.sync(S.pipe([S.lines,
                                             S.map(path),
                                             S.map(readFile)]),
                                     readFile(path('index.txt')))));


const main = () => {
  concatFiles(join(process.argv[2]))((err, data) => {
    if (err == null) exit0(data); else exit1(err);
  });
};

if (process.mainModule.filename === __filename) main();
