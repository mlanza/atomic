export default function Fluent(value){
  this.value = value;
}

export function fluent(value){
  return new Fluent(value);
}