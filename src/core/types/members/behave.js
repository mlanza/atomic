import {overload, identity, effect, subj} from "../../core";
import {implement} from '../protocol';
import {IFunctor, IHierarchy, IContent, ILookup, IAssociative, IReduce} from '../../protocols';
import {mapcat, map, each, filter} from "../lazyseq/concrete";
import {reduced} from "../reduced/construct";
import {members} from "./construct";
import {downward} from "../element/behave";
import behave from "../series/behave";
import {matches} from "../../multimethods/matches";

const matching = subj(matches);

function fmap(self, f){
  return self.constructor.from(mapcat(f, self.items));
}

function lookup(self, key){
  return map(function(node){
    return ILookup.lookup(node, key);
  }, self);
}

function assoc(self, key, value){
  return each(function(node){
    IAssociative.assoc(node, key, value);
  }, self);
  return self;
}

function contains(self, key){
  return IReduce.self(self, function(memo, node){
    return memo ? reduced(memo) : IAssociative.contains(node, key);
  }, false);
}

function children(self){
  return fmap(self, IHierarchy.children);
}

const descendants = downward(IHierarchy.children);

function nextSibling(self){
  return self.constructor.from(map(IHierarchy.nextSibling, self.items));
}

function nextSiblings(self){
  return fmap(self, IHierarchy.nextSiblings);
}

function prevSibling(self){
  return self.constructor.from(map(IHierarchy.prevSibling, self.items));
}

function prevSiblings(self){
  return fmap(self, IHierarchy.prevSiblings);
}

function siblings(self){
  return fmap(self, IHierarchy.siblings);
}

function sel(self, selector){
  return members(filter(matching(selector), descendants(self)));
}

function parent(self){
  return self.constructor.from(map(IHierarchy.parent, self.items));
}

function parents(self){
  return fmap(self, IHierarchy.parents);
}

function contents(self){
  return fmap(self, IContent.contents);
}

export default effect(
  behave,
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IContent, {contents}),
  implement(IHierarchy, {children, descendants, sel, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings, parent, parents}),
  implement(IFunctor, {fmap}));