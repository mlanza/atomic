import * as _ from "atomic/core";
import {_ as v} from "param.macro";

export function Request(url, config, options, interceptors, handlers){
  this.url = url;
  this.config = config;
  this.options = options;
  this.interceptors = interceptors;
  this.handlers = handlers;
}

export function request(url, context){
  return new Request(url, context || {}, {}, [filling], []);
}

const filling = _.fmap(v, function(self){
  return _.fill(self, self.config);
});