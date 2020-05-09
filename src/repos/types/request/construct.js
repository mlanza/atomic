import * as _ from "atomic/core";
import {_ as v} from "param.macro";
import {IIntercept} from "../../protocols"

export function Request(url, config, options, interceptors, handlers){
  this.url = url;
  this.config = config;
  this.options = options;
  this.interceptors = interceptors;
  this.handlers = handlers;
}

export function request(url, context){
  return new Request(url, context || {}, {}, [fillin], []);
}

const fillin = _.fmap(v, function(self){
  return new Request(_.fill(self.url, self.config), self.config, filledOptions(self.options, self.config), self.interceptors, self.handlers);
});

function filledOptions(options, filled){
  return _.reducekv(function(memo, key, value){
    return _.assoc(memo, key, _.isString(value) ? _.fill(value, filled) :  _.isObject(value) ? filledOptions(value, filled) : value);
  }, {}, options);
}

export function reconfig(req, f){
  return IIntercept.intercept(req, function(self){
    return new self.constructor(self.url, f(self.config), self.options, self.interceptors, self.handlers);
  }, _.prepend);
}