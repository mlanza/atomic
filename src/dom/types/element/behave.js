import * as _ from "atomic/core";
import * as $ from "atomic/shell";
import * as p from "../../protocols/concrete.js";
import {isMountable} from "../../protocols/imountable/concrete.js"
import {IHtml, IValue, IText, IContent, IHideable, IEmbeddable, ISelectable} from "../../protocols.js";
import {isElement} from "../element/construct.js";
import {matches, hidden, remove as omit} from "../../shared.js";

export function hide(el){
  el.style.display = "none";
}

export function show(el){
  el.style.display = "";
}

function toggles4(on, off, want, self){
  return want(self) ? on(self) : off(self);
}

function toggles5(on, off, _, self, want){
  return want ? on(self) : off(self);
}

const toggles = _.overload(null, null, null, null, toggles4, toggles5);
const toggle = _.partial(toggles, show, hide, hidden);

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

function contains2(self, key){
  return self.hasAttribute(key);
}

const contains = _.overload(null, _.constantly(_.looseEq), contains2);

function parent(self){
  return self && self.parentNode;
}

const parents = _.upward(function(self){
  return self && self.parentElement;
});

const root = _.comp(_.last, _.upward(parent));

function closest(self, selector){
  let target = self;
  while(target){
    if (matches(target, selector)){
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

function includes(self, target){
  if (_.isArray(target)){
    const [key, value] = target;
    return _.contains(self, key, value);
  } else {
    return !!_.detect(_.isIdentical(target, ?), children(self));
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

function chan2(el, key) {
  return $.observable(function(observer){
    return on3(el, key, $.pub(observer, ?));
  });
}

function chan3(el, key, selector){
  return $.observable(function(observer){
    return on4(el, key, selector, $.pub(observer, ?));
  });
}

const chan = _.overload(null, null, chan2, chan3);

function on3(el, key, callback){
  if (key.indexOf(" ") > -1) {
    return _.does(..._.mapa(on3(el, ?, callback), key.split(" ")));
  } else {
    el.addEventListener(key, callback);
    return function(){
      el.removeEventListener(key, callback);
    }
  }
}

function on4(el, key, selector, callback){
  return on3(el, key, function(e){
    if (e.target.matches(selector)) {
      callback.call(e.target, e);
    } else {
      const target = _.closest(e.target, selector);
      if (target && el.contains(target)) {
        callback.call(target, e);
      }
    }
  });
}

export const on = _.overload(null, null, null, on3, on4);
export const ihierarchy = _.implement(_.IHierarchy, {root, parent, parents, closest, children, descendants, nextSibling, nextSiblings, prevSibling, prevSiblings, siblings});
export const icontents = _.implement(IContent, {contents});
export const ievented = _.implement($.IEvented, {on, chan, trigger});
export const iselectable = _.implement(ISelectable, {sel, sel1});

export default _.does(
  ihierarchy,
  icontents,
  ievented,
  iselectable,
  _.implement($.ITopic, _.itopic(assoc, dissoc, {equals: _.looseEq})),
  _.keying("Element"),
  _.implement(_.IReducible, {reduce}),
  _.implement(IValue, {value}),
  _.implement(IText, {text}),
  _.implement(IHtml, {html}),
  _.implement(IEmbeddable, {embeddables}),
  _.implement($.IEmptyableCollection, {empty}),
  _.implement($.IInsertable, {before, after}),
  _.implement(_.IInclusive, {includes}),
  _.implement(IHideable, {show, hide, toggle}),
  _.implement($.IOmissible, {omit}),
  _.implement(_.ICloneable, {clone}),
  _.implement($.IAppendable, {append}),
  _.implement($.IPrependable, {prepend}),
  _.implement($.ICollection, {conj}),
  _.implement(_.ILookup, {lookup}),
  _.implement(_.IMap, {keys, vals}),
  _.implement($.IMap, {dissoc}),
  _.implement(_.IAssociative, {contains}),
  _.implement($.IAssociative, {assoc}));
