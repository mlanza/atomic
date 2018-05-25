export * from "./objectselection/construct";
import ObjectSelection from "./objectselection/construct";
export default ObjectSelection;
import behave from "./objectselection/behave";
behave(ObjectSelection);

export function isObjectSelection(self){
  return self.constructor === ObjectSelection;
}