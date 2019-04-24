export default function Parses(parse, constraint){
  this.parse = parse;
  this.constraint = constraint;
}

export function parses(parse, constraint){
  return new Parses(parse, constraint);
}

Parses.prototype.toString = function(){
  return "invalid format";
}

export {Parses}