import { isValueObject, hash } from './atomic/core.js';
export { hash, isValueObject } from './atomic/core.js';

// Used for setting prototype methods that IE8 chokes on.
var DELETE = 'delete'; // Constants describing the size of trie nodes.

var SHIFT = 5; // Resulted in best performance after ______?

var SIZE = 1 << SHIFT;
var MASK = SIZE - 1; // A consistent shared value representing "not set" which equals nothing other
// than itself, and nothing that could be provided externally.

var NOT_SET = {}; // Boolean references, Rough equivalent of `bool &`.

function MakeRef() {
  return {
    value: false
  };
}
function SetRef(ref) {
  if (ref) {
    ref.value = true;
  }
} // A function which returns a value representing an "owner" for transient writes
// to tries. The return value will only ever equal itself, and will not equal
// the return of any subsequent call of this function.

function OwnerID() {}
function ensureSize(iter) {
  if (iter.size === undefined) {
    iter.size = iter.__iterate(returnTrue);
  }

  return iter.size;
}
function wrapIndex(iter, index) {
  // This implements "is array index" which the ECMAString spec defines as:
  //
  //     A String property name P is an array index if and only if
  //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
  //     to 2^32−1.
  //
  // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
  if (typeof index !== 'number') {
    var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32

    if ('' + uint32Index !== index || uint32Index === 4294967295) {
      return NaN;
    }

    index = uint32Index;
  }

  return index < 0 ? ensureSize(iter) + index : index;
}
function returnTrue() {
  return true;
}
function wholeSlice(begin, end, size) {
  return (begin === 0 && !isNeg(begin) || size !== undefined && begin <= -size) && (end === undefined || size !== undefined && end >= size);
}
function resolveBegin(begin, size) {
  return resolveIndex(begin, size, 0);
}
function resolveEnd(end, size) {
  return resolveIndex(end, size, size);
}

function resolveIndex(index, size, defaultIndex) {
  // Sanitize indices using this shorthand for ToInt32(argument)
  // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
  return index === undefined ? defaultIndex : isNeg(index) ? size === Infinity ? size : Math.max(0, size + index) | 0 : size === undefined || size === index ? index : Math.min(size, index) | 0;
}

function isNeg(value) {
  // Account for -0 which is negative, but not less than 0.
  return value < 0 || value === 0 && 1 / value === -Infinity;
}

// Note: value is unchanged to not break immutable-devtools.
var IS_COLLECTION_SYMBOL = '@@__IMMUTABLE_ITERABLE__@@';
function isCollection(maybeCollection) {
  return Boolean(maybeCollection && maybeCollection[IS_COLLECTION_SYMBOL]);
}

var IS_KEYED_SYMBOL = '@@__IMMUTABLE_KEYED__@@';
function isKeyed(maybeKeyed) {
  return Boolean(maybeKeyed && maybeKeyed[IS_KEYED_SYMBOL]);
}

var IS_INDEXED_SYMBOL = '@@__IMMUTABLE_INDEXED__@@';
function isIndexed(maybeIndexed) {
  return Boolean(maybeIndexed && maybeIndexed[IS_INDEXED_SYMBOL]);
}

function isAssociative(maybeAssociative) {
  return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
}

function _typeof$f(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$f = function _typeof(obj) { return typeof obj; }; } else { _typeof$f = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$f(obj); }

function _inherits$a(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$a(subClass, superClass); }

function _setPrototypeOf$a(o, p) { _setPrototypeOf$a = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$a(o, p); }

