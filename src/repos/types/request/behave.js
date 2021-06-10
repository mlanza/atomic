import fetch from "fetch";
import Promise from "promise";
import * as _ from "atomic/core";
import {IParams, IOptions, IAddress, IIntercept} from "../../protocols.js";
import {ICloneable, ITemplate, IFunctor, IQueryable, ICoerceable, IForkable, IMap, IAssociative, ILookup, IAppendable, IPrependable, IKVReduce, fromTask} from "atomic/core";

export function query(self, plan){
  const keys = _.filter(_.startsWith(?, "$"), _.keys(plan));
  return self
    |> _.merge(?, _.apply(_.dissoc, plan, keys))
    |> IParams.params(?, _.selectKeys(plan, keys))
    |> fromTask;
}

function fill(self, params){
  return self
    |> _.edit(?, "url", _.fill(?, params))
    |> _.edit(?, "options", _.fill(?, params));
}

function clone(self){
  return new self.constructor(self.url, self.options, self.config, self.interceptors, self.handlers);
}

function addr(self){
  return _.fill(_.str(self.url), self.config);
}

function assoc(self, key, value) {
  return _.edit(self, "config", IAssociative.assoc(?, key, value));
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
  return _.edit(self, "url", IParams.params(?, params));
}

function options(self, options){
  return _.edit(self, "options", _.isFunction(options) ? options : _.absorb(?, options));
}

function intercept(self, interceptor){
  return prepend(self, _.fmap(?, interceptor));
}

function fmap(self, handler){
  return append(self, _.fmap(?, handler));
}

function prepend(self, xf){
  return _.edit(self, "interceptors", _.prepend(?, xf));
}

function append(self, xf){
  return _.edit(self, "handlers", _.append(?, xf));
}

function fork(self, reject, resolve){
  return self
    |> Promise.resolve
    |> _.apply(_.pipe, self.interceptors)
    |> _.fmap(?, function(self){
      return fetch(self.url, self.options)
        |> _.apply(_.pipe, self.handlers)
        |> _.fork(?, reject, resolve);
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