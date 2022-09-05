import {protocol} from "../../types/protocol.js";
export const IRevertible = protocol({
  undo: null,
  redo: null,
  flush: null,
  undoable: null,
  redoable: null,
  revision: null
});