function _createSuper$a(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$a(); return function _createSuperInternal() { var Super = _getPrototypeOf$a(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$a(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$a(this, result); }; }

function _possibleConstructorReturn$a(self, call) { if (call && (_typeof$f(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$a(self); }

function _assertThisInitialized$a(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$a() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$a(o) { _getPrototypeOf$a = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$a(o); }

function _classCallCheck$c(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Collection = function Collection(value) {
  _classCallCheck$c(this, Collection);

  return isCollection(value) ? value : Seq(value);
};
var KeyedCollection = /*#__PURE__*/function (_Collection) {
  _inherits$a(KeyedCollection, _Collection);

  _createSuper$a(KeyedCollection);

  function KeyedCollection(value) {
    var _this;

    _classCallCheck$c(this, KeyedCollection);

    return _possibleConstructorReturn$a(_this, isKeyed(value) ? value : KeyedSeq(value));
  }

  return KeyedCollection;
}(Collection);
var IndexedCollection = /*#__PURE__*/function (_Collection2) {
  _inherits$a(IndexedCollection, _Collection2);

  _createSuper$a(IndexedCollection);

  function IndexedCollection(value) {
    var _this2;

    _classCallCheck$c(this, IndexedCollection);

    return _possibleConstructorReturn$a(_this2, isIndexed(value) ? value : IndexedSeq(value));
  }

  return IndexedCollection;
}(Collection);
var SetCollection = /*#__PURE__*/function (_Collection3) {
  _inherits$a(SetCollection, _Collection3);

  _createSuper$a(SetCollection);

  function SetCollection(value) {
    var _this3;

    _classCallCheck$c(this, SetCollection);

    return _possibleConstructorReturn$a(_this3, isCollection(value) && !isAssociative(value) ? value : SetSeq(value));
  }

  return SetCollection;
}(Collection);
Collection.Keyed = KeyedCollection;
Collection.Indexed = IndexedCollection;
Collection.Set = SetCollection;

var IS_SEQ_SYMBOL = '@@__IMMUTABLE_SEQ__@@';
function isSeq(maybeSeq) {
  return Boolean(maybeSeq && maybeSeq[IS_SEQ_SYMBOL]);
}

var IS_RECORD_SYMBOL = '@@__IMMUTABLE_RECORD__@@';
function isRecord(maybeRecord) {
  return Boolean(maybeRecord && maybeRecord[IS_RECORD_SYMBOL]);
}

function isImmutable(maybeImmutable) {
  return isCollection(maybeImmutable) || isRecord(maybeImmutable);
}

var IS_ORDERED_SYMBOL = '@@__IMMUTABLE_ORDERED__@@';
function isOrdered(maybeOrdered) {
  return Boolean(maybeOrdered && maybeOrdered[IS_ORDERED_SYMBOL]);
}

function _classCallCheck$b(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$b(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$b(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$b(Constructor.prototype, protoProps); if (staticProps) _defineProperties$b(Constructor, staticProps); return Constructor; }

var ITERATE_KEYS = 0;
var ITERATE_VALUES = 1;
var ITERATE_ENTRIES = 2;
var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;
var Iterator = /*#__PURE__*/function () {
  function Iterator(next) {
    _classCallCheck$b(this, Iterator);

    this.next = next;
  }

  _createClass$b(Iterator, [{
    key: "toString",
    value: function toString() {
      return '[Iterator]';
    }
  }]);

  return Iterator;
}();
Iterator.KEYS = ITERATE_KEYS;
Iterator.VALUES = ITERATE_VALUES;
Iterator.ENTRIES = ITERATE_ENTRIES;

Iterator.prototype.inspect = Iterator.prototype.toSource = function () {
  return this.toString();
};

Iterator.prototype[ITERATOR_SYMBOL] = function () {
  return this;
};

function iteratorValue(type, k, v, iteratorResult) {
  var value = type === 0 ? k : type === 1 ? v : [k, v];
  iteratorResult ? iteratorResult.value = value : iteratorResult = {
    value: value,
    done: false
  };
  return iteratorResult;
}
function iteratorDone() {
  return {
    value: undefined,
    done: true
  };
}
function hasIterator(maybeIterable) {
  if (Array.isArray(maybeIterable)) {
    // IE11 trick as it does not support `Symbol.iterator`
    return true;
  }

  return !!getIteratorFn(maybeIterable);
}
function isIterator(maybeIterator) {
  return maybeIterator && typeof maybeIterator.next === 'function';
}
function getIterator(iterable) {
  var iteratorFn = getIteratorFn(iterable);
  return iteratorFn && iteratorFn.call(iterable);
}

function getIteratorFn(iterable) {
  var iteratorFn = iterable && (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL] || iterable[FAUX_ITERATOR_SYMBOL]);

  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

function isEntriesIterable(maybeIterable) {
  var iteratorFn = getIteratorFn(maybeIterable);
  return iteratorFn && iteratorFn === maybeIterable.entries;
}
function isKeysIterable(maybeIterable) {
  var iteratorFn = getIteratorFn(maybeIterable);
  return iteratorFn && iteratorFn === maybeIterable.keys;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function _typeof$e(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$e = function _typeof(obj) { return typeof obj; }; } else { _typeof$e = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$e(obj); }

function isArrayLike(value) {
  if (Array.isArray(value) || typeof value === 'string') {
    return true;
  }

  return value && _typeof$e(value) === 'object' && Number.isInteger(value.length) && value.length >= 0 && (value.length === 0 ? // Only {length: 0} is considered Array-like.
  Object.keys(value).length === 1 : // An object is only Array-like if it has a property where the last value
  // in the array-like may be found (which could be undefined).
  value.hasOwnProperty(value.length - 1));
}

function _typeof$d(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$d = function _typeof(obj) { return typeof obj; }; } else { _typeof$d = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$d(obj); }

function _classCallCheck$a(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$a(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$a(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$a(Constructor.prototype, protoProps); if (staticProps) _defineProperties$a(Constructor, staticProps); return Constructor; }

function _inherits$9(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$9(subClass, superClass); }

function _setPrototypeOf$9(o, p) { _setPrototypeOf$9 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$9(o, p); }

function _createSuper$9(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$9(); return function _createSuperInternal() { var Super = _getPrototypeOf$9(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$9(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$9(this, result); }; }

function _possibleConstructorReturn$9(self, call) { if (call && (_typeof$d(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$9(self); }

function _assertThisInitialized$9(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$9() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$9(o) { _getPrototypeOf$9 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$9(o); }
var Seq = /*#__PURE__*/function (_Collection) {
  _inherits$9(Seq, _Collection);

  _createSuper$9(Seq);

  function Seq(value) {
    var _this;

    _classCallCheck$a(this, Seq);

    return _possibleConstructorReturn$9(_this, value === null || value === undefined ? emptySequence() : isImmutable(value) ? value.toSeq() : seqFromValue(value));
  }

  _createClass$a(Seq, [{
    key: "toSeq",
    value: function toSeq() {
      return this;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.__toString('Seq {', '}');
    }
  }, {
    key: "cacheResult",
    value: function cacheResult() {
      if (!this._cache && this.__iterateUncached) {
        this._cache = this.entrySeq().toArray();
        this.size = this._cache.length;
      }

      return this;
    } // abstract __iterateUncached(fn, reverse)

  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var cache = this._cache;

      if (cache) {
        var size = cache.length;
        var i = 0;

        while (i !== size) {
          var entry = cache[reverse ? size - ++i : i++];

          if (fn(entry[1], entry[0], this) === false) {
            break;
          }
        }

        return i;
      }

      return this.__iterateUncached(fn, reverse);
    } // abstract __iteratorUncached(type, reverse)

  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      var cache = this._cache;

      if (cache) {
        var size = cache.length;
        var i = 0;
        return new Iterator(function () {
          if (i === size) {
            return iteratorDone();
          }

          var entry = cache[reverse ? size - ++i : i++];
          return iteratorValue(type, entry[0], entry[1]);
        });
      }

      return this.__iteratorUncached(type, reverse);
    }
  }]);

  return Seq;
}(Collection);
var KeyedSeq = /*#__PURE__*/function (_Seq) {
  _inherits$9(KeyedSeq, _Seq);

  _createSuper$9(KeyedSeq);

  function KeyedSeq(value) {
    var _this2;

    _classCallCheck$a(this, KeyedSeq);

    return _possibleConstructorReturn$9(_this2, value === null || value === undefined ? emptySequence().toKeyedSeq() : isCollection(value) ? isKeyed(value) ? value.toSeq() : value.fromEntrySeq() : isRecord(value) ? value.toSeq() : keyedSeqFromValue(value));
  }

  _createClass$a(KeyedSeq, [{
    key: "toKeyedSeq",
    value: function toKeyedSeq() {
      return this;
    }
  }]);

  return KeyedSeq;
}(Seq);
var IndexedSeq = /*#__PURE__*/function (_Seq2) {
  _inherits$9(IndexedSeq, _Seq2);

  _createSuper$9(IndexedSeq);

  function IndexedSeq(value) {
    var _this3;

    _classCallCheck$a(this, IndexedSeq);

    return _possibleConstructorReturn$9(_this3, value === null || value === undefined ? emptySequence() : isCollection(value) ? isKeyed(value) ? value.entrySeq() : value.toIndexedSeq() : isRecord(value) ? value.toSeq().entrySeq() : indexedSeqFromValue(value));
  }

  _createClass$a(IndexedSeq, [{
    key: "toIndexedSeq",
    value: function toIndexedSeq() {
      return this;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.__toString('Seq [', ']');
    }
  }], [{
    key: "of",
    value: function of() {
      return IndexedSeq(arguments);
    }
  }]);

  return IndexedSeq;
}(Seq);
var SetSeq = /*#__PURE__*/function (_Seq3) {
  _inherits$9(SetSeq, _Seq3);

  _createSuper$9(SetSeq);

  function SetSeq(value) {
    var _this4;

    _classCallCheck$a(this, SetSeq);

    return _possibleConstructorReturn$9(_this4, (isCollection(value) && !isAssociative(value) ? value : IndexedSeq(value)).toSetSeq());
  }

  _createClass$a(SetSeq, [{
    key: "toSetSeq",
    value: function toSetSeq() {
      return this;
    }
  }], [{
    key: "of",
    value: function of() {
      return SetSeq(arguments);
    }
  }]);

  return SetSeq;
}(Seq);
Seq.isSeq = isSeq;
Seq.Keyed = KeyedSeq;
Seq.Set = SetSeq;
Seq.Indexed = IndexedSeq;
Seq.prototype[IS_SEQ_SYMBOL] = true; // #pragma Root Sequences

var ArraySeq = /*#__PURE__*/function (_IndexedSeq) {
  _inherits$9(ArraySeq, _IndexedSeq);

  _createSuper$9(ArraySeq);

  function ArraySeq(array) {
    var _this5;

    _classCallCheck$a(this, ArraySeq);

    _this5._array = array;
    _this5.size = array.length;
    return _possibleConstructorReturn$9(_this5);
  }

  _createClass$a(ArraySeq, [{
    key: "get",
    value: function get(index, notSetValue) {
      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var array = this._array;
      var size = array.length;
      var i = 0;

      while (i !== size) {
        var ii = reverse ? size - ++i : i++;

        if (fn(array[ii], ii, this) === false) {
          break;
        }
      }

      return i;
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      var array = this._array;
      var size = array.length;
      var i = 0;
      return new Iterator(function () {
        if (i === size) {
          return iteratorDone();
        }

        var ii = reverse ? size - ++i : i++;
        return iteratorValue(type, ii, array[ii]);
      });
    }
  }]);

  return ArraySeq;
}(IndexedSeq);

var ObjectSeq = /*#__PURE__*/function (_KeyedSeq) {
  _inherits$9(ObjectSeq, _KeyedSeq);

  _createSuper$9(ObjectSeq);

  function ObjectSeq(object) {
    var _this6;

    _classCallCheck$a(this, ObjectSeq);

    var keys = Object.keys(object);
    _this6._object = object;
    _this6._keys = keys;
    _this6.size = keys.length;
    return _possibleConstructorReturn$9(_this6);
  }

  _createClass$a(ObjectSeq, [{
    key: "get",
    value: function get(key, notSetValue) {
      if (notSetValue !== undefined && !this.has(key)) {
        return notSetValue;
      }

      return this._object[key];
    }
  }, {
    key: "has",
    value: function has(key) {
      return hasOwnProperty.call(this._object, key);
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var object = this._object;
      var keys = this._keys;
      var size = keys.length;
      var i = 0;

      while (i !== size) {
        var key = keys[reverse ? size - ++i : i++];

        if (fn(object[key], key, this) === false) {
          break;
        }
      }

      return i;
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      var object = this._object;
      var keys = this._keys;
      var size = keys.length;
      var i = 0;
      return new Iterator(function () {
        if (i === size) {
          return iteratorDone();
        }

        var key = keys[reverse ? size - ++i : i++];
        return iteratorValue(type, key, object[key]);
      });
    }
  }]);

  return ObjectSeq;
}(KeyedSeq);

ObjectSeq.prototype[IS_ORDERED_SYMBOL] = true;

var CollectionSeq = /*#__PURE__*/function (_IndexedSeq2) {
  _inherits$9(CollectionSeq, _IndexedSeq2);

  _createSuper$9(CollectionSeq);

  function CollectionSeq(collection) {
    var _this7;

    _classCallCheck$a(this, CollectionSeq);

    _this7._collection = collection;
    _this7.size = collection.length || collection.size;
    return _possibleConstructorReturn$9(_this7);
  }

  _createClass$a(CollectionSeq, [{
    key: "__iterateUncached",
    value: function __iterateUncached(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }

      var collection = this._collection;
      var iterator = getIterator(collection);
      var iterations = 0;

      if (isIterator(iterator)) {
        var step;

        while (!(step = iterator.next()).done) {
          if (fn(step.value, iterations++, this) === false) {
            break;
          }
        }
      }

      return iterations;
    }
  }, {
    key: "__iteratorUncached",
    value: function __iteratorUncached(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }

      var collection = this._collection;
      var iterator = getIterator(collection);

      if (!isIterator(iterator)) {
        return new Iterator(iteratorDone);
      }

      var iterations = 0;
      return new Iterator(function () {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, iterations++, step.value);
      });
    }
  }]);

  return CollectionSeq;
}(IndexedSeq); // # pragma Helper functions


var EMPTY_SEQ;

function emptySequence() {
  return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
}

function keyedSeqFromValue(value) {
  var seq = maybeIndexedSeqFromValue(value);

  if (seq) {
    return seq.fromEntrySeq();
  }

  if (_typeof$d(value) === 'object') {
    return new ObjectSeq(value);
  }

  throw new TypeError('Expected Array or collection object of [k, v] entries, or keyed object: ' + value);
}
function indexedSeqFromValue(value) {
  var seq = maybeIndexedSeqFromValue(value);

  if (seq) {
    return seq;
  }

  throw new TypeError('Expected Array or collection object of values: ' + value);
}

function seqFromValue(value) {
  var seq = maybeIndexedSeqFromValue(value);

  if (seq) {
    return isEntriesIterable(value) ? seq.fromEntrySeq() : isKeysIterable(value) ? seq.toSetSeq() : seq;
  }

  if (_typeof$d(value) === 'object') {
    return new ObjectSeq(value);
  }

  throw new TypeError('Expected Array or collection object of values, or keyed object: ' + value);
}

function maybeIndexedSeqFromValue(value) {
  return isArrayLike(value) ? new ArraySeq(value) : hasIterator(value) ? new CollectionSeq(value) : undefined;
}

var IS_MAP_SYMBOL = '@@__IMMUTABLE_MAP__@@';
function isMap(maybeMap) {
  return Boolean(maybeMap && maybeMap[IS_MAP_SYMBOL]);
}

function isOrderedMap(maybeOrderedMap) {
  return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
}

/**
 * An extension of the "same-value" algorithm as [described for use by ES6 Map
 * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
 *
 * NaN is considered the same as NaN, however -0 and 0 are considered the same
 * value, which is different from the algorithm described by
 * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
 *
 * This is extended further to allow Objects to describe the values they
 * represent, by way of `valueOf` or `equals` (and `hashCode`).
 *
 * Note: because of this extension, the key equality of Immutable.Map and the
 * value equality of Immutable.Set will differ from ES6 Map and Set.
 *
 * ### Defining custom values
 *
 * The easiest way to describe the value an object represents is by implementing
 * `valueOf`. For example, `Date` represents a value by returning a unix
 * timestamp for `valueOf`:
 *
 *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
 *     var date2 = new Date(1234567890000);
 *     date1.valueOf(); // 1234567890000
 *     assert( date1 !== date2 );
 *     assert( Immutable.is( date1, date2 ) );
 *
 * Note: overriding `valueOf` may have other implications if you use this object
 * where JavaScript expects a primitive, such as implicit string coercion.
 *
 * For more complex types, especially collections, implementing `valueOf` may
 * not be performant. An alternative is to implement `equals` and `hashCode`.
 *
 * `equals` takes another object, presumably of similar type, and returns true
 * if it is equal. Equality is symmetrical, so the same result should be
 * returned if this and the argument are flipped.
 *
 *     assert( a.equals(b) === b.equals(a) );
 *
 * `hashCode` returns a 32bit integer number representing the object which will
 * be used to determine how to store the value object in a Map or Set. You must
 * provide both or neither methods, one must not exist without the other.
 *
 * Also, an important relationship between these methods must be upheld: if two
 * values are equal, they *must* return the same hashCode. If the values are not
 * equal, they might have the same hashCode; this is called a hash collision,
 * and while undesirable for performance reasons, it is acceptable.
 *
 *     if (a.equals(b)) {
 *       assert( a.hashCode() === b.hashCode() );
 *     }
 *
 * All Immutable collections are Value Objects: they implement `equals()`
 * and `hashCode()`.
 */

function is(valueA, valueB) {
  if (valueA === valueB || valueA !== valueA && valueB !== valueB) {
    return true;
  }

  if (!valueA || !valueB) {
    return false;
  }

  if (typeof valueA.valueOf === 'function' && typeof valueB.valueOf === 'function') {
    valueA = valueA.valueOf();
    valueB = valueB.valueOf();

    if (valueA === valueB || valueA !== valueA && valueB !== valueB) {
      return true;
    }

    if (!valueA || !valueB) {
      return false;
    }
  }

  return !!(isValueObject(valueA) && isValueObject(valueB) && valueA.equals(valueB));
}

function _typeof$c(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$c = function _typeof(obj) { return typeof obj; }; } else { _typeof$c = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$c(obj); }

function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$9(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$9(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$9(Constructor.prototype, protoProps); if (staticProps) _defineProperties$9(Constructor, staticProps); return Constructor; }

function _inherits$8(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$8(subClass, superClass); }

function _setPrototypeOf$8(o, p) { _setPrototypeOf$8 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$8(o, p); }

function _createSuper$8(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$8(); return function _createSuperInternal() { var Super = _getPrototypeOf$8(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$8(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$8(this, result); }; }

function _possibleConstructorReturn$8(self, call) { if (call && (_typeof$c(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$8(self); }

function _assertThisInitialized$8(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$8() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$8(o) { _getPrototypeOf$8 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$8(o); }
var ToKeyedSequence = /*#__PURE__*/function (_KeyedSeq) {
  _inherits$8(ToKeyedSequence, _KeyedSeq);

  _createSuper$8(ToKeyedSequence);

  function ToKeyedSequence(indexed, useKeys) {
    var _this;

    _classCallCheck$9(this, ToKeyedSequence);

    _this._iter = indexed;
    _this._useKeys = useKeys;
    _this.size = indexed.size;
    return _possibleConstructorReturn$8(_this);
  }

  _createClass$9(ToKeyedSequence, [{
    key: "get",
    value: function get(key, notSetValue) {
      return this._iter.get(key, notSetValue);
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._iter.has(key);
    }
  }, {
    key: "valueSeq",
    value: function valueSeq() {
      return this._iter.valueSeq();
    }
  }, {
    key: "reverse",
    value: function reverse() {
      var _this2 = this;

      var reversedSequence = reverseFactory(this, true);

      if (!this._useKeys) {
        reversedSequence.valueSeq = function () {
          return _this2._iter.toSeq().reverse();
        };
      }

      return reversedSequence;
    }
  }, {
    key: "map",
    value: function map(mapper, context) {
      var _this3 = this;

      var mappedSequence = mapFactory(this, mapper, context);

      if (!this._useKeys) {
        mappedSequence.valueSeq = function () {
          return _this3._iter.toSeq().map(mapper, context);
        };
      }

      return mappedSequence;
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var _this4 = this;

      return this._iter.__iterate(function (v, k) {
        return fn(v, k, _this4);
      }, reverse);
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      return this._iter.__iterator(type, reverse);
    }
  }]);

  return ToKeyedSequence;
}(KeyedSeq);
ToKeyedSequence.prototype[IS_ORDERED_SYMBOL] = true;
var ToIndexedSequence = /*#__PURE__*/function (_IndexedSeq) {
  _inherits$8(ToIndexedSequence, _IndexedSeq);

  _createSuper$8(ToIndexedSequence);

  function ToIndexedSequence(iter) {
    var _this5;

    _classCallCheck$9(this, ToIndexedSequence);

    _this5._iter = iter;
    _this5.size = iter.size;
    return _possibleConstructorReturn$8(_this5);
  }

  _createClass$9(ToIndexedSequence, [{
    key: "includes",
    value: function includes(value) {
      return this._iter.includes(value);
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var _this6 = this;

      var i = 0;
      reverse && ensureSize(this);
      return this._iter.__iterate(function (v) {
        return fn(v, reverse ? _this6.size - ++i : i++, _this6);
      }, reverse);
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      var _this7 = this;

      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);

      var i = 0;
      reverse && ensureSize(this);
      return new Iterator(function () {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, reverse ? _this7.size - ++i : i++, step.value, step);
      });
    }
  }]);

  return ToIndexedSequence;
}(IndexedSeq);
var ToSetSequence = /*#__PURE__*/function (_SetSeq) {
  _inherits$8(ToSetSequence, _SetSeq);

  _createSuper$8(ToSetSequence);

  function ToSetSequence(iter) {
    var _this8;

    _classCallCheck$9(this, ToSetSequence);

    _this8._iter = iter;
    _this8.size = iter.size;
    return _possibleConstructorReturn$8(_this8);
  }

  _createClass$9(ToSetSequence, [{
    key: "has",
    value: function has(key) {
      return this._iter.includes(key);
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var _this9 = this;

      return this._iter.__iterate(function (v) {
        return fn(v, v, _this9);
      }, reverse);
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);

      return new Iterator(function () {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, step.value, step.value, step);
      });
    }
  }]);

  return ToSetSequence;
}(SetSeq);
var FromEntriesSequence = /*#__PURE__*/function (_KeyedSeq2) {
  _inherits$8(FromEntriesSequence, _KeyedSeq2);

  _createSuper$8(FromEntriesSequence);

  function FromEntriesSequence(entries) {
    var _this10;

    _classCallCheck$9(this, FromEntriesSequence);

    _this10._iter = entries;
    _this10.size = entries.size;
    return _possibleConstructorReturn$8(_this10);
  }

  _createClass$9(FromEntriesSequence, [{
    key: "entrySeq",
    value: function entrySeq() {
      return this._iter.toSeq();
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var _this11 = this;

      return this._iter.__iterate(function (entry) {
        // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.
        if (entry) {
          validateEntry(entry);
          var indexedCollection = isCollection(entry);
          return fn(indexedCollection ? entry.get(1) : entry[1], indexedCollection ? entry.get(0) : entry[0], _this11);
        }
      }, reverse);
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);

      return new Iterator(function () {
        while (true) {
          var step = iterator.next();

          if (step.done) {
            return step;
          }

          var entry = step.value; // Check if entry exists first so array access doesn't throw for holes
          // in the parent iteration.

          if (entry) {
            validateEntry(entry);
            var indexedCollection = isCollection(entry);
            return iteratorValue(type, indexedCollection ? entry.get(0) : entry[0], indexedCollection ? entry.get(1) : entry[1], step);
          }
        }
      });
    }
  }]);

  return FromEntriesSequence;
}(KeyedSeq);
ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;
function flipFactory(collection) {
  var flipSequence = makeSequence(collection);
  flipSequence._iter = collection;
  flipSequence.size = collection.size;

  flipSequence.flip = function () {
    return collection;
  };

  flipSequence.reverse = function () {
    var reversedSequence = collection.reverse.apply(this); // super.reverse()

    reversedSequence.flip = function () {
      return collection.reverse();
    };

    return reversedSequence;
  };

  flipSequence.has = function (key) {
    return collection.includes(key);
  };

  flipSequence.includes = function (key) {
    return collection.has(key);
  };

  flipSequence.cacheResult = cacheResultThrough;

  flipSequence.__iterateUncached = function (fn, reverse) {
    var _this12 = this;

    return collection.__iterate(function (v, k) {
      return fn(k, v, _this12) !== false;
    }, reverse);
  };

  flipSequence.__iteratorUncached = function (type, reverse) {
    if (type === ITERATE_ENTRIES) {
      var iterator = collection.__iterator(type, reverse);

      return new Iterator(function () {
        var step = iterator.next();

        if (!step.done) {
          var k = step.value[0];
          step.value[0] = step.value[1];
          step.value[1] = k;
        }

        return step;
      });
    }

    return collection.__iterator(type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES, reverse);
  };

  return flipSequence;
}
function mapFactory(collection, mapper, context) {
  var mappedSequence = makeSequence(collection);
  mappedSequence.size = collection.size;

  mappedSequence.has = function (key) {
    return collection.has(key);
  };

  mappedSequence.get = function (key, notSetValue) {
    var v = collection.get(key, NOT_SET);
    return v === NOT_SET ? notSetValue : mapper.call(context, v, key, collection);
  };

  mappedSequence.__iterateUncached = function (fn, reverse) {
    var _this13 = this;

    return collection.__iterate(function (v, k, c) {
      return fn(mapper.call(context, v, k, c), k, _this13) !== false;
    }, reverse);
  };

  mappedSequence.__iteratorUncached = function (type, reverse) {
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

    return new Iterator(function () {
      var step = iterator.next();

      if (step.done) {
        return step;
      }

      var entry = step.value;
      var key = entry[0];
      return iteratorValue(type, key, mapper.call(context, entry[1], key, collection), step);
    });
  };

  return mappedSequence;
}
function reverseFactory(collection, useKeys) {
  var _this15 = this;

  var reversedSequence = makeSequence(collection);
  reversedSequence._iter = collection;
  reversedSequence.size = collection.size;

  reversedSequence.reverse = function () {
    return collection;
  };

  if (collection.flip) {
    reversedSequence.flip = function () {
      var flipSequence = flipFactory(collection);

      flipSequence.reverse = function () {
        return collection.flip();
      };

      return flipSequence;
    };
  }

  reversedSequence.get = function (key, notSetValue) {
    return collection.get(useKeys ? key : -1 - key, notSetValue);
  };

  reversedSequence.has = function (key) {
    return collection.has(useKeys ? key : -1 - key);
  };

  reversedSequence.includes = function (value) {
    return collection.includes(value);
  };

  reversedSequence.cacheResult = cacheResultThrough;

  reversedSequence.__iterate = function (fn, reverse) {
    var _this14 = this;

    var i = 0;
    reverse && ensureSize(collection);
    return collection.__iterate(function (v, k) {
      return fn(v, useKeys ? k : reverse ? _this14.size - ++i : i++, _this14);
    }, !reverse);
  };

  reversedSequence.__iterator = function (type, reverse) {
    var i = 0;
    reverse && ensureSize(collection);

    var iterator = collection.__iterator(ITERATE_ENTRIES, !reverse);

    return new Iterator(function () {
      var step = iterator.next();

      if (step.done) {
        return step;
      }

      var entry = step.value;
      return iteratorValue(type, useKeys ? entry[0] : reverse ? _this15.size - ++i : i++, entry[1], step);
    });
  };

  return reversedSequence;
}
function filterFactory(collection, predicate, context, useKeys) {
  var filterSequence = makeSequence(collection);

  if (useKeys) {
    filterSequence.has = function (key) {
      var v = collection.get(key, NOT_SET);
      return v !== NOT_SET && !!predicate.call(context, v, key, collection);
    };

    filterSequence.get = function (key, notSetValue) {
      var v = collection.get(key, NOT_SET);
      return v !== NOT_SET && predicate.call(context, v, key, collection) ? v : notSetValue;
    };
  }

  filterSequence.__iterateUncached = function (fn, reverse) {
    var _this16 = this;

    var iterations = 0;

    collection.__iterate(function (v, k, c) {
      if (predicate.call(context, v, k, c)) {
        iterations++;
        return fn(v, useKeys ? k : iterations - 1, _this16);
      }
    }, reverse);

    return iterations;
  };

  filterSequence.__iteratorUncached = function (type, reverse) {
    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

    var iterations = 0;
    return new Iterator(function () {
      while (true) {
        var step = iterator.next();

        if (step.done) {
          return step;
        }

        var entry = step.value;
        var key = entry[0];
        var value = entry[1];

        if (predicate.call(context, value, key, collection)) {
          return iteratorValue(type, useKeys ? key : iterations++, value, step);
        }
      }
    });
  };

  return filterSequence;
}
function countByFactory(collection, grouper, context) {
  var groups = Map().asMutable();

  collection.__iterate(function (v, k) {
    groups.update(grouper.call(context, v, k, collection), 0, function (a) {
      return a + 1;
    });
  });

  return groups.asImmutable();
}
function groupByFactory(collection, grouper, context) {
  var isKeyedIter = isKeyed(collection);
  var groups = (isOrdered(collection) ? OrderedMap() : Map()).asMutable();

  collection.__iterate(function (v, k) {
    groups.update(grouper.call(context, v, k, collection), function (a) {
      return a = a || [], a.push(isKeyedIter ? [k, v] : v), a;
    });
  });

  var coerce = collectionClass(collection);
  return groups.map(function (arr) {
    return reify(collection, coerce(arr));
  }).asImmutable();
}
function sliceFactory(collection, begin, end, useKeys) {
  var originalSize = collection.size;

  if (wholeSlice(begin, end, originalSize)) {
    return collection;
  }

  var resolvedBegin = resolveBegin(begin, originalSize);
  var resolvedEnd = resolveEnd(end, originalSize); // begin or end will be NaN if they were provided as negative numbers and
  // this collection's size is unknown. In that case, cache first so there is
  // a known size and these do not resolve to NaN.

  if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
    return sliceFactory(collection.toSeq().cacheResult(), begin, end, useKeys);
  } // Note: resolvedEnd is undefined when the original sequence's length is
  // unknown and this slice did not supply an end and should contain all
  // elements after resolvedBegin.
  // In that case, resolvedSize will be NaN and sliceSize will remain undefined.


  var resolvedSize = resolvedEnd - resolvedBegin;
  var sliceSize;

  if (resolvedSize === resolvedSize) {
    sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
  }

  var sliceSeq = makeSequence(collection); // If collection.size is undefined, the size of the realized sliceSeq is
  // unknown at this point unless the number of items to slice is 0

  sliceSeq.size = sliceSize === 0 ? sliceSize : collection.size && sliceSize || undefined;

  if (!useKeys && isSeq(collection) && sliceSize >= 0) {
    sliceSeq.get = function (index, notSetValue) {
      index = wrapIndex(this, index);
      return index >= 0 && index < sliceSize ? collection.get(index + resolvedBegin, notSetValue) : notSetValue;
    };
  }

  sliceSeq.__iterateUncached = function (fn, reverse) {
    var _this17 = this;

    if (sliceSize === 0) {
      return 0;
    }

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }

    var skipped = 0;
    var isSkipping = true;
    var iterations = 0;

    collection.__iterate(function (v, k) {
      if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
        iterations++;
        return fn(v, useKeys ? k : iterations - 1, _this17) !== false && iterations !== sliceSize;
      }
    });

    return iterations;
  };

  sliceSeq.__iteratorUncached = function (type, reverse) {
    if (sliceSize !== 0 && reverse) {
      return this.cacheResult().__iterator(type, reverse);
    } // Don't bother instantiating parent iterator if taking 0.


    if (sliceSize === 0) {
      return new Iterator(iteratorDone);
    }

    var iterator = collection.__iterator(type, reverse);

    var skipped = 0;
    var iterations = 0;
    return new Iterator(function () {
      while (skipped++ < resolvedBegin) {
        iterator.next();
      }

      if (++iterations > sliceSize) {
        return iteratorDone();
      }

      var step = iterator.next();

      if (useKeys || type === ITERATE_VALUES || step.done) {
        return step;
      }

      if (type === ITERATE_KEYS) {
        return iteratorValue(type, iterations - 1, undefined, step);
      }

      return iteratorValue(type, iterations - 1, step.value[1], step);
    });
  };

  return sliceSeq;
}
function takeWhileFactory(collection, predicate, context) {
  var takeSequence = makeSequence(collection);

  takeSequence.__iterateUncached = function (fn, reverse) {
    var _this18 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }

    var iterations = 0;

    collection.__iterate(function (v, k, c) {
      return predicate.call(context, v, k, c) && ++iterations && fn(v, k, _this18);
    });

    return iterations;
  };

  takeSequence.__iteratorUncached = function (type, reverse) {
    var _this19 = this;

    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }

    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

    var iterating = true;
    return new Iterator(function () {
      if (!iterating) {
        return iteratorDone();
      }

      var step = iterator.next();

      if (step.done) {
        return step;
      }

      var entry = step.value;
      var k = entry[0];
      var v = entry[1];

      if (!predicate.call(context, v, k, _this19)) {
        iterating = false;
        return iteratorDone();
      }

      return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
    });
  };

  return takeSequence;
}
function skipWhileFactory(collection, predicate, context, useKeys) {
  var skipSequence = makeSequence(collection);

  skipSequence.__iterateUncached = function (fn, reverse) {
    var _this20 = this;

    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }

    var isSkipping = true;
    var iterations = 0;

    collection.__iterate(function (v, k, c) {
      if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
        iterations++;
        return fn(v, useKeys ? k : iterations - 1, _this20);
      }
    });

    return iterations;
  };

  skipSequence.__iteratorUncached = function (type, reverse) {
    var _this21 = this;

    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }

    var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);

    var skipping = true;
    var iterations = 0;
    return new Iterator(function () {
      var step;
      var k;
      var v;

      do {
        step = iterator.next();

        if (step.done) {
          if (useKeys || type === ITERATE_VALUES) {
            return step;
          }

          if (type === ITERATE_KEYS) {
            return iteratorValue(type, iterations++, undefined, step);
          }

          return iteratorValue(type, iterations++, step.value[1], step);
        }

        var entry = step.value;
        k = entry[0];
        v = entry[1];
        skipping && (skipping = predicate.call(context, v, k, _this21));
      } while (skipping);

      return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
    });
  };

  return skipSequence;
}
function concatFactory(collection, values) {
  var isKeyedCollection = isKeyed(collection);
  var iters = [collection].concat(values).map(function (v) {
    if (!isCollection(v)) {
      v = isKeyedCollection ? keyedSeqFromValue(v) : indexedSeqFromValue(Array.isArray(v) ? v : [v]);
    } else if (isKeyedCollection) {
      v = KeyedCollection(v);
    }

    return v;
  }).filter(function (v) {
    return v.size !== 0;
  });

  if (iters.length === 0) {
    return collection;
  }

  if (iters.length === 1) {
    var singleton = iters[0];

    if (singleton === collection || isKeyedCollection && isKeyed(singleton) || isIndexed(collection) && isIndexed(singleton)) {
      return singleton;
    }
  }

  var concatSeq = new ArraySeq(iters);

  if (isKeyedCollection) {
    concatSeq = concatSeq.toKeyedSeq();
  } else if (!isIndexed(collection)) {
    concatSeq = concatSeq.toSetSeq();
  }

  concatSeq = concatSeq.flatten(true);
  concatSeq.size = iters.reduce(function (sum, seq) {
    if (sum !== undefined) {
      var size = seq.size;

      if (size !== undefined) {
        return sum + size;
      }
    }
  }, 0);
  return concatSeq;
}
function flattenFactory(collection, depth, useKeys) {
  var flatSequence = makeSequence(collection);

  flatSequence.__iterateUncached = function (fn, reverse) {
    if (reverse) {
      return this.cacheResult().__iterate(fn, reverse);
    }

    var iterations = 0;
    var stopped = false;

    function flatDeep(iter, currentDepth) {
      iter.__iterate(function (v, k) {
        if ((!depth || currentDepth < depth) && isCollection(v)) {
          flatDeep(v, currentDepth + 1);
        } else {
          iterations++;

          if (fn(v, useKeys ? k : iterations - 1, flatSequence) === false) {
            stopped = true;
          }
        }

        return !stopped;
      }, reverse);
    }

    flatDeep(collection, 0);
    return iterations;
  };

  flatSequence.__iteratorUncached = function (type, reverse) {
    if (reverse) {
      return this.cacheResult().__iterator(type, reverse);
    }

    var iterator = collection.__iterator(type, reverse);

    var stack = [];
    var iterations = 0;
    return new Iterator(function () {
      while (iterator) {
        var step = iterator.next();

        if (step.done !== false) {
          iterator = stack.pop();
          continue;
        }

        var v = step.value;

        if (type === ITERATE_ENTRIES) {
          v = v[1];
        }

        if ((!depth || stack.length < depth) && isCollection(v)) {
          stack.push(iterator);
          iterator = v.__iterator(type, reverse);
        } else {
          return useKeys ? step : iteratorValue(type, iterations++, v, step);
        }
      }

      return iteratorDone();
    });
  };

  return flatSequence;
}
function flatMapFactory(collection, mapper, context) {
  var coerce = collectionClass(collection);
  return collection.toSeq().map(function (v, k) {
    return coerce(mapper.call(context, v, k, collection));
  }).flatten(true);
}
function interposeFactory(collection, separator) {
  var interposedSequence = makeSequence(collection);
  interposedSequence.size = collection.size && collection.size * 2 - 1;

  interposedSequence.__iterateUncached = function (fn, reverse) {
    var _this22 = this;

    var iterations = 0;

    collection.__iterate(function (v) {
      return (!iterations || fn(separator, iterations++, _this22) !== false) && fn(v, iterations++, _this22) !== false;
    }, reverse);

    return iterations;
  };

  interposedSequence.__iteratorUncached = function (type, reverse) {
    var iterator = collection.__iterator(ITERATE_VALUES, reverse);

    var iterations = 0;
    var step;
    return new Iterator(function () {
      if (!step || iterations % 2) {
        step = iterator.next();

        if (step.done) {
          return step;
        }
      }

      return iterations % 2 ? iteratorValue(type, iterations++, separator) : iteratorValue(type, iterations++, step.value, step);
    });
  };

  return interposedSequence;
}
function sortFactory(collection, comparator, mapper) {
  if (!comparator) {
    comparator = defaultComparator;
  }

  var isKeyedCollection = isKeyed(collection);
  var index = 0;
  var entries = collection.toSeq().map(function (v, k) {
    return [k, v, index++, mapper ? mapper(v, k, collection) : v];
  }).valueSeq().toArray();
  entries.sort(function (a, b) {
    return comparator(a[3], b[3]) || a[2] - b[2];
  }).forEach(isKeyedCollection ? function (v, i) {
    entries[i].length = 2;
  } : function (v, i) {
    entries[i] = v[1];
  });
  return isKeyedCollection ? KeyedSeq(entries) : isIndexed(collection) ? IndexedSeq(entries) : SetSeq(entries);
}
function maxFactory(collection, comparator, mapper) {
  if (!comparator) {
    comparator = defaultComparator;
  }

  if (mapper) {
    var entry = collection.toSeq().map(function (v, k) {
      return [v, mapper(v, k, collection)];
    }).reduce(function (a, b) {
      return maxCompare(comparator, a[1], b[1]) ? b : a;
    });
    return entry && entry[0];
  }

  return collection.reduce(function (a, b) {
    return maxCompare(comparator, a, b) ? b : a;
  });
}

function maxCompare(comparator, a, b) {
  var comp = comparator(b, a); // b is considered the new max if the comparator declares them equal, but
  // they are not equal and b is in fact a nullish value.

  return comp === 0 && b !== a && (b === undefined || b === null || b !== b) || comp > 0;
}

function zipWithFactory(keyIter, zipper, iters, zipAll) {
  var zipSequence = makeSequence(keyIter);
  var sizes = new ArraySeq(iters).map(function (i) {
    return i.size;
  });
  zipSequence.size = zipAll ? sizes.max() : sizes.min(); // Note: this a generic base implementation of __iterate in terms of
  // __iterator which may be more generically useful in the future.

  zipSequence.__iterate = function (fn, reverse) {
    /* generic:
    var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
    var step;
    var iterations = 0;
    while (!(step = iterator.next()).done) {
      iterations++;
      if (fn(step.value[1], step.value[0], this) === false) {
        break;
      }
    }
    return iterations;
    */
    // indexed:
    var iterator = this.__iterator(ITERATE_VALUES, reverse);

    var step;
    var iterations = 0;

    while (!(step = iterator.next()).done) {
      if (fn(step.value, iterations++, this) === false) {
        break;
      }
    }

    return iterations;
  };

  zipSequence.__iteratorUncached = function (type, reverse) {
    var iterators = iters.map(function (i) {
      return i = Collection(i), getIterator(reverse ? i.reverse() : i);
    });
    var iterations = 0;
    var isDone = false;
    return new Iterator(function () {
      var steps;

      if (!isDone) {
        steps = iterators.map(function (i) {
          return i.next();
        });
        isDone = zipAll ? steps.every(function (s) {
          return s.done;
        }) : steps.some(function (s) {
          return s.done;
        });
      }

      if (isDone) {
        return iteratorDone();
      }

      return iteratorValue(type, iterations++, zipper.apply(null, steps.map(function (s) {
        return s.value;
      })));
    });
  };

  return zipSequence;
} // #pragma Helper Functions

function reify(iter, seq) {
  return iter === seq ? iter : isSeq(iter) ? seq : iter.constructor(seq);
}

function validateEntry(entry) {
  if (entry !== Object(entry)) {
    throw new TypeError('Expected [K, V] tuple: ' + entry);
  }
}

function collectionClass(collection) {
  return isKeyed(collection) ? KeyedCollection : isIndexed(collection) ? IndexedCollection : SetCollection;
}

function makeSequence(collection) {
  return Object.create((isKeyed(collection) ? KeyedSeq : isIndexed(collection) ? IndexedSeq : SetSeq).prototype);
}

function cacheResultThrough() {
  if (this._iter.cacheResult) {
    this._iter.cacheResult();

    this.size = this._iter.size;
    return this;
  }

  return Seq.prototype.cacheResult.call(this);
}

function defaultComparator(a, b) {
  if (a === undefined && b === undefined) {
    return 0;
  }

  if (a === undefined) {
    return 1;
  }

  if (b === undefined) {
    return -1;
  }

  return a > b ? 1 : a < b ? -1 : 0;
}

// http://jsperf.com/copy-array-inline
function arrCopy(arr, offset) {
  offset = offset || 0;
  var len = Math.max(0, arr.length - offset);
  var newArr = new Array(len);

  for (var ii = 0; ii < len; ii++) {
    newArr[ii] = arr[ii + offset];
  }

  return newArr;
}

function invariant(condition, error) {
  if (!condition) throw new Error(error);
}

function assertNotInfinite(size) {
  invariant(size !== Infinity, 'Cannot perform this action with an infinite size.');
}

function coerceKeyPath(keyPath) {
  if (isArrayLike(keyPath) && typeof keyPath !== 'string') {
    return keyPath;
  }

  if (isOrdered(keyPath)) {
    return keyPath.toArray();
  }

  throw new TypeError('Invalid keyPath: expected Ordered Collection or Array: ' + keyPath);
}

function _typeof$b(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$b = function _typeof(obj) { return typeof obj; }; } else { _typeof$b = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$b(obj); }

var toString = Object.prototype.toString;
function isPlainObject(value) {
  // The base prototype's toString deals with Argument objects and native namespaces like Math
  if (!value || _typeof$b(value) !== 'object' || toString.call(value) !== '[object Object]') {
    return false;
  }

  var proto = Object.getPrototypeOf(value);

  if (proto === null) {
    return true;
  } // Iteratively going up the prototype chain is needed for cross-realm environments (differing contexts, iframes, etc)


  var parentProto = proto;
  var nextProto = Object.getPrototypeOf(proto);

  while (nextProto !== null) {
    parentProto = nextProto;
    nextProto = Object.getPrototypeOf(parentProto);
  }

  return parentProto === proto;
}

function _typeof$a(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$a = function _typeof(obj) { return typeof obj; }; } else { _typeof$a = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$a(obj); }
/**
 * Returns true if the value is a potentially-persistent data structure, either
 * provided by Immutable.js or a plain Array or Object.
 */

function isDataStructure(value) {
  return _typeof$a(value) === 'object' && (isImmutable(value) || Array.isArray(value) || isPlainObject(value));
}

/**
 * Converts a value to a string, adding quotes if a string was provided.
 */
function quoteString(value) {
  try {
    return typeof value === 'string' ? JSON.stringify(value) : String(value);
  } catch (_ignoreError) {
    return JSON.stringify(value);
  }
}

function has(collection, key) {
  return isImmutable(collection) ? collection.has(key) : isDataStructure(collection) && hasOwnProperty.call(collection, key);
}

function get(collection, key, notSetValue) {
  return isImmutable(collection) ? collection.get(key, notSetValue) : !has(collection, key) ? notSetValue : typeof collection.get === 'function' ? collection.get(key) : collection[key];
}

function shallowCopy(from) {
  if (Array.isArray(from)) {
    return arrCopy(from);
  }

  var to = {};

  for (var key in from) {
    if (hasOwnProperty.call(from, key)) {
      to[key] = from[key];
    }
  }

  return to;
}

function remove(collection, key) {
  if (!isDataStructure(collection)) {
    throw new TypeError('Cannot update non-data-structure value: ' + collection);
  }

  if (isImmutable(collection)) {
    if (!collection.remove) {
      throw new TypeError('Cannot update immutable value without .remove() method: ' + collection);
    }

    return collection.remove(key);
  }

  if (!hasOwnProperty.call(collection, key)) {
    return collection;
  }

  var collectionCopy = shallowCopy(collection);

  if (Array.isArray(collectionCopy)) {
    collectionCopy.splice(key, 1);
  } else {
    delete collectionCopy[key];
  }

  return collectionCopy;
}

function set(collection, key, value) {
  if (!isDataStructure(collection)) {
    throw new TypeError('Cannot update non-data-structure value: ' + collection);
  }

  if (isImmutable(collection)) {
    if (!collection.set) {
      throw new TypeError('Cannot update immutable value without .set() method: ' + collection);
    }

    return collection.set(key, value);
  }

  if (hasOwnProperty.call(collection, key) && value === collection[key]) {
    return collection;
  }

  var collectionCopy = shallowCopy(collection);
  collectionCopy[key] = value;
  return collectionCopy;
}

function updateIn$1(collection, keyPath, notSetValue, updater) {
  if (!updater) {
    updater = notSetValue;
    notSetValue = undefined;
  }

  var updatedValue = updateInDeeply(isImmutable(collection), collection, coerceKeyPath(keyPath), 0, notSetValue, updater);
  return updatedValue === NOT_SET ? notSetValue : updatedValue;
}

function updateInDeeply(inImmutable, existing, keyPath, i, notSetValue, updater) {
  var wasNotSet = existing === NOT_SET;

  if (i === keyPath.length) {
    var existingValue = wasNotSet ? notSetValue : existing;
    var newValue = updater(existingValue);
    return newValue === existingValue ? existing : newValue;
  }

  if (!wasNotSet && !isDataStructure(existing)) {
    throw new TypeError('Cannot update within non-data-structure value in path [' + keyPath.slice(0, i).map(quoteString) + ']: ' + existing);
  }

  var key = keyPath[i];
  var nextExisting = wasNotSet ? NOT_SET : get(existing, key, NOT_SET);
  var nextUpdated = updateInDeeply(nextExisting === NOT_SET ? inImmutable : isImmutable(nextExisting), nextExisting, keyPath, i + 1, notSetValue, updater);
  return nextUpdated === nextExisting ? existing : nextUpdated === NOT_SET ? remove(existing, key) : set(wasNotSet ? inImmutable ? emptyMap() : {} : existing, key, nextUpdated);
}

function setIn$1(collection, keyPath, value) {
  return updateIn$1(collection, keyPath, NOT_SET, function () {
    return value;
  });
}

function setIn(keyPath, v) {
  return setIn$1(this, keyPath, v);
}

function removeIn(collection, keyPath) {
  return updateIn$1(collection, keyPath, function () {
    return NOT_SET;
  });
}

function deleteIn(keyPath) {
  return removeIn(this, keyPath);
}

function update$1(collection, key, notSetValue, updater) {
  return updateIn$1(collection, [key], notSetValue, updater);
}

function update(key, notSetValue, updater) {
  return arguments.length === 1 ? key(this) : update$1(this, key, notSetValue, updater);
}

function updateIn(keyPath, notSetValue, updater) {
  return updateIn$1(this, keyPath, notSetValue, updater);
}

function merge$1() {
  for (var _len = arguments.length, iters = new Array(_len), _key = 0; _key < _len; _key++) {
    iters[_key] = arguments[_key];
  }

  return mergeIntoKeyedWith(this, iters);
}
function mergeWith$1(merger) {
  if (typeof merger !== 'function') {
    throw new TypeError('Invalid merger function: ' + merger);
  }

  for (var _len2 = arguments.length, iters = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    iters[_key2 - 1] = arguments[_key2];
  }

  return mergeIntoKeyedWith(this, iters, merger);
}

function mergeIntoKeyedWith(collection, collections, merger) {
  var iters = [];

  for (var ii = 0; ii < collections.length; ii++) {
    var _collection = KeyedCollection(collections[ii]);

    if (_collection.size !== 0) {
      iters.push(_collection);
    }
  }

  if (iters.length === 0) {
    return collection;
  }

  if (collection.toSeq().size === 0 && !collection.__ownerID && iters.length === 1) {
    return collection.constructor(iters[0]);
  }

  return collection.withMutations(function (collection) {
    var mergeIntoCollection = merger ? function (value, key) {
      update$1(collection, key, NOT_SET, function (oldVal) {
        return oldVal === NOT_SET ? value : merger(oldVal, value, key);
      });
    } : function (value, key) {
      collection.set(key, value);
    };

    for (var _ii = 0; _ii < iters.length; _ii++) {
      iters[_ii].forEach(mergeIntoCollection);
    }
  });
}

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray$1(arr); }

function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function merge(collection) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  return mergeWithSources(collection, sources);
}
function mergeWith(merger, collection) {
  for (var _len2 = arguments.length, sources = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    sources[_key2 - 2] = arguments[_key2];
  }

  return mergeWithSources(collection, sources, merger);
}
function mergeDeep$1(collection) {
  for (var _len3 = arguments.length, sources = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    sources[_key3 - 1] = arguments[_key3];
  }

  return mergeDeepWithSources(collection, sources);
}
function mergeDeepWith$1(merger, collection) {
  for (var _len4 = arguments.length, sources = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    sources[_key4 - 2] = arguments[_key4];
  }

  return mergeDeepWithSources(collection, sources, merger);
}
function mergeDeepWithSources(collection, sources, merger) {
  return mergeWithSources(collection, sources, deepMergerWith(merger));
}
function mergeWithSources(collection, sources, merger) {
  if (!isDataStructure(collection)) {
    throw new TypeError('Cannot merge into non-data-structure value: ' + collection);
  }

  if (isImmutable(collection)) {
    return typeof merger === 'function' && collection.mergeWith ? collection.mergeWith.apply(collection, [merger].concat(_toConsumableArray(sources))) : collection.merge ? collection.merge.apply(collection, _toConsumableArray(sources)) : collection.concat.apply(collection, _toConsumableArray(sources));
  }

  var isArray = Array.isArray(collection);
  var merged = collection;
  var Collection = isArray ? IndexedCollection : KeyedCollection;
  var mergeItem = isArray ? function (value) {
    // Copy on write
    if (merged === collection) {
      merged = shallowCopy(merged);
    }

    merged.push(value);
  } : function (value, key) {
    var hasVal = hasOwnProperty.call(merged, key);
    var nextVal = hasVal && merger ? merger(merged[key], value, key) : value;

    if (!hasVal || nextVal !== merged[key]) {
      // Copy on write
      if (merged === collection) {
        merged = shallowCopy(merged);
      }

      merged[key] = nextVal;
    }
  };

  for (var i = 0; i < sources.length; i++) {
    Collection(sources[i]).forEach(mergeItem);
  }

  return merged;
}

function deepMergerWith(merger) {
  function deepMerger(oldValue, newValue, key) {
    return isDataStructure(oldValue) && isDataStructure(newValue) && areMergeable(oldValue, newValue) ? mergeWithSources(oldValue, [newValue], deepMerger) : merger ? merger(oldValue, newValue, key) : newValue;
  }

  return deepMerger;
}
/**
 * It's unclear what the desired behavior is for merging two collections that
 * fall into separate categories between keyed, indexed, or set-like, so we only
 * consider them mergeable if they fall into the same category.
 */


function areMergeable(oldDataStructure, newDataStructure) {
  var oldSeq = Seq(oldDataStructure);
  var newSeq = Seq(newDataStructure); // This logic assumes that a sequence can only fall into one of the three
  // categories mentioned above (since there's no `isSetLike()` method).

  return isIndexed(oldSeq) === isIndexed(newSeq) && isKeyed(oldSeq) === isKeyed(newSeq);
}

function mergeDeep() {
  for (var _len = arguments.length, iters = new Array(_len), _key = 0; _key < _len; _key++) {
    iters[_key] = arguments[_key];
  }

  return mergeDeepWithSources(this, iters);
}
function mergeDeepWith(merger) {
  for (var _len2 = arguments.length, iters = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    iters[_key2 - 1] = arguments[_key2];
  }

  return mergeDeepWithSources(this, iters, merger);
}

function mergeIn(keyPath) {
  for (var _len = arguments.length, iters = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    iters[_key - 1] = arguments[_key];
  }

  return updateIn$1(this, keyPath, emptyMap(), function (m) {
    return mergeWithSources(m, iters);
  });
}

function mergeDeepIn(keyPath) {
  for (var _len = arguments.length, iters = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    iters[_key - 1] = arguments[_key];
  }

  return updateIn$1(this, keyPath, emptyMap(), function (m) {
    return mergeDeepWithSources(m, iters);
  });
}

function withMutations(fn) {
  var mutable = this.asMutable();
  fn(mutable);
  return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
}

function asMutable() {
  return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
}

function asImmutable() {
  return this.__ensureOwner();
}

function wasAltered() {
  return this.__altered;
}

function _typeof$9(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$9 = function _typeof(obj) { return typeof obj; }; } else { _typeof$9 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$9(obj); }

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$8(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$8(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$8(Constructor.prototype, protoProps); if (staticProps) _defineProperties$8(Constructor, staticProps); return Constructor; }

function _inherits$7(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$7(subClass, superClass); }

function _setPrototypeOf$7(o, p) { _setPrototypeOf$7 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$7(o, p); }

function _createSuper$7(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$7(); return function _createSuperInternal() { var Super = _getPrototypeOf$7(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$7(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$7(this, result); }; }

function _possibleConstructorReturn$7(self, call) { if (call && (_typeof$9(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$7(self); }

function _assertThisInitialized$7(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$7() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$7(o) { _getPrototypeOf$7 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$7(o); }
var Map = /*#__PURE__*/function (_KeyedCollection) {
  _inherits$7(Map, _KeyedCollection);

  _createSuper$7(Map);

  // @pragma Construction
  function Map(value) {
    var _this;

    _classCallCheck$8(this, Map);

    return _possibleConstructorReturn$7(_this, value === null || value === undefined ? emptyMap() : isMap(value) && !isOrdered(value) ? value : emptyMap().withMutations(function (map) {
      var iter = KeyedCollection(value);
      assertNotInfinite(iter.size);
      iter.forEach(function (v, k) {
        return map.set(k, v);
      });
    }));
  }

  _createClass$8(Map, [{
    key: "toString",
    value: function toString() {
      return this.__toString('Map {', '}');
    } // @pragma Access

  }, {
    key: "get",
    value: function get(k, notSetValue) {
      return this._root ? this._root.get(0, undefined, k, notSetValue) : notSetValue;
    } // @pragma Modification

  }, {
    key: "set",
    value: function set(k, v) {
      return updateMap(this, k, v);
    }
  }, {
    key: "remove",
    value: function remove(k) {
      return updateMap(this, k, NOT_SET);
    }
  }, {
    key: "deleteAll",
    value: function deleteAll(keys) {
      var collection = Collection(keys);

      if (collection.size === 0) {
        return this;
      }

      return this.withMutations(function (map) {
        collection.forEach(function (key) {
          return map.remove(key);
        });
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.size === 0) {
        return this;
      }

      if (this.__ownerID) {
        this.size = 0;
        this._root = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return emptyMap();
    } // @pragma Composition

  }, {
    key: "sort",
    value: function sort(comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator));
    }
  }, {
    key: "sortBy",
    value: function sortBy(mapper, comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator, mapper));
    }
  }, {
    key: "map",
    value: function map(mapper, context) {
      var _this2 = this;

      return this.withMutations(function (map) {
        map.forEach(function (value, key) {
          map.set(key, mapper.call(context, value, key, _this2));
        });
      });
    } // @pragma Mutability

  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      return new MapIterator(this, type, reverse);
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var _this3 = this;

      var iterations = 0;
      this._root && this._root.iterate(function (entry) {
        iterations++;
        return fn(entry[1], entry[0], _this3);
      }, reverse);
      return iterations;
    }
  }, {
    key: "__ensureOwner",
    value: function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      if (!ownerID) {
        if (this.size === 0) {
          return emptyMap();
        }

        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }

      return makeMap(this.size, this._root, ownerID, this.__hash);
    }
  }], [{
    key: "of",
    value: function of() {
      for (var _len = arguments.length, keyValues = new Array(_len), _key = 0; _key < _len; _key++) {
        keyValues[_key] = arguments[_key];
      }

      return emptyMap().withMutations(function (map) {
        for (var i = 0; i < keyValues.length; i += 2) {
          if (i + 1 >= keyValues.length) {
            throw new Error('Missing value for key: ' + keyValues[i]);
          }

          map.set(keyValues[i], keyValues[i + 1]);
        }
      });
    }
  }]);

  return Map;
}(KeyedCollection);
Map.isMap = isMap;
var MapPrototype = Map.prototype;
MapPrototype[IS_MAP_SYMBOL] = true;
MapPrototype[DELETE] = MapPrototype.remove;
MapPrototype.removeAll = MapPrototype.deleteAll;
MapPrototype.setIn = setIn;
MapPrototype.removeIn = MapPrototype.deleteIn = deleteIn;
MapPrototype.update = update;
MapPrototype.updateIn = updateIn;
MapPrototype.merge = MapPrototype.concat = merge$1;
MapPrototype.mergeWith = mergeWith$1;
MapPrototype.mergeDeep = mergeDeep;
MapPrototype.mergeDeepWith = mergeDeepWith;
MapPrototype.mergeIn = mergeIn;
MapPrototype.mergeDeepIn = mergeDeepIn;
MapPrototype.withMutations = withMutations;
MapPrototype.wasAltered = wasAltered;
MapPrototype.asImmutable = asImmutable;
MapPrototype['@@transducer/init'] = MapPrototype.asMutable = asMutable;

MapPrototype['@@transducer/step'] = function (result, arr) {
  return result.set(arr[0], arr[1]);
};

MapPrototype['@@transducer/result'] = function (obj) {
  return obj.asImmutable();
}; // #pragma Trie Nodes


var ArrayMapNode = /*#__PURE__*/function () {
  function ArrayMapNode(ownerID, entries) {
    _classCallCheck$8(this, ArrayMapNode);

    this.ownerID = ownerID;
    this.entries = entries;
  }

  _createClass$8(ArrayMapNode, [{
    key: "get",
    value: function get(shift, keyHash, key, notSetValue) {
      var entries = this.entries;

      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }

      return notSetValue;
    }
  }, {
    key: "update",
    value: function update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;
      var entries = this.entries;
      var idx = 0;
      var len = entries.length;

      for (; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }

      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && entries.length === 1) {
        return; // undefined
      }

      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
        return createNodes(ownerID, entries, key, value);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : newEntries[idx] = newEntries.pop();
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new ArrayMapNode(ownerID, newEntries);
    }
  }]);

  return ArrayMapNode;
}();

var BitmapIndexedNode = /*#__PURE__*/function () {
  function BitmapIndexedNode(ownerID, bitmap, nodes) {
    _classCallCheck$8(this, BitmapIndexedNode);

    this.ownerID = ownerID;
    this.bitmap = bitmap;
    this.nodes = nodes;
  }

  _createClass$8(BitmapIndexedNode, [{
    key: "get",
    value: function get(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }

      var bit = 1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK);
      var bitmap = this.bitmap;
      return (bitmap & bit) === 0 ? notSetValue : this.nodes[popCount(bitmap & bit - 1)].get(shift + SHIFT, keyHash, key, notSetValue);
    }
  }, {
    key: "update",
    value: function update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }

      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var bit = 1 << keyHashFrag;
      var bitmap = this.bitmap;
      var exists = (bitmap & bit) !== 0;

      if (!exists && value === NOT_SET) {
        return this;
      }

      var idx = popCount(bitmap & bit - 1);
      var nodes = this.nodes;
      var node = exists ? nodes[idx] : undefined;
      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

      if (newNode === node) {
        return this;
      }

      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
      }

      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
        return nodes[idx ^ 1];
      }

      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
        return newNode;
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
      var newNodes = exists ? newNode ? setAt(nodes, idx, newNode, isEditable) : spliceOut(nodes, idx, isEditable) : spliceIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.bitmap = newBitmap;
        this.nodes = newNodes;
        return this;
      }

      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
    }
  }]);

  return BitmapIndexedNode;
}();

