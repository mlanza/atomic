function isValueObject(maybeValue) {
  return Boolean(maybeValue && typeof maybeValue.equals === 'function' && typeof maybeValue.hashCode === 'function');
}

// Values which have either 00 or 11 as the high order bits qualify.
// This function drops the highest order bit in a signed number, maintaining
// the sign bit.

function smi(i32) {
  return i32 >>> 1 & 0x40000000 | i32 & 0xbfffffff;
}

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
var defaultValueOf = Object.prototype.valueOf;
function hash(o) {
  if (o == null) {
    return hashNullish(o);
  }

  if (typeof o.hashCode === 'function') {
    // Drop any high bits from accidentally long hash codes.
    return smi(o.hashCode(o));
  }

  var v = valueOf(o);

  if (v == null) {
    return hashNullish(v);
  }

  switch (_typeof(v)) {
    case 'boolean':
      // The hash values for built-in constants are a 1 value for each 5-byte
      // shift region expect for the first, which encodes the value. This
      // reduces the odds of a hash collision for these common values.
      return v ? 0x42108421 : 0x42108420;

    case 'number':
      return hashNumber(v);

    case 'string':
      return v.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(v) : hashString(v);

    case 'object':
    case 'function':
      return hashJSObj(v);

    case 'symbol':
      return hashSymbol(v);

    default:
      if (typeof v.toString === 'function') {
        return hashString(v.toString());
      }

      throw new Error('Value type ' + _typeof(v) + ' cannot be hashed.');
  }
}

function hashNullish(nullish) {
  return nullish === null ? 0x42108422 :
  /* undefined */
  0x42108423;
} // Compress arbitrarily large numbers into smi hashes.


function hashNumber(n) {
  if (n !== n || n === Infinity) {
    return 0;
  }

  var hash = n | 0;

  if (hash !== n) {
    hash ^= n * 0xffffffff;
  }

  while (n > 0xffffffff) {
    n /= 0xffffffff;
    hash ^= n;
  }

  return smi(hash);
}

function cachedHashString(string) {
  var hashed = stringHashCache[string];

  if (hashed === undefined) {
    hashed = hashString(string);

    if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
      STRING_HASH_CACHE_SIZE = 0;
      stringHashCache = {};
    }

    STRING_HASH_CACHE_SIZE++;
    stringHashCache[string] = hashed;
  }

  return hashed;
} // http://jsperf.com/hashing-strings


function hashString(string) {
  // This is the hash from JVM
  // The hash code for a string is computed as
  // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
  // where s[i] is the ith character of the string and n is the length of
  // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
  // (exclusive) by dropping high bits.
  var hashed = 0;

  for (var ii = 0; ii < string.length; ii++) {
    hashed = 31 * hashed + string.charCodeAt(ii) | 0;
  }

  return smi(hashed);
}

function hashSymbol(sym) {
  var hashed = symbolMap[sym];

  if (hashed !== undefined) {
    return hashed;
  }

  hashed = nextHash();
  symbolMap[sym] = hashed;
  return hashed;
}

function hashJSObj(obj) {
  var hashed;

  if (usingWeakMap) {
    hashed = weakMap.get(obj);

    if (hashed !== undefined) {
      return hashed;
    }
  }

  hashed = obj[UID_HASH_KEY];

  if (hashed !== undefined) {
    return hashed;
  }

  if (!canDefineProperty) {
    hashed = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];

    if (hashed !== undefined) {
      return hashed;
    }

    hashed = getIENodeHash(obj);

    if (hashed !== undefined) {
      return hashed;
    }
  }

  hashed = nextHash();

  if (usingWeakMap) {
    weakMap.set(obj, hashed);
  } else if (isExtensible !== undefined && isExtensible(obj) === false) {
    throw new Error('Non-extensible objects are not allowed as keys.');
  } else if (canDefineProperty) {
    Object.defineProperty(obj, UID_HASH_KEY, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: hashed
    });
  } else if (obj.propertyIsEnumerable !== undefined && obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
    // Since we can't define a non-enumerable property on the object
    // we'll hijack one of the less-used non-enumerable properties to
    // save our hash on it. Since this is a function it will not show up in
    // `JSON.stringify` which is what we want.
    obj.propertyIsEnumerable = function () {
      return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
    };

    obj.propertyIsEnumerable[UID_HASH_KEY] = hashed;
  } else if (obj.nodeType !== undefined) {
    // At this point we couldn't get the IE `uniqueID` to use as a hash
    // and we couldn't use a non-enumerable property to exploit the
    // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
    // itself.
    obj[UID_HASH_KEY] = hashed;
  } else {
    throw new Error('Unable to set a non-enumerable property on object.');
  }

  return hashed;
} // Get references to ES5 object methods.


var isExtensible = Object.isExtensible; // True if Object.defineProperty works as expected. IE8 fails this test.

var canDefineProperty = function () {
  try {
    Object.defineProperty({}, '@', {});
    return true;
  } catch (e) {
    return false;
  }
}(); // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
// and avoid memory leaks from the IE cloneNode bug.


function getIENodeHash(node) {
  if (node && node.nodeType > 0) {
    switch (node.nodeType) {
      case 1:
        // Element
        return node.uniqueID;

      case 9:
        // Document
        return node.documentElement && node.documentElement.uniqueID;
    }
  }
}

function valueOf(obj) {
  return obj.valueOf !== defaultValueOf && typeof obj.valueOf === 'function' ? obj.valueOf(obj) : obj;
}

function nextHash() {
  var nextHash = ++_objHashUID;

  if (_objHashUID & 0x40000000) {
    _objHashUID = 0;
  }

  return nextHash;
} // If possible, use a WeakMap.


var usingWeakMap = typeof WeakMap === 'function';
var weakMap;

if (usingWeakMap) {
  weakMap = new WeakMap();
}

var symbolMap = Object.create(null);
var _objHashUID = 0;
var UID_HASH_KEY = '__immutablehash__';

if (typeof Symbol === 'function') {
  UID_HASH_KEY = Symbol(UID_HASH_KEY);
}

var STRING_HASH_CACHE_MIN_STRLEN = 16;
var STRING_HASH_CACHE_MAX_SIZE = 255;
var STRING_HASH_CACHE_SIZE = 0;
var stringHashCache = {};

export { hash, isValueObject };
