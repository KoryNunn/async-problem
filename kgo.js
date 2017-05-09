'use strict';

/* eslint func-call-spacing: "off", no-unexpected-multiline: "off" */

const foreign       = require('foreign');
const kgo           = require('kgo');
const S             = require('sanctuary');

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');
const readFile      = require('./common/read-file-callback');


const main = () => {
  const path = join(process.argv[2]);

  kgo
  ('index', readFile(path('index.txt')))
  ('filePaths', ['index'], kgo.sync(S.compose(S.map(path), S.lines)))
  ('files', ['filePaths'], S.curry3(foreign.parallel, readFile))
  ('concated', ['files'], kgo.sync(S.joinWith('')))
  (['concated'], exit0)
  (['*'], exit1);
};

if (process.mainModule.filename === __filename) main();
