export default function LazySeq(head, tail){
  this.head = head;
  this.tail = tail;
}

export function lazySeq(head, tail){
  if (typeof tail !== "function") {
    throw new Error("LazySeq tail is not a thunk.");
  }
  return new LazySeq(head, tail);
}

export {LazySeq};