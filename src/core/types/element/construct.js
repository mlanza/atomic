import {IReduce, ICollection} from '../../protocols';

export default Element;

export function element(name, ...contents){
  return IReduce.reduce(contents, ICollection.conj, document.createElement(name));
}

export function isElement(self){
  return self instanceof Element;
}