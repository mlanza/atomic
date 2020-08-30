import {protocol, each} from "atomic/core";
import {_ as v} from "param.macro";
export const IEmbeddable = protocol({
  embed: null
});
export function embeds(self, ...contents){
  each(IEmbeddable.embed(v, self), contents);
}