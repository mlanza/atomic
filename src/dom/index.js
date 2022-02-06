import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as mut from "atomic/transients";
import * as p from "./protocols/concrete.js";
import {element} from "./types/element/construct.js";
import {mounts} from "./protocols/imountable/concrete.js";
import {IValue} from "./protocols/ivalue/instance.js";
import {IEmbeddable} from "./protocols/iembeddable/instance.js";
import {isHTMLDocument} from "./types/html-document/construct.js";
import * as T from "./types.js";
export * from "./types.js";
export * from "./protocols.js";
export * from "./protocols/concrete.js";
export * from "./shared.js";
export {append, prepend, before, after, omit, empty} from "atomic/transients"; //TODO is reexporting a good idea?
import {behaviors} from "./behaviors.js";
export * from "./behaviors.js";
export const behave = _.behaves(behaviors, ?);

export const ready = _.assume(isHTMLDocument, document, function ready(document, callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
});

export const hash = $.shared($.cell, function(window){
  return $.computed(function(e){
    return window.location.hash;
  }, $.chan(window, "hashchange"));
});

export const focus = $.shared($.cell, function(el){
  return $.toggles(el, "focus", "blur", function(){
    return el === el.ownerDocument.activeElement;
  });
});

export const click = $.shared($.subject, function(el){
  return $.chan(el, "click");
});

export const hover = $.shared($.cell, function(el){
  return $.toggles(el, "mouseenter", "mouseleave", _.constantly(false));
});

export const depressed = $.shared($.cell, function(el){
  return $.seed(
    _.constantly([]),
    $.pipe(
      $.chan(el, "keydown keyup"),
        t.scan(function(memo, e){
          if (e.type === "keyup") {
            memo = _.filtera(_.notEq(e.key, ?), memo);
          } else if (!_.includes(memo, e.key)) {
            memo = _.conj(memo, e.key);
          }
          return memo;
        }, []),
        t.dedupe()));
});

function attr2(self, key){
  if (_.isString(key)) {
    return self.getAttribute(key);
  } else {
    const pairs = key;
    _.eachkv(attr3(self, ?, ?), pairs);
  }
}

function attr3(self, key, value){
  self.setAttribute(key, _.str(value));
}

function attrN(self, ...kvps){
  const stop = kvps.length - 1;
  for(let i = 0; i <= stop; i += 2){
    attr3(self, kvps[i], kvps[i + 1]);
  }
}

export const attr = _.overload(null, null, attr2, attr3, attrN);

function removeAttr2(self, key){
  self.removeAttribute(key);
}

export const removeAttr = _.overload(null, null, removeAttr2, _.doing(removeAttr2));

function prop3(self, key, value){
  self[key] = value;
}

function prop2(self, key){
  return self[key];
}

export const prop = _.overload(null, null, prop2, prop3);

export function addStyle(self, key, value) {
  self.style[key] = value;
}

function removeStyle2(self, key) {
  self.style.removeProperty(key);
}

function removeStyle3(self, key, value) {
  if (self.style[key] === value) {
    self.style.removeProperty(key);
  }
}

export const removeStyle = _.overload(null, null, removeStyle2, removeStyle3);

export function addClass(self, name){
  self.classList.add(name);
}

export function removeClass(self, name){
  self.classList.remove(name);
}

function toggleClass2(self, name){
  toggleClass3(self, name, !self.classList.contains(name));
}

function toggleClass3(self, name, want){
  self.classList[want ? "add" : "remove"](name);
}

export const toggleClass = _.overload(null, null, toggleClass2, toggleClass3);

export function hasClass(self, name){
  return self.classList.contains(name);
}

function mount3(render, config, el){
  return mount4(_.constantly(null), render, config, el);
}

function mount4(create, render, config, el){
  config.what && $.trigger(el, config.what + ":installing", {bubbles: true, detail: {config}});
  $.trigger(el, "installing", {bubbles: true, detail: {config}});

  const bus = create(config),
        detail = {config, bus};

  el |> $.on(?, "mounting mounted", function(e){
    Object.assign(e.detail, detail);
  });
  el |> render(?, config, bus);
  el |> mounts;

  config.what && $.trigger(el, config.what + ":installed", {bubbles: true, detail});
  $.trigger(el, "installed", {bubbles: true, detail});
  return bus;
}

