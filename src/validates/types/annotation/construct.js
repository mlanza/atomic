export function Annotation(note, constraint) {
  this.note = note;
  this.constraint = constraint;
}

export function anno(note, constraint){
  return new Annotation(note, constraint);
}

Annotation.prototype[Symbol.toStringTag] = "Annotation";
