export function When(year, month, day, hour, minute, second, millisecond){
  this.attrs = {year, month, day, hour, minute, second, millisecond};
}

export function when(year, month, day, hour, minute, second, millisecond){
  return new When(year, month, day, hour, minute, second, millisecond);
}

export function year(n){
  return when(n);
}

export function month(n){
  return when(null, n);
}

export function day(n){
  return when(null, null, n);
}

export function hour(n){
  return when(null, null, null, n);
}

export function minute(n){
  return when(null, null, null, null, n);
}

export function second(n){
  return when(null, null, null, null, null, n);
}

export function millisecond(n){
  return when(null, null, null, null, null, null, n);
}

export function isWhen(self){
  return self.constructor === When;
}

export default When;