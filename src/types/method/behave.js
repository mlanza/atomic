import {effect, constantly} from "../../core";
import {implement} from '../protocol';
import {IFn, IAssociative} from '../../protocols';

function invoke(self, ...args){
  const hash = self.hash(self.dispatch(...args));
  const handler = self.handlers.get(hash) || self.fallback;
  return handler(...args);
}

function assoc(self, key, handler){
  const hash = self.hash(key);
  self.handlers.set(hash, handler);
  return self;
}

export default effect(
  implement(IAssociative, {assoc}),
  implement(IFn, {invoke}));