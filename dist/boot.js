requirejs.config({
  baseUrl: '/dist',
  waitSeconds: 0, //disabled to allow for interactive debugging
  shim: {
    'immutable': {
      export: 'Immutable'
    },
    'jquery': {
      exports: 'jQuery'
    },
    'qunit': {
      exports: 'QUnit'
    }
  }
});
define('promise', window.Promise ? [] : ["/dist/promise.js"], function(Promise){
  window.Promise || (window.Promise = Promise);
  return window.Promise;
});
define('fetch', window.fetch ? [] : ["promise", "/dist/fetch.js"], function(){
  return window.fetch;
});
define('symbol', window.Symbol ? [] : ["/dist/symbol-es6.js"], function(){
  return window.Symbol;
});
define('map', window.Map ? [] : ["/dist/collections-es6.js"], function(){
  return window.Map;
});
define('set', window.Set ? [] : ["/dist/collections-es6.js"], function(){
  return window.Set;
});
define('weak-map', window.WeakMap ? [] : ["/dist/collections-es6.js"], function(){
  return window.WeakMap;
});
define('weak-set', window.WeakSet ? [] : ["/dist/collections-es6.js"], function(){
  return window.WeakSet;
});
define('dom', [], function(){
  return {
    document: document,
    Location: Location,
    Element: Element,
    DocumentFragment: DocumentFragment,
    HTMLCollection: HTMLCollection,
    HTMLSelectElement: HTMLSelectElement,
    NodeList: NodeList,
    Comment: Comment,
    HTMLDocument: window.HTMLDocument || window.Document, //IE compatible
    XMLDocument: window.XMLDocument || window.Document //IE compatible
  }
});
(function(mods){
  define('atomic/core', [`/dist/${mods[0]}.js`], function(core){
    return Object.assign(core.placeholder, core.impart(core, core.partly));
  });
  for (var i = 1; i < mods.length; i++) {
    var mod = mods[i];
    define(mod, ["atomic/core", `/dist/${mod}.js`], function(core, tgt){
      return core.impart(tgt, core.partly);
    });
  }
  define('atomic', mods, function(core, dom, immutables, reactives, repos, transducers, transients, validates, draw){
    return { //exposed purely for in-browser repl use.
      core: core,
      dom: dom,
      immutables: immutables,
      reactives: reactives,
      transducers: transducers,
      transients: transients,
      validates: validates,
      draw: draw,
      repos: repos
    };
  });
})(["atomic/core", "atomic/dom", "atomic/immutables", "atomic/reactives", "atomic/repos", "atomic/transducers", "atomic/transients", "atomic/validates", "atomic/draw"]);