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
  return p.reduce(p.appendChild, document.createElement(name), contents);
}));

export const frag = expansive(function(...contents){
  return p.reduce(p.appendChild, document.createDocumentFragment(), contents);
});