import {overload, constantly, identity} from "./core";
import {EMPTY, lazySeq, cons, apply, concat, partial, partially, comp, satisfies, compact, flatten, detect, filter, remove, each, map, mapcat} from "./types";
import {IHierarchy, IArr, IReduce, ISeqable} from "./protocols";
import {has, add, del, transpose, matches} from "./multimethods";
export {has, add, del, transpose, matches} from "./multimethods";

export function expansive(f){
  function expand(...xs){
    const contents = IArr.toArray(compact(flatten(xs)));
    return detect(function(content){
      return typeof content === "function";
    }, contents) ? step(contents) : f(...contents);
  }
  function step(contents){
    return function(value){
      const resolve = typeof value === "function" ? partial(comp, value) : function(f){
        return f(value);
      }
      return expand(...map(function(content){
        return typeof content === "function" ? resolve(content) : content;
      }, contents));
    }
  }
  return expand;
}

export const tag = partially(expansive(function(name, ...contents){ //partially guarantees calling tag always produces a factory
  return IReduce.reduce(contents, add, document.createElement(name));
}));

export const frag = expansive(function(...contents){
  return IReduce.reduce(contents, add, document.createDocumentFragment());
});

function selects(pred){
  return function(el){
    return matches(el, pred);
  }
}

export function closest(self, selector){
  let target = self.parentNode;
  while(target){
    if (matches(target, selector)){
      return target;
    }
    target = target.parentNode;
  }
}

function sel2(pred, context){
  return filter(selects(pred), descendants(context));
}

function sel1(pred){
  return sel2(pred, document);
}

function sel0(){
  return descendants(document);
}

export const sel = overload(sel0, sel1, sel2);

export function descendants(self){
  const children = IHierarchy.children(self);
  const grandchildren = mapcat(descendants, children);
  return concat(children, grandchildren);
}

function follow(f){
  return function step(self){
    const other = f(self);
    return other ? cons(other, step(other)) : EMPTY;
  }
}

export const parents      = follow(IHierarchy.parent);
export const prevSiblings = follow(IHierarchy.prevSibling);
export const nextSiblings = follow(IHierarchy.nextSibling);
export const ancestors    = parents;

export function siblings(self){
  return concat(prevSiblings(self), nextSiblings(self));
}

export function andSelf(f, coll){
  return concat(ISeqable.seq(coll), f(coll));
}

const hidden = {style: "display: none;"};

export function toggle(self){
  return transpose(self, hidden);
}

export function hide(self){
  return add(self, hidden);
}

export function show(self){
  return del(self, hidden);
}

function prop2(self, key){
  return self[key];
}

function prop3(self, key, value){
  self[key] = value;
}

export const prop = overload(null, null, prop2, prop3);

function value1(self){
  return self.value != null ? self.value : null;
}

function value2(self, value){
  if (self.value != null) {
    self.value = value;
  }
}

export const value = overload(null, value1, value2);

function text1(self){
  return self.nodeType === Node.TEXT_NODE ? self.data : null;
}

function text2(self, text){
  if (self.nodeType === Node.TEXT_NODE) {
    self.data = text;
  }
}

export const text = overload(null, text1, text2);

function html1(self){
  return self.innerHTML;
}

function html2(self, html){
  self.innerHTML = html;
}

export const html = overload(null, html1, html2);