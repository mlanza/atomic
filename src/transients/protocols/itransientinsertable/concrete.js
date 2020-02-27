import {ITransientInsertable} from "./instance";
import {overload, noop} from "atomic/core";

function afterN(self, ...els) {
  let ref = self;
  while (els.length) {
    let el = els.shift();
    ITransientInsertable.after(ref, el);
    ref = el;
  }
}

export const after = overload(null, noop, ITransientInsertable.after, afterN);

function beforeN(self, ...els) {
  let ref = self;
  while (els.length) {
    let el = els.pop();
    ITransientInsertable.before(ref, el);
    ref = el;
  }
}

export const before = overload(null, noop, ITransientInsertable.before, beforeN);