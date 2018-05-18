export * from "./pipeline/construct";
import Pipeline from "./pipeline/construct";
export default Pipeline;
import provideBehavior from "./pipeline/behave";
export function providePipeline(piped){
  provideBehavior(piped)(Pipeline);
}