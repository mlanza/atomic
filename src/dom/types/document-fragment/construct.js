import * as _ from "atomic/core";
import {embed} from "../../protocols/iembeddable/concrete.js";
import {isHTMLDocument} from "../html-document/construct.js";

export const fragment = _.assume(isHTMLDocument, document, function fragment(document, ...contents){
  return _.doto(document.createDocumentFragment(),
    embed(?, contents));
});