var HashArrayMapNode = /*#__PURE__*/function () {
  function HashArrayMapNode(ownerID, count, nodes) {
    _classCallCheck$8(this, HashArrayMapNode);

    this.ownerID = ownerID;
    this.count = count;
    this.nodes = nodes;
  }

  _createClass$8(HashArrayMapNode, [{
    key: "get",
    value: function get(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }

      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var node = this.nodes[idx];
      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
    }
  }, {
    key: "update",
    value: function update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }

      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var removed = value === NOT_SET;
      var nodes = this.nodes;
      var node = nodes[idx];

      if (removed && !node) {
        return this;
      }

      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

      if (newNode === node) {
        return this;
      }

      var newCount = this.count;

      if (!node) {
        newCount++;
      } else if (!newNode) {
        newCount--;

        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
          return packNodes(ownerID, nodes, newCount, idx);
        }
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newNodes = setAt(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.count = newCount;
        this.nodes = newNodes;
        return this;
      }

      return new HashArrayMapNode(ownerID, newCount, newNodes);
    }
  }]);

  return HashArrayMapNode;
}();

var HashCollisionNode = /*#__PURE__*/function () {
  function HashCollisionNode(ownerID, keyHash, entries) {
    _classCallCheck$8(this, HashCollisionNode);

    this.ownerID = ownerID;
    this.keyHash = keyHash;
    this.entries = entries;
  }

  _createClass$8(HashCollisionNode, [{
    key: "get",
    value: function get(shift, keyHash, key, notSetValue) {
      var entries = this.entries;

      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }

      return notSetValue;
    }
  }, {
    key: "update",
    value: function update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }

      var removed = value === NOT_SET;

      if (keyHash !== this.keyHash) {
        if (removed) {
          return this;
        }

        SetRef(didAlter);
        SetRef(didChangeSize);
        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
      }

      var entries = this.entries;
      var idx = 0;
      var len = entries.length;

      for (; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }

      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && len === 2) {
        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : newEntries[idx] = newEntries.pop();
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
    }
  }]);

  return HashCollisionNode;
}();

