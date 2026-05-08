import * as _ from "atomic/core";
import {IInsertable} from "./instance.js";

function afterN(self, ...els) {
  let ref = self;
  while (els.length) {
    let el = els.shift();
    IInsertable.after(ref, el);
    ref = el;
  }
}

export const after = _.overload(null, _.noop, IInsertable.after, afterN);

function beforeN(self, ...els) {
  let ref = self;
  while (els.length) {
    let el = els.pop();
    IInsertable.before(ref, el);
    ref = el;
  }
}

export const before = _.overload(null, _.noop, IInsertable.before, beforeN);
