import record from "../record/behave";
import {reduced} from "../reduced/construct";
import {effect} from '../../core';
import {implement} from '../protocol';
import {IComparable} from '../../protocols';

function compare(a, b){
  return IEquiv.equiv(a, b) ? 0 : IReduce.reduce(IMap.keys(a), function(memo, key){
    const x = ILookup.lookup(a, key), y = ILookup.lookup(b, key);
    return memo ? x == y || x > y : reduced(memo);
  }, true) ? 1 : -1;
}

export default effect(
  record,
  implement(IComparable, {compare}));