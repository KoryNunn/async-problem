'use strict';

const fs = require('fs');
const path = require('path');

const righto = require('righto');
const R = require('ramda');
const S = require('sanctuary');


// join :: String -> String -> String
const join = R.curryN(2, path.join);

// data Text = Buffer | String
// readFile :: String -> String -> ((Error?, Text?) -> Unit) -> Unit
const readFile = R.curry((encoding, filename, callback) => {
  fs.readFile(filename, {encoding: encoding}, callback);
});


const main = () => {
  const dir = process.argv[2];

  const getFile = righto(readFile('utf8', join(dir, 'index.txt')));
  const getPaths = righto.sync(S.compose(R.map(join(dir)), S.lines), getFile);
  const getFiles = righto.all(righto.sync(R.map(path => righto(readFile('utf8', path))), getPaths));
  const getConcated = righto.sync(R.join(''), getFiles);

  getConcated((error, data) => {
    if(error){
      process.stderr.write(String(error) + '\n');
      process.exit(1);
    }else{
      process.stdout.write(data);
      process.exit(0);
    }
  });
};

if (process.argv[1] === __filename) main();
