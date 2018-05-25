export * from "./classification/construct";
import Classification from "./classification/construct";
export default classification;

export function isClassification(self){
  return self.constructor === Classification;
}