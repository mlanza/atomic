import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const IEmptyableCollection = protocol({
  empty: null
});

export const empty = IEmptyableCollection.empty;
export const isEmptyableCollection = partial(satisfies, IEmptyableCollection);
export default IEmptyableCollection;