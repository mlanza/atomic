import * as _ from "atomic/core";
import {subject} from "../subject/construct.js";

export function Cell(state, observer, validate){
  this.state = state;
  this.observer = observer;
  this.validate = validate;
}

Cell.prototype[Symbol.toStringTag] = "Cell";

function cell0(){
  return cell1(null);
}

function cell1(init){
  return cell2(init, subject());
}

function cell2(init, observer){
  return cell3(init, observer, null);
}

function cell3(init, observer, validate){
  return new Cell(init, observer, validate);
}

export const cell = _.overload(cell0, cell1, cell2, cell3);
