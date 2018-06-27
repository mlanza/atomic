import {effect, overload, constantly, identity} from '../../core';
import {implement} from '../protocol';
import {IDispatch, IMiddleware, ILookup} from '../../protocols';

function dispatch(self, command){
  IMiddleware.handle(self.handler, command);
}

export default effect(
  implement(IDispatch, {dispatch}));