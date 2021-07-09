import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import {IEmbeddable} from "./instance.js";

export function embed(self, parent, referenceNode){
  if (_.satisfies(IEmbeddable, self)) {
    IEmbeddable.embed(self, parent, referenceNode);
  } else if (_.satisfies(_.ISequential, self)) {
    _.each(embed(?, parent, referenceNode), self);
  } else if (_.descriptive(self)){
    _.each(function(entry){
      mut.assoc(parent, _.key(entry), _.val(entry));
    }, self);
  } else {
    IEmbeddable.embed(_.str(self), parent, referenceNode);
  }
}

export function embeds(self, ...contents){
  _.each(IEmbeddable.embed(?, self), contents);
}
