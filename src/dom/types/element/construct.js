import {satisfies, each, assoc, key, val, str, ISequential, IDescriptive} from 'cloe/core';
import {IEmbeddable} from "../../protocols";
import {_ as v} from "param.macro";

export default Element;

function inject(self, content){
  if (satisfies(IEmbeddable, content)) {
    IEmbeddable.embed(content, self);
  } else if (satisfies(ISequential, content)) {
    each(inject(self, v), content);
  } else if (satisfies(IDescriptive, content)){
    each(function(entry){
      assoc(self, key(entry), val(entry));
    }, content);
  } else {
    IEmbeddable.embed(str(content), self);
  }
}

export function element(name, ...contents){
  const el = document.createElement(name);
  each(inject(el, v), contents);
  return el;
}

export function isElement(self){
  return self instanceof Element;
}