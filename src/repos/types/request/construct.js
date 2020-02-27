import * as _ from "atomic/core";
import {IIntercept} from "../../protocols"
import {_ as v} from "param.macro";

export function Request(url, filled, options, interceptors, handlers){
  this.url = url;
  this.filled = filled;
  this.options = options;
  this.interceptors = interceptors;
  this.handlers = handlers;
}

function filledOptions(options, filled){
  return _.reducekv(function(memo, key, value){
    return _.assoc(memo, key, _.isString(value) ? _.fill(value, filled) :  _.isObject(value) ? filledOptions(value, filled) : value);
  }, {}, options);
}

function fillin(self){
  return new Request(_.fill(self.url, self.filled), self.filled, filledOptions(self.options, self.filled), self.interceptors, self.handlers);
}

export function mapFills(req, sel, f){
  return IIntercept.intercept(req, function(self){
    return new Request(self.url, _.reducekv(function(memo, key, value){
      return _.assoc(memo, key, sel(key) ? f(value) : value);
    }, {}, self.filled), self.options, self.interceptors, self.handlers);
  }, _.prepend);
}

const esc = _.pipe(_.replace(v, /&/g, "%26"), _.replace(v, /'/g, "''"));

function escFills2(req, keys){
  return mapFills(req, _.include(keys, v), esc);
}

function escFills1(req){
  return mapFills(req, _.constantly(true), esc);
}

export const escFills = _.overload(null, escFills1, escFills2);

export function request(url, context){
  return new Request(url, context || {}, {}, [fillin], []);
}