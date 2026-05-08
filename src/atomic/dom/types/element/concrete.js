import * as _ from "atomic/core";
import * as $ from "atomic/shell";

export function replaceWith(self, other){
  const parent = _.parent(self),
        replacement = _.isString(other) ? self.ownerDocument.createTextNode(other) : other;
  parent.replaceChild(replacement, self);
}

export function wrap(self, other){
  replaceWith(self, other);
  $.append(other, self);
}

export function isVisible(el){
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

export function enable(self, enabled){
  self.disabled = !enabled;
  return self;
}
