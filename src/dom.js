import {implement} from './core/types/protocol';
import {conj, yank, overload, constantly, identity, subj} from "./core";
import {split, trim, lazySeq, cons, apply, concat, partial, partially, comp, satisfies, compact, flatten, detect, filter, remove, each, mapa, map, mapcat, into, selfish} from "./core/types";
import {IHierarchy, IArray, IReduce, ISeqable, ICollection} from "./core/protocols";
import {reduce} from "./core";
import {matches} from "./core/multimethods";
export {matches} from "./core/multimethods";
export {parent, nextSibling, prevSibling, children, contents} from "./core";

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
  return into(document.createElement(name), contents);
}));

export const frag = expansive(function(...contents){
  return into(document.createDocumentFragment(), contents);
});

export function tags(...names){
  return reduce(function(memo, name){
    memo[name] = tag(name);
    return memo;
  }, {}, names);
}

export function closest(self, selector){
  let target = IHierarchy.parent(self);
  while(target){
    if (matches(target, selector)){
      return target;
    }
    target = IHierarchy.parent(target);
  }
}

const matching = subj(matches);

function sel2(pred, context){
  return filter(matching(pred), descendants(context));
}

function sel1(pred){
  return sel2(pred, document);
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
    return other ? cons(other, up(other)) : EmptyList.EMPTY;
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
  return ICollection.conj(self, hidden);
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