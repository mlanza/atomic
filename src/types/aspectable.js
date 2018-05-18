export * from "./aspectable/construct";
import Aspectable, {provideConstructor} from "./aspectable/construct";
export default Aspectable;
import provideBehavior from "./aspectable/behave";

export function provideAspectable(pipeline, compile){
  provideBehavior(pipeline, compile)(Aspectable);
  return provideConstructor(pipeline);
}