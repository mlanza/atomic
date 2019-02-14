import IBlankable from "./instance";
export const blank = IBlankable.blank;
export function blot(self){
  return blank(self) ? null : self;
}