import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as mut from "atomic/transients";
import * as p from "../../protocols/concrete.js";
import {isMountable} from "../../protocols/imountable/concrete.js"
import {IHtml, IValue, IText, IContent, IHideable, IEmbeddable, ISelectable} from "../../protocols.js";
import {nestedAttrs} from "../nested-attrs/construct.js";
import {isElement} from "../element/construct.js";
import {Text} from "dom";
import Symbol from "symbol";

const hides = ["display", "none"];
export const hidden = _.comp(_.includes(?, hides), nestedAttrs(?, "style"));
const toggle = _.partial(_.toggles, show, hide, hidden);

function hide(self){
  mut.conj(nestedAttrs(self, "style"), hides);
}

function show(self){
  mut.omit(nestedAttrs(self, "style"), hides); //TODO mut unconj
}

function embeddables(self){
  function embed(parent, add){
    if (isMountable(self)) {
      const detail = {parent};
      $.trigger(self, "mounting", {bubbles: true, detail});
      add(parent, self);
      $.trigger(self, "mounted" , {bubbles: true, detail});
    } else {
      add(parent, self);
    }
  }
  return [embed];
}

function append(self, content){
  p.embed(self, [content]);
}

function prepend(self, content){
  p.embed(function(parent, child){
    parent.insertBefore(child, parent.childNodes[0]);
  }, self, [content]);
}

function before(self, content){
  p.embed(function(parent, child){
    parent.insertBefore(child, self);
  }, _.parent(self), [content]);
}

function after(self, content){
  const ref = _.nextSibling(self);
  p.embed(function(parent, child){
    parent.insertBefore(child, ref);
  }, _.parent(self), [content]);
}

const conj = append;

function isAttrs(self){
  return !_.ako(self, Node) && _.descriptive(self);
}

function on3(el, key, callback){
  const $hub = el[Symbol.for(key)] ||= $.fromEvent(el, key);
  return $.sub($hub, callback);
}

function on4(el, key, selector, callback){
  const $hub = el[Symbol.for(_.str(key, "|", selector))] ||= $.fromEvent(el, key, selector);
  return $.sub($hub, callback);
}

const on = _.overload(null, null, null, on3, on4);

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

//TODO too overloaded, impure protocol
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

function value1(self){
  switch (self.getAttribute("type")){
    case "checkbox":
      return self.checked;
    case "number":
    case "range":
      return _.maybe(self.value, _.blot, parseFloat);
    default:
      return "value" in self ? self.value : null;
  }
}

function value2(self, value){
  switch (self.getAttribute("type")){
    case "checkbox":
      self.checked = !!value;
      return;
    case "number":
    case "range":
      self.value = _.maybe(value, _.blot, parseFloat);
      return;
    default:
      if ("value" in self) {
        value = value == null ? "" : value;
        if (self.value != value) {
          self.value = value;
        }
      } else {
        throw new TypeError("Type does not support value property.");
      }
  }
}

export const value = _.overload(null, value1, value2);

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
    p.embed(self, [html]);
  }
  return self;
}

export const html = _.overload(null, html1, html2);

function reduce(self, f, init){
  return _.reduce(f, init, _.descendants(self));
}

export const ihierarchy = _.implement(_.IHierarchy, {root, parent, parents, closest, children, descendants, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings});
export const icontents = _.implement(IContent, {contents});
export const ievented = _.implement($.IEvented, {on, trigger});
export const iselectable = _.implement(ISelectable, {sel, sel1});

export default _.does(
  ihierarchy,
  icontents,
  ievented,
  iselectable,
  _.naming(?, Symbol("Element")),
  _.implement(_.IReduce, {reduce}),
  _.implement(IValue, {value}),
  _.implement(IText, {text}),
  _.implement(IHtml, {html}),
  _.implement(IEmbeddable, {embeddables}),
  _.implement(mut.ITransientEmptyableCollection, {empty}),
  _.implement(mut.ITransientInsertable, {before, after}),
  _.implement(_.IInclusive, {includes}),
  _.implement(IHideable, {show, hide, toggle}),
  _.implement(mut.ITransientOmissible, {omit}),
  _.implement(_.IClonable, {clone}),
  _.implement(mut.ITransientAppendable, {append}),
  _.implement(mut.ITransientPrependable, {prepend}),
  _.implement(mut.ITransientCollection, {conj}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IMap, {keys, vals}),
  _.implement(mut.ITransientMap, {dissoc}),
  _.implement(_.IAssociative, {contains}),
  _.implement(mut.ITransientAssociative, {assoc}));
