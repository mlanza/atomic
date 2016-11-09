/*

* no mutation
* use protocols
* payload last curried functions
* transducers

*/

var unbind      = Function.call.bind(Function.bind, Function.call);
var slice       = unbind(Array.prototype.slice);
var trim        = unbind(String.prototype.trim);
var toLowerCase = unbind(String.prototype.toLowerCase);
var toUpperCase = unbind(String.prototype.toUpperCase);

function identity(value){
  return value;
}

function curry(f, len, applied){
  return len ? function(){
    //every call to a curried function advances by at least one argument (see `undefined`).
    var args = (applied || []).concat(arguments.length === 0 ? [undefined] : slice(arguments));
    if (args.length >= len) {
      return f.apply(this, args);
    } else {
      return curry(f, len, args);
    }
  } : curry(f, f.length);
}

var arity = curry(function(len, f){
  return function(){
    return f.apply(this, slice(arguments, 0, len));
  }
});

var nullary = arity(0),
    unary   = arity(1);

function flip(f, len){
  var l = len || f.length;
  return curry(arity(l, function(){
    var size = arguments.length,
        last = arguments[size - 1],
        rest = slice(arguments,0,size - 1),
        args = [last].concat(rest);
    return f.apply(this, args);
  }), l);
}

function reverse(xs){
  return slice(xs).reverse();
}

function chain(init){
  return Coll.reduce(slice(arguments, 1), function(value, f){
    return f(value);
  }, init);
}

function pipe(){
  var fs = slice(arguments);
  return function(init){
    return Coll.reduce(fs, function(value, f){
      return f(value);
    }, init);
  }
}

function compose(){
  return pipe.apply(this, chain(arguments, slice, reverse));
}

var split       = flip(unbind(String.prototype.split), 2);
var replace     = flip(unbind(String.prototype.replace), 3);
var substring   = flip(unbind(String.prototype.substring), 3);
var startsWith  = flip(unbind(String.prototype.startsWith), 2);
var endsWith    = flip(unbind(String.prototype.endsWith), 2);
var keys        = Object.keys;

function Reduced(value){
  this.value = value;
}

Reduced.prototype.valueOf = function(){
  return this.value;
}

function reduced(value){
  return new Reduced(value);
}

function isReduced(value){
  return value instanceof Reduced;
}

function multimethod(dispatch){
  return function(){
    var f = dispatch.apply(this, arguments);
    return f.apply(this, arguments);
  }
}

function always(value){
  return function(){
    return value;
  }
}

function log(){
  console.log.apply(this, arguments);
}

function odd(n){
  return n % 2;
}

function add(a, b){
  return a + b;
}

function method(f){
  var map = new Map();
  return Object.assign(multimethod(function(self){
    return map.get(self) || map.get(self.constructor) || f;
  }), {map: map});
}

function Protocol(template){
  for(var key in template){
    this[key] = method(template[key]);
  }
}

function protocol(template){
  return new Protocol(template);
}

function extend(self, template){
  var kinds = Array.prototype.slice.call(arguments, 2);
  for(var k in kinds){
    var kind = kinds[k];
    for(var key in self){
      self[key].map.set(kind, template[key]);
    }
  }
  return self;
}

function noop(){
}

var Clone = protocol({clone: null});

var ToObject = protocol({toObject: null});

var Append = protocol({append: null});

var Seq  = protocol({seq: null});

var Assoc = protocol({
  get: null,
  set: null,
  has: null
});

var Coll = (function(seq){

  return protocol({
    empty: null,
    isEmpty: null,
    each: function(self, f){
      Coll.each(seq(self), f);
    },
    map: function(self, f){
      return Coll.map(seq(self), f);
    },
    filter: function(self, pred){
      return Coll.filter(seq(self), pred);
    },
    find: function(self, pred){
      return Coll.find(seq(self), pred);
    },
    reduce: function(self, f, init){
      return Coll.reduce(seq(self), f, init);
    },
    toArray: function(self){
      return Coll.reduce(seq(self), Append.append, []);
    },
    join: function(self, glue){
      var init = "";
      return Coll.reduce(seq(self), function(memo, x){
        return memo === init ? x : memo + glue + x;
      }, init);
    }
  });

})(Seq.seq);

(function(){

  extend(Coll, {
    each: identity,
    empty: identity,
    isEmpty: always(true),
    map: identity,
    filter: identity,
    find: identity,
    toArray: always([]),
    reduce: function(_, _, init){
      return init;
    },
    join: identity
  }, null, undefined);

  extend(ToObject, {
    toObject: always({})
  }, null, undefined);

  extend(Clone, {
    clone: identity
  }, null, undefined);

})();

var Cons = (function(each, map, filter, find, reduce, append){

  function Cons(head, tail){
    this.head = head;
    this.tail = tail;
  }

  extend(Seq, {
    seq: identity
  }, Cons);

  extend(Coll, {
    empty: always(null),
    isEmpty: always(false),
    each: function(self, f){
      f(self.head);
      each(self.tail(), f);
    },
    reduce: function(self, f, init){ //TODO add reduced fn to test whether reduction is complete? will this affect transducers?
      return reduce(self.tail(), f, f(init, self.head));
    },
    toArray: function(self){
      return reduce(self, append, []);
    },
    map: function(self, f){
      return new Cons(f(self.head), function(){
        return map(self.tail(), f);
      });
    },
    find: function(self, pred){
      return pred(self.head) ? self.head : find(self.tail(), pred);
    },
    filter: function(self, pred){
      return pred(self.head) ? new Cons(self.head, function(){
        return filter(self.tail(), pred);
      }) : filter(self.tail(), pred);
    }
  }, Cons);

  extend(ToObject, {
    toObject: function(self){
      return reduce(self, append, {});
    }
  }, Cons);

  extend(Clone, {
    clone: identity
  }, Cons);

  return Cons;

})(Coll.each, Coll.map, Coll.filter, Coll.find, Coll.reduce, Append.append);

