import ITemplate from "./instance";
export const fill = ITemplate.fill;
export function template(self, ...args){
  return fill(self, args);
}