export const mount = _.overload(null, null, null, mount3, mount4);

export const markup = _.obj(function(name, ...contents){
  const attrs = _.map(function(entry){
    return _.template("{0}=\"{1}\"", _.key(entry), _.replace(_.val(entry), /"/g, '&quot;'));
  }, _.apply(_.merge, _.filter(_.isObject, contents)));
  const content = _.map(_.str, _.remove(_.isObject, contents));
  return _.join("", _.concat(["<" + name + " " + _.join(" ", attrs) + ">"], content, "</" + name + ">"));
}, Infinity);

function tags0(){
  return tags1(element(document));
}

const tags1 = _.factory;

function tags2(engine, keys){
  return tags3(engine, _.identity, keys);
}

function tags3(engine, f, keys){
  const tag = tags1(engine);
  return _.reduce(function(memo, key){
    memo[key] = f(tag(key));
    return memo;
  }, {}, keys);
}

export const tags = _.overload(tags0, tags1, tags2, tags3);
export const tag = tags();

export const option = _.assume(isHTMLDocument, document, _.overload(null, null, function option(document, entry){
  return element(document, "option", {value: _.key(entry)}, _.val(entry));
}, function(document, key, value){
  return element(document, "option", {value: key}, value);
}));

export const select = _.called(_.assume(isHTMLDocument, document, function select(document, entries, ...args){
  return element(document, "select", _.map(option(document, ?), entries), ...args);
}), "`select` is deprecated — use `select` tag with `option(key, value),...` or `map(option, entries)`.");

export const checkbox = _.called(_.assume(isHTMLDocument, document, function checkbox(document, ...args){
  const el = element(document, 'input', {type: "checkbox"}, ...args);
  function value1(el){
    return el.checked;
  }
  function value2(el, checked){
    el.checked = checked;
  }
  const value = _.overload(null, value1, value2);
  return _.doto(el,
    _.specify(IValue, {value: value}));
}), "`checkbox` is deprecated — use `input` tag with {type: 'checkbox'} instead.");

export const input = _.called(_.assume(isHTMLDocument, document, function input(document, ...args){
  return element(document, 'input', {type: "text"}, ...args);
}), "`input` is deprecated — use `input` tag with {type: 'text'}.");

export const textbox = input;

_.extend(_.ICoercible, {toFragment: null});

export const toFragment = _.toFragment;

(function(){

  function embeddables(self, doc){
    return [(doc || document).createTextNode(self)];
  }

  function toFragment(self, doc){
    return (doc || document).createRange().createContextualFragment(self);
  }

  _.doto(String,
    _.implement(_.ICoercible, {toFragment}),
    _.implement(IEmbeddable, {embeddables}));

})();

(function(){

  function embeddables(self, doc){
    return [(doc || document).createTextNode(self)];
  }

  _.doto(Number, _.implement(IEmbeddable, {embeddables}));

})();

(function(){

  function embeddables(self, doc){
    function embed(el){
      _.each(function(entry){
        mut.assoc(el, _.key(entry), _.val(entry)); //attributes
      }, self);
    }
    return [embed];
  }

  _.doto(Object, _.implement(IEmbeddable, {embeddables}));

})();

(function(){

  function toFragment(self, doc){
    return (doc || document).createRange().createContextualFragment("");
  };

  _.doto(_.Nil,
    _.implement(_.ICoercible, {toFragment}),
    _.implement(IEmbeddable, {embeddables: _.emptyList}));

})();

_.ICoercible.addMethod([NodeList, Array], Array.from);
_.ICoercible.addMethod([T.SpaceSeparated, Array], _.comp(Array.from, _.seq));
_.ICoercible.addMethod([T.NestedAttrs, Object], _.deref);

function stylesheet2(href, document){
  const stylesheet = element(document, "link", {type: "text/css", rel: "stylesheet", href});
  mut.append(document.body, stylesheet);
}

function stylesheet1(href){
  stylesheet2(href, document);
}

export const stylesheet = _.overload(null, stylesheet1, stylesheet2);
