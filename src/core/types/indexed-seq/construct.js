import {overload} from "../../core.js";
import {emptyList} from "../empty-list.js";
import * as p from "./protocols.js";

export function IndexedSeq(seq, start){
  this.seq = seq;
  this.start = start;
}

function indexedSeq1(seq){
  return indexedSeq2(seq, 0);
}

function indexedSeq2(seq, start){
  return start < p.count(seq) ? new IndexedSeq(seq, start) : emptyList();
}

export const indexedSeq = overload(null, indexedSeq1, indexedSeq2);

IndexedSeq.prototype[Symbol.toStringTag] = "IndexedSeq";
