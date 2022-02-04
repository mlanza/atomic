import * as _ from "atomic/core";

export function Request(url, options, config, interceptors, handlers){
  this.url = url;
  this.options = options;
  this.config = config;
  this.interceptors = interceptors;
  this.handlers = handlers;
}

Request.prototype[Symbol.toStringTag] = "Request";

export function request(url, config){
  return new Request(url, {}, config || {}, [filling], []);
}

const filling = _.fmap(?, function(self){
  return _.fill(self, self.config);
});
