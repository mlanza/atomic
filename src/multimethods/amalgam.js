//An amalgam is something composed of disparate parts

import {detect, each, mapa, compact} from "../types/lazyseq/concrete";
import {reduced} from "../types/reduced/construct";
import {multimethod} from "../types/multimethod/construct";
import {isElement} from "../types/element/construct";
import {isString, trim, split} from "../types/string";
import {isFunction} from "../types/function/construct";
import {signature, or} from "../predicates";
import {apply} from "../types/function/concrete";
import {IReduce, IKVReduce, IEvented, IHierarchy, IContent, isSequential, isObj} from "../protocols";

export const has = multimethod();
export const inject = multimethod();
export const yank = multimethod();
export const transpose = multimethod(function(self, other){
  return has(self, other) ? yank(self, other) : inject(self, other);
});

/* Element */

IEvented.on(yank.instance, signature(isElement), function(self){
  return yank(IHierarchy.parent(self), self);
});

/* Element / Keys */

const elementKeys = signature(isElement, isSequential);

IEvented.on(yank.instance, elementKeys, function(self, keys){
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

IEvented.on(inject.instance, elementStyleValue, function(self, key, styles){
  each(function(style){
    const [key, value] = mapa(trim, compact(split(style, ":")));
    self.style[key] = value;
  }, mapa(trim, split(styles, ";")));
  return self;
});

IEvented.on(yank.instance, elementStyleValue, function(self, key, styles){
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

IEvented.on(inject.instance, elementClassValue, function(self, key, value){
  each(self.classList.inject.bind(self.classList), value.split(" "));
  return self;
});

IEvented.on(yank.instance, elementClassValue, function(self, key, value){
  each(self.classList.yank.bind(self.classList), value.split(" "));
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

IEvented.on(inject.instance, elementKeyValue, function(self, key, value){
  self.setAttribute(key, value);
  return self;
});

IEvented.on(yank.instance, elementKeyValue, function(self, key, value){
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

IEvented.on(inject.instance, elementEventCallback, function(self, key, f){
  self.addEventListener(key, f);
  return self;
});

IEvented.on(yank.instance, elementEventCallback, function(self, key, f){
  self.delEventListener(key, f);
  return self;
});

/* Element / Attributes */

const elementAttrs = signature(isElement, isObj);

IEvented.on(inject.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, inject, self);
});

IEvented.on(has.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, function(memo, key, value){
    return memo ? has(self, key, value) : reduced(memo);
  }, true);
});

IEvented.on(yank.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, yank, self);
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

IEvented.on(inject.instance, elementText, function(self, text){
  self.appendChild(document.createTextNode(text));
  return self;
});

IEvented.on(yank.instance, elementText, function(self, text){
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

IEvented.on(inject.instance, elementElement, function(self, child){
  self.appendChild(child);
  return self;
});

IEvented.on(yank.instance, elementElement, function(self, child){
  self.delChild(child);
  return self;
});