import {effect, overload, constantly} from '../../core';
import {implement} from '../../protocol';
import {IHierarchy} from '../../protocols';
import {elems} from '../../types/elems';

function parent(self){
  return self.el.parent;
}

function children(self){
  return elems(self.el.childNodes);
}

function nextSibling(self){
  return self.el.nextSibling;
}

function prevSibling(self){
  return self.el.previousSibling;
}

export default effect(
  implement(IHierarchy, {parent, children, nextSibling, prevSibling}));