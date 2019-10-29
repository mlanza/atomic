import IInsertable from "./instance";
import {overload, identity, deprecated} from "../../core";

function afterN(self, ...els) {
  deprecated(self, "IInsertable.after deprecated. Use ITransientInsertable.after.");
  let ref = self;
  while (els.length) {
    let el = els.shift();
    IInsertable.after(ref, el);
    ref = el;
  }
  return self;
}

export const after = overload(null, identity, IInsertable.after, afterN);

function beforeN(self, ...els) {
  deprecated(self, "IInsertable.before deprecated. Use ITransientInsertable.before.");
  let ref = self;
  while (els.length) {
    let el = els.pop();
    IInsertable.before(ref, el);
    ref = el;
  }
  return self;
}

export const before = overload(null, identity, IInsertable.before, beforeN);