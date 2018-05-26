//An amalgam is something composed of disparate parts

import {reduced, multimethod, isElement, isString, isObject, isObjectSelection, isClassification, detect} from "../types";
import {signature, or} from "../predicates";
import * as p from "../protocols";

export const has = multimethod();
export const add = multimethod();
export const remove = multimethod();
export const transpose = multimethod(function(self, other){
  return has(self, other) ? remove(self, other) : add(self, other);
});

/* Element / Attributes */

const elementAttrs = signature(isElement, or(isObjectSelection, isObject));

p.on(add.instance, elementAttrs, function(self, obj){
  return p.reducekv(obj, function(memo, key, value){
    const f = typeof value === "function" ? memo.addEventListener : memo.setAttribute;
    f.call(self, key, value);
    return memo;
  }, self);
});

p.on(has.instance, elementAttrs, function(self, obj){
  return p.reducekv(obj, function(memo, key, value){
    return memo ? self.getAttribute(key) == value : reduced(memo);
  }, true);
});

p.on(remove.instance, elementAttrs, function(self, obj){
  return p.reducekv(obj, function(memo, key, value){
    const f = typeof value === "function" ? memo.removeEventListener : function(key, value){
      if (this.getAttribute(key) == value){
        this.removeAttribute(key)
      }
    };
    f.call(self, key, value);
    return memo;
  }, self);
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

/* Element / Classification */

const elementClassification = signature(isElement, isClassification);

p.on(has.instance, elementClassification, function(self, classification){
  return self.classList.contains(classification.name);
});

p.on(add.instance, elementClassification, function(self, classification){
  self.classList.add(classification.name);
  return self;
});

p.on(transpose.instance, elementClassification, function(self, classification){
  self.classList.toggle(classification.name);
  return self;
});

p.on(remove.instance, elementClassification, function(self, classification){
  self.classList.remove(classification.name);
  return self;
});