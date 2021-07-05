import * as _ from "atomic/core";
import {DocumentFragment, document} from "dom";
import {embed} from "../../protocols/iembeddable/concrete.js";
import {isHTMLDocument} from "../html-document/construct.js";

export const fragment = _.assume(isHTMLDocument, document, function fragment(document, ...contents){
  const frag = document.createDocumentFragment();
  _.each(embed(?, frag), contents);
  return frag;
});

DocumentFragment.create = fragment;

export function isDocumentFragment(self){
  return self && self instanceof DocumentFragment;
}
