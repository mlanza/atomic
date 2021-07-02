import {HTMLSelectElement} from "dom";
import behave from "./html-select-element/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {HTMLSelectElement: behave});
behave(HTMLSelectElement);
