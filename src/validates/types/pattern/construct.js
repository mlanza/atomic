export default function Pattern(regex, description){
  this.regex = regex;
  this.description = description;
}

export function pattern(regex, description){
  return new Pattern(regex, description || null);
}