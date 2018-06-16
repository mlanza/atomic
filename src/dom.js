import {implement} from './core/types/protocol';
import EmptyList from './core/types/emptylist/construct';
import {conj, yank, overload, constantly, identity, subj} from "./core";
import {multiple, split, trim, lazySeq, cons, apply, concat, partial, partially, comp, satisfies, compact, flatten, detect, filter, remove, each, mapa, map, mapcat, into, selfish} from "./core/types";
import {IHierarchy, IArray, IReduce, ISeqable, ICollection} from "./core/protocols";
import {reduce} from "./core";
import {matches} from "./core/multimethods";
export {matches} from "./core/multimethods";
import * as core from "./core";

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

const hidden = {style: "display: none;"};

export const toggle = multiple(function(self){
  return transpose(self, hidden);
});

export const hide = multiple(function(self){
  return ICollection.conj(self, hidden);
})

export const show = multiple(function(self){
  return yank(self, hidden);
})

function prop2(self, key){
  return self[key];
}

function prop3(self, key, value){
  self[key] = value;
}

export const prop = multiple(overload(null, null, prop2, prop3));

function value1(self){
  return self.value != null ? self.value : null;
}

function value2(self, value){
  if (self.value != null) {
    self.value = value;
  }
}

export const value = multiple(overload(null, value1, value2));

function text1(self){
  return self.nodeType === Node.TEXT_NODE ? self.data : null;
}

function text2(self, text){
  if (self.nodeType === Node.TEXT_NODE) {
    self.data = text;
  }
}

export const text = multiple(overload(null, text1, text2));

function html1(self){
  return self.innerHTML;
}

function html2(self, html){
  self.innerHTML = html;
}

export const html = multiple(overload(null, html1, html2));