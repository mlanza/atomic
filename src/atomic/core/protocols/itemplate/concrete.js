import {ITemplate} from "./instance.js";
export const fill = ITemplate.fill;
export function template(self, ...args){
  return fill(self, args);
}