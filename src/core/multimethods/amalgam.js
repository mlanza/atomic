//An amalgam is something composed of disparate parts

import {overload} from "../core";
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

const yank1 = multimethod(), yank2 = multimethod(), yank3 = multimethod();
const has2 = multimethod(), has3 = multimethod();
const inject2 = multimethod(), inject3 = multimethod();
const transpose2 = multimethod(function(self, other){
  return has2(self, other) ? yank2(self, other) : inject2(self, other);
}), transpose3 = multimethod(function(self, key, value){
  return has3(self, key, other) ? yank3(self, key, other) : inject3(self, key, other);
});
export const inject = overload(null, null, inject2, reducing(inject2));
export const yank = overload(null, yank1, yank2, reducing(yank2));
export const has = overload(null, null, has2, has3);
export const transpose = overload(null, null, transpose2, transpose3);

/* Date / When */

IEvented.on(inject2, signature(isDate, isWhen), function(self, when){
  return IReduce.reduce(IMap.keys(self), function(dt, key){
    const init = ILookup.lookup(when, key);
    const value = isFunction(init) ? init(ILookup.lookup(dt, key)) : init;
    return value == null ? dt : IAssociative.assoc(dt, key, value);
  }, self);
});

/* When / When */

IEvented.on(inject2, signature(isWhen, isWhen), function(self, other){
  return IReduce.reduce(IMap.keys(self), function(memo, key){
    const value = ILookup.lookup(other, key);
    return value == null ? memo : IAssociative.assoc(memo, key, value);
  }, self);
});

/* Element */

IEvented.on(yank1, signature(isElement), function(self){
  return yank2(IHierarchy.parent(self), self);
});

/* Element / Keys */

const elementKeys = signature(isElement, isSequential);

IEvented.on(yank2, elementKeys, function(self, keys){
  each(self.removeAttribute.bind(self), keys);
  return self;
});

IEvented.on(has2, elementKeys, function(self, keys){
  return IReduce.reduce(keys, function(memo, key){
    return memo ? self.hasAttribute(key) : reduced(memo);
  }, true);
});

/* Element / Key = "style" / Value */

const elementStyleValue = signature(isElement, function(name){
  return name === "style";
}, null);

IEvented.on(inject3, elementStyleValue, function(self, key, styles){
  each(function(style){
    const [key, value] = mapa(trim, compact(split(style, ":")));
    self.style[key] = value;
  }, mapa(trim, split(styles, ";")));
  return self;
});

IEvented.on(yank3, elementStyleValue, function(self, key, styles){
  each(function(style){
    const [key, value] = mapa(trim, compact(split(style, ":")));
    if (self.style[key] == value) {
      self.style[key] = "";
    }
  }, mapa(trim, split(styles, ";")));
  return self;
});

IEvented.on(transpose3, elementStyleValue, function(self, key, styles){
  each(function(style){
    const [key, value] = mapa(trim, compact(split(style, ":")));
    self.style[key] = self.style[key] == value ? "" : value;
  }, mapa(trim, split(styles, ";")));
  return self;
});

IEvented.on(has3, elementStyleValue, function(self, key, styles){
  return IReduce.reduce(mapa(trim, compact(split(styles, ";"))), function(memo, style){
    const [key, value] = mapa(trim, split(style, ":"))
    return memo ? self.style[key] == value : reduced(memo);
  }, true);
});

/* Element / Key = "class" / Value */

const elementClassValue = signature(isElement, function(name){
  return name === "class";
}, null);

IEvented.on(inject3, elementClassValue, function(self, key, value){
  each(self.classList.add.bind(self.classList), value.split(" "));
  return self;
});

IEvented.on(yank3, elementClassValue, function(self, key, value){
  each(self.classList.remove.bind(self.classList), value.split(" "));
  return self;
});

IEvented.on(transpose3, elementClassValue, function(self, key, value){
  each(self.classList.toggle.bind(self.classList), value.split(" "));
  return self;
});

IEvented.on(has3, elementClassValue, function(self, key, value){
  return IReduce.reduce(value.split(" "), function(memo, name){
    return memo ? self.classList.contains(name) : reduced(memo);
  }, true);
});

/* Element / Key / Value */

const elementKeyValue = signature(isElement, isString, null);

IEvented.on(inject3, elementKeyValue, function(self, key, value){
  self.setAttribute(key, value);
  return self;
});

IEvented.on(yank3, elementKeyValue, function(self, key, value){
  if (value == null || value == self.getAttribute(key)) {
    self.removeAttribute(key);
  }
  return self;
});

IEvented.on(has3, elementKeyValue, function(self, key, value){
  return self.getAttribute(key) == value;
});

IEvented.on(transpose3, elementKeyValue, function(self, key, value){
  self.getAttribute(key) == value ? self.removeAttribute(key) : self.setAttribute(key, value);
  return self;
});

const elementEventCallback = signature(isElement, isString, isFunction);

IEvented.on(inject3, elementEventCallback, function(self, key, f){
  self.addEventListener(key, f);
  return self;
});

IEvented.on(yank3, elementEventCallback, function(self, key, f){
  self.removeEventListener(key, f);
  return self;
});

/* Element / Attributes */

const elementAttrs = signature(isElement, isDescriptive);

IEvented.on(inject2, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, inject3, self);
});

IEvented.on(has2, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, function(memo, key, value){
    return memo ? has3(self, key, value) : reduced(memo);
  }, true);
});

IEvented.on(yank2, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, yank3, self);
});

IEvented.on(transpose2, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, transpose3, self);
});

/* Element / Text */

const elementText = signature(isElement, isString);

IEvented.on(has2, elementText, function(self, text){
  return detect(function(node){
    return node.nodeType === Node.TEXT_NODE && node.data === text;
  }, IContent.contents(self));
});

IEvented.on(inject2, elementText, function(self, text){
  self.appendChild(document.createTextNode(text));
  return self;
});

IEvented.on(yank2, elementText, function(self, text){
  const node = has2(self, text);
  node && self.removeChild(node);
  return self;
});

/* Element / Element */

const elementElement = signature(isElement, isElement);

IEvented.on(has2, elementElement, function(self, child){
  return detect(function(node){
    return node === child;
  }, IContent.contents(self));
});

IEvented.on(inject2, elementElement, function(self, child){
  self.appendChild(child);
  return self;
});

IEvented.on(yank2, elementElement, function(self, child){
  self.removeChild(child);
  return self;
});
