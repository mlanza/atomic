const failures = {
  count: 0,
  subscribers: []
};
const extenders = [];

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

export function test(title, callback, options = {}){
  const count = counter();

  //everything must go through `assert`
  function assert(pass, re = "expected"){
    const num = count();
    const reason = re ? ['—', re] : [];
    const test = [title, num, ...reason];
    try {
      if (!pass) {
        fail();
        throw new Error(`Other than ${re}`);
      }
      console.info.apply(this, test);
    } catch (ex) {
      console.error.apply(this, [...test, ex]);
    }
  }

  function check(f, {str = JSON.stringify, reason = null} = {}){
    return function(obj, re = reason){
      assert(f(obj), re, str(obj));
    }
  }

  function compare(eq, {str = JSON.stringify, reason = null} = {}){
    return function(a, b, re = reason){
      assert(eq(a, b), re, `${str(a)} !== ${str(b)}`);
    }
  }

  function compareAll(eq, {str = JSON.stringify, reason = null} = {}){
    return function(xs, re = reason){
      assert(eq(...xs), re, str(xs));
    }
  }

  const equals = compare((a, b) => a === b);
  const notEquals = compare((a, b) => a !== b);

  function throws(f, re = "an exception"){
    try {
      f();
      assert(false, re); //shouldn't get here
    } catch (ex) {
      assert(true, re); //should get here
    }
  }

  const f = pipe(...[...extenders, options.tests || identity]);

  callback(f({assert, equals, notEquals, check, compare, compareAll, throws}));
}

export default test;
