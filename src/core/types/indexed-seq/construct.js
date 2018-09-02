import {overload} from '../../core';
import {emptyList} from "../empty-list";
import Symbol from '../symbol/construct';
import {ICounted} from '../../protocols';

export function IndexedSeq(seq, start){
  this.seq = seq;
  this.start = start;
}

function indexedSeq1(seq){
  return indexedSeq2(seq, 0);
}

function indexedSeq2(seq, start){
  return start < ICounted.count(seq) ? new IndexedSeq(seq, start) : emptyList();
}

export const indexedSeq = overload(null, indexedSeq1, indexedSeq2);

function from({seq, start}){
  return indexedSeq(seq, start);
}

IndexedSeq.prototype[Symbol.toStringTag] = "IndexedSeq";
IndexedSeq.create = indexedSeq;
IndexedSeq.from = from;

export default IndexedSeq;