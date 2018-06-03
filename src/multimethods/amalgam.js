//An amalgam is something composed of disparate parts

import {detect, each, mapa, compact} from "../types/lazyseq/concrete";
import {reduced, reducing} from "../types/reduced";
import {multimethod} from "../types/multimethod/construct";
import {isDate} from "../types/date/construct";
import {isWhen} from "../types/when/construct";
import {isElement} from "../types/element/construct";
import {isString, trim, split} from "../types/string";
import {isFunction} from "../types/function/construct";
import {signature, or} from "../predicates";
import {apply} from "../types/function/concrete";
import {ICloneable, IReduce, IKVReduce, IEvented, IHierarchy, IContent, ILookup, IAssociative, IMap, isSequential, isDescriptive} from "../protocols";

export const has = multimethod();
const _inject = multimethod();
export const _yank = multimethod();
export const transpose = multimethod(function(self, other){
  return has(self, other) ? _yank(self, other) : _inject(self, other);
});

/* Date / When */

IEvented.on(_inject.instance, signature(isDate, isWhen), function(self, when){
  return IReduce.reduce(IMap.keys(self), function(dt, key){
    const value = ILookup.lookup(when, key);
    return value == null ? dt : IAssociative.assoc(dt, key, value);
  }, self);
});

/* When / When */

IEvented.on(_inject.instance, signature(isWhen, isWhen), function(self, other){
  return IReduce.reduce(IMap.keys(self), function(memo, key){
    const value = ILookup.lookup(other, key);
    return value == null ? memo : IAssociative.assoc(memo, key, value);
  }, self);
});

/* Element */

IEvented.on(_yank.instance, signature(isElement), function(self){
  return _yank(IHierarchy.parent(self), self);
});

/* Element / Keys */

const elementKeys = signature(isElement, isSequential);

IEvented.on(_yank.instance, elementKeys, function(self, keys){
  each(self.removeAttribute.bind(self), keys);
  return self;
});

IEvented.on(has.instance, elementKeys, function(self, keys){
  return IReduce.reduce(keys, function(memo, key){
    return memo ? self.hasAttribute(key) : reduced(memo);
  }, true);
});

/* Element / Key = "style" / Value */

const elementStyleValue = signature(isElement, function(name){
  return name === "style";
}, null);

IEvented.on(_inject.instance, elementStyleValue, function(self, key, styles){
  each(function(style){
    const [key, value] = mapa(trim, compact(split(style, ":")));
    self.style[key] = value;
  }, mapa(trim, split(styles, ";")));
  return self;
});

IEvented.on(_yank.instance, elementStyleValue, function(self, key, styles){
  each(function(style){
    const [key, value] = mapa(trim, compact(split(style, ":")));
    if (self.style[key] == value) {
      self.style[key] = "";
    }
  }, mapa(trim, split(styles, ";")));
  return self;
});

IEvented.on(transpose.instance, elementStyleValue, function(self, key, styles){
  each(function(style){
    const [key, value] = mapa(trim, compact(split(style, ":")));
    self.style[key] = self.style[key] == value ? "" : value;
  }, mapa(trim, split(styles, ";")));
  return self;
});

IEvented.on(has.instance, elementStyleValue, function(self, key, styles){
  return IReduce.reduce(mapa(trim, compact(split(styles, ";"))), function(memo, style){
    const [key, value] = mapa(trim, split(style, ":"))
    return memo ? self.style[key] == value : reduced(memo);
  }, true);
});

/* Element / Key = "class" / Value */

const elementClassValue = signature(isElement, function(name){
  return name === "class";
}, null);

IEvented.on(_inject.instance, elementClassValue, function(self, key, value){
  each(self.classList._inject.bind(self.classList), value.split(" "));
  return self;
});

IEvented.on(_yank.instance, elementClassValue, function(self, key, value){
  each(self.classList._yank.bind(self.classList), value.split(" "));
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

IEvented.on(_inject.instance, elementKeyValue, function(self, key, value){
  self.setAttribute(key, value);
  return self;
});

IEvented.on(_yank.instance, elementKeyValue, function(self, key, value){
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

IEvented.on(_inject.instance, elementEventCallback, function(self, key, f){
  self.addEventListener(key, f);
  return self;
});

IEvented.on(_yank.instance, elementEventCallback, function(self, key, f){
  self.delEventListener(key, f);
  return self;
});

/* Element / Attributes */

const elementAttrs = signature(isElement, isDescriptive);

IEvented.on(_inject.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, _inject, self);
});

IEvented.on(has.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, function(memo, key, value){
    return memo ? has(self, key, value) : reduced(memo);
  }, true);
});

IEvented.on(_yank.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, _yank, self);
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

IEvented.on(_inject.instance, elementText, function(self, text){
  self.appendChild(document.createTextNode(text));
  return self;
});

IEvented.on(_yank.instance, elementText, function(self, text){
  const node = has(self, text);
  node && self.delChild(node);
  return self;
});

/* Element / Element */

const elementElement = signature(isElement, isElement);

IEvented.on(has.instance, elementElement, function(self, child){
  return detect(function(node){
    return node === child;
  }, IContent.contents(self));
});

IEvented.on(_inject.instance, elementElement, function(self, child){
  self.appendChild(child);
  return self;
});

IEvented.on(_yank.instance, elementElement, function(self, child){
  self.delChild(child);
  return self;
});

const inject = reducing(_inject);
inject.instance = _inject.instance;
const yank = reducing(_yank);
yank.instance = _yank.instance;

export {inject, yank};
