import {partial, reduce, overload, reversed, identity} from "./core";

function piping1(reducer){
  return partial(pipingN, reducer);
}

function pipingN(reducer, f, ...fs){
  return function(init, ...args){
    return reduce(fs, reducer, reducer(init, function(memo){
      return f.apply(this, [memo].concat(args));
    }));
  }
}

export const piping = overload(null, piping1, pipingN);

function chaining1(reducer){
  return partial(chainingN, reducer);
}

function chainingN(reducer, init, ...fs){
  return reduce(fs, reducer, init);
}

export const chaining = overload(null, chaining1, chainingN);

function composeReducer2(r1, r2){
  return function(memo, f){
    return r2(memo, function(memo){
      return r1(memo, f);
    });
  }
}

function composeReducerN(r1, r2, ...rs){
  const r = composeReducer2(r1, r2);
  return rs.length ? composeReducerN.apply(this, [r].concat(rs)) : r;
}

export const composeReducer = overload(null, identity, composeReducer2, composeReducerN);

function identityReducer(memo, f){
  return f(memo);
}

function someReducer(memo, f){
  return isNil(memo) || isBlank(memo) ? new Reduced(null) : f(memo);
}

function errorReducer(memo, f){
  if (memo instanceof Error) {
    return new Reduced(memo);
  }
  try {
    return f(memo);
  } catch (ex) {
    return ex;
  }
}

function pipe2(a, b){
  return function(){
    return b(a.apply(this, arguments));
  }
}

function pipe3(a, b, c){
  return function(){
    return c(b(a.apply(this, arguments)));
  }
}

function pipe4(a, b, c, d){
  return function(){
    return d(c(b(a.apply(this, arguments))));
  }
}

export const pipe   = overload(null, identity, pipe2, pipe3, pipe4, piping(identityReducer));
export const opt    = piping(someReducer);
export const comp   = reversed(pipe);
export const chain  = chaining(identityReducer);
export const maybe  = chaining(someReducer);
export const handle = chaining(errorReducer);