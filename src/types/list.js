export function List(head, tail){
  this.head = head;
  this.tail = tail;
}

export function cons(head, tail){
  return new List(head, tail || EMPTY);
}

export {List as default};