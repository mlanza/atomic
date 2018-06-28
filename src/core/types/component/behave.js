import {effect} from '../../core';
import {implement} from '../protocol';
import {IDispatch, ISubscribe, IMiddleware} from '../../protocols';

function dispatch(self, command){
  IMiddleware.handle(self.bus, command);
}

function sub(self, callback){
  return ISubscribe.sub(self.publ, callback);
}

export default effect(
  implement(ISubscribe, {sub}),
  implement(IDispatch, {dispatch}));