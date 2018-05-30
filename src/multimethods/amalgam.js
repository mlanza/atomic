//An amalgam is something composed of disparate parts

import {detect, each, mapa, compact} from "../types/lazyseq/concrete";
import {reduced} from "../types/reduced/construct";
import {multimethod} from "../types/multimethod/construct";
import {isElement} from "../types/element/construct";
import {isArray} from "../types/array";
import {isString, trim, split} from "../types/string";
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
export const del = multimethod();
export const transpose = multimethod(function(self, other){
  return has(self, other) ? del(self, other) : add(self, other);
});

/* NodeList or Elements */

const isItems = or(isNodeList, isElements);

IEvented.on(add.instance, isItems, function(items, ...args){
  each(function(item){
    apply(add, item, args);
  }, items);
  return items;
});

IEvented.on(del.instance, isItems, function(items, ...args){
  each(function(item){
    apply(del, item, args);
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

IEvented.on(del.instance, signature(isElement), function(self){
  return del(IHierarchy.parent(self), self);
});


/* Element / Keys */

const elementKeys = signature(isElement, isArray);

IEvented.on(del.instance, elementKeys, function(self, keys){
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

IEvented.on(add.instance, elementStyleValue, function(self, key, styles){
  each(function(style){
    const [key, value] = mapa(trim, compact(split(style, ":")));
    self.style[key] = value;
  }, mapa(trim, split(styles, ";")));
  return self;
});

IEvented.on(del.instance, elementStyleValue, function(self, key, styles){
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

IEvented.on(add.instance, elementClassValue, function(self, key, value){
  each(self.classList.add.bind(self.classList), value.split(" "));
  return self;
});

IEvented.on(del.instance, elementClassValue, function(self, key, value){
  each(self.classList.del.bind(self.classList), value.split(" "));
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

IEvented.on(del.instance, elementKeyValue, function(self, key, value){
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

IEvented.on(del.instance, elementEventCallback, function(self, key, f){
  self.delEventListener(key, f);
  return self;
});

/* Element / Attributes */

const elementAttrs = signature(isElement, or(isObjectSelection, isObject));

IEvented.on(add.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, add, self);
});

IEvented.on(has.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, function(memo, key, value){
    return memo ? has(self, key, value) : reduced(memo);
  }, true);
});

IEvented.on(del.instance, elementAttrs, function(self, obj){
  return IKVReduce.reducekv(obj, del, self);
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
  return self;
});

IEvented.on(del.instance, elementText, function(self, text){
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

IEvented.on(add.instance, elementElement, function(self, child){
  self.appendChild(child);
  return self;
});

IEvented.on(del.instance, elementElement, function(self, child){
  self.delChild(child);
  return self;
});