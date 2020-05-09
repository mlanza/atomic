import fetch from "fetch";
import Promise from "promise";
import * as _ from "atomic/core";
import {IParams, IOptions, IAddress, IIntercept} from "../../protocols";
import {ITemplate, IFunctor, IQueryable, ICoerceable, IForkable, IMap, IAssociative, ILookup, ICollection, fromTask} from "atomic/core";
import {_ as v} from "param.macro";

export function query(self, plan){
  const keys = _.filter(_.startsWith(v, "$"), _.keys(plan));
  return self
    |> _.merge(v, _.apply(_.dissoc, plan, keys))
    |> IParams.params(v, _.selectKeys(plan, keys))
    |> fromTask;
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
  return conj(self, _.fmap(v, handler));
}

function intercept2(self, interceptor){
  return intercept3(self, interceptor, _.append);
}

function intercept3(self, interceptor, manner){
  return new self.constructor(self.url, self.config, self.options, manner(self.interceptors, _.fmap(v, interceptor)), self.handlers);
}

function conj(self, f){
  return new self.constructor(self.url, self.config, self.options, self.interceptors, _.conj(self.handlers, f));
}

const intercept = _.overload(null, null, intercept2, intercept3);

function fork(self, reject, resolve){
  return self
    |> Promise.resolve
    |> _.apply(_.pipe, self.interceptors)
    |> _.fmap(v, function(self){
         return fetch(self.url, self.options);
       })
    |> _.apply(_.pipe, self.handlers)
    |> _.fork(v, reject, resolve);
}

export const behaveAsRequest = _.does(
  _.implement(ICoerceable, {toPromise: fromTask}),
  _.implement(ICollection, {conj}),
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