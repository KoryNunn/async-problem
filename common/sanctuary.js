'use strict';

const Future        = require('fluture');
const S             = require('sanctuary');
const $             = require('sanctuary-def');


//    FutureType :: Type -> Type -> Type
const FutureType = $.BinaryType(
  Future.name,
  'https://github.com/fluture-js/Fluture',
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
  env: S.env.concat([FutureType($.Unknown, $.Unknown), PromiseType]),
});
