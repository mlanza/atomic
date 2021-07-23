import {identity, overload, does} from "../../core.js";
import {implement} from "../protocol.js";
import * as p from "../../protocols/concrete.js";
import {IRevertible, IAssociative, ILookup} from "../../protocols.js";
import {Journal} from "./construct.js";

function undo(self){
  return undoable(self) ? new Journal(self.pos + 1, self.max, self.history, self.state) : self;
}

function redo(self){
  return redoable(self) ? new Journal(self.pos - 1, self.max, self.history, self.state) : self;
}

function flush(self){
  return new Journal(0, self.max, [self.state], self.state);
}

function undoable(self){
  return self.pos < p.count(self.history);
}

function redoable(self){
  return self.pos > 0;
}

function assoc(self, key, value){
  const revised = p.assoc(self.state, key, value);
  return new Journal(0, self.max, p.prepend(self.history, revised), revised);
}

function contains(self, key){
  return p.contains(p.nth(self.history, self.pos), key);
}

function lookup(self, key){
  return p.get(p.nth(self.history, self.pos), key);
}

export default does(
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(IRevertible, {undo, redo, flush, undoable, redoable}));
