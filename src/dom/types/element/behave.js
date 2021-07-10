import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as mut from "atomic/transients";
import * as p from "../../protocols/concrete.js";
import {isMountable} from "../../protocols/imountable/concrete.js"
import {IHtml, IText, IValue, IContent, IHideable, IEmbeddable, ISelectable} from "../../protocols.js";
import {nestedAttrs} from "../nested-attrs/construct.js";
import {isElement} from "../element/construct.js";
import {Text} from "dom";

const hides = ["display", "none"];
export const hidden = _.comp(_.includes(?, hides), nestedAttrs(?, "style"));
const toggle = _.partial(_.toggles, show, hide, hidden);

function hide(self){
  mut.conj(nestedAttrs(self, "style"), hides);
}

function show(self){
  mut.omit(nestedAttrs(self, "style"), hides); //TODO mut unconj
}

function embed(self, parent, referenceNode) {
  if (isMountable(self)) {
    const detail = {parent};
    $.trigger(self, "mounting", {bubbles: true, detail});
    if (referenceNode) {
      parent.insertBefore(self, referenceNode);
    } else {
      parent.appendChild(self);
    }
    $.trigger(self, "mounted" , {bubbles: true, detail});
  } else {
    if (referenceNode) {
      parent.insertBefore(self, referenceNode);
    } else {
      parent.appendChild(self);
    }
  }
  return self;
}

function append(self, content){
  p.embed(content, self);
}

function prepend(self, content){
  p.embed(content, self, self.childNodes[0]);
}

function before(self, content){
  p.embed(content, _.parent(self), self);
}

function after(self, content){
  p.embed(content, _.parent(self), _.nextSibling(self));
}

const conj = append;

function check(self, selector){
  return _.isString(selector);
}

const matches = _.pre(function matches(self, selector){
  return self.matches(selector);
}, check);

function isText(self){
  return self && self.constructor === Text;
}

function isAttrs(self){
  return !(self instanceof Node) && _.descriptive(self);
}

function eventContext(catalog){
  function on3(self, key, callback){
    _.isString(key) ? _.each(function(key){
      self.addEventListener(key, callback);
    }, _.compact(key.split(" "))) : self.addEventListener(key, callback);
    return self;
  }

  function on4(self, key, selector, callback){
    on3(self, key, _.doto(function(e){
      if (_.matches(e.target, selector)) {
        callback.call(e.target, e);
      } else {
        const found = _.closest(e.target, selector);
        if (found && self.contains(found)) {
          callback.call(found, e);
        }
      }
    }, _.assoc(catalog, callback, ?)));
    return self;
  }

  const on = _.overload(null, null, null, on3, on4);

  function off(self, key, callback){
    self.removeEventListener(key, _.get(catalog, callback, callback));
    return self;
  }

  return {on, off};
}

const {on, off} = eventContext(_.weakMap());

const eventConstructors = {
  "click": MouseEvent,
  "mousedown": MouseEvent,
  "mouseup": MouseEvent,
  "mouseover": MouseEvent,
  "mousemove": MouseEvent,
  "mouseout": MouseEvent,
  "focus": FocusEvent,
  "blur": FocusEvent
}

const eventDefaults = {
  bubbles: true
}

function trigger(self, key, options){
  options = Object.assign({}, eventDefaults, options || {});
  const Event = eventConstructors[key] || CustomEvent;
  let event = null;
  try {
    event = new Event(key, options);
  } catch (ex) {
    event = self.ownerDocument.createEvent('HTMLEvents');
    event.initEvent(key, options.bubbles || false, options.cancelable || false);
    event.detail = options.detail;
  }
  self.dispatchEvent(event);
  return self;
}

function contents(self){
  return self.contentDocument || _.seq(self.childNodes);
}

function assoc(self, key, value){
  self.setAttribute(key, _.str(value));
}

function dissoc(self, key){
  self.removeAttribute(key);
}

function keys2(self, idx){
  return idx < self.attributes.length ? _.lazySeq(function(){
    return _.cons(self.attributes[idx].name, keys2(self, idx + 1));
  }) : _.emptyList();
}

function keys(self){
  return keys2(self, 0);
}

function vals2(self, idx){
  return idx < self.attributes.length ? _.lazySeq(function(){
    return _.cons(self.attributes[idx].value, keys2(self, idx + 1));
  }) : _.emptyList();
}

function vals(self){
  return vals2(self, 0);
}

function lookup(self, key){
  return self.getAttribute(key);
}

function contains(self, key){
  return self.hasAttribute(key);
}

function parent(self){
  return self && self.parentNode;
}

const parents = _.upward(function(self){
  return self && self.parentElement;
});

const root = _.comp(_.last, _.upward(parent));