var ValueNode = /*#__PURE__*/function () {
  function ValueNode(ownerID, keyHash, entry) {
    _classCallCheck$8(this, ValueNode);

    this.ownerID = ownerID;
    this.keyHash = keyHash;
    this.entry = entry;
  }

  _createClass$8(ValueNode, [{
    key: "get",
    value: function get(shift, keyHash, key, notSetValue) {
      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
    }
  }, {
    key: "update",
    value: function update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;
      var keyMatch = is(key, this.entry[0]);

      if (keyMatch ? value === this.entry[1] : removed) {
        return this;
      }

      SetRef(didAlter);

      if (removed) {
        SetRef(didChangeSize);
        return; // undefined
      }

      if (keyMatch) {
        if (ownerID && ownerID === this.ownerID) {
          this.entry[1] = value;
          return this;
        }

        return new ValueNode(ownerID, this.keyHash, [key, value]);
      }

      SetRef(didChangeSize);
      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
    }
  }]);

  return ValueNode;
}(); // #pragma Iterators


ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function (fn, reverse) {
  var entries = this.entries;

  for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
    if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
      return false;
    }
  }
};

BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function (fn, reverse) {
  var nodes = this.nodes;

  for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
    var node = nodes[reverse ? maxIndex - ii : ii];

    if (node && node.iterate(fn, reverse) === false) {
      return false;
    }
  }
}; // eslint-disable-next-line no-unused-vars


ValueNode.prototype.iterate = function (fn, reverse) {
  return fn(this.entry);
};

var MapIterator = /*#__PURE__*/function (_Iterator) {
  _inherits$7(MapIterator, _Iterator);

  _createSuper$7(MapIterator);

  function MapIterator(map, type, reverse) {
    var _this4;

    _classCallCheck$8(this, MapIterator);

    _this4._type = type;
    _this4._reverse = reverse;
    _this4._stack = map._root && mapIteratorFrame(map._root);
    return _possibleConstructorReturn$7(_this4);
  }

  _createClass$8(MapIterator, [{
    key: "next",
    value: function next() {
      var type = this._type;
      var stack = this._stack;

      while (stack) {
        var node = stack.node;
        var index = stack.index++;
        var maxIndex = void 0;

        if (node.entry) {
          if (index === 0) {
            return mapIteratorValue(type, node.entry);
          }
        } else if (node.entries) {
          maxIndex = node.entries.length - 1;

          if (index <= maxIndex) {
            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
          }
        } else {
          maxIndex = node.nodes.length - 1;

          if (index <= maxIndex) {
            var subNode = node.nodes[this._reverse ? maxIndex - index : index];

            if (subNode) {
              if (subNode.entry) {
                return mapIteratorValue(type, subNode.entry);
              }

              stack = this._stack = mapIteratorFrame(subNode, stack);
            }

            continue;
          }
        }

        stack = this._stack = this._stack.__prev;
      }

      return iteratorDone();
    }
  }]);

  return MapIterator;
}(Iterator);

function mapIteratorValue(type, entry) {
  return iteratorValue(type, entry[0], entry[1]);
}

function mapIteratorFrame(node, prev) {
  return {
    node: node,
    index: 0,
    __prev: prev
  };
}

function makeMap(size, root, ownerID, hash) {
  var map = Object.create(MapPrototype);
  map.size = size;
  map._root = root;
  map.__ownerID = ownerID;
  map.__hash = hash;
  map.__altered = false;
  return map;
}

var EMPTY_MAP;
function emptyMap() {
  return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
}

function updateMap(map, k, v) {
  var newRoot;
  var newSize;

  if (!map._root) {
    if (v === NOT_SET) {
      return map;
    }

    newSize = 1;
    newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
  } else {
    var didChangeSize = MakeRef();
    var didAlter = MakeRef();
    newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);

    if (!didAlter.value) {
      return map;
    }

    newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
  }

  if (map.__ownerID) {
    map.size = newSize;
    map._root = newRoot;
    map.__hash = undefined;
    map.__altered = true;
    return map;
  }

  return newRoot ? makeMap(newSize, newRoot) : emptyMap();
}

function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
  if (!node) {
    if (value === NOT_SET) {
      return node;
    }

    SetRef(didAlter);
    SetRef(didChangeSize);
    return new ValueNode(ownerID, keyHash, [key, value]);
  }

  return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
}

function isLeafNode(node) {
  return node.constructor === ValueNode || node.constructor === HashCollisionNode;
}

function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
  if (node.keyHash === keyHash) {
    return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
  }

  var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
  var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
  var newNode;
  var nodes = idx1 === idx2 ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] : (newNode = new ValueNode(ownerID, keyHash, entry), idx1 < idx2 ? [node, newNode] : [newNode, node]);
  return new BitmapIndexedNode(ownerID, 1 << idx1 | 1 << idx2, nodes);
}

function createNodes(ownerID, entries, key, value) {
  if (!ownerID) {
    ownerID = new OwnerID();
  }

  var node = new ValueNode(ownerID, hash(key), [key, value]);

  for (var ii = 0; ii < entries.length; ii++) {
    var entry = entries[ii];
    node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
  }

  return node;
}

function packNodes(ownerID, nodes, count, excluding) {
  var bitmap = 0;
  var packedII = 0;
  var packedNodes = new Array(count);

  for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
    var node = nodes[ii];

    if (node !== undefined && ii !== excluding) {
      bitmap |= bit;
      packedNodes[packedII++] = node;
    }
  }

  return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
}

