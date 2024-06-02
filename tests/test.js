const failures = {
  count: 0,
  subscribers: []
};
const extenders = [];

export function failed(callback){
  failures.subscribers.push(callback);
}

export function adding(callback){
  extenders.push(callback);
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

  const equals = compare((a, b) => a === b, {str: (a) => a});
  const notEquals = compare((a, b) => a !== b, {str: (a) => a});

  function throws(f, re = "an exception"){
    try {
      f();
      assert(false, re); //shouldn't get here
    } catch (ex) {
      assert(true, re); //should get here
    }
  }

  const tools = {assert, equals, notEquals, check, compare, throws};
  const ext = options.extend || function identity(a){ return a; };
  for(const extend of extenders){
    const additions = ext(extend(tools) || {});
    Object.assign(tools, additions);
  }

  callback(tools);
}

export default test;
