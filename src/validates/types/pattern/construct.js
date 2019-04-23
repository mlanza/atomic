export default function Pattern(regex, desc){
  this.regex = regex;
  this.desc = desc;
}

export function pattern(regex, desc){
  return new Pattern(regex, desc || "format");
}

Pattern.prototype.toString = function(){
  return `invalid ${this.desc}`;
}

export {Pattern}