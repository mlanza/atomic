requirejs.config({
  baseUrl: '../assets/',
  waitSeconds: 0, //disabled to allow for interactive debugging
  shim: {
    'polyfills/collections-es6': {
      deps: ["symbol"]
    },
    'immutable': {
      export: 'Immutable'
    },
    'jquery': {
      exports: 'jQuery'
    }
  },
  paths: {
    "text": "require/text",
    "css": "require/css",
    "promised": "require/promised"
  }
});
define('polyfill', String.prototype.repeat && String.prototype.padStart && String.prototype.padEnd && String.prototype.trimLeft && String.prototype.trimRight && Object.assign && Object.values && location.origin && Element.prototype.matches ? [] : ["polyfills/base"]);
define('promise', window.Promise ? [] : ["polyfills/es6-promise"], function(Promise){
  return window.Promise = Promise || window.Promise;
});
define('fetch', window.fetch ? [] : ["promise", "polyfills/fetch"], function(Promise, exports){
  return window.fetch = Object.assign({}, exports).fetch || window.fetch;
});
define('symbol', window.Symbol ? [] : ["polyfills/symbol-es6"], function(){
  return window.Symbol;
});
define('map', window.Map ? [] : ["polyfills/collections-es6"], function(){
  return window.Map;
});
define('set', window.Set ? [] : ["polyfills/collections-es6"], function(){
  return window.Set;
});
define('weak-map', window.WeakMap ? [] : ["polyfills/collections-es6"], function(){
  return window.WeakMap;
});
define('weak-set', window.WeakSet ? [] : ["polyfills/collections-es6"], function(){
  return window.WeakSet;
});
define('dom', [], function(){
  return {
    window: window,
    document: document,
    Window: Window,
    Text: Text,
    Element: Element,
    NodeList: NodeList,
    DocumentFragment: DocumentFragment,
    XMLDocument: window.XMLDocument || window.Document, //IE compatible
    HTMLDocument: window.HTMLDocument || window.Document, //IE compatible
    HTMLCollection: HTMLCollection,
    HTMLSelectElement: HTMLSelectElement,
    Comment: Comment,
    Location: Location
  }
});
(function(mods){
  define('atomic/core', ["../../assets/" + mods[0] + ".js", 'polyfill'], function(core){
    return Object.assign(core.placeholder, core.impart(core, core.partly));
  });
  for (var idx in mods) {
    var mod = mods[idx];
    define(mod, ["atomic/core", "../../assets/" + mod + ".js"], function(core, tgt){
      return core.impart(tgt, core.partly);
    });
  }
})(["atomic/core", "atomic/dom", "atomic/immutables", "atomic/reactives", "atomic/repos", "atomic/transducers", "atomic/transients", "atomic/validates", "atomic/draw"]);
define('atomic/imports', function(){
  return {
    "_": "atomic/core",
    "$": "atomic/reactives",
    "dom": "atomic/dom",
    "imm": "atomic/immutables",
    "t": "atomic/transducers",
    "mut": "atomic/transients",
    "vld": "atomic/validates",
    "draw": "atomic/draw",
    "repos": "atomic/repos"
  }
});
define('cmd', ["atomic/core", "atomic/imports", "promise"], function(_, defaults, Promise){
  function load(dest, name){
    return new Promise(function(resolve, reject){
      require([name], function(exported){
        var out = {};
        out[dest] = exported;
        resolve(out);
      });
    });
  }
  return function cmd(others){
    var target = this,
        imports = Object.assign({}, defaults, others),
        loading = [];
    for(var dest in imports){
      loading.push(load(dest, imports[dest]));
    }
    return _.fmap(Promise.all(loading), _.spread(Object.assign), _.tee(function(imported){
      console.log("Commands loaded.");
      Object.assign(target, imported);
    }));
  }
});
require(['cmd'], function(cmd){
  window.cmd = cmd;
});