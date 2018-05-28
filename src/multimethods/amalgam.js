//An amalgam is something composed of disparate parts

import {detect, each} from "../types/lazyseq/concrete";
import {reduced} from "../types/reduced/construct";
import {multimethod} from "../types/multimethod/construct";
import {isElement} from "../types/element/construct";
import {isString} from "../types/string/construct";
import {isFunction} from "../types/function/construct";
import {isNodeList} from "../types/nodelist/construct";
import {isElements} from "../types/elements/construct";
import {isObject} from "../types/object/construct";
import {isObjectSelection} from "../types/objectselection/construct";
import {signature, or} from "../predicates";
import {apply} from "../types/function/concrete";
import * as p from "../protocols";

export const has = multimethod();
export const add = multimethod();
export const remove = multimethod();
export const transpose = multimethod(function(self, other){
  return has(self, other) ? remove(self, other) : add(self, other);
});

/* NodeList or Elements */

const isItems = or(isNodeList, isElements);

p.on(add.instance, isItems, function(items, ...args){
  each(function(item){
    apply(add, item, args);
  }, items);
  return items;
});

p.on(remove.instance, isItems, function(items, ...args){
  each(function(item){
    apply(remove, item, args);
  }, items);
  return items;
});

p.on(transpose.instance, isItems, function(items, ...args){
  each(function(item){
    apply(transpose, item, args);
  }, items);
  return items;
});

p.on(has.instance, isItems, function(items, ...args){
  return detect(function(item){
    return apply(has, item, args);
  }, items);
});

/* Element */

p.on(remove.instance, signature(isElement), function(self){
  return remove(p.IHierarchy.parent(self), self);
});

/* Element / Key = "class" / Value */

const elementClassValue = signature(isElement, function(name){
  return name === "class";
}, null);

p.on(add.instance, elementClassValue, function(self, key, value){
  each(self.classList.add.bind(self.classList), value.split(" "));
  return self;
});

p.on(remove.instance, elementClassValue, function(self, key, value){
  each(self.classList.remove.bind(self.classList), value.split(" "));
  return self;
});

p.on(transpose.instance, elementClassValue, function(self, key, value){
  each(self.classList.toggle.bind(self.classList), value.split(" "));
  return self;
});

p.on(has.instance, elementClassValue, function(self, key, value){
  return p.reduce(value.split(" "), function(memo, name){
    return memo ? self.classList.contains(name) : reduced(memo);
  }, true);
});

/* Element / Key / Value */

const elementKeyValue = signature(isElement, isString, null);

p.on(add.instance, elementKeyValue, function(self, key, value){
  self.setAttribute(key, value);
  return self;
});

p.on(remove.instance, elementKeyValue, function(self, key, value){
  if (value == null || value == self.getAttribute(key)) {
    self.removeAttribute(key);
  }
  return self;
});

p.on(has.instance, elementKeyValue, function(self, key, value){
  return self.getAttribute(key) == value;
});

p.on(transpose.instance, elementKeyValue, function(self, key, value){
  self.getAttribute(key) == value ? self.removeAttribute(key) : self.setAttribute(key, value);
  return self;
});

const elementEventCallback = signature(isElement, isString, isFunction);

p.on(add.instance, elementEventCallback, function(self, key, f){
  self.addEventListener(key, f);
  return self;
});

p.on(remove.instance, elementEventCallback, function(self, key, f){
  self.removeEventListener(key, f);
  return self;
});

/* Element / Attributes */

const elementAttrs = signature(isElement, or(isObjectSelection, isObject));

p.on(add.instance, elementAttrs, function(self, obj){
  return p.reducekv(obj, add, self);
});

p.on(has.instance, elementAttrs, function(self, obj){
  return p.reducekv(obj, has, true);
});

p.on(remove.instance, elementAttrs, function(self, obj){
  return p.reducekv(obj, remove, self);
});

p.on(transpose.instance, elementAttrs, function(self, obj){
  return p.reducekv(obj, transpose, self);
});

/* Element / Text */

const elementText = signature(isElement, isString);

p.on(has.instance, elementText, function(self, text){
  return detect(function(node){
    return node.nodeType === Node.TEXT_NODE && node.data === text;
  }, p.contents(self));
});

p.on(add.instance, elementText, function(self, text){
  self.appendChild(document.createTextNode(text));
});

p.on(remove.instance, elementText, function(self, text){
  const node = has(self, text);
  node && self.removeChild(node);
  return self;
});

/* Element / Element */

const elementElement = signature(isElement, isElement);

p.on(has.instance, elementElement, function(self, child){
  return detect(function(node){
    return node === child;
  }, p.contents(self));
});

p.on(add.instance, elementElement, function(self, child){
  self.appendChild(child);
  return self;
});

p.on(remove.instance, elementElement, function(self, child){
  self.removeChild(child);
  return self;
});