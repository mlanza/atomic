import {overload, constantly, identity} from "./core";
import {EMPTY, lazySeq, concat, partial, partially, comp, satisfies, compact, flatten, detect, filter, remove, each, map, mapcat, mapping, mapcatting, elements} from "./types";
import {IContent, IHierarchy, IHierarchicalSet, IArr, IReduce, ISeqable} from "./protocols";
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
  return elements(filter(selects(pred), descendants(context)));
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

export function toggle(el){
  return transpose(el, {style: "display: none;"});
}

export function hide(el){
  return add(el, {style: "display: none;"});
}

export function show(el){
  return del(el, {style: "display: none;"});
}

function prop2(self, key){
  return map(function(el){
    return el[key];
  }, self);
}

function prop3(self, key, value){
  each(function(el){
    el[key] = value;
  }, self);
}

export const prop = overload(null, null, prop2, prop3);

function value1(self){
  return map(function(el){
    return el.value;
  }, remove(function(el){
    return el.value == null;
  }, self));
}

function value2(self, value){
  each(function(el){
    el.value = value;
  }, remove(function(el){
    return el.value == null;
  }, self));
}

export const value = overload(null, value1, value2);

function text1(self){
  return map(function(node){
    return node.data;
  }, filter(function(node){
    return node.nodeType === Node.TEXT_NODE;
  }, IContent.contents(self)));
}

function text2(self, text){
  each(function(node){
    node.data = text;
  }, filter(function(node){
    return node.nodeType === Node.TEXT_NODE;
  }, IContent.contents(self)));
}

export const text = overload(null, text1, text2);

function html1(self){
  return map(function(node){
    return node.innerHTML;
  }, self);
}

function html2(self, html){
  return each(function(node){
    return node.innerHTML = html;
  }, self);
}

export const html = overload(null, html1, html2);