(function(append){

  extend(Coll, {
    empty: always([]),
    isEmpty: function(self){
      return self.length === 0;
    },
    toArray: identity,
    join: function(self, glue){
      return self.join(glue);
    },
    map: function(self, f){
      return chain(self, seq, map(f), toArray);
    },
    filter: function(self, pred){
      return chain(self, seq, filter(pred), toArray);
    }
  }, Array);

  extend(ToObject, {
    toObject: function(self){
      return chain(self, reduce(append, {}));
    }
  }, Array);

  extend(Append, {
    append: function(self, value){
      return self.concat([value]);
    }
  }, Array);

  extend(Clone, {
    clone: slice
  }, Array);

  extend(Assoc, {
    has: function(self, key){
      return key > -1 && key < self.length;
    },
    get: function(self, key){
      return self[key];
    },
    set: function(self, key, value){
      var cloned = clone(self);
      cloned[key] = value;
      return cloned;
    }
  }, Array);

})(Append.append);

(function(){

  extend(Coll, {
    empty: always(""),
    isEmpty: function(value){
      return value === "";
    },
    toArray: function(self){
      var len = self.length, i = 0, out = [];
      while(i < len){
        var x = self[i++]
        out.push(x);
      }
      return out;
    },
    filter: function(self, pred){
      var len = self.length, i = 0, out = "";
      while(i < len){
        var x = self[i++]
        pred(x) && (out += x);
      }
      return out;
    }
  }, String);

  extend(Append, {
    append: function(self, value){
      return self + value;
    }
  }, String);

  extend(Clone, {
    clone: identity
  }, String);

})();


function cons(head, tail){
  return new Cons(head, tail);
}

(function(){

  function seq(arr, at){
    var pos = at || 0;
    return pos < arr.length ? new Cons(arr[pos], function(){
      return seq(arr, pos + 1);
    }) : null;
  }

  extend(Seq, {
    seq: unary(seq)
  }, Array, String);

})();

(function(){

  function seq(obj, ks, at){
    var pos = at || 0, keys = ks || Object.keys(obj), key = keys[pos];
    return pos < keys.length ? new Cons([key, obj[key]], function(){
      return seq(obj, keys, pos + 1);
    }) : null;
  }

  extend(Coll, {
    empty: always({}),
    isEmpty: function(self){
      return Object.keys(self).length === 0;
    },
    map: function(self, f){
      return chain(self, seq, map(f), toObject);
    },
    filter: function(self, pred){
      return chain(self, seq, filter(pred), toObject);
    }
  }, Object);

  extend(ToObject, {
    toObject: identity
  }, Object);

  extend(Append, {
    append: function(self, pair){
      var kv = {};
      kv[pair[0]] = pair[1];
      return Object.assign({}, self, kv);
    }
  }, Object);

  extend(Seq, {
    seq: unary(seq)
  }, Object);

  extend(Clone, {
    clone: function(self){
      return Object.assign({}, self);
    }
  }, Object);

  extend(Assoc, {
    has: function(self, key){
      return self.hasOwnProperty(key);
    },
    get: function(self, key){
      return self[key];
    },
    set: function(self, key, value){
      var cloned = clone(self);
      cloned[key] = value;
      return cloned;
    }
  }, Object);

})();

var eq = curry(function(a, b){
  return a == b;
});

var only = curry(function(pred, f, x){
  return pred(x) ? f(x) : x;
});

function index(self, at){
  var pos = at || 0;
  return pos < self.length ? new Cons([pos, self[pos]], function(){
    return index(self, pos + 1);
  }) : null;
}

var each     = flip(Coll.each, 2),
    reduce   = flip(Coll.reduce, 3),
    filter   = flip(Coll.filter, 2),
    find     = flip(Coll.find, 2),
    map      = flip(Coll.map, 2),
    join     = flip(Coll.join, 2),
    append   = flip(Append.append, 2);
    empty    = Coll.empty,
    toArray  = Coll.toArray,
    clone    = Clone.clone,
    set      = flip(Assoc.set, 3),
    has      = flip(Assoc.has, 2),
    get      = flip(Assoc.get, 2),
    property = get,
    toObject = ToObject.toObject,
    seq      = Seq.seq;

function juxt(){
  var fs = slice(arguments);
  return function(){
    var self = this;
    var args = slice(arguments);
    return map(function(f){
      return f.apply(self, args);
    }, fs);
  }
}

var lookup = curry(function(obj, key){
  return obj[key];
});

//TODO create a Pair constructor for kvps in an array?  better implement IMapEntry a thing with a key and a val.

chain([1,2,3,4,5], filter(odd), log);
chain([1,2,3,4,5], reduce(add, 0), log);
chain(null, each(log));
chain("nasa", map(toUpperCase), join(""), log);
chain([10,11,12], join(0), log);
chain({}, set("Larry", "Howard"), set("Moe", "Howard"), log);
chain({Moe: "Howard"}, toArray, toObject, log);
chain({Moe: "Howard", Curly: "Howard", Larry: "Fine"}, filter(pipe(get(1), eq("Howard"))), log);
chain({Moe: "Howard", Curly: "Howard", Larry: "Fine"}, toArray, log);
chain({Moe: "Howard", Curly: "Howard", Larry: "Fine"}, map(only(pipe(get(1), eq("Howard")), juxt(get(0), pipe(get(1), toUpperCase)))), log);
chain({Moe: "Howard"}, set("Larry", "Fine"), log);
chain(["Ace", "King", "Queen"], set(0, "Jack"), index, toObject, Object.values, log);