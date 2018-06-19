import {constantly, effect, identity} from '../../core';
import {implement} from '../protocol';
import {IEncode, IDecode, IConverse, IComparable} from '../../protocols';

function compare(self, other){
  return self === other ? 0 : self === true ? 1 : -1;
}

function converse(self){
  return !self;
}

export default effect(
  implement(IDecode, {decode: identity}),
  implement(IEncode, {encode: identity}),
  implement(IComparable, {compare}),
  implement(IConverse, {converse}));