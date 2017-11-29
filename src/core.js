export function overload(){
  var fs = arguments;
  return function(){
    var f = fs[arguments.length] || fs[fs.length - 1];
    return f.apply(this, arguments);
  }
}

export function identity(x){
  return x;
}

export function constantly(x){
  return function(){
    return x;
  }
}

export function partial(f){
  var applied = Array.prototype.slice.call(arguments, 1);
  return function(){
    return f.apply(this, applied.concat(Array.prototype.slice.call(arguments)));
  }
}