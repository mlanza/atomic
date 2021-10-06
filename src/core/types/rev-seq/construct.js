import Symbol from "symbol";

export function RevSeq(coll, idx){
  this.coll = coll;
  this.idx = idx;
}

RevSeq.prototype[Symbol.toStringTag] = "RevSeq";

export function revSeq(coll, idx){
  return new RevSeq(coll, idx);
}
