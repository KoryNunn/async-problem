'use strict';

const fs            = require('fs');

const LazyEither    = require('lazy-either');
const S             = require('sanctuary');

const exit0         = require('./common/exit0');
const exit1         = require('./common/exit1');
const join          = require('./common/join');


//    Array$traverse :: Applicative f => TypeRep f -> (a -> f b) -> Array a -> f (Array b)
//
//    We cannot use S.traverse because LazyEither does not currently support
//    recent versions of the Fantasy Land specification. It's thus necessary
//    to dispatch to `map` and `ap` (rather than their prefixed equivalents).
const Array$traverse = S.curry3((typeRep, f, xs) => {
  function go(idx, n) {
    const g = m => go(idx, m).map(S.concat).ap(go(idx + m, n - m));
    return n === 0 ? typeRep.of([]) :
           n === 2 ? f(xs[idx]).map(x => y => [x, y]).ap(f(xs[idx + 1])) :
                     g(Math.floor(n / 4) * 2);
  }
  const len = xs.length;
  return len % 2 === 1 ? f(xs[0]).map(x => S.concat([x])).ap(go(1, len - 1))
                       : go(0, len);
});

//    readFile :: String -> String -> LazyEither Error String
const readFile = filename =>
  new LazyEither(resolve => {
    fs.readFile(filename, {encoding: 'utf8'}, (err, data) =>
      resolve(err == null ? S.Right(data) : S.Left(err))
    );
  });

//    concatFiles :: (String -> String) -> LazyEither Error String
const concatFiles = path =>
  readFile(path('index.txt'))
  .map(S.lines)
  .map(S.map(path))
  .chain(Array$traverse(LazyEither, readFile))
  .map(S.joinWith(''));


const main = () => {
  concatFiles(join(process.argv[2]))
  .value(e => { e.isRight ? exit0(e.value) : exit1(e.value); });
};

if (process.mainModule.filename === __filename) main();
