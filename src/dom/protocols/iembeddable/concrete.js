import IEmbeddable from "./instance";
import {satisfies, each, key, val, str, ISequential, IDescriptive} from 'atomic/core';
import {assoc} from 'atomic/transients';
import {_ as v} from "param.macro";

export function embed(self, parent, referenceNode){
  if (satisfies(IEmbeddable, self)) {
    IEmbeddable.embed(self, parent, referenceNode);
  } else if (satisfies(ISequential, self)) {
    each(embed(v, parent, referenceNode), self);
  } else if (satisfies(IDescriptive, self)){
    each(function(entry){
      assoc(parent, key(entry), val(entry));
    }, self);
  } else {
    IEmbeddable.embed(str(self), parent, referenceNode);
  }
}