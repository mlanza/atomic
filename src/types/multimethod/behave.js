import {effect, constantly} from "../../core";
import {implement} from '../protocol';
import {multi, apply} from '../function/concrete';
import {concatenated} from '../concatenated';
import {cond} from '../lazyseq/concrete';
import {IFn, IAppendable, IPrependable, IEvented} from '../../protocols';

function append(self, handler){
  self.handlers.push(handler);
  cache(self);
}

function prepend(self, handler){
  self.handlers.unshift(handler);
  cache(self);
}

function invoke(self, ...args){
  return self.fn(...args);
}

function on(self, pred, callback){
  return append(self, [pred, callback]);
}

function cache(self){
  self.fn = multi(apply(cond, concatenated(self.handlers.concat([[constantly(true), self.fallback]]))));
}

export default effect(
  implement(IFn, {invoke}),
  implement(IEvented, {on}),
  implement(IPrependable, {prepend}),
  implement(IAppendable, {append}));