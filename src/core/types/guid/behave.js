import {does} from '../../core';
import {implement} from '../protocol';
import {IEncode, IEquiv, IAssociative} from '../../protocols';
import {Symbol} from '../symbol/construct';

function equiv(self, other){
  return other && other.constructor === self.constructor && self.id === other.id;
}

function encode(self, label){
  return IAssociative.assoc({data: Object.assign({}, self)}, label, self[Symbol.toStringTag]);
}

export const behaveAsGuid = does(
  implement(IEquiv, {equiv}),
  implement(IEncode, {encode}));