function expandNodes(ownerID, nodes, bitmap, including, node) {
  var count = 0;
  var expandedNodes = new Array(SIZE);

  for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
    expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
  }

  expandedNodes[including] = node;
  return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
}

function popCount(x) {
  x -= x >> 1 & 0x55555555;
  x = (x & 0x33333333) + (x >> 2 & 0x33333333);
  x = x + (x >> 4) & 0x0f0f0f0f;
  x += x >> 8;
  x += x >> 16;
  return x & 0x7f;
}

function setAt(array, idx, val, canEdit) {
  var newArray = canEdit ? array : arrCopy(array);
  newArray[idx] = val;
  return newArray;
}

function spliceIn(array, idx, val, canEdit) {
  var newLen = array.length + 1;

  if (canEdit && idx + 1 === newLen) {
    array[idx] = val;
    return array;
  }

  var newArray = new Array(newLen);
  var after = 0;

  for (var ii = 0; ii < newLen; ii++) {
    if (ii === idx) {
      newArray[ii] = val;
      after = -1;
    } else {
      newArray[ii] = array[ii + after];
    }
  }

  return newArray;
}

function spliceOut(array, idx, canEdit) {
  var newLen = array.length - 1;

  if (canEdit && idx === newLen) {
    array.pop();
    return array;
  }

  var newArray = new Array(newLen);
  var after = 0;

  for (var ii = 0; ii < newLen; ii++) {
    if (ii === idx) {
      after = 1;
    }

    newArray[ii] = array[ii + after];
  }

  return newArray;
}

var MAX_ARRAY_MAP_SIZE = SIZE / 4;
var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

var IS_LIST_SYMBOL = '@@__IMMUTABLE_LIST__@@';
function isList(maybeList) {
  return Boolean(maybeList && maybeList[IS_LIST_SYMBOL]);
}

function _typeof$8(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$8 = function _typeof(obj) { return typeof obj; }; } else { _typeof$8 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$8(obj); }

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$7(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$7(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$7(Constructor.prototype, protoProps); if (staticProps) _defineProperties$7(Constructor, staticProps); return Constructor; }

function _inherits$6(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$6(subClass, superClass); }

function _setPrototypeOf$6(o, p) { _setPrototypeOf$6 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$6(o, p); }

function _createSuper$6(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$6(); return function _createSuperInternal() { var Super = _getPrototypeOf$6(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$6(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$6(this, result); }; }

function _possibleConstructorReturn$6(self, call) { if (call && (_typeof$8(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$6(self); }

function _assertThisInitialized$6(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$6(o) { _getPrototypeOf$6 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$6(o); }
var List = /*#__PURE__*/function (_IndexedCollection) {
  _inherits$6(List, _IndexedCollection);

  _createSuper$6(List);

  // @pragma Construction
  function List(value) {
    var _this;

    _classCallCheck$7(this, List);

    var empty = emptyList();

    if (value === null || value === undefined) {
      return _possibleConstructorReturn$6(_this, empty);
    }

    if (isList(value)) {
      return _possibleConstructorReturn$6(_this, value);
    }

    var iter = IndexedCollection(value);
    var size = iter.size;

    if (size === 0) {
      return _possibleConstructorReturn$6(_this, empty);
    }

    assertNotInfinite(size);

    if (size > 0 && size < SIZE) {
      return _possibleConstructorReturn$6(_this, makeList(0, size, SHIFT, null, new VNode(iter.toArray())));
    }

    return _possibleConstructorReturn$6(_this, empty.withMutations(function (list) {
      list.setSize(size);
      iter.forEach(function (v, i) {
        return list.set(i, v);
      });
    }));
  }

  _createClass$7(List, [{
    key: "toString",
    value: function toString() {
      return this.__toString('List [', ']');
    } // @pragma Access

  }, {
    key: "get",
    value: function get(index, notSetValue) {
      index = wrapIndex(this, index);

      if (index >= 0 && index < this.size) {
        index += this._origin;
        var node = listNodeFor(this, index);
        return node && node.array[index & MASK];
      }

      return notSetValue;
    } // @pragma Modification

  }, {
    key: "set",
    value: function set(index, value) {
      return updateList(this, index, value);
    }
  }, {
    key: "remove",
    value: function remove(index) {
      return !this.has(index) ? this : index === 0 ? this.shift() : index === this.size - 1 ? this.pop() : this.splice(index, 1);
    }
  }, {
    key: "insert",
    value: function insert(index, value) {
      return this.splice(index, 0, value);
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.size === 0) {
        return this;
      }

      if (this.__ownerID) {
        this.size = this._origin = this._capacity = 0;
        this._level = SHIFT;
        this._root = this._tail = this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return emptyList();
    }
  }, {
    key: "push",
    value: function push() {
      var values = arguments;
      var oldSize = this.size;
      return this.withMutations(function (list) {
        setListBounds(list, 0, oldSize + values.length);

        for (var ii = 0; ii < values.length; ii++) {
          list.set(oldSize + ii, values[ii]);
        }
      });
    }
  }, {
    key: "pop",
    value: function pop() {
      return setListBounds(this, 0, -1);
    }
  }, {
    key: "unshift",
    value: function unshift() {
      var values = arguments;
      return this.withMutations(function (list) {
        setListBounds(list, -values.length);

        for (var ii = 0; ii < values.length; ii++) {
          list.set(ii, values[ii]);
        }
      });
    }
  }, {
    key: "shift",
    value: function shift() {
      return setListBounds(this, 1);
    } // @pragma Composition

  }, {
    key: "concat",
    value: function concat() {
      var seqs = [];

      for (var i = 0; i < arguments.length; i++) {
        var argument = arguments[i];
        var seq = IndexedCollection(typeof argument !== 'string' && hasIterator(argument) ? argument : [argument]);

        if (seq.size !== 0) {
          seqs.push(seq);
        }
      }

      if (seqs.length === 0) {
        return this;
      }

      if (this.size === 0 && !this.__ownerID && seqs.length === 1) {
        return this.constructor(seqs[0]);
      }

      return this.withMutations(function (list) {
        seqs.forEach(function (seq) {
          return seq.forEach(function (value) {
            return list.push(value);
          });
        });
      });
    }
  }, {
    key: "setSize",
    value: function setSize(size) {
      return setListBounds(this, 0, size);
    }
  }, {
    key: "map",
    value: function map(mapper, context) {
      var _this2 = this;

      return this.withMutations(function (list) {
        for (var i = 0; i < _this2.size; i++) {
          list.set(i, mapper.call(context, list.get(i), i, _this2));
        }
      });
    } // @pragma Iteration

  }, {
    key: "slice",
    value: function slice(begin, end) {
      var size = this.size;

      if (wholeSlice(begin, end, size)) {
        return this;
      }

      return setListBounds(this, resolveBegin(begin, size), resolveEnd(end, size));
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      var index = reverse ? this.size : 0;
      var values = iterateList(this, reverse);
      return new Iterator(function () {
        var value = values();
        return value === DONE ? iteratorDone() : iteratorValue(type, reverse ? --index : index++, value);
      });
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var index = reverse ? this.size : 0;
      var values = iterateList(this, reverse);
      var value;

      while ((value = values()) !== DONE) {
        if (fn(value, reverse ? --index : index++, this) === false) {
          break;
        }
      }

      return index;
    }
  }, {
    key: "__ensureOwner",
    value: function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      if (!ownerID) {
        if (this.size === 0) {
          return emptyList();
        }

        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }

      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
    }
  }], [{
    key: "of",
    value: function of() {
      return this(arguments);
    }
  }]);

  return List;
}(IndexedCollection);
List.isList = isList;
var ListPrototype = List.prototype;
ListPrototype[IS_LIST_SYMBOL] = true;
ListPrototype[DELETE] = ListPrototype.remove;
ListPrototype.merge = ListPrototype.concat;
ListPrototype.setIn = setIn;
ListPrototype.deleteIn = ListPrototype.removeIn = deleteIn;
ListPrototype.update = update;
ListPrototype.updateIn = updateIn;
ListPrototype.mergeIn = mergeIn;
ListPrototype.mergeDeepIn = mergeDeepIn;
ListPrototype.withMutations = withMutations;
ListPrototype.wasAltered = wasAltered;
ListPrototype.asImmutable = asImmutable;
ListPrototype['@@transducer/init'] = ListPrototype.asMutable = asMutable;

ListPrototype['@@transducer/step'] = function (result, arr) {
  return result.push(arr);
};

ListPrototype['@@transducer/result'] = function (obj) {
  return obj.asImmutable();
};

var VNode = /*#__PURE__*/function () {
  function VNode(array, ownerID) {
    _classCallCheck$7(this, VNode);

    this.array = array;
    this.ownerID = ownerID;
  } // TODO: seems like these methods are very similar


  _createClass$7(VNode, [{
    key: "removeBefore",
    value: function removeBefore(ownerID, level, index) {
      if (index === level ? 1 << level : this.array.length === 0) {
        return this;
      }

      var originIndex = index >>> level & MASK;

      if (originIndex >= this.array.length) {
        return new VNode([], ownerID);
      }

      var removingFirst = originIndex === 0;
      var newChild;

      if (level > 0) {
        var oldChild = this.array[originIndex];
        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);

        if (newChild === oldChild && removingFirst) {
          return this;
        }
      }

      if (removingFirst && !newChild) {
        return this;
      }

      var editable = editableVNode(this, ownerID);

      if (!removingFirst) {
        for (var ii = 0; ii < originIndex; ii++) {
          editable.array[ii] = undefined;
        }
      }

      if (newChild) {
        editable.array[originIndex] = newChild;
      }

      return editable;
    }
  }, {
    key: "removeAfter",
    value: function removeAfter(ownerID, level, index) {
      if (index === (level ? 1 << level : 0) || this.array.length === 0) {
        return this;
      }

      var sizeIndex = index - 1 >>> level & MASK;

      if (sizeIndex >= this.array.length) {
        return this;
      }

      var newChild;

      if (level > 0) {
        var oldChild = this.array[sizeIndex];
        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);

        if (newChild === oldChild && sizeIndex === this.array.length - 1) {
          return this;
        }
      }

      var editable = editableVNode(this, ownerID);
      editable.array.splice(sizeIndex + 1);

      if (newChild) {
        editable.array[sizeIndex] = newChild;
      }

      return editable;
    }
  }]);

  return VNode;
}();

var DONE = {};

function iterateList(list, reverse) {
  var left = list._origin;
  var right = list._capacity;
  var tailPos = getTailOffset(right);
  var tail = list._tail;
  return iterateNodeOrLeaf(list._root, list._level, 0);

  function iterateNodeOrLeaf(node, level, offset) {
    return level === 0 ? iterateLeaf(node, offset) : iterateNode(node, level, offset);
  }

  function iterateLeaf(node, offset) {
    var array = offset === tailPos ? tail && tail.array : node && node.array;
    var from = offset > left ? 0 : left - offset;
    var to = right - offset;

    if (to > SIZE) {
      to = SIZE;
    }

    return function () {
      if (from === to) {
        return DONE;
      }

      var idx = reverse ? --to : from++;
      return array && array[idx];
    };
  }

  function iterateNode(node, level, offset) {
    var values;
    var array = node && node.array;
    var from = offset > left ? 0 : left - offset >> level;
    var to = (right - offset >> level) + 1;

    if (to > SIZE) {
      to = SIZE;
    }

    return function () {
      while (true) {
        if (values) {
          var value = values();

          if (value !== DONE) {
            return value;
          }

          values = null;
        }

        if (from === to) {
          return DONE;
        }

        var idx = reverse ? --to : from++;
        values = iterateNodeOrLeaf(array && array[idx], level - SHIFT, offset + (idx << level));
      }
    };
  }
}

function makeList(origin, capacity, level, root, tail, ownerID, hash) {
  var list = Object.create(ListPrototype);
  list.size = capacity - origin;
  list._origin = origin;
  list._capacity = capacity;
  list._level = level;
  list._root = root;
  list._tail = tail;
  list.__ownerID = ownerID;
  list.__hash = hash;
  list.__altered = false;
  return list;
}

var EMPTY_LIST;
function emptyList() {
  return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
}

function updateList(list, index, value) {
  index = wrapIndex(list, index);

  if (index !== index) {
    return list;
  }

  if (index >= list.size || index < 0) {
    return list.withMutations(function (list) {
      index < 0 ? setListBounds(list, index).set(0, value) : setListBounds(list, 0, index + 1).set(index, value);
    });
  }

  index += list._origin;
  var newTail = list._tail;
  var newRoot = list._root;
  var didAlter = MakeRef();

  if (index >= getTailOffset(list._capacity)) {
    newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
  } else {
    newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
  }

  if (!didAlter.value) {
    return list;
  }

  if (list.__ownerID) {
    list._root = newRoot;
    list._tail = newTail;
    list.__hash = undefined;
    list.__altered = true;
    return list;
  }

  return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
}

function updateVNode(node, ownerID, level, index, value, didAlter) {
  var idx = index >>> level & MASK;
  var nodeHas = node && idx < node.array.length;

  if (!nodeHas && value === undefined) {
    return node;
  }

  var newNode;

  if (level > 0) {
    var lowerNode = node && node.array[idx];
    var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);

    if (newLowerNode === lowerNode) {
      return node;
    }

    newNode = editableVNode(node, ownerID);
    newNode.array[idx] = newLowerNode;
    return newNode;
  }

  if (nodeHas && node.array[idx] === value) {
    return node;
  }

  if (didAlter) {
    SetRef(didAlter);
  }

  newNode = editableVNode(node, ownerID);

  if (value === undefined && idx === newNode.array.length - 1) {
    newNode.array.pop();
  } else {
    newNode.array[idx] = value;
  }

  return newNode;
}

function editableVNode(node, ownerID) {
  if (ownerID && node && ownerID === node.ownerID) {
    return node;
  }

  return new VNode(node ? node.array.slice() : [], ownerID);
}

function listNodeFor(list, rawIndex) {
  if (rawIndex >= getTailOffset(list._capacity)) {
    return list._tail;
  }

  if (rawIndex < 1 << list._level + SHIFT) {
    var node = list._root;
    var level = list._level;

    while (node && level > 0) {
      node = node.array[rawIndex >>> level & MASK];
      level -= SHIFT;
    }

    return node;
  }
}

function setListBounds(list, begin, end) {
  // Sanitize begin & end using this shorthand for ToInt32(argument)
  // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
  if (begin !== undefined) {
    begin |= 0;
  }

  if (end !== undefined) {
    end |= 0;
  }

  var owner = list.__ownerID || new OwnerID();
  var oldOrigin = list._origin;
  var oldCapacity = list._capacity;
  var newOrigin = oldOrigin + begin;
  var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;

  if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
    return list;
  } // If it's going to end after it starts, it's empty.


  if (newOrigin >= newCapacity) {
    return list.clear();
  }

  var newLevel = list._level;
  var newRoot = list._root; // New origin might need creating a higher root.

  var offsetShift = 0;

  while (newOrigin + offsetShift < 0) {
    newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
    newLevel += SHIFT;
    offsetShift += 1 << newLevel;
  }

  if (offsetShift) {
    newOrigin += offsetShift;
    oldOrigin += offsetShift;
    newCapacity += offsetShift;
    oldCapacity += offsetShift;
  }

  var oldTailOffset = getTailOffset(oldCapacity);
  var newTailOffset = getTailOffset(newCapacity); // New size might need creating a higher root.

  while (newTailOffset >= 1 << newLevel + SHIFT) {
    newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
    newLevel += SHIFT;
  } // Locate or create the new tail.


  var oldTail = list._tail;
  var newTail = newTailOffset < oldTailOffset ? listNodeFor(list, newCapacity - 1) : newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail; // Merge Tail into tree.

  if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
    newRoot = editableVNode(newRoot, owner);
    var node = newRoot;

    for (var level = newLevel; level > SHIFT; level -= SHIFT) {
      var idx = oldTailOffset >>> level & MASK;
      node = node.array[idx] = editableVNode(node.array[idx], owner);
    }

    node.array[oldTailOffset >>> SHIFT & MASK] = oldTail;
  } // If the size has been reduced, there's a chance the tail needs to be trimmed.


  if (newCapacity < oldCapacity) {
    newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
  } // If the new origin is within the tail, then we do not need a root.


  if (newOrigin >= newTailOffset) {
    newOrigin -= newTailOffset;
    newCapacity -= newTailOffset;
    newLevel = SHIFT;
    newRoot = null;
    newTail = newTail && newTail.removeBefore(owner, 0, newOrigin); // Otherwise, if the root has been trimmed, garbage collect.
  } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
    offsetShift = 0; // Identify the new top root node of the subtree of the old root.

    while (newRoot) {
      var beginIndex = newOrigin >>> newLevel & MASK;

      if (beginIndex !== newTailOffset >>> newLevel & MASK) {
        break;
      }

      if (beginIndex) {
        offsetShift += (1 << newLevel) * beginIndex;
      }

      newLevel -= SHIFT;
      newRoot = newRoot.array[beginIndex];
    } // Trim the new sides of the new root.


    if (newRoot && newOrigin > oldOrigin) {
      newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
    }

    if (newRoot && newTailOffset < oldTailOffset) {
      newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
    }

    if (offsetShift) {
      newOrigin -= offsetShift;
      newCapacity -= offsetShift;
    }
  }

  if (list.__ownerID) {
    list.size = newCapacity - newOrigin;
    list._origin = newOrigin;
    list._capacity = newCapacity;
    list._level = newLevel;
    list._root = newRoot;
    list._tail = newTail;
    list.__hash = undefined;
    list.__altered = true;
    return list;
  }

  return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
}

function getTailOffset(size) {
  return size < SIZE ? 0 : size - 1 >>> SHIFT << SHIFT;
}

