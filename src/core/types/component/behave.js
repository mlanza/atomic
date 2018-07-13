import {effect, overload, constantly, identity} from '../../core';
import {implement} from '../protocol';
import {IDispatch, ISubscribe, IDeref, IConfigured} from '../../protocols';

function dispatch(self, command){
  IDispatch.dispatch(self.input, command);
}

function sub(self, callback){
  return ISubscribe.sub(self.output, callback);
}

function deref(self){
  return IDeref.deref(self.output);
}

function config(self){
  return self.config;
}

export default effect(
  implement(IConfigured, {config}),
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub}),
  implement(IDispatch, {dispatch}));