import Aspectable from './construct';
import {implement} from '../../protocol';
import {effect} from '../../core';
import {IFn, ILookup, IAssociative} from '../../protocols';

export default function provideBehavior(pipeline, compile){

  function invoke(self, ...args){
    return compile(pipeline(self.how, [compile(self.before), self.exec, compile(self.after)]))(...args)
  }

  function lookup(self, key){
    switch (key) {
      case "before":
        return self.before;
      case "after":
        return self.after;
    }
  }

  function assoc(self, key, value){
    switch (key) {
      case "before":
        return new Aspectable(self.how, self.exec, value, self.after);
      case "after":
        return new Aspectable(self.how, self.exec, self.before, value);
      default:
        return self;
    }
  }

  return effect(
    implement(ILookup, {lookup}),
    implement(IAssociative, {assoc}),
    implement(IFn, {invoke}));
}