function _typeof$7(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$7 = function _typeof(obj) { return typeof obj; }; } else { _typeof$7 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$7(obj); }

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$6(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$6(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$6(Constructor.prototype, protoProps); if (staticProps) _defineProperties$6(Constructor, staticProps); return Constructor; }

function _inherits$5(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$5(subClass, superClass); }

function _setPrototypeOf$5(o, p) { _setPrototypeOf$5 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$5(o, p); }

function _createSuper$5(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$5(); return function _createSuperInternal() { var Super = _getPrototypeOf$5(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$5(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$5(this, result); }; }

function _possibleConstructorReturn$5(self, call) { if (call && (_typeof$7(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$5(self); }

function _assertThisInitialized$5(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$5(o) { _getPrototypeOf$5 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$5(o); }
var OrderedMap = /*#__PURE__*/function (_Map) {
  _inherits$5(OrderedMap, _Map);

  _createSuper$5(OrderedMap);

  // @pragma Construction
  function OrderedMap(value) {
    var _this;

    _classCallCheck$6(this, OrderedMap);

    return _possibleConstructorReturn$5(_this, value === null || value === undefined ? emptyOrderedMap() : isOrderedMap(value) ? value : emptyOrderedMap().withMutations(function (map) {
      var iter = KeyedCollection(value);
      assertNotInfinite(iter.size);
      iter.forEach(function (v, k) {
        return map.set(k, v);
      });
    }));
  }

  _createClass$6(OrderedMap, [{
    key: "toString",
    value: function toString() {
      return this.__toString('OrderedMap {', '}');
    } // @pragma Access

  }, {
    key: "get",
    value: function get(k, notSetValue) {
      var index = this._map.get(k);

      return index !== undefined ? this._list.get(index)[1] : notSetValue;
    } // @pragma Modification

  }, {
    key: "clear",
    value: function clear() {
      if (this.size === 0) {
        return this;
      }

      if (this.__ownerID) {
        this.size = 0;

        this._map.clear();

        this._list.clear();

        this.__altered = true;
        return this;
      }

      return emptyOrderedMap();
    }
  }, {
    key: "set",
    value: function set(k, v) {
      return updateOrderedMap(this, k, v);
    }
  }, {
    key: "remove",
    value: function remove(k) {
      return updateOrderedMap(this, k, NOT_SET);
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var _this2 = this;

      return this._list.__iterate(function (entry) {
        return entry && fn(entry[1], entry[0], _this2);
      }, reverse);
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      return this._list.fromEntrySeq().__iterator(type, reverse);
    }
  }, {
    key: "__ensureOwner",
    value: function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      var newMap = this._map.__ensureOwner(ownerID);

      var newList = this._list.__ensureOwner(ownerID);

      if (!ownerID) {
        if (this.size === 0) {
          return emptyOrderedMap();
        }

        this.__ownerID = ownerID;
        this.__altered = false;
        this._map = newMap;
        this._list = newList;
        return this;
      }

      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
    }
  }], [{
    key: "of",
    value: function of() {
      return this(arguments);
    }
  }]);

  return OrderedMap;
}(Map);
OrderedMap.isOrderedMap = isOrderedMap;
OrderedMap.prototype[IS_ORDERED_SYMBOL] = true;
OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;

function makeOrderedMap(map, list, ownerID, hash) {
  var omap = Object.create(OrderedMap.prototype);
  omap.size = map ? map.size : 0;
  omap._map = map;
  omap._list = list;
  omap.__ownerID = ownerID;
  omap.__hash = hash;
  omap.__altered = false;
  return omap;
}

var EMPTY_ORDERED_MAP;
function emptyOrderedMap() {
  return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
}

function updateOrderedMap(omap, k, v) {
  var map = omap._map;
  var list = omap._list;
  var i = map.get(k);
  var has = i !== undefined;
  var newMap;
  var newList;

  if (v === NOT_SET) {
    // removed
    if (!has) {
      return omap;
    }

    if (list.size >= SIZE && list.size >= map.size * 2) {
      newList = list.filter(function (entry, idx) {
        return entry !== undefined && i !== idx;
      });
      newMap = newList.toKeyedSeq().map(function (entry) {
        return entry[0];
      }).flip().toMap();

      if (omap.__ownerID) {
        newMap.__ownerID = newList.__ownerID = omap.__ownerID;
      }
    } else {
      newMap = map.remove(k);
      newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
    }
  } else if (has) {
    if (v === list.get(i)[1]) {
      return omap;
    }

    newMap = map;
    newList = list.set(i, [k, v]);
  } else {
    newMap = map.set(k, list.size);
    newList = list.set(list.size, [k, v]);
  }

  if (omap.__ownerID) {
    omap.size = newMap.size;
    omap._map = newMap;
    omap._list = newList;
    omap.__hash = undefined;
    omap.__altered = true;
    return omap;
  }

  return makeOrderedMap(newMap, newList);
}

var IS_STACK_SYMBOL = '@@__IMMUTABLE_STACK__@@';
function isStack(maybeStack) {
  return Boolean(maybeStack && maybeStack[IS_STACK_SYMBOL]);
}

function _typeof$6(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$6 = function _typeof(obj) { return typeof obj; }; } else { _typeof$6 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$6(obj); }

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$5(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$5(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$5(Constructor.prototype, protoProps); if (staticProps) _defineProperties$5(Constructor, staticProps); return Constructor; }

function _inherits$4(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$4(subClass, superClass); }

function _setPrototypeOf$4(o, p) { _setPrototypeOf$4 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$4(o, p); }

function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = _getPrototypeOf$4(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$4(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$4(this, result); }; }

function _possibleConstructorReturn$4(self, call) { if (call && (_typeof$6(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$4(self); }

function _assertThisInitialized$4(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$4(o) { _getPrototypeOf$4 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$4(o); }
var Stack = /*#__PURE__*/function (_IndexedCollection) {
  _inherits$4(Stack, _IndexedCollection);

  _createSuper$4(Stack);

  // @pragma Construction
  function Stack(value) {
    var _this;

    _classCallCheck$5(this, Stack);

    return _possibleConstructorReturn$4(_this, value === null || value === undefined ? emptyStack() : isStack(value) ? value : emptyStack().pushAll(value));
  }

  _createClass$5(Stack, [{
    key: "toString",
    value: function toString() {
      return this.__toString('Stack [', ']');
    } // @pragma Access

  }, {
    key: "get",
    value: function get(index, notSetValue) {
      var head = this._head;
      index = wrapIndex(this, index);

      while (head && index--) {
        head = head.next;
      }

      return head ? head.value : notSetValue;
    }
  }, {
    key: "peek",
    value: function peek() {
      return this._head && this._head.value;
    } // @pragma Modification

  }, {
    key: "push",
    value: function push() {
      if (arguments.length === 0) {
        return this;
      }

      var newSize = this.size + arguments.length;
      var head = this._head;

      for (var ii = arguments.length - 1; ii >= 0; ii--) {
        head = {
          value: arguments[ii],
          next: head
        };
      }

      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return makeStack(newSize, head);
    }
  }, {
    key: "pushAll",
    value: function pushAll(iter) {
      iter = IndexedCollection(iter);

      if (iter.size === 0) {
        return this;
      }

      if (this.size === 0 && isStack(iter)) {
        return iter;
      }

      assertNotInfinite(iter.size);
      var newSize = this.size;
      var head = this._head;

      iter.__iterate(function (value) {
        newSize++;
        head = {
          value: value,
          next: head
        };
      },
      /* reverse */
      true);

      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return makeStack(newSize, head);
    }
  }, {
    key: "pop",
    value: function pop() {
      return this.slice(1);
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.size === 0) {
        return this;
      }

      if (this.__ownerID) {
        this.size = 0;
        this._head = undefined;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return emptyStack();
    }
  }, {
    key: "slice",
    value: function slice(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }

      var resolvedBegin = resolveBegin(begin, this.size);
      var resolvedEnd = resolveEnd(end, this.size);

      if (resolvedEnd !== this.size) {
        // super.slice(begin, end);
        return IndexedCollection.prototype.slice.call(this, begin, end);
      }

      var newSize = this.size - resolvedBegin;
      var head = this._head;

      while (resolvedBegin--) {
        head = head.next;
      }

      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }

      return makeStack(newSize, head);
    } // @pragma Mutability

  }, {
    key: "__ensureOwner",
    value: function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      if (!ownerID) {
        if (this.size === 0) {
          return emptyStack();
        }

        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }

      return makeStack(this.size, this._head, ownerID, this.__hash);
    } // @pragma Iteration

  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var _this2 = this;

      if (reverse) {
        return new ArraySeq(this.toArray()).__iterate(function (v, k) {
          return fn(v, k, _this2);
        }, reverse);
      }

      var iterations = 0;
      var node = this._head;

      while (node) {
        if (fn(node.value, iterations++, this) === false) {
          break;
        }

        node = node.next;
      }

      return iterations;
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      if (reverse) {
        return new ArraySeq(this.toArray()).__iterator(type, reverse);
      }

      var iterations = 0;
      var node = this._head;
      return new Iterator(function () {
        if (node) {
          var value = node.value;
          node = node.next;
          return iteratorValue(type, iterations++, value);
        }

        return iteratorDone();
      });
    }
  }], [{
    key: "of",
    value: function of() {
      return this(arguments);
    }
  }]);

  return Stack;
}(IndexedCollection);
Stack.isStack = isStack;
var StackPrototype = Stack.prototype;
StackPrototype[IS_STACK_SYMBOL] = true;
StackPrototype.shift = StackPrototype.pop;
StackPrototype.unshift = StackPrototype.push;
StackPrototype.unshiftAll = StackPrototype.pushAll;
StackPrototype.withMutations = withMutations;
StackPrototype.wasAltered = wasAltered;
StackPrototype.asImmutable = asImmutable;
StackPrototype['@@transducer/init'] = StackPrototype.asMutable = asMutable;

StackPrototype['@@transducer/step'] = function (result, arr) {
  return result.unshift(arr);
};

StackPrototype['@@transducer/result'] = function (obj) {
  return obj.asImmutable();
};

function makeStack(size, head, ownerID, hash) {
  var map = Object.create(StackPrototype);
  map.size = size;
  map._head = head;
  map.__ownerID = ownerID;
  map.__hash = hash;
  map.__altered = false;
  return map;
}

var EMPTY_STACK;

function emptyStack() {
  return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
}

var IS_SET_SYMBOL = '@@__IMMUTABLE_SET__@@';
function isSet(maybeSet) {
  return Boolean(maybeSet && maybeSet[IS_SET_SYMBOL]);
}

function isOrderedSet(maybeOrderedSet) {
  return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
}

var imul = typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ? Math.imul : function imul(a, b) {
  a |= 0; // int

  b |= 0; // int

  var c = a & 0xffff;
  var d = b & 0xffff; // Shift by 0 fixes the sign on the high part.

  return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0; // int
}; // v8 has an optimization for storing 31-bit signed numbers.
// Values which have either 00 or 11 as the high order bits qualify.
// This function drops the highest order bit in a signed number, maintaining
// the sign bit.

function smi(i32) {
  return i32 >>> 1 & 0x40000000 | i32 & 0xbfffffff;
}

function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (!isCollection(b) || a.size !== undefined && b.size !== undefined && a.size !== b.size || a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash || isKeyed(a) !== isKeyed(b) || isIndexed(a) !== isIndexed(b) || isOrdered(a) !== isOrdered(b)) {
    return false;
  }

  if (a.size === 0 && b.size === 0) {
    return true;
  }

  var notAssociative = !isAssociative(a);

  if (isOrdered(a)) {
    var entries = a.entries();
    return b.every(function (v, k) {
      var entry = entries.next().value;
      return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
    }) && entries.next().done;
  }

  var flipped = false;

  if (a.size === undefined) {
    if (b.size === undefined) {
      if (typeof a.cacheResult === 'function') {
        a.cacheResult();
      }
    } else {
      flipped = true;
      var _ = a;
      a = b;
      b = _;
    }
  }

  var allEqual = true;

  var bSize = b.__iterate(function (v, k) {
    if (notAssociative ? !a.has(v) : flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
      allEqual = false;
      return false;
    }
  });

  return allEqual && a.size === bSize;
}

/**
 * Contributes additional methods to a constructor
 */
function mixin(ctor, methods) {
  var keyCopier = function keyCopier(key) {
    ctor.prototype[key] = methods[key];
  };

  Object.keys(methods).forEach(keyCopier);
  Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);
  return ctor;
}

function _typeof$5(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$5 = function _typeof(obj) { return typeof obj; }; } else { _typeof$5 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$5(obj); }
function toJS(value) {
  if (!value || _typeof$5(value) !== 'object') {
    return value;
  }

  if (!isCollection(value)) {
    if (!isDataStructure(value)) {
      return value;
    }

    value = Seq(value);
  }

  if (isKeyed(value)) {
    var _result = {};

    value.__iterate(function (v, k) {
      _result[k] = toJS(v);
    });

    return _result;
  }

  var result = [];

  value.__iterate(function (v) {
    result.push(toJS(v));
  });

  return result;
}

function _typeof$4(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$4 = function _typeof(obj) { return typeof obj; }; } else { _typeof$4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$4(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); if (staticProps) _defineProperties$4(Constructor, staticProps); return Constructor; }

function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$3(subClass, superClass); }

function _setPrototypeOf$3(o, p) { _setPrototypeOf$3 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$3(o, p); }

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf$3(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$3(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$3(this, result); }; }

function _possibleConstructorReturn$3(self, call) { if (call && (_typeof$4(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$3(self); }

function _assertThisInitialized$3(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$3(o) { _getPrototypeOf$3 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$3(o); }
var Set = /*#__PURE__*/function (_SetCollection) {
  _inherits$3(Set, _SetCollection);

  _createSuper$3(Set);

  // @pragma Construction
  function Set(value) {
    var _this;

    _classCallCheck$4(this, Set);

    return _possibleConstructorReturn$3(_this, value === null || value === undefined ? emptySet() : isSet(value) && !isOrdered(value) ? value : emptySet().withMutations(function (set) {
      var iter = SetCollection(value);
      assertNotInfinite(iter.size);
      iter.forEach(function (v) {
        return set.add(v);
      });
    }));
  }

  _createClass$4(Set, [{
    key: "toString",
    value: function toString() {
      return this.__toString('Set {', '}');
    } // @pragma Access

  }, {
    key: "has",
    value: function has(value) {
      return this._map.has(value);
    } // @pragma Modification

  }, {
    key: "add",
    value: function add(value) {
      return updateSet(this, this._map.set(value, value));
    }
  }, {
    key: "remove",
    value: function remove(value) {
      return updateSet(this, this._map.remove(value));
    }
  }, {
    key: "clear",
    value: function clear() {
      return updateSet(this, this._map.clear());
    } // @pragma Composition

  }, {
    key: "map",
    value: function map(mapper, context) {
      var _this2 = this;

      // keep track if the set is altered by the map function
      var didChanges = false;
      var newMap = updateSet(this, this._map.mapEntries(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            v = _ref2[1];

        var mapped = mapper.call(context, v, v, _this2);

        if (mapped !== v) {
          didChanges = true;
        }

        return [mapped, mapped];
      }, context));
      return didChanges ? newMap : this;
    }
  }, {
    key: "union",
    value: function union() {
      for (var _len = arguments.length, iters = new Array(_len), _key = 0; _key < _len; _key++) {
        iters[_key] = arguments[_key];
      }

      iters = iters.filter(function (x) {
        return x.size !== 0;
      });

      if (iters.length === 0) {
        return this;
      }

      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
        return this.constructor(iters[0]);
      }

      return this.withMutations(function (set) {
        for (var ii = 0; ii < iters.length; ii++) {
          SetCollection(iters[ii]).forEach(function (value) {
            return set.add(value);
          });
        }
      });
    }
  }, {
    key: "intersect",
    value: function intersect() {
      for (var _len2 = arguments.length, iters = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        iters[_key2] = arguments[_key2];
      }

      if (iters.length === 0) {
        return this;
      }

      iters = iters.map(function (iter) {
        return SetCollection(iter);
      });
      var toRemove = [];
      this.forEach(function (value) {
        if (!iters.every(function (iter) {
          return iter.includes(value);
        })) {
          toRemove.push(value);
        }
      });
      return this.withMutations(function (set) {
        toRemove.forEach(function (value) {
          set.remove(value);
        });
      });
    }
  }, {
    key: "subtract",
    value: function subtract() {
      for (var _len3 = arguments.length, iters = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        iters[_key3] = arguments[_key3];
      }

      if (iters.length === 0) {
        return this;
      }

      iters = iters.map(function (iter) {
        return SetCollection(iter);
      });
      var toRemove = [];
      this.forEach(function (value) {
        if (iters.some(function (iter) {
          return iter.includes(value);
        })) {
          toRemove.push(value);
        }
      });
      return this.withMutations(function (set) {
        toRemove.forEach(function (value) {
          set.remove(value);
        });
      });
    }
  }, {
    key: "sort",
    value: function sort(comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator));
    }
  }, {
    key: "sortBy",
    value: function sortBy(mapper, comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator, mapper));
    }
  }, {
    key: "wasAltered",
    value: function wasAltered() {
      return this._map.wasAltered();
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var _this3 = this;

      return this._map.__iterate(function (k) {
        return fn(k, k, _this3);
      }, reverse);
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      return this._map.__iterator(type, reverse);
    }
  }, {
    key: "__ensureOwner",
    value: function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      var newMap = this._map.__ensureOwner(ownerID);

      if (!ownerID) {
        if (this.size === 0) {
          return this.__empty();
        }

        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }

      return this.__make(newMap, ownerID);
    }
  }], [{
    key: "of",
    value: function of() {
      return this(arguments);
    }
  }, {
    key: "fromKeys",
    value: function fromKeys(value) {
      return this(KeyedCollection(value).keySeq());
    }
  }, {
    key: "intersect",
    value: function intersect(sets) {
      sets = Collection(sets).toArray();
      return sets.length ? SetPrototype.intersect.apply(Set(sets.pop()), sets) : emptySet();
    }
  }, {
    key: "union",
    value: function union(sets) {
      sets = Collection(sets).toArray();
      return sets.length ? SetPrototype.union.apply(Set(sets.pop()), sets) : emptySet();
    }
  }]);

  return Set;
}(SetCollection);
Set.isSet = isSet;
var SetPrototype = Set.prototype;
SetPrototype[IS_SET_SYMBOL] = true;
SetPrototype[DELETE] = SetPrototype.remove;
SetPrototype.merge = SetPrototype.concat = SetPrototype.union;
SetPrototype.withMutations = withMutations;
SetPrototype.asImmutable = asImmutable;
SetPrototype['@@transducer/init'] = SetPrototype.asMutable = asMutable;

SetPrototype['@@transducer/step'] = function (result, arr) {
  return result.add(arr);
};

SetPrototype['@@transducer/result'] = function (obj) {
  return obj.asImmutable();
};

SetPrototype.__empty = emptySet;
SetPrototype.__make = makeSet;

function updateSet(set, newMap) {
  if (set.__ownerID) {
    set.size = newMap.size;
    set._map = newMap;
    return set;
  }

  return newMap === set._map ? set : newMap.size === 0 ? set.__empty() : set.__make(newMap);
}

function makeSet(map, ownerID) {
  var set = Object.create(SetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

var EMPTY_SET;

function emptySet() {
  return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
}

function _typeof$3(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$3 = function _typeof(obj) { return typeof obj; }; } else { _typeof$3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$3(obj); }

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$2(subClass, superClass); }

function _setPrototypeOf$2(o, p) { _setPrototypeOf$2 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$2(o, p); }

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf$2(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$2(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$2(this, result); }; }

function _possibleConstructorReturn$2(self, call) { if (call && (_typeof$3(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$2(self); }

function _assertThisInitialized$2(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$2(o) { _getPrototypeOf$2 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$2(o); }
/**
 * Returns a lazy seq of nums from start (inclusive) to end
 * (exclusive), by step, where start defaults to 0, step to 1, and end to
 * infinity. When start is equal to end, returns empty list.
 */

var Range = /*#__PURE__*/function (_IndexedSeq) {
  _inherits$2(Range, _IndexedSeq);

  _createSuper$2(Range);

  function Range(start, end, step) {
    var _this;

    _classCallCheck$3(this, Range);

    if (!(_assertThisInitialized$2(_this) instanceof Range)) {
      return _possibleConstructorReturn$2(_this, new Range(start, end, step));
    }

    invariant(step !== 0, 'Cannot step a Range by 0');
    start = start || 0;

    if (end === undefined) {
      end = Infinity;
    }

    step = step === undefined ? 1 : Math.abs(step);

    if (end < start) {
      step = -step;
    }

    _this._start = start;
    _this._end = end;
    _this._step = step;
    _this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);

    if (_this.size === 0) ;

    return _possibleConstructorReturn$2(_this);
  }

  _createClass$3(Range, [{
    key: "toString",
    value: function toString() {
      if (this.size === 0) {
        return 'Range []';
      }

      return 'Range [ ' + this._start + '...' + this._end + (this._step !== 1 ? ' by ' + this._step : '') + ' ]';
    }
  }, {
    key: "get",
    value: function get(index, notSetValue) {
      return this.has(index) ? this._start + wrapIndex(this, index) * this._step : notSetValue;
    }
  }, {
    key: "includes",
    value: function includes(searchValue) {
      var possibleIndex = (searchValue - this._start) / this._step;
      return possibleIndex >= 0 && possibleIndex < this.size && possibleIndex === Math.floor(possibleIndex);
    }
  }, {
    key: "slice",
    value: function slice(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }

      begin = resolveBegin(begin, this.size);
      end = resolveEnd(end, this.size);

      if (end <= begin) {
        return new Range(0, 0);
      }

      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
    }
  }, {
    key: "indexOf",
    value: function indexOf(searchValue) {
      var offsetValue = searchValue - this._start;

      if (offsetValue % this._step === 0) {
        var index = offsetValue / this._step;

        if (index >= 0 && index < this.size) {
          return index;
        }
      }

      return -1;
    }
  }, {
    key: "lastIndexOf",
    value: function lastIndexOf(searchValue) {
      return this.indexOf(searchValue);
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var size = this.size;
      var step = this._step;
      var value = reverse ? this._start + (size - 1) * step : this._start;
      var i = 0;

      while (i !== size) {
        if (fn(value, reverse ? size - ++i : i++, this) === false) {
          break;
        }

        value += reverse ? -step : step;
      }

      return i;
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      var size = this.size;
      var step = this._step;
      var value = reverse ? this._start + (size - 1) * step : this._start;
      var i = 0;
      return new Iterator(function () {
        if (i === size) {
          return iteratorDone();
        }

        var v = value;
        value += reverse ? -step : step;
        return iteratorValue(type, reverse ? size - ++i : i++, v);
      });
    }
  }, {
    key: "equals",
    value: function equals(other) {
      return other instanceof Range ? this._start === other._start && this._end === other._end && this._step === other._step : deepEqual(this, other);
    }
  }]);

  return Range;
}(IndexedSeq);

function getIn$1(collection, searchKeyPath, notSetValue) {
  var keyPath = coerceKeyPath(searchKeyPath);
  var i = 0;

  while (i !== keyPath.length) {
    collection = get(collection, keyPath[i++], NOT_SET);

    if (collection === NOT_SET) {
      return notSetValue;
    }
  }

  return collection;
}

function getIn(searchKeyPath, notSetValue) {
  return getIn$1(this, searchKeyPath, notSetValue);
}

function hasIn$1(collection, keyPath) {
  return getIn$1(collection, keyPath, NOT_SET) !== NOT_SET;
}

function hasIn(searchKeyPath) {
  return hasIn$1(this, searchKeyPath);
}

function toObject() {
  assertNotInfinite(this.size);
  var object = {};

  this.__iterate(function (v, k) {
    object[k] = v;
  });

  return object;
}

Collection.isIterable = isCollection;
Collection.isKeyed = isKeyed;
Collection.isIndexed = isIndexed;
Collection.isAssociative = isAssociative;
Collection.isOrdered = isOrdered;
Collection.Iterator = Iterator;
mixin(Collection, {
  // ### Conversion to other types
  toArray: function toArray() {
    assertNotInfinite(this.size);
    var array = new Array(this.size || 0);
    var useTuples = isKeyed(this);
    var i = 0;

    this.__iterate(function (v, k) {
      // Keyed collections produce an array of tuples.
      array[i++] = useTuples ? [k, v] : v;
    });

    return array;
  },
  toIndexedSeq: function toIndexedSeq() {
    return new ToIndexedSequence(this);
  },
  toJS: function toJS$1() {
    return toJS(this);
  },
  toKeyedSeq: function toKeyedSeq() {
    return new ToKeyedSequence(this, true);
  },
  toMap: function toMap() {
    // Use Late Binding here to solve the circular dependency.
    return Map(this.toKeyedSeq());
  },
  toObject: toObject,
  toOrderedMap: function toOrderedMap() {
    // Use Late Binding here to solve the circular dependency.
    return OrderedMap(this.toKeyedSeq());
  },
  toOrderedSet: function toOrderedSet() {
    // Use Late Binding here to solve the circular dependency.
    return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
  },
  toSet: function toSet() {
    // Use Late Binding here to solve the circular dependency.
    return Set(isKeyed(this) ? this.valueSeq() : this);
  },
  toSetSeq: function toSetSeq() {
    return new ToSetSequence(this);
  },
  toSeq: function toSeq() {
    return isIndexed(this) ? this.toIndexedSeq() : isKeyed(this) ? this.toKeyedSeq() : this.toSetSeq();
  },
  toStack: function toStack() {
    // Use Late Binding here to solve the circular dependency.
    return Stack(isKeyed(this) ? this.valueSeq() : this);
  },
  toList: function toList() {
    // Use Late Binding here to solve the circular dependency.
    return List(isKeyed(this) ? this.valueSeq() : this);
  },
  // ### Common JavaScript methods and properties
  toString: function toString() {
    return '[Collection]';
  },
  __toString: function __toString(head, tail) {
    if (this.size === 0) {
      return head + tail;
    }

    return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  concat: function concat() {
    for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }

    return reify(this, concatFactory(this, values));
  },
  includes: function includes(searchValue) {
    return this.some(function (value) {
      return is(value, searchValue);
    });
  },
  entries: function entries() {
    return this.__iterator(ITERATE_ENTRIES);
  },
  every: function every(predicate, context) {
    assertNotInfinite(this.size);
    var returnValue = true;

    this.__iterate(function (v, k, c) {
      if (!predicate.call(context, v, k, c)) {
        returnValue = false;
        return false;
      }
    });

    return returnValue;
  },
  filter: function filter(predicate, context) {
    return reify(this, filterFactory(this, predicate, context, true));
  },
  find: function find(predicate, context, notSetValue) {
    var entry = this.findEntry(predicate, context);
    return entry ? entry[1] : notSetValue;
  },
  forEach: function forEach(sideEffect, context) {
    assertNotInfinite(this.size);
    return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
  },
  join: function join(separator) {
    assertNotInfinite(this.size);
    separator = separator !== undefined ? '' + separator : ',';
    var joined = '';
    var isFirst = true;

    this.__iterate(function (v) {
      isFirst ? isFirst = false : joined += separator;
      joined += v !== null && v !== undefined ? v.toString() : '';
    });

    return joined;
  },
  keys: function keys() {
    return this.__iterator(ITERATE_KEYS);
  },
  map: function map(mapper, context) {
    return reify(this, mapFactory(this, mapper, context));
  },
  reduce: function reduce(reducer, initialReduction, context) {
    return _reduce(this, reducer, initialReduction, context, arguments.length < 2, false);
  },
  reduceRight: function reduceRight(reducer, initialReduction, context) {
    return _reduce(this, reducer, initialReduction, context, arguments.length < 2, true);
  },
  reverse: function reverse() {
    return reify(this, reverseFactory(this, true));
  },
  slice: function slice(begin, end) {
    return reify(this, sliceFactory(this, begin, end, true));
  },
  some: function some(predicate, context) {
    return !this.every(not(predicate), context);
  },
  sort: function sort(comparator) {
    return reify(this, sortFactory(this, comparator));
  },
  values: function values() {
    return this.__iterator(ITERATE_VALUES);
  },
  // ### More sequential methods
  butLast: function butLast() {
    return this.slice(0, -1);
  },
  isEmpty: function isEmpty() {
    return this.size !== undefined ? this.size === 0 : !this.some(function () {
      return true;
    });
  },
  count: function count(predicate, context) {
    return ensureSize(predicate ? this.toSeq().filter(predicate, context) : this);
  },
  countBy: function countBy(grouper, context) {
    return countByFactory(this, grouper, context);
  },
  equals: function equals(other) {
    return deepEqual(this, other);
  },
  entrySeq: function entrySeq() {
    var collection = this;

    if (collection._cache) {
      // We cache as an entries array, so we can just return the cache!
      return new ArraySeq(collection._cache);
    }

    var entriesSequence = collection.toSeq().map(entryMapper).toIndexedSeq();

    entriesSequence.fromEntrySeq = function () {
      return collection.toSeq();
    };

    return entriesSequence;
  },
  filterNot: function filterNot(predicate, context) {
    return this.filter(not(predicate), context);
  },
  findEntry: function findEntry(predicate, context, notSetValue) {
    var found = notSetValue;

    this.__iterate(function (v, k, c) {
      if (predicate.call(context, v, k, c)) {
        found = [k, v];
        return false;
      }
    });

    return found;
  },
  findKey: function findKey(predicate, context) {
    var entry = this.findEntry(predicate, context);
    return entry && entry[0];
  },
  findLast: function findLast(predicate, context, notSetValue) {
    return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
  },
  findLastEntry: function findLastEntry(predicate, context, notSetValue) {
    return this.toKeyedSeq().reverse().findEntry(predicate, context, notSetValue);
  },
  findLastKey: function findLastKey(predicate, context) {
    return this.toKeyedSeq().reverse().findKey(predicate, context);
  },
  first: function first(notSetValue) {
    return this.find(returnTrue, null, notSetValue);
  },
  flatMap: function flatMap(mapper, context) {
    return reify(this, flatMapFactory(this, mapper, context));
  },
  flatten: function flatten(depth) {
    return reify(this, flattenFactory(this, depth, true));
  },
  fromEntrySeq: function fromEntrySeq() {
    return new FromEntriesSequence(this);
  },
  get: function get(searchKey, notSetValue) {
    return this.find(function (_, key) {
      return is(key, searchKey);
    }, undefined, notSetValue);
  },
  getIn: getIn,
  groupBy: function groupBy(grouper, context) {
    return groupByFactory(this, grouper, context);
  },
  has: function has(searchKey) {
    return this.get(searchKey, NOT_SET) !== NOT_SET;
  },
  hasIn: hasIn,
  isSubset: function isSubset(iter) {
    iter = typeof iter.includes === 'function' ? iter : Collection(iter);
    return this.every(function (value) {
      return iter.includes(value);
    });
  },
  isSuperset: function isSuperset(iter) {
    iter = typeof iter.isSubset === 'function' ? iter : Collection(iter);
    return iter.isSubset(this);
  },
  keyOf: function keyOf(searchValue) {
    return this.findKey(function (value) {
      return is(value, searchValue);
    });
  },
  keySeq: function keySeq() {
    return this.toSeq().map(keyMapper).toIndexedSeq();
  },
  last: function last(notSetValue) {
    return this.toSeq().reverse().first(notSetValue);
  },
  lastKeyOf: function lastKeyOf(searchValue) {
    return this.toKeyedSeq().reverse().keyOf(searchValue);
  },
  max: function max(comparator) {
    return maxFactory(this, comparator);
  },
  maxBy: function maxBy(mapper, comparator) {
    return maxFactory(this, comparator, mapper);
  },
  min: function min(comparator) {
    return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
  },
  minBy: function minBy(mapper, comparator) {
    return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
  },
  rest: function rest() {
    return this.slice(1);
  },
  skip: function skip(amount) {
    return amount === 0 ? this : this.slice(Math.max(0, amount));
  },
  skipLast: function skipLast(amount) {
    return amount === 0 ? this : this.slice(0, -Math.max(0, amount));
  },
  skipWhile: function skipWhile(predicate, context) {
    return reify(this, skipWhileFactory(this, predicate, context, true));
  },
  skipUntil: function skipUntil(predicate, context) {
    return this.skipWhile(not(predicate), context);
  },
  sortBy: function sortBy(mapper, comparator) {
    return reify(this, sortFactory(this, comparator, mapper));
  },
  take: function take(amount) {
    return this.slice(0, Math.max(0, amount));
  },
  takeLast: function takeLast(amount) {
    return this.slice(-Math.max(0, amount));
  },
  takeWhile: function takeWhile(predicate, context) {
    return reify(this, takeWhileFactory(this, predicate, context));
  },
  takeUntil: function takeUntil(predicate, context) {
    return this.takeWhile(not(predicate), context);
  },
  update: function update(fn) {
    return fn(this);
  },
  valueSeq: function valueSeq() {
    return this.toIndexedSeq();
  },
  // ### Hashable Object
  hashCode: function hashCode() {
    return this.__hash || (this.__hash = hashCollection(this));
  } // ### Internal
  // abstract __iterate(fn, reverse)
  // abstract __iterator(type, reverse)

});
var CollectionPrototype = Collection.prototype;
CollectionPrototype[IS_COLLECTION_SYMBOL] = true;
CollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.values;
CollectionPrototype.toJSON = CollectionPrototype.toArray;
CollectionPrototype.__toStringMapper = quoteString;

CollectionPrototype.inspect = CollectionPrototype.toSource = function () {
  return this.toString();
};

CollectionPrototype.chain = CollectionPrototype.flatMap;
CollectionPrototype.contains = CollectionPrototype.includes;
mixin(KeyedCollection, {
  // ### More sequential methods
  flip: function flip() {
    return reify(this, flipFactory(this));
  },
  mapEntries: function mapEntries(mapper, context) {
    var _this = this;

    var iterations = 0;
    return reify(this, this.toSeq().map(function (v, k) {
      return mapper.call(context, [k, v], iterations++, _this);
    }).fromEntrySeq());
  },
  mapKeys: function mapKeys(mapper, context) {
    var _this2 = this;

    return reify(this, this.toSeq().flip().map(function (k, v) {
      return mapper.call(context, k, v, _this2);
    }).flip());
  }
});
var KeyedCollectionPrototype = KeyedCollection.prototype;
KeyedCollectionPrototype[IS_KEYED_SYMBOL] = true;
KeyedCollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.entries;
KeyedCollectionPrototype.toJSON = toObject;

KeyedCollectionPrototype.__toStringMapper = function (v, k) {
  return quoteString(k) + ': ' + quoteString(v);
};

mixin(IndexedCollection, {
  // ### Conversion to other types
  toKeyedSeq: function toKeyedSeq() {
    return new ToKeyedSequence(this, false);
  },
  // ### ES6 Collection methods (ES6 Array and Map)
  filter: function filter(predicate, context) {
    return reify(this, filterFactory(this, predicate, context, false));
  },
  findIndex: function findIndex(predicate, context) {
    var entry = this.findEntry(predicate, context);
    return entry ? entry[0] : -1;
  },
  indexOf: function indexOf(searchValue) {
    var key = this.keyOf(searchValue);
    return key === undefined ? -1 : key;
  },
  lastIndexOf: function lastIndexOf(searchValue) {
    var key = this.lastKeyOf(searchValue);
    return key === undefined ? -1 : key;
  },
  reverse: function reverse() {
    return reify(this, reverseFactory(this, false));
  },
  slice: function slice(begin, end) {
    return reify(this, sliceFactory(this, begin, end, false));
  },
  splice: function splice(index, removeNum
  /*, ...values*/
  ) {
    var numArgs = arguments.length;
    removeNum = Math.max(removeNum || 0, 0);

    if (numArgs === 0 || numArgs === 2 && !removeNum) {
      return this;
    } // If index is negative, it should resolve relative to the size of the
    // collection. However size may be expensive to compute if not cached, so
    // only call count() if the number is in fact negative.


    index = resolveBegin(index, index < 0 ? this.count() : this.size);
    var spliced = this.slice(0, index);
    return reify(this, numArgs === 1 ? spliced : spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum)));
  },
  // ### More collection methods
  findLastIndex: function findLastIndex(predicate, context) {
    var entry = this.findLastEntry(predicate, context);
    return entry ? entry[0] : -1;
  },
  first: function first(notSetValue) {
    return this.get(0, notSetValue);
  },
  flatten: function flatten(depth) {
    return reify(this, flattenFactory(this, depth, false));
  },
  get: function get(index, notSetValue) {
    index = wrapIndex(this, index);
    return index < 0 || this.size === Infinity || this.size !== undefined && index > this.size ? notSetValue : this.find(function (_, key) {
      return key === index;
    }, undefined, notSetValue);
  },
  has: function has(index) {
    index = wrapIndex(this, index);
    return index >= 0 && (this.size !== undefined ? this.size === Infinity || index < this.size : this.indexOf(index) !== -1);
  },
  interpose: function interpose(separator) {
    return reify(this, interposeFactory(this, separator));
  },
  interleave: function interleave() {
    var collections = [this].concat(arrCopy(arguments));
    var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, collections);
    var interleaved = zipped.flatten(true);

    if (zipped.size) {
      interleaved.size = zipped.size * collections.length;
    }

    return reify(this, interleaved);
  },
  keySeq: function keySeq() {
    return Range(0, this.size);
  },
  last: function last(notSetValue) {
    return this.get(-1, notSetValue);
  },
  skipWhile: function skipWhile(predicate, context) {
    return reify(this, skipWhileFactory(this, predicate, context, false));
  },
  zip: function zip() {
    var collections = [this].concat(arrCopy(arguments));
    return reify(this, zipWithFactory(this, defaultZipper, collections));
  },
  zipAll: function zipAll() {
    var collections = [this].concat(arrCopy(arguments));
    return reify(this, zipWithFactory(this, defaultZipper, collections, true));
  },
  zipWith: function zipWith(zipper
  /*, ...collections */
  ) {
    var collections = arrCopy(arguments);
    collections[0] = this;
    return reify(this, zipWithFactory(this, zipper, collections));
  }
});
var IndexedCollectionPrototype = IndexedCollection.prototype;
IndexedCollectionPrototype[IS_INDEXED_SYMBOL] = true;
IndexedCollectionPrototype[IS_ORDERED_SYMBOL] = true;
mixin(SetCollection, {
  // ### ES6 Collection methods (ES6 Array and Map)
  get: function get(value, notSetValue) {
    return this.has(value) ? value : notSetValue;
  },
  includes: function includes(value) {
    return this.has(value);
  },
  // ### More sequential methods
  keySeq: function keySeq() {
    return this.valueSeq();
  }
});
var SetCollectionPrototype = SetCollection.prototype;
SetCollectionPrototype.has = CollectionPrototype.includes;
SetCollectionPrototype.contains = SetCollectionPrototype.includes;
SetCollectionPrototype.keys = SetCollectionPrototype.values; // Mixin subclasses

mixin(KeyedSeq, KeyedCollectionPrototype);
mixin(IndexedSeq, IndexedCollectionPrototype);
mixin(SetSeq, SetCollectionPrototype); // #pragma Helper functions

function _reduce(collection, reducer, reduction, context, useFirst, reverse) {
  assertNotInfinite(collection.size);

  collection.__iterate(function (v, k, c) {
    if (useFirst) {
      useFirst = false;
      reduction = v;
    } else {
      reduction = reducer.call(context, reduction, v, k, c);
    }
  }, reverse);

  return reduction;
}

function keyMapper(v, k) {
  return k;
}

function entryMapper(v, k) {
  return [k, v];
}

function not(predicate) {
  return function () {
    return !predicate.apply(this, arguments);
  };
}

function neg(predicate) {
  return function () {
    return -predicate.apply(this, arguments);
  };
}

function defaultZipper() {
  return arrCopy(arguments);
}

function defaultNegComparator(a, b) {
  return a < b ? 1 : a > b ? -1 : 0;
}

function hashCollection(collection) {
  if (collection.size === Infinity) {
    return 0;
  }

  var ordered = isOrdered(collection);
  var keyed = isKeyed(collection);
  var h = ordered ? 1 : 0;

  var size = collection.__iterate(keyed ? ordered ? function (v, k) {
    h = 31 * h + hashMerge(hash(v), hash(k)) | 0;
  } : function (v, k) {
    h = h + hashMerge(hash(v), hash(k)) | 0;
  } : ordered ? function (v) {
    h = 31 * h + hash(v) | 0;
  } : function (v) {
    h = h + hash(v) | 0;
  });

  return murmurHashOfSize(size, h);
}

function murmurHashOfSize(size, h) {
  h = imul(h, 0xcc9e2d51);
  h = imul(h << 15 | h >>> -15, 0x1b873593);
  h = imul(h << 13 | h >>> -13, 5);
  h = (h + 0xe6546b64 | 0) ^ size;
  h = imul(h ^ h >>> 16, 0x85ebca6b);
  h = imul(h ^ h >>> 13, 0xc2b2ae35);
  h = smi(h ^ h >>> 16);
  return h;
}

function hashMerge(a, b) {
  return a ^ b + 0x9e3779b9 + (a << 6) + (a >> 2) | 0; // int
}

function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf$1(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$1(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$1(this, result); }; }

function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$2(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$1(self); }

function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }
var OrderedSet = /*#__PURE__*/function (_Set) {
  _inherits$1(OrderedSet, _Set);

  _createSuper$1(OrderedSet);

  // @pragma Construction
  function OrderedSet(value) {
    var _this;

    _classCallCheck$2(this, OrderedSet);

    return _possibleConstructorReturn$1(_this, value === null || value === undefined ? emptyOrderedSet() : isOrderedSet(value) ? value : emptyOrderedSet().withMutations(function (set) {
      var iter = SetCollection(value);
      assertNotInfinite(iter.size);
      iter.forEach(function (v) {
        return set.add(v);
      });
    }));
  }

  _createClass$2(OrderedSet, [{
    key: "toString",
    value: function toString() {
      return this.__toString('OrderedSet {', '}');
    }
  }], [{
    key: "of",
    value: function of() {
      return this(arguments);
    }
  }, {
    key: "fromKeys",
    value: function fromKeys(value) {
      return this(KeyedCollection(value).keySeq());
    }
  }]);

  return OrderedSet;
}(Set);
OrderedSet.isOrderedSet = isOrderedSet;
var OrderedSetPrototype = OrderedSet.prototype;
OrderedSetPrototype[IS_ORDERED_SYMBOL] = true;
OrderedSetPrototype.zip = IndexedCollectionPrototype.zip;
OrderedSetPrototype.zipWith = IndexedCollectionPrototype.zipWith;
OrderedSetPrototype.zipAll = IndexedCollectionPrototype.zipAll;
OrderedSetPrototype.__empty = emptyOrderedSet;
OrderedSetPrototype.__make = makeOrderedSet;

