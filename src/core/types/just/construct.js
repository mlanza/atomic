export default function Just(value){
  this.value = value;
}

export function just(value){
  return new Just(value);
}

export function maybe(x){
  return x == null ? x : just(x);
}