define(['exports', 'promise', 'atomic/core', 'fetch'], function (exports, Promise$1, _, fetch) { 'use strict';

  var _param, _$fmap, _ref;
  function Request(url, options, config, interceptors, handlers) {
    this.url = url;
    this.options = options;
    this.config = config;
    this.interceptors = interceptors;
    this.handlers = handlers;
  }
  function request(url, config) {
    return new Request(url, {}, config || {}, [filling], []);
  }
  var filling = (_ref = _, _$fmap = _ref.fmap, _param = function _param(self) {
    return _.fill(self, self.config);
  }, function fmap(_argPlaceholder) {
    return _$fmap.call(_ref, _argPlaceholder, _param);
  });

  var IAddress = _.protocol({
    addr: _.identity
  });

  var IIntercept = _.protocol({
    intercept: null
  });

  var IOptions = _.protocol({
    options: null
  });

  var IParams = _.protocol({
    params: null
  });

  function demand(self, keys) {
    return IIntercept.intercept(self, function (req) {
      var _req, _$contains, _ref;

      var params = _.remove((_ref = _, _$contains = _ref.contains, _req = req, function contains(_argPlaceholder) {
        return _$contains.call(_ref, _req, _argPlaceholder);
      }), keys);

      if (_.seq(params)) {
        var _$str, _ref2;

        throw new TypeError("Missing required params — " + _.join(", ", _.map((_ref2 = _, _$str = _ref2.str, function str(_argPlaceholder2) {
          return _$str.call(_ref2, "`", _argPlaceholder2, "`");
        }), params)) + ".");
      }

      return req;
    });
  }

  function query(self, plan) {
    var _$startsWith, _ref, _ref2, _ref3, _self, _$apply, _$merge, _ref4, _$selectKeys, _IParams$params, _IParams;

    var keys = _.filter((_ref = _, _$startsWith = _ref.startsWith, function startsWith(_argPlaceholder) {
      return _$startsWith.call(_ref, _argPlaceholder, "$");
    }), _.keys(plan));

    return _ref2 = (_ref3 = (_self = self, (_ref4 = _, _$merge = _ref4.merge, _$apply = _.apply(_.dissoc, plan, keys), function merge(_argPlaceholder2) {
      return _$merge.call(_ref4, _argPlaceholder2, _$apply);
    })(_self)), (_IParams = IParams, _IParams$params = _IParams.params, _$selectKeys = _.selectKeys(plan, keys), function params(_argPlaceholder3) {
      return _IParams$params.call(_IParams, _argPlaceholder3, _$selectKeys);
    })(_ref3)), _.fromTask(_ref2);
  }

  function fill$1(self, params) {
    var _ref5, _self2, _$fill, _$edit, _ref6, _params, _$fill2, _ref7, _$fill3, _$edit2, _ref8, _params2, _$fill4, _ref9;

    return _ref5 = (_self2 = self, (_ref6 = _, _$edit = _ref6.edit, _$fill = (_ref7 = _, _$fill2 = _ref7.fill, _params = params, function fill(_argPlaceholder5) {
      return _$fill2.call(_ref7, _argPlaceholder5, _params);
    }), function edit(_argPlaceholder4) {
      return _$edit.call(_ref6, _argPlaceholder4, "url", _$fill);
    })(_self2)), (_ref8 = _, _$edit2 = _ref8.edit, _$fill3 = (_ref9 = _, _$fill4 = _ref9.fill, _params2 = params, function fill(_argPlaceholder7) {
      return _$fill4.call(_ref9, _argPlaceholder7, _params2);
    }), function edit(_argPlaceholder6) {
      return _$edit2.call(_ref8, _argPlaceholder6, "options", _$fill3);
    })(_ref5);
  }

  function clone$1(self) {
    return new self.constructor(self.url, self.options, self.config, self.interceptors, self.handlers);
  }

  function addr$2(self) {
    return _.fill(_.str(self.url), self.config);
  }

  function assoc(self, key, value) {
    var _key, _value, _IAssociative$assoc, _IAssociative;

    return _.edit(self, "config", (_IAssociative = _.IAssociative, _IAssociative$assoc = _IAssociative.assoc, _key = key, _value = value, function assoc(_argPlaceholder8) {
      return _IAssociative$assoc.call(_IAssociative, _argPlaceholder8, _key, _value);
    }));
  }

  function contains(self, key) {
    return _.IAssociative.contains(self.config, key);
  }

  function keys(self) {
    return _.IMap.keys(self.config);
  }

  function lookup(self, key) {
    return _.ILookup.lookup(self.config, key);
  }

  function params$3(self, params) {
    var _params3, _IParams$params2, _IParams2;

    return _.edit(self, "url", (_IParams2 = IParams, _IParams$params2 = _IParams2.params, _params3 = params, function params(_argPlaceholder9) {
      return _IParams$params2.call(_IParams2, _argPlaceholder9, _params3);
    }));
  }

  function options$1(self, options) {
    var _options, _$absorb, _ref10;

    return _.edit(self, "options", _.isFunction(options) ? options : (_ref10 = _, _$absorb = _ref10.absorb, _options = options, function absorb(_argPlaceholder10) {
      return _$absorb.call(_ref10, _argPlaceholder10, _options);
    }));
  }

  function intercept$1(self, interceptor) {
    var _interceptor, _$fmap, _ref11;

    return prepend(self, (_ref11 = _, _$fmap = _ref11.fmap, _interceptor = interceptor, function fmap(_argPlaceholder11) {
      return _$fmap.call(_ref11, _argPlaceholder11, _interceptor);
    }));
  }

  function fmap(self, handler) {
    var _handler, _$fmap2, _ref12;

    return append(self, (_ref12 = _, _$fmap2 = _ref12.fmap, _handler = handler, function fmap(_argPlaceholder12) {
      return _$fmap2.call(_ref12, _argPlaceholder12, _handler);
    }));
  }

  function prepend(self, xf) {
    var _xf, _$prepend, _ref13;

    return _.edit(self, "interceptors", (_ref13 = _, _$prepend = _ref13.prepend, _xf = xf, function prepend(_argPlaceholder13) {
      return _$prepend.call(_ref13, _argPlaceholder13, _xf);
    }));
  }

  function append(self, xf) {
    var _xf2, _$append, _ref14;

    return _.edit(self, "handlers", (_ref14 = _, _$append = _ref14.append, _xf2 = xf, function append(_argPlaceholder14) {
      return _$append.call(_ref14, _argPlaceholder14, _xf2);
    }));
  }

  function fork$1(self, reject, resolve) {
    var _ref15, _ref16, _self3, _param, _$fmap3, _ref17;

    return _ref15 = (_ref16 = (_self3 = self, Promise$1.resolve(_self3)), _.apply(_.pipe, self.interceptors)(_ref16)), (_ref17 = _, _$fmap3 = _ref17.fmap, _param = function _param(self) {
      var _ref18, _fetch, _reject, _resolve, _$fork, _ref19;

      return _ref18 = (_fetch = fetch(self.url, self.options), _.apply(_.pipe, self.handlers)(_fetch)), (_ref19 = _, _$fork = _ref19.fork, _reject = reject, _resolve = resolve, function fork(_argPlaceholder16) {
        return _$fork.call(_ref19, _argPlaceholder16, _reject, _resolve);
      })(_ref18);
    }, function fmap(_argPlaceholder15) {
      return _$fmap3.call(_ref17, _argPlaceholder15, _param);
    })(_ref15);
  }

  var behaveAsRequest = _.does(_.implement(_.ITemplate, {
    fill: fill$1
  }), _.implement(_.ICloneable, {
    clone: clone$1
  }), _.implement(_.ICoerceable, {
    toPromise: _.fromTask
  }), _.implement(_.IAppendable, {
    append: append
  }), _.implement(_.IPrependable, {
    prepend: prepend
  }), _.implement(_.IForkable, {
    fork: fork$1
  }), _.implement(_.IQueryable, {
    query: query
  }), _.implement(_.IAssociative, {
    assoc: assoc,
    contains: contains
  }), _.implement(_.ILookup, {
    lookup: lookup
  }), _.implement(_.IMap, {
    keys: keys
  }), _.implement(IAddress, {
    addr: addr$2
  }), _.implement(IOptions, {
    options: options$1
  }), _.implement(IParams, {
    params: params$3
  }), _.implement(IIntercept, {
    intercept: intercept$1
  }), _.implement(_.IFunctor, {
    fmap: fmap
  }));

  behaveAsRequest(Request);

  function Routed(requests) {
    this.requests = requests;
  }
  var routed = _.constructs(Routed);

  function xform(xf) {
    return function (self) {
      var _$apply, _$mapa, _ref, _xf, _args, _$apply2, _ref2;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return _.edit(self, "requests", (_ref = _, _$mapa = _ref.mapa, _$apply = (_ref2 = _, _$apply2 = _ref2.apply, _xf = xf, _args = args, function apply(_argPlaceholder2) {
        return _$apply2.call(_ref2, _xf, _argPlaceholder2, _args);
      }), function mapa(_argPlaceholder) {
        return _$mapa.call(_ref, _$apply, _argPlaceholder);
      }));
    };
  }

  function clone(self) {
    return new self.constructor(self.requests);
  }

  function filled(self) {
    var _param, _$test, _ref3;

    return _.maybe(self, IAddress.addr, (_ref3 = _, _$test = _ref3.test, _param = /\{[^{}]+\}/, function test(_argPlaceholder3) {
      return _$test.call(_ref3, _param, _argPlaceholder3);
    }), _.not);
  }

  function fork(self, reject, resolve) {
    return _.IForkable.fork(_.detect(filled, self.requests), reject, resolve);
  }

  function addr$1(self) {
    return IAddress.addr(_.detect(filled, self.requests));
  }

  function first(self) {
    return _.first(self.requests);
  }

  function rest(self) {
    return _.rest(self.requests);
  }

  var behaveAsRouted = _.does(_.implement(_.ICloneable, {
    clone: clone
  }), _.implement(_.ICoerceable, {
    toPromise: _.fromTask
  }), _.implement(_.IForkable, {
    fork: fork
  }), _.implement(_.IQueryable, {
    query: query
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }), _.implement(IAddress, {
    addr: addr$1
  }), _.implement(_.ITemplate, {
    fill: xform(_.ITemplate.fill)
  }), _.implement(_.ICollection, {
    conj: xform(_.ICollection.conj)
  }), _.implement(IIntercept, {
    intercept: xform(IIntercept.intercept)
  }), _.implement(_.IFunctor, {
    fmap: xform(_.IFunctor.fmap)
  }), _.implement(_.IAssociative, {
    assoc: xform(_.IAssociative.assoc)
  }), _.implement(_.IMap, {
    dissoc: xform(_.IMap.dissoc)
  }), _.implement(IParams, {
    params: xform(IParams.params)
  }), _.implement(IOptions, {
    options: xform(IOptions.options)
  }));

  behaveAsRouted(Routed);

  function URL(url, xfq) {
    this.url = url;
    this.xfq = xfq;
  }

  URL.prototype.toString = function () {
    return this.url;
  };

  function url1(url) {
    return url2(url, _.identity);
  }

  var url2 = _.constructs(URL);
  var url = _.overload(null, url1, url2);

  function params$2(self, obj) {
    var _obj, _$merge, _ref, _ref2, _self$url, _$split, _ref3, _ref4, _ref5, _ref6, _self$url2;

    var f = _.isFunction(obj) ? obj : (_ref = _, _$merge = _ref.merge, _obj = obj, function merge(_argPlaceholder) {
      return _$merge.call(_ref, _argPlaceholder, _obj);
    });
    return new self.constructor(_.str((_ref2 = (_self$url = self.url, (_ref3 = _, _$split = _ref3.split, function split(_argPlaceholder2) {
      return _$split.call(_ref3, _argPlaceholder2, "?");
    })(_self$url)), _.first(_ref2)), (_ref4 = (_ref5 = (_ref6 = (_self$url2 = self.url, _.fromQueryString(_self$url2)), f(_ref6)), self.xfq(_ref5)), _.toQueryString(_ref4))), self.xfq);
  }

  function fill(self, params) {
    return _.ITemplate.fill(_.str(self), params);
  }

  var behaveAsURL = _.does(_.implement(IParams, {
    params: params$2
  }), _.implement(_.ITemplate, {
    fill: fill
  }));

  behaveAsURL(URL);

  var addr = IAddress.addr;

  var intercept = IIntercept.intercept;

  var options = IOptions.options;
  function json(req) {
    var _ref, _req, _credentials$headers, _IOptions$options, _IOptions, _param, _$fmap, _ref2;

    return _ref = (_req = req, (_IOptions = IOptions, _IOptions$options = _IOptions.options, _credentials$headers = {
      credentials: "same-origin",
      headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose"
      }
    }, function options(_argPlaceholder) {
      return _IOptions$options.call(_IOptions, _argPlaceholder, _credentials$headers);
    })(_req)), (_ref2 = _, _$fmap = _ref2.fmap, _param = function _param(resp) {
      return resp.json();
    }, function fmap(_argPlaceholder2) {
      return _$fmap.call(_ref2, _argPlaceholder2, _param);
    })(_ref);
  }
  function method(req, method) {
    return IOptions.options(req, {
      method: method
    });
  }

  var params$1 = IParams.params;

  function text(req) {
    return _.fmap(req, function (resp) {
      return resp.text();
    });
  }
  function xml(req) {
    var parser = new DOMParser();
    return _.fmap(text(req), function (text) {
      return parser.parseFromString(text, "text/xml");
    });
  }
  function raise(req) {
    return _.fmap(req, function (resp) {
      return new Promise$1(function (resolve, reject) {
        return resp.ok ? resolve(resp) : reject(resp);
      });
    });
  }
  function suppress(req, f) {
    return _.fmap(req, function (resp) {
      return new Promise$1(function (resolve, reject) {
        return resp.ok ? resolve(resp) : resolve(f(resp));
      });
    });
  }

  function params(self, obj) {
    var _obj, _$merge, _ref, _ref2, _self, _$split, _ref3, _ref4, _ref5, _self2;

    var f = _.isFunction(obj) ? obj : (_ref = _, _$merge = _ref.merge, _obj = obj, function merge(_argPlaceholder) {
      return _$merge.call(_ref, _argPlaceholder, _obj);
    });
    return _.str((_ref2 = (_self = self, (_ref3 = _, _$split = _ref3.split, function split(_argPlaceholder2) {
      return _$split.call(_ref3, _argPlaceholder2, "?");
    })(_self)), _.first(_ref2)), (_ref4 = (_ref5 = (_self2 = self, _.fromQueryString(_self2)), f(_ref5)), _.toQueryString(_ref4)));
  }

  _.implement(IParams, {
    params: params
  }, String);

  exports.IAddress = IAddress;
  exports.IIntercept = IIntercept;
  exports.IOptions = IOptions;
  exports.IParams = IParams;
  exports.Request = Request;
  exports.Routed = Routed;
  exports.URL = URL;
  exports.addr = addr;
  exports.demand = demand;
  exports.intercept = intercept;
  exports.json = json;
  exports.method = method;
  exports.options = options;
  exports.params = params$1;
  exports.raise = raise;
  exports.request = request;
  exports.routed = routed;
  exports.suppress = suppress;
  exports.text = text;
  exports.url = url;
  exports.xml = xml;

  Object.defineProperty(exports, '__esModule', { value: true });

});
