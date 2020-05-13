import fetch from "fetch";
import Promise from "promise";
import * as _ from "atomic/core";
import {IParams, IOptions, IAddress, IIntercept} from "../../protocols";
import {ICloneable, ITemplate, IFunctor, IQueryable, ICoerceable, IForkable, IMap, IAssociative, ILookup, IAppendable, IPrependable, fromTask} from "atomic/core";
import {_ as v} from "param.macro";

export function query(self, plan){
  const keys = _.filter(_.startsWith(v, "$"), _.keys(plan));
  return self
    |> _.merge(v, _.apply(_.dissoc, plan, keys))
    |> IParams.params(v, _.selectKeys(plan, keys))
    |> fromTask;
}

function fill(self, params){
  return _.just(self,
    _.edit(v, "url", _.fill(v, params)),
    _.edit(v, "options", _.fill(v, params)));
}

function clone(self){
  return new self.constructor(self.url, self.config, self.options, self.interceptors, self.handlers);
}

function addr(self){
  return _.fill(_.str(self.url), self.config);
}

function assoc(self, key, value) {
  return _.edit(self, "config", IAssociative.assoc(v, key, value));
}

function contains(self, key){
  return IAssociative.contains(self.config, key);
}

function keys(self){
  return IMap.keys(self.config);
}

function lookup(self, key){
  return ILookup.lookup(self.config, key);
}

function params(self, params){
  return _.edit(self, "url", IParams.params(v, params));
}

function options(self, options){
  return _.edit(self, "options", _.isFunction(options) ? options : _.absorb(v, options));
}

function intercept(self, interceptor){
  return prepend(self, _.fmap(v, interceptor));
}

function fmap(self, handler){
  return append(self, _.fmap(v, handler));
}

function prepend(self, xf){
  return _.edit(self, "interceptors", _.prepend(v, xf));
}

function append(self, xf){
  return _.edit(self, "handlers", _.append(v, xf));
}

function fork(self, reject, resolve){
  return self
    |> Promise.resolve
    |> _.apply(_.pipe, self.interceptors)
    |> _.fmap(v, function(self){
      return fetch(self.url, self.options)
        |> _.apply(_.pipe, self.handlers)
        |> _.fork(v, reject, resolve);
    });
}

export const behaveAsRequest = _.does(
  _.implement(ITemplate, {fill}),
  _.implement(ICloneable, {clone}),
  _.implement(ICoerceable, {toPromise: fromTask}),
  _.implement(IAppendable, {append}),
  _.implement(IPrependable, {prepend}),
  _.implement(IForkable, {fork}),
  _.implement(IQueryable, {query}),
  _.implement(IAssociative, {assoc, contains}),
  _.implement(ILookup, {lookup}),
  _.implement(IMap, {keys}),
  _.implement(IAddress, {addr}),
  _.implement(IOptions, {options}),
  _.implement(IParams, {params}),
  _.implement(IIntercept, {intercept}),
  _.implement(IFunctor, {fmap}));