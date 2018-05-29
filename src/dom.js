import {overload, constantly, identity} from "./core";
import {EMPTY, lazySeq, concat, partial, partially, comp, satisfies, compact, flatten, detect, filter, map, mapcat, mapping, mapcatting} from "./types";
import {IHierarchy, IHierarchicalSet, IArr, IReduce, ISeqable} from "./protocols";
import {add, matches} from "./multimethods";
export {has, add, remove, transpose, matches} from "./multimethods";

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
  return IReduce.reduce(add, document.createElement(name), contents);
}));

export const frag = expansive(function(...contents){
  return IReduce.reduce(add, document.createDocumentFragment(), contents);
});

function selects(pred){
  return function(el){
    return matches(el, pred);
  }
}

export function closest(what, coll){
  return mapping(function(el){
    let target = el.parentNode;
    while(target && target !== document){
      if (matches(target, what)){
        return target;
      }
      target = target.parentNode;
    }
  })(coll);
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

function follow(key){
  return function following(el, memo){
    memo = memo || EMPTY;
    return el[key] && el[key] !== document ? lazySeq(el[key], function(){
      return following(el[key], memo);
    }) : memo;
  }
}

const parentNodes         = follow("parentNode");
const prevElementSiblings = follow("prevElementSibling");
const nextElementSiblings = follow("nextElementSibling");

export const ancestors = mapcatting(function(el){
  const parents = parentNodes(el, EMPTY);
  return concat(parents, ancestors(parents));
});

export const descendants = mapcatting(function(el){
  const children = IHierarchy.children(el);
  return concat(children, descendants(children));
});

export const prevSiblings = mapcatting(prevElementSiblings);
export const nextSiblings = mapcatting(nextElementSiblings);

export const siblings = mapcatting(function(el){
  return concat(prevSiblings([el]), nextSiblings([el]));
});

export function andSelf(f, coll){
  return concat(ISeqable.seq(coll), f(coll));
}

export const parents = ancestors;

function prioritized(name, ...candidates){
  return function(self){
    const f = detect(function(candidate){
      return satisfies(candidate, self);
    }, candidates)[name];
    return f.apply(this, arguments);
  }
}

export const children = prioritized("children", IHierarchicalSet, IHierarchy);