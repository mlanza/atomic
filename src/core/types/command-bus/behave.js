import {effect, overload, constantly, identity} from '../../core';
import {implement} from '../protocol';
import {IDispatch, ISubscribe, IMiddleware, ILookup} from '../../protocols';

function dispatch(self, command){
  IMiddleware.handle(self.handler, command);
}

function sub(self, callback){
  return ISubscribe.sub(self.publ, callback);
}

export default effect(
  implement(ISubscribe, {sub}),
  implement(IDispatch, {dispatch}));