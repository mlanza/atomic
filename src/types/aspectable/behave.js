import Aspectable from './construct';
import {implement} from '../../protocol';
import {effect} from '../../core';
import {IFn, ILookup, IAssociative, IAppendable, IPrependable} from '../../protocols';

export default function provideBehavior(pipeline, compile, update){

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

  function prepend(self, advice){
    return update(self, "before", function(pipeline){
      return IPrependable.prend(pipeline, advice);
    });
  }

  function append(self, advice){
    return update(self, "after", function(pipeline){
      return IAppendable.append(pipeline, advice);
    });
  }

  return effect(
    implement(ILookup, {lookup}),
    implement(IAssociative, {assoc}),
    implement(IPrependable, {prepend}),
    implement(IAppendable, {append}),
    implement(IFn, {invoke}));
}