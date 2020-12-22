import {protocol, each} from "atomic/core";
export const IEmbeddable = protocol({
  embed: null
});
export function embeds(self, ...contents){
  each(IEmbeddable.embed(?, self), contents);
}