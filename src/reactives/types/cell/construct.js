import {overload} from "atomic/core";
import {broadcast} from "../broadcast/construct";

export default function Cell(state, observer, validate){
  this.state = state;
  this.observer = observer;
  this.validate = validate;
}

function cell0(){
  return cell1(null);
}

function cell1(init){
  return cell2(init, broadcast());
}

function cell2(init, observer){
  return cell3(init, observer, null);
}

function cell3(init, observer, validate){
  return new Cell(init, observer, validate);
}

export const cell = overload(cell0, cell1, cell2, cell3);