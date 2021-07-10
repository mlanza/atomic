import {HTMLInputElement} from "dom";
import behave from "./html-input-element/behave.js";
import {behaviors} from "../behaviors.js";
Object.assign(behaviors, {HTMLInputElement: behave});
behave(HTMLInputElement);
