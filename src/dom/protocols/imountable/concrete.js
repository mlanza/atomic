import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import {IMountable} from "./instance.js";

export const isMountable = _.satisfies(IMountable, ?);

export function mounts(self){
  _.specify(IMountable, {}, self);

  const parent = _.parent(self);

  if (parent) {
    _.each(function(key){
      $.trigger(self, key, {bubbles: true, detail: {parent}});
    }, ["mounting", "mounted"]); //ensure hooks trigger even if already mounted
  }

  return self;
}
