export * from "./aspectable/construct";
import Aspectable, {provideConstructor} from "./aspectable/construct";
export default Aspectable;
import provideBehavior from "./aspectable/behave";

export function provideAspectable(pipeline, compile, update){
  provideBehavior(pipeline, compile, update)(Aspectable);
  return provideConstructor(pipeline);
}