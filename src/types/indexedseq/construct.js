import EmptyList from "../emptylist";
import {ICounted} from '../../protocols';

export function IndexedSeq(seq, start){
  this.seq = seq;
  this.start = start;
}

export function indexedSeq(seq, start){
  return start < ICounted.count(seq) ? new IndexedSeq(seq, start) : EmptyList.EMPTY;
}

export default IndexedSeq;