import {implement} from '../protocol';
import {ISeqable, IHierarchy, IMatch, IContent} from '../../protocols';
import {constantly, effect} from '../../core';
import {comp} from "../function/concrete";
import {filter} from "../lazyseq/concrete";
import {members} from "../members/construct";
import {downward, upward, closest} from "../element/behave";
import EmptyList from "../emptylist/construct";

const descendants = comp(members, downward(IHierarchy.children));

function children(self){
  return ISeqable.seq(document.children);
}

function sel(self, selector){
  return members(filter(function(node){
    return IMatch.matches(node, selector);
  }, descendants(self)));
}

function contents(self){
  return ISeqable.seq(self.childNodes);
}

export default effect(
  implement(IContent, {contents}),
  implement(IHierarchy, {children, descendants, sel, nextSibling: constantly(null), nextSiblings: constantly(EmptyList.EMPTY), prevSibling: constantly(null), prevSiblings: constantly(EmptyList.EMPTY), siblings: constantly(EmptyList.EMPTY), parent: constantly(null), parents: constantly(EmptyList.EMPTY)}));