import * as _ from "./dom";
import {curry, overload, subj, obj} from "./core";
export {tag, frag, tags, parent, contents, children, descendants, ancestors, parents, prevSibling, prevSiblings, nextSibling, nextSiblings, siblings, toggle, hide, show} from "./dom";

export const sel = obj(_.sel);
export const closest = subj(_.closest);
export const prop = subj(_.prop);
export const value = subj(_.value);
export const text = subj(_.text);
export const html = subj(_.html);