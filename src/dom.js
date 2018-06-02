import {implement} from './types/protocol';
import {overload, constantly, identity, subj} from "./core";
import {EMPTY, lazySeq, cons, apply, concat, partial, partially, comp, satisfies, compact, flatten, detect, filter, remove, each, map, mapcat, selfish} from "./types";
import {IHierarchy, IArray, IReduce, ISeqable} from "./protocols";
import {has, inject, yank, transpose, matches} from "./multimethods";
export {has, inject, yank, transpose, matches} from "./multimethods";

export function expansive(f){
  function expand(...xs){
    const contents = IArray.toArray(compact(flatten(xs)));
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
  return IReduce.reduce(contents, inject, document.createElement(name));
}));

export const frag = expansive(function(...contents){
  return IReduce.reduce(contents, inject, document.createDocumentFragment());
});

export function closest(self, selector){
  let target = self.parentNode;
  while(target){
    if (matches(target, selector)){
      return target;
    }
    target = target.parentNode;
  }
}

const matching = subj(matches);

function sel2(context, pred){
  return filter(matching(pred), descendants(context));
}

function sel1(pred){
  return sel2(document, pred);
}

function sel0(){
  return descendants(document);
}

export const sel = overload(sel0, sel1, sel2);

function downward(f){
  return function down(self){
    const xs = f(self),
          ys = mapcat(down, xs);
    return concat(xs, ys);
  }
}

function upward(f){
  return function up(self){
    const other = f(self);
    return other ? cons(other, up(other)) : EMPTY;
  }
}

export const descendants  = downward(IHierarchy.children);
export const parents      = upward(IHierarchy.parent);
export const prevSiblings = upward(IHierarchy.prevSibling);
export const nextSiblings = upward(IHierarchy.nextSibling);
export const ancestors    = parents;

export function siblings(self){
  return concat(prevSiblings(self), nextSiblings(self));
}

const hidden = {style: "display: none;"};

export function toggle(self){
  return transpose(self, hidden);
}

export function hide(self){
  return inject(self, hidden);
}

export function show(self){
  return yank(self, hidden);
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