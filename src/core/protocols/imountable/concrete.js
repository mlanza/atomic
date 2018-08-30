import {IEvented, ISubscribe, IDeref} from '../../protocols';
import IMountable from "./instance";
import {root} from "../../protocols/ihierarchy/concrete";
import {getIn} from "../../protocols/ilookup/concrete";
import {trigger, one} from "../../protocols/ievented/concrete";
import {specify, satisfies} from "../../types/protocol";
import {isHTMLDocument} from "../../types/html-document/construct";
import {partial, comp} from "../../types/function/concrete";
import {doto, overload, noop} from '../../../core/core';
import {_ as v} from "param.macro";

export const mountable = IMountable.mountable;

export function mount(self, parent){
  if (!mountable(self)) {
    throw new Error("Item is not mountable.");
  }
  return IMountable.mount(self, parent);
}

function mounts1(self){
  return mounts2(self, isHTMLDocument);
}

function mounts2(self, pred){
  return mounts3(self, pred, function(el, ancestor, event){
    trigger(el, event, {bubbles: false, detail: {ancestor}});
  });
}

function mounts3(self, pred, attached){
  return mounts4(self, pred, attached, self);
}

function mounts4(self, pred, attached, context){
  if (!mountable(self)) {
    throw new Error("Item is not mountable.");
  }
  function attach(parent, event, callback){
    const ancestor = root(parent);
    if (pred(ancestor)) {
      attached(context, ancestor, event);
    } else {
      callback(parent);
    }
  }
  return self |>
    one(v, "mounting",
      comp(
        attach(v, "attaching", mounts(v, pred, attached, context)),
        getIn(v, ["detail", "parent"]))) |>
    one(v, "mounted" ,
      comp(
        attach(v, "attached" , noop),
        getIn(v, ["detail", "parent"])));
}

export const mounts = overload(null, mounts1, mounts2, mounts3, mounts4);

function mutate3(self, state, f){
  ISubscribe.sub(state, partial(f, self));
  return self;
}

function mutate2(state, f){
  return mutate3(v, state, f);
}

export const mutate = overload(null, null, mutate2, mutate3);