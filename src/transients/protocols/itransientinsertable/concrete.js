import * as _ from "atomic/core";
import {ITransientInsertable} from "./instance.js";

function afterN(self, ...els) {
  let ref = self;
  while (els.length) {
    let el = els.shift();
    ITransientInsertable.after(ref, el);
    ref = el;
  }
}

export const after = _.overload(null, _.noop, ITransientInsertable.after, afterN);

function beforeN(self, ...els) {
  let ref = self;
  while (els.length) {
    let el = els.pop();
    ITransientInsertable.before(ref, el);
    ref = el;
  }
}

export const before = _.overload(null, _.noop, ITransientInsertable.before, beforeN);
