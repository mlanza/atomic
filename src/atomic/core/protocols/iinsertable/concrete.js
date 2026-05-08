import {IInsertable} from "./instance.js";
import {overload, identity} from "../../core.js";

function afterN(self, ...els) {
  let ref = self;
  while (els.length) {
    let el = els.shift();
    IInsertable.after(ref, el);
    ref = el;
  }
}

export const after = overload(null, identity, IInsertable.after, afterN);

function beforeN(self, ...els) {
  let ref = self;
  while (els.length) {
    let el = els.pop();
    IInsertable.before(ref, el);
    ref = el;
  }
}

export const before = overload(null, identity, IInsertable.before, beforeN);