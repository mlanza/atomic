import Aspectable from './construct';
import {implement} from '../../protocol';
import {effect} from '../../core';
import {IFn, ILookup, IAssociative} from '../../protocols';

export default function provideBehavior(pipeline, compile){

  function invoke(self, ...args){
    return compile(pipeline(self.how, [compile(self.pre), self.exec, compile(self.post)]))(...args)
  }

  function lookup(self, key){
    switch (key) {
      case "pre":
        return self.pre;
      case "post":
        return self.post;
    }
  }

  function assoc(self, key, value){
    switch (key) {
      case "pre":
        return new Aspectable(self.how, self.exec, value, self.post);
      case "post":
        return new Aspectable(self.how, self.exec, self.pre, value);
      default:
        return self;
    }
  }

  return effect(
    implement(ILookup, {lookup}),
    implement(IAssociative, {assoc}),
    implement(IFn, {invoke}));
}