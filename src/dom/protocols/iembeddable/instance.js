import * as _ from "atomic/core";
export const IEmbeddable = _.protocol({
  embed: null
});
export function embeds(self, ...contents){
  _.each(IEmbeddable.embed(?, self), contents);
}
