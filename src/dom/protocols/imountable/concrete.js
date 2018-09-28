import {root, getIn, specify, satisfies, partial, comp, doto, overload, noop, IDeref} from 'cloe/core';
import {trigger, one, ISubscribe, IEvented} from "cloe/reactives";
import IMountable from "./instance";
import {isHTMLDocument} from "../../types/html-document/construct";
import {_ as v} from "param.macro";

export function mountable(self){
  return satisfies(IMountable, self) && IMountable.mountable(self);
}

export function mount(self, parent){
  IEvented.trigger(self, "mounting", {bubbles: true, detail: {parent}});
  IMountable.mount(self, parent);
  IEvented.trigger(self, "mounted" , {bubbles: true, detail: {parent}});
  return self;
}

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
  function attach(parent, event, callback){
    const ancestor = root(parent);
    if (pred(ancestor)) {
      attached(context, ancestor, event);
    } else {
      callback(parent);
    }
  }
  return self |>
    IMountable.mounts |>
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