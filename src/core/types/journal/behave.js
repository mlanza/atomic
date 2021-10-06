import {identity, overload, does, slice} from "../../core.js";
import {implement} from "../protocol.js";
import * as p from "../../protocols/concrete.js";
import {IRevertible, IAssociative, ILookup, IFunctor, IDeref} from "../../protocols.js";
import {Journal} from "./construct.js";
import {naming} from "../../protocols/inamable/concrete.js";
import Symbol from "symbol";

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
  return fmap(self, p.assoc(?, key, value))
}

function contains(self, key){
  return p.contains(p.nth(self.history, self.pos), key);
}

function lookup(self, key){
  return p.get(p.nth(self.history, self.pos), key);
}

function deref(self){
  return self.state;
}

function fmap(self, f){
  const revised = f(self.state);
  return new Journal(0, self.max, p.prepend(self.pos ? slice(self.history, self.pos) : self.history, revised), revised);
}

export default does(
  naming(?, Symbol("Journal")),
  implement(IDeref, {deref}),
  implement(IFunctor, {fmap}),
  implement(ILookup, {lookup}),
  implement(IAssociative, {assoc, contains}),
  implement(IRevertible, {undo, redo, flush, undoable, redoable}));
