import {protocol} from "atomic/core";
export const ITimeTraveler = protocol({
  undo: null,
  redo: null,
  flush: null,
  undoable: null,
  redoable: null
});