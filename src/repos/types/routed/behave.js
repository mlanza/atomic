import * as _ from "atomic/core";
import {IParams, IOptions, IAddress, IIntercept} from "../../protocols";
import {ITemplate, IFunctor, IQueryable, ICoerceable, IForkable, ISeq, fromTask} from "atomic/core";
import {query} from "../request/behave";
import {_ as v} from "param.macro";

function filled(self){
  return !_.test(/\{[^{}]+\}/, IAddress.addr(self));
}

function fork(self, reject, resolve){
  return IForkable.fork(_.detect(filled, self.requests), reject, resolve);
}

function addr(self){
  return IAddress.addr(_.detect(filled, self.requests));
}

function params(self, params){
  return new self.constructor(_.mapa(IParams.params(v, params), self.requests));
}

function options(self, options){
  return new self.constructor(_.mapa(IOptions.options(v, options), self.requests));
}

function fill(self, params){
  return new self.constructor(_.mapa(_.fill(v, params), self.requests));
}

function intercept(self, interceptor){
  return new self.constructor(_.mapa(IIntercept.intercept(v, interceptor), self.requests));
}

function fmap(self, fmap){
  return new self.constructor(_.mapa(_.fmap(v, fmap), self.requests));
}

function first(self){
  return _.first(self.requests);
}

function rest(self){
  return _.rest(self.requests);
}

export const behaveAsRouted = _.does(
  _.implement(ICoerceable, {toPromise: fromTask}),
  _.implement(IForkable, {fork}),
  _.implement(IQueryable, {query}),
  _.implement(ISeq, {first, rest}),
  _.implement(IIntercept, {intercept}),
  _.implement(IFunctor, {fmap}),
  _.implement(ITemplate, {fill}),
  _.implement(IAddress, {addr}),
  _.implement(IParams, {params}),
  _.implement(IOptions, {options}));