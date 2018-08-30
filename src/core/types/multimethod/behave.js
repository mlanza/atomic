import {does} from "../../core";
import {implement} from '../protocol';
import {apply} from '../function/concrete';
import {handler} from '../router/concrete';
import {IFn, IAppendable, IPrependable, IEvented, IDispatch} from '../../protocols';

function append(self, handler){
  self.router = IAppendable.append(self.router, handler);
  return self;
}

function prepend(self, handler){
  self.router = IPrependable.prepend(self.router, handler);
  return self;
}

function on(self, pred, callback){
  return append(self, handler(pred, callback, apply));
}

function invoke(self, ...args){
  return IDispatch.dispatch(self.router, args);
}

export default does(
  implement(IFn, {invoke}),
  implement(IEvented, {on}),
  implement(IPrependable, {prepend}),
  implement(IAppendable, {append}));