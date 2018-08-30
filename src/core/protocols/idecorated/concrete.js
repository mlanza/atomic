import {doto, constantly} from "../../core";
import {specify} from "../../types/protocol/concrete";
import IDecorated from "./instance";

//designed primarily for reflection during development

export const undecorate = IDecorated.undecorate;

export function decorate(what, how){ //makes a decoration retractable
  const undecorate = constantly(what);
  return doto(how(what), specify(IDecorated, {undecorate}));
}