export function closest(self, selector){
  let target = self;
  while(target){
    if (_.matches(target, selector)){
      return target;
    }
    target = _.parent(target);
  }
}

function sel(self, selector){
  return self.querySelectorAll(selector);
}

function sel1(self, selector){
  return self.querySelector(selector);
}

function children(self){
  return _.seq(self.children || _.filter(isElement, self.childNodes)); //IE has no children on document fragment
}

const descendants = _.downward(_.children);

function nextSibling(self){
  return self.nextElementSibling;
}

const nextSiblings = _.upward(_.nextSibling);

function prevSibling(self){
  return self.previousElementSibling;
}

const prevSiblings = _.upward(_.prevSibling);

export function siblings(self){
  return _.concat(prevSiblings(self), nextSiblings(self));
}

function omit1(self){
  omit2(parent(self), self);
}

function omit2(self, node){
  if (isElement(node)) {
    self.removeChild(node);
  } else if (_.satisfies(_.ISequential, node)) {
    const keys = node;
    _.each(self.removeAttribute.bind(self), keys);
  } else if (isAttrs(node)) {
    const attrs = node;
    _.each(function(entry){
      const key = entry[0], value = entry[1];
      let curr = lookup(self, key);
      if (_.isObject(curr)){
        curr = mapa(function(pair){
          return pair.join(": ") + "; ";
        }, _.toArray(curr)).join("").trim();
      }
      curr == value && dissoc(self, key);
    }, attrs);
  } else if (_.isString(node)) {
    node = includes(self, node);
    self.removeChild(node);
  }
}

export const omit = _.overload(null, omit1, omit2);

function includes(self, target){
  if (isElement(target)) {
    return _.detect(_.isIdentical(target, ?), children(self));
  } else if (_.satisfies(_.ISequential, target)){
    const keys = target;
    return _.reduce(function(memo, key){
      return memo ? self.hasAttribute(key) : reduced(memo);
    }, true, keys);
  } else if (isAttrs(target)) {
    return _.reducekv(function(memo, key, value){
      return memo ? lookup(self, key) == value : reduced(memo);
    }, true, target);
  } else {
    return _.detect(_.isString(target) ? function(node){
      return node.nodeType === Node.TEXT_NODE && node.data === target;
    } : function(node){
      return node === target;
    }, contents(self));
  }
}

function empty(self){
  while (self.firstChild) {
    self.removeChild(self.firstChild);
  }
}

function clone(self){
  return self.cloneNode(true);
}

function text1(self){
  return self.textContent;
}

function text2(self, text){
  self.textContent = text == null ? "" : text;
}

export const text = _.overload(null, text1, text2);

function html1(self){
  return self.innerHTML;
}

function html2(self, html){
  if (_.isString(html)){
    self.innerHTML = html;
  } else {
    empty(self);
    p.embed(html, self);
  }
  return self;
}

export const html = _.overload(null, html1, html2);

function value1(self){
  return "value" in self ? self.value : null;
}

function value2(self, value){
  if ("value" in self) {
    value = value == null ? "" : value;
    if (self.value != value) {
      self.value = value;
    }
  } else {
    throw new TypeError("Type does not support value property.");
  }
}

export const value = _.overload(null, value1, value2);

function reduce(self, f, init){
  return _.reduce(f, init, _.descendants(self));
}

export const ihierarchy = _.implement(_.IHierarchy, {root, parent, parents, closest, children, descendants, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings});
export const icontents = _.implement(IContent, {contents});
export const ievented = _.implement($.IEvented, {on, off, trigger});
export const iselectable = _.implement(ISelectable, {sel, sel1});

export default _.does(
  ihierarchy,
  icontents,
  ievented,
  iselectable,
  _.implement(_.IReduce, {reduce}),
  _.implement(IText, {text}),
  _.implement(IHtml, {html}),
  _.implement(IValue, {value}),
  _.implement(IEmbeddable, {embed}),
  _.implement(mut.ITransientEmptyableCollection, {empty}),
  _.implement(mut.ITransientInsertable, {before, after}),
  _.implement(_.IInclusive, {includes}),
  _.implement(IHideable, {show, hide, toggle}),
  _.implement(mut.ITransientOmissible, {omit}),
  _.implement(_.IMatchable, {matches}),
  _.implement(_.IClonable, {clone}),
  _.implement(mut.ITransientAppendable, {append}),
  _.implement(mut.ITransientPrependable, {prepend}),
  _.implement(mut.ITransientCollection, {conj}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IMap, {keys, vals}),
  _.implement(mut.ITransientMap, {dissoc}),
  _.implement(_.IAssociative, {contains}),
  _.implement(mut.ITransientAssociative, {assoc}));
