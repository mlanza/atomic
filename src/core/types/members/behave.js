import {overload, identity, effect} from "../../core";
import {implement} from '../protocol';
import {IText, IHtml, IValue, IFunctor, IHideable, IMatch, IHierarchy, IContent, ILookup, IAssociative, IReduce, INext} from '../../protocols';
import {mapcat, map, each, filter, compact} from "../lazyseq/concrete";
import {ihideable} from "../lazyseq/behave";
import {reduced} from "../reduced/construct";
import {members} from "./construct";
import {downward} from "../element/behave";
import {comp} from "../function/concrete";
import behave from "../series/behave";

function next(self){
  return INext.next(self.items);
}

function fmap(self, f){
  return members(mapcat(f, self.items));
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

const descendants = comp(members, downward(IHierarchy.children));

function nextSibling(self){
  return members(map(IHierarchy.nextSibling, self.items));
}

function nextSiblings(self){
  return fmap(self, IHierarchy.nextSiblings);
}

function prevSibling(self){
  return members(map(IHierarchy.prevSibling, self.items));
}

function prevSiblings(self){
  return fmap(self, IHierarchy.prevSiblings);
}

function siblings(self){
  return fmap(self, IHierarchy.siblings);
}

function sel(self, selector){
  return members(filter(function(node){
    return IMatch.matches(node, selector);
  }, descendants(self)));
}

function parent(self){
  return members(map(IHierarchy.parent, self.items));
}

function parents(self){
  return fmap(self, IHierarchy.parents);
}

function contents(self){
  return fmap(self, IContent.contents);
}

function text1(self){
  return compact(map(IText.text, self));
}

function text2(self, value){
  each(function(node){
    IText.text(node, value);
  }, self);
  return self;
}

export const text = overload(null, text1, text2);

function html1(self){
  return compact(map(IHtml.html, self));
}

function html2(self, value){
  each(function(node){
    IHtml.html(node, value);
  }, self);
  return self;
}

export const html = overload(null, html1, html2);

function value1(self){
  return compact(map(IValue.value, self));
}

function value2(self, value){
  each(function(node){
    IValue.value(node, value);
  }, self);
  return self;
}

export const value = overload(null, value1, value2);

export const itext  = implement(IText, {text});
export const ihtml  = implement(IHtml, {html});
export const ivalue = implement(IValue, {value});

export default effect(
  behave,
  ihideable,
  itext,
  ihtml,
  ivalue,
  implement(IText, {text}),
  implement(IHtml, {html}),
  implement(INext, {next}),
  implement(IAssociative, {assoc, contains}),
  implement(ILookup, {lookup}),
  implement(IContent, {contents}),
  implement(IHierarchy, {children, descendants, sel, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings, parent, parents}),
  implement(IFunctor, {fmap}));