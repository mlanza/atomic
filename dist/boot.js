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
define('context', function(){
  return {};
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
    HTMLDocument: window.HTMLDocument || window.Document,
    XMLDocument: window.XMLDocument || window.Document
  }
});
define('atomic/core', ["/dist/atomic/core.js"], function(core){
  return Object.assign(core.placeholder, core.impart(core, core.partly));
});
define('atomic/dom', ["atomic/core", "/dist/atomic/dom.js"], function(core, dom){
  return core.impart(dom, core.partly);
});
define('atomic/immutables', ["atomic/core", "/dist/atomic/immutables.js"], function(core, immutables){
  return core.impart(immutables, core.partly);
});
define('atomic/reactives', ["atomic/core", "/dist/atomic/reactives.js"], function(core, reactives){
  return core.impart(reactives, core.partly);
});
define('atomic/repos', ["atomic/core", "/dist/atomic/repos.js"], function(core, repos){
  return core.impart(repos, core.partly);
});
define('atomic/transducers', ["atomic/core", "/dist/atomic/transducers.js"], function(core, transducers){
  return core.impart(transducers, core.partly);
});
define('atomic/transients', ["atomic/core", "/dist/atomic/transients.js"], function(core, transients){
  return core.impart(transients, core.partly);
});
define('atomic/validates', ["atomic/core", "/dist/atomic/validates.js"], function(core, validates){
  return core.impart(validates, core.partly);
});
define('atomic/draw', ["atomic/core", "/dist/atomic/draw.js"], function(core, draw){
  return core.impart(draw, core.partly);
});
define('atomic', ['atomic/core', 'atomic/dom', 'atomic/immutables', 'atomic/reactives', 'atomic/transducers', 'atomic/transients', 'atomic/repos', 'atomic/validates', 'atomic/draw'], function(core, dom, immutables, reactives, transducers, transients, repos, validates, draw){
  return Object.assign(core, { //for in-browser testing, not for production use.
    core: core,
    dom: dom,
    immutables: immutables,
    reactives: reactives,
    transducers: transducers,
    transients: transients,
    validates: validates,
    draw: draw,
    repos: repos
  });
});