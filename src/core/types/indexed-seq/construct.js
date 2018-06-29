import {overload} from '../../core';
import EmptyList from "../empty-list";
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
  return start < ICounted.count(seq) ? new IndexedSeq(seq, start) : EmptyList.EMPTY;
}

export const indexedSeq = overload(null, indexedSeq1, indexedSeq2);

function from({seq, start}){
  return indexedSeq(seq, start);
}

IndexedSeq.prototype[Symbol.toStringTag] = "IndexedSeq";
IndexedSeq.from = from;

export default IndexedSeq;