const failures = {
  count: 0,
  subscribers: []
};

export function failed(callback){
  failures.subscribers.push(callback);
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

export function test(title, callback){
  const count = counter();

  function assert(pass, re = null){
    const num = count();
    const reason = re ? ['—', re] : [];
    const test = [title, num, ...reason];
    try {
      if (!pass) {
        fail();
        throw new Error("Failed!");
      }
      console.info.apply(this, test);
    } catch (ex) {
      console.error.apply(this, [...test, ex]);
    }
  }

  function throws(f, re = null){
    try {
      f();
      assert(false, re); //shouldn't get here
    } catch (ex) {
      assert(true, re); //should get here
    }
  }

  callback({assert, throws});
}

export default test;
