import {IAssociative, ILookup} from '../../protocols';
import {identity, constantly, effect} from '../../core';
import {implement} from '../protocol';

function lookup(self, ref){
  return self.get(ref);
}

function assoc(self, ref, value){
  self.set(ref, value);
  return self;
}

function contains(self, ref){
  return self.has(ref);
}

export default effect(
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}));