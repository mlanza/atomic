const failures = {
  count: 0,
  subscribers: []
};
const extenders = [];
const params = new URLSearchParams(location.search);
const selectTitle = params.get("title");

function pipe(f, ...fs){
  return function(...args){
    let result = f(...args);
    for(const f of fs){
      result = f(result);
    }
    return result;
  }
}

function identity(obj){
  return obj;
}

function fail(){
  failures.count++;
  for(const callback of failures.subscribers){
    callback(failures.count);
  }
}

function counter(start = 1){
  let c = start;
  return function(){
    return c++;
  }
}

export function failed(callback){
  failures.subscribers.push(callback);
}

export function tests(callback){
  extenders.push(callback);
}

function noop(){
}

export function test(title, callback, options = {}){
  if (selectTitle && !title.includes(selectTitle)) {
    return;
  }

  const count = counter();

  //everything must go through `assert`
  function assert(pass, expect = null, explain = noop){
    const num = count();
    const reason = expect ? ['—', expect] : [];
    const test = [title, num, ...reason];
    try {
      if (!pass) {
        fail();
        throw new Error(expect ? `Expected: ${expect}` : "Failed!");
      }
      console.info.apply(this, test);
    } catch (ex) {
      console.error.apply(this, [...test, ex, explain()]);
    }
  }

  function check(f, options = {}){
    const {str = JSON.stringify} = options;
    return function(obj, expect = options.expect){
      assert(f(obj), expect, () => str(obj));
    }
  }

  function compare(eq, options = {}){
    const {str = JSON.stringify} = options;
    return function(a, b, expect = options.expect){
      assert(eq(a, b), expect, () => `${str(a)} !== ${str(b)}`);
    }
  }

  function compareAll(eq, options = {}){
    const {str = JSON.stringify} = options;
    return function(xs, expect = options.expect){
      assert(eq(...xs), expect, () => str(xs));
    }
  }

  const equals = compare((a, b) => a === b);
  const notEquals = compare((a, b) => a !== b);

  function throws(f, expect = "must throw"){
    try {
      f();
      assert(false, expect); //shouldn't get here
    } catch (ex) {
      assert(true, expect); //should get here
    }
  }

  console.log(`${location.href}?title=${encodeURIComponent(title)}`);

  const f = pipe(...[...extenders, options.tests || identity]);
  callback(f({assert, equals, notEquals, check, compare, compareAll, throws}));
}

export default test;
