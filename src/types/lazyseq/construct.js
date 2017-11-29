export function LazySeq(head, tail){
  this.head = head;
  this.tail = tail;
}

export function lazySeq(head, tail){
  return new LazySeq(head, tail);
}

export default LazySeq;