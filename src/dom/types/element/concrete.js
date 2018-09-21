import {IHierarchy} from 'cloe/core';

export function replaceWith(self, other){
  const parent = IHierarchy.parent(self);
  parent.replaceChild(other, self);
}

export function isVisible(el){
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

export function enable(self, enabled){
  self.disabled = !enabled;
  return self;
}