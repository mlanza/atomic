/*!
 * Collections-ES6 v0.1.5
 * Provides functionality of Collections Framework of ES6 such as
 * Map, Set, WeakMap, WeakSet in native ES5 for older browsers and JavaScript
 * engines.
 *
 * @license Copyright (c) 2017-2018 Rousan Ali, MIT License
 *
 * Codebase: https://github.com/rousan/collections-es6
 * Date: 29th Jan, 2018
 */

(function (global, factory) {

    "use strict";

    if (typeof module === "object" && typeof module.exports === "object") {
        // For the environment like NodeJS, CommonJS etc where module or
        // module.exports objects are available
        module.exports = factory(global);
    } else {
        // For browser context, where global object is window
        factory(global);
    }

    /* window is for browser environment and global is for NodeJS environment */
})(typeof window !== "undefined" ? window : global, function (global) {

    "use strict";

    var defineProperty = Object.defineProperty;

    var defineProperties = Object.defineProperties;

    var isArray = Array.isArray;

    var create = Object.create;

    var ES6 = typeof global.ES6 === "object" ? global.ES6 : (global.ES6 = {});

    var isCallable = function (fn) {
        return typeof fn === 'function';
    };

    var Iterator = function () {};

    var MapIterator = function MapIterator(map, flag) {
        this._map = map;
        this._flag = flag;
        this._currentEntry = null;
        this._done = false;
    };

    var SetIterator = function SetIterator(set, flag) {
        this._set = set;
        this._flag = flag;
        this._currentEntry = null;
        this._done = false;
    };

    var isES6Running = function () {
        return false; /* Now 'false' for testing purpose */
    };

    var isObject = function (value) {
        return value !== null && (typeof value === "object" || typeof value === "function");
    };

    // Provides simple inheritance functionality
    var simpleInheritance = function (child, parent) {
        if (typeof child !== "function" || typeof parent !== "function")
            throw new TypeError("Child and Parent must be function type");

        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    };

    // Make Iterator like iterable
    defineProperty(Iterator.prototype, Symbol.iterator.toString(), {
        value: function () {return this;},
        writable: true,
        configurable: true
    });

    simpleInheritance(MapIterator, Iterator);

    simpleInheritance(SetIterator, Iterator);

    defineProperty(MapIterator.prototype, Symbol.toStringTag.toString(), {
        value: "Map Iterator",
        configurable: true
    });

    defineProperty(SetIterator.prototype, Symbol.toStringTag.toString(), {
        value: "Set Iterator",
        configurable: true
    });

    MapIterator.prototype.next = function next() {
        if (!(this instanceof MapIterator))
            throw new TypeError("Method Map Iterator.prototype.next called on incompatible receiver " + String(this));
        var self = this,
            nextValue;
        if (self._done) {
            return {
                done: true,
                value: undefined
            };
        }
        if (self._currentEntry === null)
            self._currentEntry = self._map._head;
        else
            self._currentEntry = self._currentEntry.next;

        if (self._currentEntry === null) {
            self._done = true;
            return {
                done: true,
                value: undefined
            };
        }
        // _flag = 1 for [key, value]
        // _flag = 2 for [value]
        // _flag = 3 for [key]
        if (self._flag === 1)
            nextValue = [self._currentEntry.key, self._currentEntry.value];
        else if (self._flag === 2)
            nextValue = self._currentEntry.value;
        else if (self._flag === 3)
            nextValue = self._currentEntry.key;
        return {
            done: false,
            value: nextValue
        };
    };

    SetIterator.prototype.next = function next() {
        if (!(this instanceof SetIterator))
            throw new TypeError("Method Set Iterator.prototype.next called on incompatible receiver " + String(this));
        var self = this,
            nextValue;
        if (self._done) {
            return {
                done: true,
                value: undefined
            };
        }
        if (self._currentEntry === null)
            self._currentEntry = self._set._head;
        else
            self._currentEntry = self._currentEntry.next;

        if (self._currentEntry === null) {
            self._done = true;
            return {
                done: true,
                value: undefined
            };
        }
        // _flag = 1 for [value, value]
        // _flag = 2 for [value]
        if (self._flag === 1)
            nextValue = [self._currentEntry.value, self._currentEntry.value];
        else if (self._flag === 2)
            nextValue = self._currentEntry.value;
        return {
            done: false,
            value: nextValue
        };
    };

    // Returns hash for primitive typed key like this:
    // undefined or null => I___toString(key)
    // number => N___toString(key)
    // string => S___toString(key)
    // boolean => B___toString(key)
    //
    // But returns null for object typed key.
    var hash = function (key) {
        // String(0) === String(-0)
        // String(NaN) === String(NaN)
        var strKey = String(key);
        if (key === undefined || key === null)
            return "I___" + strKey;
        else if (typeof key === "number")
            return "N___" + strKey;
        else if (typeof key === "string")
            return "S___" + strKey;
        else if (typeof key === "boolean")
            return "B___" + strKey;
        else
            return null; /* For object key */
    };

    var Map = function Map(iterable) {
        if (!(this instanceof Map) || isMap(this))
            throw new TypeError("Constructor Map requires 'new'");
        setupMapInternals(this);

        if (iterable !== null && iterable !== undefined) {
            ES6.forOf(iterable, function (entry) {
                if (!isObject(entry))
                    throw new TypeError("Iterator value " + entry + " is not an entry object");
                this.set(entry[0], entry[1]);
            }, this);
        }
    };

    // WARNING: This method puts a link in the key object to reduce time complexity to O(1).
    // So, after map.set(key, value) call, if the linker property of the key object is deleted
    // then map.has(key) will returns false.
    // Time complexity: O(1) for all cases(there is no worst case, same for both primitive and object key).
    // Space complexity is O(n) for all cases.
    Map.prototype.set = function set(key, value) {
        if (!isMap(this))
            throw new TypeError("Method Map.prototype.set called on incompatible receiver " + this);
        var keyHash = hash(key),
            objectHash = this._objectHash,
            entry;
        if (keyHash === null) {
            if (typeof key[objectHash] === "number" && this._data.objects[key[objectHash]] instanceof MapEntry) {
                entry = this._data.objects[key[objectHash]];
                entry.value = value;
                return this;
            }
            entry = new MapEntry(key, value);
            this._data.objects.push(entry);
            defineProperty(key, objectHash.toString(), {
                value: this._data.objects.length - 1,
                configurable: true
            });
            this._size++;
        } else {
            if (this._data.primitives[keyHash] instanceof MapEntry) {
                entry = this._data.primitives[keyHash];
                entry.value = value;
                return this;
            }
            entry = new MapEntry(key, value);
            this._data.primitives[keyHash] = entry;
            this._size++;
        }

        if (this._head === null) {
            this._head = entry;
            entry.next = null;
            entry.prev = null;
        }
        if (this._tail === null)
            this._tail = this._head;
        else {
            this._tail.next = entry;
            entry.prev = this._tail;
            entry.next = null;
            this._tail = entry;
        }
        return this;
    };

    // Time complexity: O(1) for all cases(there is no worst case, same for both primitive and object key).
    // Space complexity is O(1)
    Map.prototype.has = function has(key) {
        if (!isMap(this))
            throw new TypeError("Method Map.prototype.has called on incompatible receiver " + this);
        var keyHash = hash(key),
            objectHash = this._objectHash;

        if (keyHash === null)
            return typeof key[objectHash] === "number" && this._data.objects[key[objectHash]] instanceof MapEntry;
        else
            return this._data.primitives[keyHash] instanceof MapEntry;
    };

    // Time complexity: O(1) for all cases(there is no worst case, same for both primitive and object key).
    // Space complexity is O(1)
    Map.prototype.get = function get(key) {
        if (!isMap(this))
            throw new TypeError("Method Map.prototype.get called on incompatible receiver " + this);
        var keyHash = hash(key),
            objectHash = this._objectHash;
        if (keyHash === null) {
            if (typeof key[objectHash] === "number" && this._data.objects[key[objectHash]] instanceof MapEntry)
                return this._data.objects[key[objectHash]].value;
        } else {
            if (this._data.primitives[keyHash] instanceof MapEntry)
                return this._data.primitives[keyHash].value;
        }
    };

    // Time complexity: O(n)
    // Space complexity is O(1)
    Map.prototype.clear = function clear() {
        if (!isMap(this))
            throw new TypeError("Method Map.prototype.clear called on incompatible receiver " + this);
        var entry;
        // Clear all primitive keys
        Object.getOwnPropertyNames(this._data.primitives).forEach(function (prop) {
            if (this._data.primitives[prop] instanceof MapEntry) {
                entry = this._data.primitives[prop];
                delete this._data.primitives[prop];
                entry.next = null;
                entry.prev = null;
            }
        }, this);

        // Clear all object keys
        Object.getOwnPropertyNames(this._data.objects).forEach(function (prop) {
            if (this._data.objects[prop] instanceof MapEntry) {
                entry = this._data.objects[prop];
                delete this._data.objects[prop];
                delete entry.key[this._objectHash];
                entry.next = null;
                entry.prev = null;
            }
        }, this);
        this._data.objects.length = 0;

        // Free head and tail MapEntry
        this._head = null;
        this._tail = null;
        this._size = 0;
    };

    // Time complexity: O(1) for all cases(there is no worst case, same for both primitive and object key).
    // Space complexity is O(1)
    Map.prototype.delete = function (key) {
        if (!isMap(this))
            throw new TypeError("Method Map.prototype.delete called on incompatible receiver " + this);
        var keyHash = hash(key),
            objectHash = this._objectHash,
            entry;
        if (keyHash === null) {
            if (typeof key[objectHash] === "number" && this._data.objects[key[objectHash]] instanceof MapEntry) {
                entry = this._data.objects[key[objectHash]];
                delete this._data.objects[key[objectHash]];
                delete entry.key[objectHash];
            } else
                return false;
        } else {
            if (this._data.primitives[keyHash] instanceof MapEntry) {
                entry = this._data.primitives[keyHash];
                delete this._data.primitives[keyHash];
            } else {
                return false;
            }
        }

        if (entry.prev !== null && entry.next !== null) {
            entry.prev.next = entry.next;
            entry.next.prev = entry.prev;
            entry.next = null;
            entry.prev = null;
        } else if (entry.prev === null && entry.next !== null) {
            this._head = entry.next;
            entry.next.prev = null;
            entry.next = null;
        }
        if (entry.prev !== null && entry.next === null) {
            this._tail = entry.prev;
            entry.prev.next = null;
            entry.prev = null;
        } else {
            this._head = null;
            this._tail = null;
        }
        this._size--;
        return true;
    };

    defineProperty(Map.prototype, "size", {
        get: function size() {
            if (!isMap(this))
                throw new TypeError("Method Map.prototype.size called on incompatible receiver " + this);
            return this._size;
        },
        configurable: true
    });

    Map.prototype.entries = function entries() {
        if (!isMap(this))
            throw new TypeError("Method Map.prototype.entries called on incompatible receiver " + this);
        return new MapIterator(this, 1);
    };

    Map.prototype.values = function values() {
        if (!isMap(this))
            throw new TypeError("Method Map.prototype.values called on incompatible receiver " + this);
        return new MapIterator(this, 2);
    };

    Map.prototype.keys = function keys() {
        if (!isMap(this))
            throw new TypeError("Method Map.prototype.keys called on incompatible receiver " + this);
        return new MapIterator(this, 3);
    };

    Map.prototype.forEach = function forEach(callback, thisArg) {
        if (!isMap(this))
            throw new TypeError("Method Map.prototype.forEach called on incompatible receiver " + this);
        if (!isCallable(callback))
            throw new TypeError(callback + " is not a function");
        var currentEntry = this._head;
        while (currentEntry !== null) {
            callback.call(thisArg, currentEntry.value, currentEntry.key, this);
            currentEntry = currentEntry.next;
        }
    };

    Map.prototype[Symbol.iterator] = Map.prototype.entries;

    defineProperty(Map.prototype, Symbol.toStringTag.toString(), {
        value: "Map",
        configurable: true
    });

    var setupMapInternals = function (map) {
        defineProperties(map, {
            _isMap: {
                value: true
            },
            _head: {
                value: null,
                writable: true
            },
            _tail: {
                value: null,
                writable: true
            },
            _objectHash: {
                value: Symbol("Hash(map)")
            },
            _size: {
                value: 0,
                writable: true
            },
            _data: {
                value: create(null, {
                    primitives: {
                        value: create(null) /* [[Prototype]] must be null */
                    },
                    objects: {
                        value: []
                    }
                })
            }
        });
    };

    var checkMapInternals = function (map) {
        return map._isMap === true
            && (map._head === null || map._head instanceof MapEntry)
            && (map._tail === null || map._tail instanceof MapEntry)
            && ES6.isSymbol(map._objectHash)
            && typeof map._size === "number"
            && isObject(map._data)
            && isObject(map._data.primitives)
            && isArray(map._data.objects);
    };

    var isMap = function (map) {
        return map instanceof Map && checkMapInternals(map);
    };

    var MapEntry = function MapEntry(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
    };

    var Set = function Set(iterable) {
        if (!(this instanceof Set) || isSet(this))
            throw new TypeError("Constructor Set requires 'new'");
        setupSetInternals(this);

        if (iterable !== null && iterable !== undefined) {
            ES6.forOf(iterable, function (entry) {
                this.add(entry);
            }, this);
        }
    };

    // WARNING: This method puts a link in the value object to reduce time complexity to O(1).
    // So, after set.add(value) call, if the linker property of the value object is deleted
    // then set.has(value) will returns false.
    // Time complexity: O(1) for all cases(there is no worst case, same for both primitive and object value).
    // Space complexity is O(n) for all cases.
    Set.prototype.add = function add(value) {
        if (!isSet(this))
            throw new TypeError("Method Set.prototype.add called on incompatible receiver " + this);
        var valueHash = hash(value),
            objectHash = this._objectHash,
            entry;
        if (valueHash === null) {
            if (typeof value[objectHash] === "number" && this._data.objects[value[objectHash]] instanceof SetEntry) {
                // If the value is already present then just return 'this'
                return this;
            }
            entry = new SetEntry(value);
            this._data.objects.push(entry);
            defineProperty(value, objectHash.toString(), {
                value: this._data.objects.length - 1,
                configurable: true
            });
            this._size++;
        } else {
            if (this._data.primitives[valueHash] instanceof SetEntry) {
                // If the value is already present then just return 'this'
                return this;
            }
            entry = new SetEntry(value);
            this._data.primitives[valueHash] = entry;
            this._size++;
        }

        if (this._head === null) {
            this._head = entry;
            entry.next = null;
            entry.prev = null;
        }
        if (this._tail === null)
            this._tail = this._head;
        else {
            this._tail.next = entry;
            entry.prev = this._tail;
            entry.next = null;
            this._tail = entry;
        }
        return this;
    };

    // Time complexity: O(1) for all cases(there is no worst case, same for both primitive and object value).
    // Space complexity is O(1)
    Set.prototype.has = function has(value) {
        if (!isSet(this))
            throw new TypeError("Method Set.prototype.has called on incompatible receiver " + this);
        var valueHash = hash(value),
            objectHash = this._objectHash;

        if (valueHash === null)
            return typeof value[objectHash] === "number" && this._data.objects[value[objectHash]] instanceof SetEntry;
        else
            return this._data.primitives[valueHash] instanceof SetEntry;
    };

    // Time complexity: O(n)
    // Space complexity is O(1)
    Set.prototype.clear = function clear() {
        if (!isSet(this))
            throw new TypeError("Method Set.prototype.clear called on incompatible receiver " + this);
        var entry;
        // Clear all primitive values
        Object.getOwnPropertyNames(this._data.primitives).forEach(function (prop) {
            if (this._data.primitives[prop] instanceof SetEntry) {
                entry = this._data.primitives[prop];
                delete this._data.primitives[prop];
                entry.next = null;
                entry.prev = null;
            }
        }, this);

        // Clear all object values
        Object.getOwnPropertyNames(this._data.objects).forEach(function (prop) {
            if (this._data.objects[prop] instanceof SetEntry) {
                entry = this._data.objects[prop];
                delete this._data.objects[prop];
                delete entry.value[this._objectHash];
                entry.next = null;
                entry.prev = null;
            }
        }, this);
        this._data.objects.length = 0;

        // Free head and tail MapEntry
        this._head = null;
        this._tail = null;
        this._size = 0;
    };

    // Time complexity: O(1) for all cases(there is no worst case, same for both primitive and object value).
    // Space complexity is O(1)
    Set.prototype.delete = function (value) {
        if (!isSet(this))
            throw new TypeError("Method Set.prototype.delete called on incompatible receiver " + this);
        var valueHash = hash(value),
            objectHash = this._objectHash,
            entry;
        if (valueHash === null) {
            if (typeof value[objectHash] === "number" && this._data.objects[value[objectHash]] instanceof SetEntry) {
                entry = this._data.objects[value[objectHash]];
                delete this._data.objects[value[objectHash]];
                delete entry.value[objectHash];
            } else
                return false;
        } else {
            if (this._data.primitives[valueHash] instanceof SetEntry) {
                entry = this._data.primitives[valueHash];
                delete this._data.primitives[valueHash];
            } else {
                return false;
            }
        }

        if (entry.prev !== null && entry.next !== null) {
            entry.prev.next = entry.next;
            entry.next.prev = entry.prev;
            entry.next = null;
            entry.prev = null;
        } else if (entry.prev === null && entry.next !== null) {
            this._head = entry.next;
            entry.next.prev = null;
            entry.next = null;
        }
        if (entry.prev !== null && entry.next === null) {
            this._tail = entry.prev;
            entry.prev.next = null;
            entry.prev = null;
        } else {
            this._head = null;
            this._tail = null;
        }
        this._size--;
        return true;
    };

    Set.prototype.entries = function entries() {
        if (!isSet(this))
            throw new TypeError("Method Set.prototype.entries called on incompatible receiver " + this);
        return new SetIterator(this, 1);
    };

    Set.prototype.values = function values() {
        if (!isSet(this))
            throw new TypeError("Method Set.prototype.values called on incompatible receiver " + this);
        return new SetIterator(this, 2);
    };

    Set.prototype.keys = Set.prototype.values;

    Set.prototype[Symbol.iterator] = Set.prototype.values;

    defineProperty(Set.prototype, "size", {
        get: function size() {
            if (!isSet(this))
                throw new TypeError("Method Set.prototype.size called on incompatible receiver " + this);
            return this._size;
        },
        configurable: true
    });

    Set.prototype.forEach = function forEach(callback, thisArg) {
        if (!isSet(this))
            throw new TypeError("Method Set.prototype.forEach called on incompatible receiver " + this);
        if (!isCallable(callback))
            throw new TypeError(callback + " is not a function");
        var currentEntry = this._head;
        while (currentEntry !== null) {
            callback.call(thisArg, currentEntry.value, currentEntry.value, this);
            currentEntry = currentEntry.next;
        }
    };

    defineProperty(Set.prototype, Symbol.toStringTag.toString(), {
        value: "Set",
        configurable: true
    });

    var setupSetInternals = function (set) {
        defineProperties(set, {
            _isSet: {
                value: true
            },
            _head: {
                value: null,
                writable: true
            },
            _tail: {
                value: null,
                writable: true
            },
            _objectHash: {
                value: Symbol("Hash(set)")
            },
            _size: {
                value: 0,
                writable: true
            },
            _data: {
                value: create(null, {
                    primitives: {
                        value: create(null) /* [[Prototype]] must be null */
                    },
                    objects: {
                        value: []
                    }
                })
            }
        });
    };

    var checkSetInternals = function (set) {
        return set._isSet === true
            && (set._head === null || set._head instanceof SetEntry)
            && (set._tail === null || set._tail instanceof SetEntry)
            && ES6.isSymbol(set._objectHash)
            && typeof set._size === "number"
            && isObject(set._data)
            && isObject(set._data.primitives)
            && isArray(set._data.objects);
    };

    var SetEntry = function SetEntry(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    };

    var isSet = function (set) {
        return set instanceof Set && checkSetInternals(set);
    };

    var WeakMap = function WeakMap(iterable) {
        if (!(this instanceof WeakMap) || isWeakMap(this))
            throw new TypeError("Constructor WeakMap requires 'new'");
        setupWeakMapInternals(this);

        if (iterable !== null && iterable !== undefined) {
            ES6.forOf(iterable, function (entry) {
                if (!isObject(entry))
                    throw new TypeError("Iterator value " + entry + " is not an entry object");
                this.set(entry[0], entry[1]);
            }, this);
        }
    };

    var setupWeakMapInternals = function (weakMap) {
        defineProperties(weakMap, {
            _isWeakMap: {
                value: true
            },
            _objectHash: {
                value: Symbol("Hash(weakmap)")
            },
            _values: {
                value: []
            }
        });
    };

    defineProperty(WeakMap.prototype, Symbol.toStringTag.toString(), {
        value: "WeakMap",
        configurable: true
    });

    var checkWeakMapInternals = function (weakMap) {
        return weakMap._isWeakMap === true
            && ES6.isSymbol(weakMap._objectHash)
            && isArray(weakMap._values);
    };

    var isWeakMap = function (weakMap) {
        return weakMap instanceof WeakMap && checkWeakMapInternals(weakMap);
    };

    // WARNING: This method puts a link in the key object to reduce time complexity to O(1).
    // So, after weakMap.set(key, value) call, if the linker property of the key object is deleted
    // then weakMap.has(key) will return false.
    // Time complexity: O(1) for all cases(there is no worst case)
    // Space complexity is O(n) for all cases.
    WeakMap.prototype.set = function set(key, value) {
        if (!isWeakMap(this))
            throw new TypeError("Method WeakMap.prototype.set called on incompatible receiver " + this);
        // No symbol is allowed in WeakMap as key
        if (!isObject(key) || ES6.isSymbol(key))
            throw new TypeError("Invalid value used as weak map key");
        var objectHash = this._objectHash;
        if (typeof key[objectHash] === "number" && this._values.hasOwnProperty(key[objectHash])) {
            this._values[key[objectHash]] = value;
        } else {
            this._values.push(value);
            defineProperty(key, objectHash.toString(), {
                value: this._values.length - 1,
                configurable: true
            });
        }
        return this;
    };


    // Time complexity: O(1) for all cases(there is no worst case)
    // Space complexity is O(1)
    WeakMap.prototype.get = function get(key) {
        if (!isWeakMap(this))
            throw new TypeError("Method WeakMap.prototype.get called on incompatible receiver " + this);
        if (!isObject(key) || ES6.isSymbol(key))
            return;
        var objectHash = this._objectHash;
        if (typeof key[objectHash] === "number" && this._values.hasOwnProperty(key[objectHash]))
            return this._values[key[objectHash]];
    };

    // Time complexity: O(1) for all cases(there is no worst case)
    // Space complexity is O(1)
    WeakMap.prototype.has = function has(key) {
        if (!isWeakMap(this))
            throw new TypeError("Method WeakMap.prototype.has called on incompatible receiver " + this);
        if (!isObject(key) || ES6.isSymbol(key))
            return false;
        var objectHash = this._objectHash;
        return typeof key[objectHash] === "number" && this._values.hasOwnProperty(key[objectHash]);
    };

    // Time complexity: O(1) for all cases(there is no worst case)
    // Space complexity is O(1)
    WeakMap.prototype.delete = function (key) {
        if (!isWeakMap(this))
            throw new TypeError("Method WeakMap.prototype.delete called on incompatible receiver " + this);
        if (!isObject(key) || ES6.isSymbol(key))
            return false;
        var objectHash = this._objectHash;
        if (typeof key[objectHash] === "number" && this._values.hasOwnProperty(key[objectHash])) {
            delete this._values[key[objectHash]];
            delete key[objectHash];
            return true;
        } else
            return false;
    };

    var WeakSet = function WeakSet(iterable) {
        if (!(this instanceof WeakSet) || isWeakSet(this))
            throw new TypeError("Constructor WeakSet requires 'new'");
        setupWeakSetInternals(this);

        if (iterable !== null && iterable !== undefined) {
            ES6.forOf(iterable, function (entry) {
                this.add(entry);
            }, this);
        }
    };

    var setupWeakSetInternals = function (weakSet) {
        defineProperties(weakSet, {
            _isWeakSet: {
                value: true
            },
            _objectHash: {
                value: Symbol("Hash(weakset)")
            }
        });
    };

    var checkWeakSetInternals = function (weakSet) {
        return weakSet._isWeakSet === true
            && ES6.isSymbol(weakSet._objectHash);
    };

    var isWeakSet = function (weakSet) {
        return weakSet instanceof WeakSet && checkWeakSetInternals(weakSet);
    };

    // WARNING: This method puts a link in the value object to reduce time complexity to O(1).
    // So, after weakSet.add(value) call, if the linker property of the value object is deleted
    // then weakSet.has(value) will return false.
    // Time complexity: O(1) for all cases(there is no worst case)
    // Space complexity is O(n) for all cases.
    WeakSet.prototype.add = function add(value) {
        if (!isWeakSet(this))
            throw new TypeError("Method WeakSet.prototype.add called on incompatible receiver " + this);
        // No symbol is allowed in WeakSet as value
        if (!isObject(value) || ES6.isSymbol(value))
            throw new TypeError("Invalid value used in weak set");
        var objectHash = this._objectHash;
        if (value[objectHash] === objectHash.toString()) {
            // Just ignore if the value already exists
        } else {
            defineProperty(value, objectHash.toString(), {
                value: objectHash.toString(),
                configurable: true
            });
        }
        return this;
    };

    // Time complexity: O(1) for all cases(there is no worst case)
    // Space complexity is O(1) for all cases.
    WeakSet.prototype.has = function has(value) {
        if (!isWeakSet(this))
            throw new TypeError("Method WeakSet.prototype.has called on incompatible receiver " + this);
        if (!isObject(value) || ES6.isSymbol(value))
            return false;
        var objectHash = this._objectHash;
        return value[objectHash] === objectHash.toString();
    };

    // Time complexity: O(1) for all cases(there is no worst case)
    // Space complexity is O(1) for all cases.
    WeakSet.prototype.delete = function (value) {
        if (!isWeakSet(this))
            throw new TypeError("Method WeakSet.prototype.delete called on incompatible receiver " + this);
        if (!isObject(value) || ES6.isSymbol(value))
            return false;
        var objectHash = this._objectHash;
        if (value[objectHash] === objectHash.toString()) {
            delete value[objectHash];
            return true;
        } else
            return false;
    };

    defineProperty(WeakSet.prototype, Symbol.toStringTag.toString(), {
        value: "WeakSet",
        configurable: true
    });

    // export ES6 APIs and add all the patches to support Collections in ES5
    // If the running environment already supports ES6 then no patches will be applied,
    if (isES6Running())
        return ES6;
    else {
        defineProperties(ES6, {
            isMap: {
                value: isMap,
                writable: true,
                configurable: true
            },
            isSet: {
                value: isSet,
                writable: true,
                configurable: true
            },
            isWeakMap: {
                value: isWeakMap,
                writable: true,
                configurable: true
            },
            isWeakSet: {
                value: isWeakSet,
                writable: true,
                configurable: true
            }
        });

        defineProperty(global, "Map", {
            value: Map,
            writable: true,
            configurable: true
        });

        defineProperty(global, "Set", {
            value: Set,
            writable: true,
            configurable: true
        });

        defineProperty(global, "WeakMap", {
            value: WeakMap,
            writable: true,
            configurable: true
        });

        defineProperty(global, "WeakSet", {
            value: WeakSet,
            writable: true,
            configurable: true
        });
    }

    return ES6;
});




