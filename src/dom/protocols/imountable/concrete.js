import {root, getIn, specify, satisfies, partial, comp, doto, overload, noop} from 'cloe/core';
import {trigger, one} from "cloe/reactives";
import IMountable from "./instance";
import {isHTMLDocument} from "../../types/html-document/construct";
import {_ as v} from "param.macro";

export const isMountable = satisfies(IMountable, v);

function mounts1(self){
  return mounts2(self, isHTMLDocument);
}

function mounts2(self, pred){
  return mounts3(self, pred, function(el, ancestor, event){
    trigger(el, event, {bubbles: true, detail: {ancestor}});
  });
}

function mounts3(self, pred, attached){
  return mounts4(self, pred, attached, self);
}

function mounts4(self, pred, attached, context){
  specify(IMountable, {}, self);
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
        attach(v, "attaching", mounts4(v, pred, attached, context)),
        getIn(v, ["detail", "parent"]))) |>
    one(v, "mounted" ,
      comp(
        attach(v, "attached" , noop),
        getIn(v, ["detail", "parent"])));
}

export const mounts = overload(null, mounts1, mounts2, mounts3, mounts4);