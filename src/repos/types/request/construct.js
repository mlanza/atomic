import * as _ from "atomic/core";
import {_ as v} from "param.macro";

export function Request(url, options, config, interceptors, handlers){
  this.url = url;
  this.options = options;
  this.config = config;
  this.interceptors = interceptors;
  this.handlers = handlers;
}

export function request(url, config){
  return new Request(url, {}, config || {}, [filling], []);
}

const filling = _.fmap(v, function(self){
  return _.fill(self, self.config);
});