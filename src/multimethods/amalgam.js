//An amalgam is something composed of disparate parts

import {reduced, multimethod, isElement, isString, isFunction, isObject, isObjectSelection, detect, each} from "../types";
import {signature, or} from "../predicates";
import * as p from "../protocols";

export const has = multimethod();
export const add = multimethod();
export const remove = multimethod();
export const transpose = multimethod(function(self, other){
  return has(self, other) ? remove(self, other) : add(self, other);
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
  let classes = value.split(" ");
  each(self.classList.add.bind(self.classList), classes);
  return self;
});

p.on(remove.instance, elementClassValue, function(self, key, value){
  let classes = value.split(" ");
  each(self.classList.remove.bind(self.classList), classes);
  return self;
});

p.on(transpose.instance, elementClassValue, function(self, key, value){
  let classes = value.split(" ");
  each(self.classList.toggle.bind(self.classList), classes);
  return self;
});

p.on(has.instance, elementClassValue, function(self, key, value){
  let classes = value.split(" ");
  return p.reduce(classes, function(memo, name){
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
  self.removeAttribute(key, value);
  return self;
});

p.on(has.instance, elementKeyValue, function(self, key, value){
  return self.getAttribute(key) === value;
});

p.on(transpose.instance, elementKeyValue, function(self, key, value){
  self.getAttribute(key) === value ? self.removeAttribute(key) : self.addAttribute(key, value);
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