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
import {IReduce, IKVReduce, IEvented, IHierarchy, IContent} from "../protocols";

export const has = multimethod();
export const add = multimethod();
export const remove = multimethod();
export const transpose = multimethod(function(self, other){
  return has(self, other) ? remove(self, other) : add(self, other);
});

/* NodeList or Elements */

const isItems = or(isNodeList, isElements);

IEvented.on(add.instance, isItems, function(items, ...args){
  each(function(item){
    apply(add, item, args);
  }, items);
  return items;
});

IEvented.on(remove.instance, isItems, function(items, ...args){
  each(function(item){
    apply(remove, item, args);
  }, items);
  return items;
});

IEvented.on(transpose.instance, isItems, function(items, ...args){
  each(function(item){
    apply(transpose, item, args);
  }, items);
  return items;
});

IEvented.on(has.instance, isItems, function(items, ...args){
  return detect(function(item){
    return apply(has, item, args);
  }, items);
});

/* Element */

IEvented.on(remove.instance, signature(isElement), function(self){
  return remove(IHierarchy.parent(self), self);
});

/* Element / Key = "class" / Value */

const elementClassValue = signature(isElement, function(name){
  return name === "class";
}, null);

IEvented.on(add.instance, elementClassValue, function(self, key, value){
  each(self.classList.add.bind(self.classList), value.split(" "));
  return self;
});

IEvented.on(remove.instance, elementClassValue, function(self, key, value){
  each(self.classList.remove.bind(self.classList), value.split(" "));
  return self;
});

IEvented.on(transpose.instance, elementClassValue, function(self, key, value){
  each(self.classList.toggle.bind(self.classList), value.split(" "));
  return self;
});

IEvented.on(has.instance, elementClassValue, function(self, key, value){
  return IReduce.reduce(value.split(" "), function(memo, name){
    return memo ? self.classList.contains(name) : reduced(memo);
  }, true);
});

/* Element / Key / Value */

const elementKeyValue = signature(isElement, isString, null);

IEvented.on(add.instance, elementKeyValue, function(self, key, value){
  self.setAttribute(key, value);
  return self;
});

IEvented.on(remove.instance, elementKeyValue, function(self, key, value){
  if (value == null || value == self.getAttribute(key)) {
    self.removeAttribute(key);
  }
  return self;
});

IEvented.on(has.instance, elementKeyValue, function(self, key, value){
  return self.getAttribute(key) == value;
});

IEvented.on(transpose.instance, elementKeyValue, function(self, key, value){
  self.getAttribute(key) == value ? self.removeAttribute(key) : self.setAttribute(key, value);
  return self;
});

const elementEventCallback = signature(isElement, isString, isFunction);

IEvented.on(add.instance, elementEventCallback, function(self, key, f){
  self.addEventListener(key, f);
  return self;
});

IEvented.on(remove.instance, elementEventCallback, function(self, key, f){
  self.removeEventListener(key, f);
  return self;
});

/* Element / Attributes */

const elementAttrs = signature(isElement, or(isObjectSelection, isObject));

IEvented.on(add.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, add, self);
});

IEvented.on(has.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, has, true);
});

IEvented.on(remove.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, remove, self);
});

IEvented.on(transpose.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, transpose, self);
});

/* Element / Text */

const elementText = signature(isElement, isString);

IEvented.on(has.instance, elementText, function(self, text){
  return detect(function(node){
    return node.nodeType === Node.TEXT_NODE && node.data === text;
  }, IContent.contents(self));
});

IEvented.on(add.instance, elementText, function(self, text){
  self.appendChild(document.createTextNode(text));
});

IEvented.on(remove.instance, elementText, function(self, text){
  const node = has(self, text);
  node && self.removeChild(node);
  return self;
});

/* Element / Element */

const elementElement = signature(isElement, isElement);

IEvented.on(has.instance, elementElement, function(self, child){
  return detect(function(node){
    return node === child;
  }, IContent.contents(self));
});

IEvented.on(add.instance, elementElement, function(self, child){
  self.appendChild(child);
  return self;
});

IEvented.on(remove.instance, elementElement, function(self, child){
  self.removeChild(child);
  return self;
});