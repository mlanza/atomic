export function RevSeq(coll, idx){
  this.coll = coll;
  this.idx = idx;
}

export function revSeq(coll, idx){
  return new RevSeq(coll, idx);
}

export default RevSeq;