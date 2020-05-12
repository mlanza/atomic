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

export function demand(self, keys){
  return IIntercept.intercept(self, function(req){
    const param = _.reduce(function(memo, key){
      return memo || _.contains(req, key) ? null : key;
    }, null, keys);
    if (param){
      throw new TypeError("Missing required param `" + param + "`.");
    }
    return req;
  });
}