import fetch from "fetch";
import Promise from "promise";
import * as _ from "atomic/core";
import {IParams, IOptions, IAddress, IIntercept} from "../../protocols";
import {ITemplate, IFunctor, IQueryable, ICoerceable, IForkable, fromTask} from "atomic/core";
import {_ as v} from "param.macro";

export function query(self, plan){
  const ks = _.keys(plan),
        os = _.filter(_.startsWith(v, "$"), ks),
        params = _.selectKeys(plan, os),
        fills = _.apply(_.dissoc, plan, os);
  return fromTask(IParams.params(ITemplate.fill(self, fills), params));
}

function addr(self){
  return _.fill(_.str(self.url), self.filled);
}

function fill(self, filled){
  const f = _.isFunction(filled) ? filled : _.merge(v, filled);
  return new self.constructor(self.url, f(self.filled), self.options, self.interceptors, self.handlers);
}

function params(self, params){
  return new self.constructor(IParams.params(self.url, params), self.filled, self.options, self.interceptors, self.handlers);
}

function options(self, options){
  const f = _.isFunction(options) ? options : _.absorb(v, options);
  return new self.constructor(self.url, self.filled, f(self.options), self.interceptors, self.handlers);
}

function fmap(self, handler){
  return new self.constructor(self.url, self.filled, self.options, self.interceptors, _.conj(self.handlers, handler));
}

function intercept2(self, interceptor){
  return intercept3(self, interceptor, _.append);
}

function intercept3(self, interceptor, manner){
  return new self.constructor(self.url, self.filled, self.options, manner(self.interceptors, interceptor), self.handlers);
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
  _.implement(IAddress, {addr}),
  _.implement(IOptions, {options}),
  _.implement(IParams, {params}),
  _.implement(ITemplate, {fill}),
  _.implement(IIntercept, {intercept}),
  _.implement(IFunctor, {fmap}));