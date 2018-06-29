import {constantly} from "../../core";
import Symbol from '../symbol/construct';

export default function EmptyList(){
}
EmptyList.prototype[Symbol.toStringTag] = "EmptyList";
EmptyList.EMPTY = new EmptyList();
EmptyList.from = constantly(EmptyList.EMPTY);
export {EmptyList};