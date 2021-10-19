requirejs.config({
  baseUrl: '../assets/',
  waitSeconds: 0, //disabled to allow for interactive debugging
  shim: {
    'polyfills/collections-es6': {
      deps: ["symbol"]
    },
    'jquery': {
      exports: 'jQuery'
    }
  },
  paths: {
    "assets": "../assets/",
    "vendor": "../assets/vendor",
    "qunit": "vendor/qunit",
    "immutable": "vendor/immutable",
    "hash": "vendor/hash",
    "rxjs": "vendor/rxjs",
    "text": "vendor/require/text",
    "css": "vendor/require/css",
    "promised": "vendor/require/promised"
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
    DOMParser: DOMParser,
    Text: Text,
    Element: Element,
    NodeList: NodeList,
    DocumentFragment: DocumentFragment,
    XMLDocument: window.XMLDocument || window.Document, //IE compatible
    HTMLDocument: window.HTMLDocument || window.Document, //IE compatible
    HTMLCollection: HTMLCollection,
    HTMLInputElement: HTMLInputElement,
    HTMLSelectElement: HTMLSelectElement,
    Comment: Comment,
    Location: Location
  }
});
define('jquery', ["vendor/jquery"], function(){
  return jQuery.noConflict();
});
(function(mods){
  define('atomic/core', ["vendor/" + mods[0], 'polyfill'], function(core){
    return Object.assign(core.placeholder, core.impart(core, core.partly));
  });
  define('atomic/behave', mods, function(){
    var modules = arguments;
    return function behave(env){
      for(var i in modules){
        var mod = modules[i],
            behave = mod["behave"];
        if (behave){
          behave(env);
        }
      }
    }
  });
  for (var idx in mods) {
    var mod = mods[idx];
    define(mod, ["atomic/core", "vendor/" + mod], function(core, tgt){
      return core.impart(tgt, core.partly);
    });
  }
})(["atomic/core", "atomic/dom", "atomic/immutables", "atomic/reactives", "atomic/shell", "atomic/repos", "atomic/transducers", "atomic/transients", "atomic/validates", "atomic/html", "atomic/svg"]);
define('cmd/imports', function(){
  return {
    "_": "atomic/core",
    "$": "atomic/reactives",
    "sh": "atomic/shell",
    "dom": "atomic/dom",
    "imm": "atomic/immutables",
    "t": "atomic/transducers",
    "mut": "atomic/transients",
    "vd": "atomic/validates",
    "html": "atomic/html",
    "svg": "atomic/svg",
    "repos": "atomic/repos"
  }
});
define('cmd', ["atomic/core", "cmd/imports", "promise"], function(_, defaults, Promise){
  function load(dest, name){
    return new Promise(function(resolve, reject){
      require([name], function(exported){
        var out = {};
        out[dest] = exported;
        resolve(out);
      });
    });
  }
  return function cmd(others, logger){
    var target = this,
        imports = Object.assign({}, defaults, others),
        loading = [];
    for(var dest in imports){
      loading.push(load(dest, imports[dest]));
    }
    return _.fmap(Promise.all(loading), _.spread(Object.assign), _.tee(function(imported){
      _.log(logger || _.config.logger, "Commands loaded.");
      Object.assign(target, imported);
    }));
  }

});
require(['cmd'], function(cmd){
  window.cmd = cmd;
});