function makeOrderedSet(map, ownerID) {
  var set = Object.create(OrderedSetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

var EMPTY_ORDERED_SET;

function emptyOrderedSet() {
  return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
}

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

function throwOnInvalidDefaultValues(defaultValues) {
  if (isRecord(defaultValues)) {
    throw new Error('Can not call `Record` with an immutable Record as default values. Use a plain javascript object instead.');
  }

  if (isImmutable(defaultValues)) {
    throw new Error('Can not call `Record` with an immutable Collection as default values. Use a plain javascript object instead.');
  }

  if (defaultValues === null || _typeof$1(defaultValues) !== 'object') {
    throw new Error('Can not call `Record` with a non-object as default values. Use a plain javascript object instead.');
  }
}

var Record = /*#__PURE__*/function () {
  function Record(defaultValues, name) {
    _classCallCheck$1(this, Record);

    var hasInitialized;
    throwOnInvalidDefaultValues(defaultValues);

    var RecordType = function Record(values) {
      var _this = this;

      if (values instanceof RecordType) {
        return values;
      }

      if (!(this instanceof RecordType)) {
        return new RecordType(values);
      }

      if (!hasInitialized) {
        hasInitialized = true;
        var keys = Object.keys(defaultValues);
        var indices = RecordTypePrototype._indices = {}; // Deprecated: left to attempt not to break any external code which
        // relies on a ._name property existing on record instances.
        // Use Record.getDescriptiveName() instead

        RecordTypePrototype._name = name;
        RecordTypePrototype._keys = keys;
        RecordTypePrototype._defaultValues = defaultValues;

        for (var i = 0; i < keys.length; i++) {
          var propName = keys[i];
          indices[propName] = i;

          if (RecordTypePrototype[propName]) {
            /* eslint-disable no-console */
            (typeof console === "undefined" ? "undefined" : _typeof$1(console)) === 'object' && console.warn && console.warn('Cannot define ' + recordName(this) + ' with property "' + propName + '" since that property name is part of the Record API.');
            /* eslint-enable no-console */
          } else {
            setProp(RecordTypePrototype, propName);
          }
        }
      }

      this.__ownerID = undefined;
      this._values = List().withMutations(function (l) {
        l.setSize(_this._keys.length);
        KeyedCollection(values).forEach(function (v, k) {
          l.set(_this._indices[k], v === _this._defaultValues[k] ? undefined : v);
        });
      });
      return this;
    };

    var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
    RecordTypePrototype.constructor = RecordType;

    if (name) {
      RecordType.displayName = name;
    }

    return RecordType;
  }

  _createClass$1(Record, [{
    key: "toString",
    value: function toString() {
      var str = recordName(this) + ' { ';
      var keys = this._keys;
      var k;

      for (var i = 0, l = keys.length; i !== l; i++) {
        k = keys[i];
        str += (i ? ', ' : '') + k + ': ' + quoteString(this.get(k));
      }

      return str + ' }';
    }
  }, {
    key: "equals",
    value: function equals(other) {
      return this === other || other && recordSeq(this).equals(recordSeq(other));
    }
  }, {
    key: "hashCode",
    value: function hashCode() {
      return recordSeq(this).hashCode();
    } // @pragma Access

  }, {
    key: "has",
    value: function has(k) {
      return this._indices.hasOwnProperty(k);
    }
  }, {
    key: "get",
    value: function get(k, notSetValue) {
      if (!this.has(k)) {
        return notSetValue;
      }

      var index = this._indices[k];

      var value = this._values.get(index);

      return value === undefined ? this._defaultValues[k] : value;
    } // @pragma Modification

  }, {
    key: "set",
    value: function set(k, v) {
      if (this.has(k)) {
        var newValues = this._values.set(this._indices[k], v === this._defaultValues[k] ? undefined : v);

        if (newValues !== this._values && !this.__ownerID) {
          return makeRecord(this, newValues);
        }
      }

      return this;
    }
  }, {
    key: "remove",
    value: function remove(k) {
      return this.set(k);
    }
  }, {
    key: "clear",
    value: function clear() {
      var newValues = this._values.clear().setSize(this._keys.length);

      return this.__ownerID ? this : makeRecord(this, newValues);
    }
  }, {
    key: "wasAltered",
    value: function wasAltered() {
      return this._values.wasAltered();
    }
  }, {
    key: "toSeq",
    value: function toSeq() {
      return recordSeq(this);
    }
  }, {
    key: "toJS",
    value: function toJS$1() {
      return toJS(this);
    }
  }, {
    key: "entries",
    value: function entries() {
      return this.__iterator(ITERATE_ENTRIES);
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      return recordSeq(this).__iterator(type, reverse);
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      return recordSeq(this).__iterate(fn, reverse);
    }
  }, {
    key: "__ensureOwner",
    value: function __ensureOwner(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }

      var newValues = this._values.__ensureOwner(ownerID);

      if (!ownerID) {
        this.__ownerID = ownerID;
        this._values = newValues;
        return this;
      }

      return makeRecord(this, newValues, ownerID);
    }
  }]);

  return Record;
}();
Record.isRecord = isRecord;
Record.getDescriptiveName = recordName;
var RecordPrototype = Record.prototype;
RecordPrototype[IS_RECORD_SYMBOL] = true;
RecordPrototype[DELETE] = RecordPrototype.remove;
RecordPrototype.deleteIn = RecordPrototype.removeIn = deleteIn;
RecordPrototype.getIn = getIn;
RecordPrototype.hasIn = CollectionPrototype.hasIn;
RecordPrototype.merge = merge$1;
RecordPrototype.mergeWith = mergeWith$1;
RecordPrototype.mergeIn = mergeIn;
RecordPrototype.mergeDeep = mergeDeep;
RecordPrototype.mergeDeepWith = mergeDeepWith;
RecordPrototype.mergeDeepIn = mergeDeepIn;
RecordPrototype.setIn = setIn;
RecordPrototype.update = update;
RecordPrototype.updateIn = updateIn;
RecordPrototype.withMutations = withMutations;
RecordPrototype.asMutable = asMutable;
RecordPrototype.asImmutable = asImmutable;
RecordPrototype[ITERATOR_SYMBOL] = RecordPrototype.entries;
RecordPrototype.toJSON = RecordPrototype.toObject = CollectionPrototype.toObject;

RecordPrototype.inspect = RecordPrototype.toSource = function () {
  return this.toString();
};

function makeRecord(likeRecord, values, ownerID) {
  var record = Object.create(Object.getPrototypeOf(likeRecord));
  record._values = values;
  record.__ownerID = ownerID;
  return record;
}

function recordName(record) {
  return record.constructor.displayName || record.constructor.name || 'Record';
}

function recordSeq(record) {
  return keyedSeqFromValue(record._keys.map(function (k) {
    return [k, record.get(k)];
  }));
}

function setProp(prototype, name) {
  try {
    Object.defineProperty(prototype, name, {
      get: function get() {
        return this.get(name);
      },
      set: function set(value) {
        invariant(this.__ownerID, 'Cannot set on an immutable record.');
        this.set(name, value);
      }
    });
  } catch (error) {// Object.defineProperty failed. Probably IE8.
  }
}

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
/**
 * Returns a lazy Seq of `value` repeated `times` times. When `times` is
 * undefined, returns an infinite sequence of `value`.
 */

var Repeat = /*#__PURE__*/function (_IndexedSeq) {
  _inherits(Repeat, _IndexedSeq);

  _createSuper(Repeat);

  function Repeat(value, times) {
    var _this;

    _classCallCheck(this, Repeat);

    if (!(_assertThisInitialized(_this) instanceof Repeat)) {
      return _possibleConstructorReturn(_this, new Repeat(value, times));
    }

    _this._value = value;
    _this.size = times === undefined ? Infinity : Math.max(0, times);

    if (_this.size === 0) ;

    return _possibleConstructorReturn(_this);
  }

  _createClass(Repeat, [{
    key: "toString",
    value: function toString() {
      if (this.size === 0) {
        return 'Repeat []';
      }

      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
    }
  }, {
    key: "get",
    value: function get(index, notSetValue) {
      return this.has(index) ? this._value : notSetValue;
    }
  }, {
    key: "includes",
    value: function includes(searchValue) {
      return is(this._value, searchValue);
    }
  }, {
    key: "slice",
    value: function slice(begin, end) {
      var size = this.size;
      return wholeSlice(begin, end, size) ? this : new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
    }
  }, {
    key: "reverse",
    value: function reverse() {
      return this;
    }
  }, {
    key: "indexOf",
    value: function indexOf(searchValue) {
      if (is(this._value, searchValue)) {
        return 0;
      }

      return -1;
    }
  }, {
    key: "lastIndexOf",
    value: function lastIndexOf(searchValue) {
      if (is(this._value, searchValue)) {
        return this.size;
      }

      return -1;
    }
  }, {
    key: "__iterate",
    value: function __iterate(fn, reverse) {
      var size = this.size;
      var i = 0;

      while (i !== size) {
        if (fn(this._value, reverse ? size - ++i : i++, this) === false) {
          break;
        }
      }

      return i;
    }
  }, {
    key: "__iterator",
    value: function __iterator(type, reverse) {
      var _this2 = this;

      var size = this.size;
      var i = 0;
      return new Iterator(function () {
        return i === size ? iteratorDone() : iteratorValue(type, reverse ? size - ++i : i++, _this2._value);
      });
    }
  }, {
    key: "equals",
    value: function equals(other) {
      return other instanceof Repeat ? is(this._value, other._value) : deepEqual(other);
    }
  }]);

  return Repeat;
}(IndexedSeq);

function fromJS(value, converter) {
  return fromJSWith([], converter || defaultConverter, value, '', converter && converter.length > 2 ? [] : undefined, {
    '': value
  });
}

function fromJSWith(stack, converter, value, key, keyPath, parentValue) {
  if (typeof value !== 'string' && !isImmutable(value) && (isArrayLike(value) || hasIterator(value) || isPlainObject(value))) {
    if (~stack.indexOf(value)) {
      throw new TypeError('Cannot convert circular structure to Immutable');
    }

    stack.push(value);
    keyPath && key !== '' && keyPath.push(key);
    var converted = converter.call(parentValue, key, Seq(value).map(function (v, k) {
      return fromJSWith(stack, converter, v, k, keyPath, value);
    }), keyPath && keyPath.slice());
    stack.pop();
    keyPath && keyPath.pop();
    return converted;
  }

  return value;
}

function defaultConverter(k, v) {
  // Effectively the opposite of "Collection.toSeq()"
  return isIndexed(v) ? v.toList() : isKeyed(v) ? v.toMap() : v.toSet();
}

var version = "1.0.0";

var Immutable = {
  version: version,
  Collection: Collection,
  // Note: Iterable is deprecated
  Iterable: Collection,
  Seq: Seq,
  Map: Map,
  OrderedMap: OrderedMap,
  List: List,
  Stack: Stack,
  Set: Set,
  OrderedSet: OrderedSet,
  Record: Record,
  Range: Range,
  Repeat: Repeat,
  is: is,
  fromJS: fromJS,
  hash: hash,
  isImmutable: isImmutable,
  isCollection: isCollection,
  isKeyed: isKeyed,
  isIndexed: isIndexed,
  isAssociative: isAssociative,
  isOrdered: isOrdered,
  isValueObject: isValueObject,
  isPlainObject: isPlainObject,
  isSeq: isSeq,
  isList: isList,
  isMap: isMap,
  isOrderedMap: isOrderedMap,
  isStack: isStack,
  isSet: isSet,
  isOrderedSet: isOrderedSet,
  isRecord: isRecord,
  get: get,
  getIn: getIn$1,
  has: has,
  hasIn: hasIn$1,
  merge: merge,
  mergeDeep: mergeDeep$1,
  mergeWith: mergeWith,
  mergeDeepWith: mergeDeepWith$1,
  remove: remove,
  removeIn: removeIn,
  set: set,
  setIn: setIn$1,
  update: update$1,
  updateIn: updateIn$1
}; // Note: Iterable is deprecated

var Iterable = Collection;

export default Immutable;
export { Collection, Iterable, List, Map, OrderedMap, OrderedSet, Range, Record, Repeat, Seq, Set, Stack, fromJS, get, getIn$1 as getIn, has, hasIn$1 as hasIn, is, isAssociative, isCollection, isImmutable, isIndexed, isKeyed, isList, isMap, isOrdered, isOrderedMap, isOrderedSet, isPlainObject, isRecord, isSeq, isSet, isStack, merge, mergeDeep$1 as mergeDeep, mergeDeepWith$1 as mergeDeepWith, mergeWith, remove, removeIn, set, setIn$1 as setIn, update$1 as update, updateIn$1 as updateIn, version };
