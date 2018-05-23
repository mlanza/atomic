import {overload, constantly, identity} from "./core";
import {satisfies} from "./types";
import {IHierarchy, IHierarchicalSet} from "./protocols";
import * as t from "./types";
import * as p from "./protocols";
import * as s from "./sequences";

export function expansive(f){
  function expand(...xs){
    const contents = p.toArray(s.compact(s.flatten(xs)));
    return s.detect(function(content){
      return typeof content === "function";
    }, contents) ? step(contents) : f(...contents);
  }
  function step(contents){
    return function(value){
      const resolve = typeof value === "function" ? t.partial(t.comp, value) : function(f){
        return f(value);
      }
      return expand(...s.map(function(content){
        return typeof content === "function" ? resolve(content) : content;
      }, contents));
    }
  }
  return expand;
}

export const tag = t.partially(expansive(function(name, ...contents){ //partially guarantees calling tag always produces a factory
  return p.reduce(p.embed, document.createElement(name), contents);
}));

export const frag = expansive(function(...contents){
  return p.reduce(p.embed, document.createDocumentFragment(), contents);
});

function elements(map){
  return function(f){
    return function(coll){
      return s.distinct(s.compact(map(f, s.filter(function(el){
        return el !== document;
      }, coll instanceof Element ? p.seq([coll]) : p.seq(coll)))));
    }
  }
}

const mapping    = elements(s.map);
const mapcatting = elements(s.mapcat);

function selects(pred){
  return typeof pred === "string" ? function(el){
    return el.matches(pred);
  } : pred;
}

export function matches(el, selector){
  return el.matches(selector);
}

export function closest(pred, coll){ //TODO IMatch protocol?
  pred = selects(pred);
  return mapping(function(el){
    let target = el.parentNode;
    while(target && target !== document){
      if (pred(target)){
        return target;
      }
      target = target.parentNode;
    }
  }, coll);
}

function sel2(pred, context){
  return s.filter(selects(pred), descendants(context));
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
    memo = memo || t.EMPTY;
    return el[key] && el[key] !== document ? t.lazySeq(el[key], function(){
      return following(el[key], memo);
    }) : memo;
  }
}

const parentNodes         = follow("parentNode");
const prevElementSiblings = follow("prevElementSibling");
const nextElementSiblings = follow("nextElementSibling");

export const ancestors = mapcatting(function(el){
  const parents = parentNodes(el, t.EMPTY);
  return t.concat(parents, ancestors(parents));
});

export const descendants = mapcatting(function(el){
  const children = IHierarchy.children(el);
  return t.concat(children, descendants(children));
});

export const prevSiblings = mapcatting(prevElementSiblings);
export const nextSiblings = mapcatting(nextElementSiblings);

export const siblings = mapcatting(function(el){
  return t.concat(prevSiblings([el]), nextSiblings([el]));
});

export function andSelf(f, coll){
  return t.concat(p.seq(coll), f(coll));
}

export const parents = ancestors;

function prioritized(name, ...candidates){
  return function(self){
    const f = s.detect(function(candidate){
      return satisfies(candidate, self);
    }, candidates)[name];
    return f.apply(this, arguments);
  }
}

export const children = prioritized("children", IHierarchicalSet, IHierarchy);

