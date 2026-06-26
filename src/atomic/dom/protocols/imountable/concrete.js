import * as _ from "atomic/core";
import * as $ from "atomic/shell";
import {IMountable} from "./instance.js";

export const isMountable = x => _.satisfies(IMountable, x);

export function mounts(self){
  _.specify(IMountable, {}, self);

  const parent = _.parent(self);

  if (parent) {
    $.each(function(key){
      $.trigger(self, key, {bubbles: true, detail: {parent}});
    }, ["mounting", "mounted"]); //ensure hooks trigger even if already mounted
  }

  return self;
}
