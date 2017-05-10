'use strict';

const Future        = require('fluture');
const S             = require('sanctuary');
const $             = require('sanctuary-def');


//    ConcurrentFutureType :: Type -> Type -> Type
const ConcurrentFutureType = $.BinaryType(
  Future.Par['@@type'],
  'https://github.com/fluture-js/Fluture#concurrentfuture',
  x => S.type(x) === Future.Par['@@type'],
  f => [],
  f => []
);

//    FutureType :: Type -> Type -> Type
const FutureType = $.BinaryType(
  Future.name,
  'https://github.com/fluture-js/Fluture#future',
  Future.isFuture,
  Future.extractLeft,
  Future.extractRight
);

//    PromiseType :: Type
const PromiseType = $.NullaryType(
  'async-problem/Promise',
  '',
  S.is(Promise)
);


module.exports = S.create({
  checkTypes: true,
  env: S.env.concat([
    ConcurrentFutureType($.Unknown, $.Unknown),
    FutureType($.Unknown, $.Unknown),
    PromiseType,
  ]),
});
