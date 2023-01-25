import {protocol} from "../../types/protocol.js";
export const IRevertible = protocol({
  undo: null,
  redo: null,
  flush: null,
  crunch: null,
  undoable: null,
  redoable: null,
  flushable: null,
  crunchable: null,
  revision: null
});
