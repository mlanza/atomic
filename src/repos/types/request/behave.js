import fetch from "fetch";
import Promise from "promise";
import * as _ from "atomic/core";
import {IParams, IOptions, IAddress, IIntercept} from "../../protocols";
import {ITemplate, IFunctor, IQueryable, ICoerceable, IForkable, IMap, IAssociative, ILookup, fromTask} from "atomic/core";
import {_ as v} from "param.macro";

export function query(self, plan){
  const keys = _.filter(_.startsWith(v, "$"), _.keys(plan)),
        params = _.selectKeys(plan, keys),
        attrs = _.apply(_.dissoc, plan, keys);
  return fromTask(IParams.params(_.merge(self, attrs), params));
}

function addr(self){
  return _.fill(_.str(self.url), self.config);
}

function assoc(self, key, value) {
  return new self.constructor(self.url, IAssociative.assoc(self.config, key, value), self.options, self.interceptors, self.handlers);
}

function keys(self){
  return IMap.keys(self.config);
}

function dissoc(self, key) {
  return new self.constructor(self.url, IMap.dissoc(self.config, key), self.options, self.interceptors, self.handlers);
}

function lookup(self, key){
  return ILookup.lookup(self.config, key);
}

function params(self, params){
  return new self.constructor(IParams.params(self.url, params), self.config, self.options, self.interceptors, self.handlers);
}

function options(self, options){
  const f = _.isFunction(options) ? options : _.absorb(v, options);
  return new self.constructor(self.url, self.config, f(self.options), self.interceptors, self.handlers);
}

function fmap(self, handler){
  return new self.constructor(self.url, self.config, self.options, self.interceptors, _.conj(self.handlers, handler));
}

function intercept2(self, interceptor){
  return intercept3(self, interceptor, _.append);
}

function intercept3(self, interceptor, manner){
  return new self.constructor(self.url, self.config, self.options, manner(self.interceptors, interceptor), self.handlers);
}

const intercept = _.overload(null, null, intercept2, intercept3);

function fork(self, reject, resolve){
  return _.fork(
    _.reduce(_.fmap, Promise.resolve(self), self.interceptors),
    reject,
    function(self){
      return _.fork(_.apply(_.fmap, fetch(self.url, self.options), self.handlers), reject, resolve);
    });
}

export const behaveAsRequest = _.does(
  _.implement(ICoerceable, {toPromise: fromTask}),
  _.implement(IForkable, {fork}),
  _.implement(IQueryable, {query}),
  _.implement(IAssociative, {assoc}),
  _.implement(ILookup, {lookup}),
  _.implement(IMap, {keys, dissoc}),
  _.implement(IAddress, {addr}),
  _.implement(IOptions, {options}),
  _.implement(IParams, {params}),
  _.implement(IIntercept, {intercept}),
  _.implement(IFunctor, {fmap}));