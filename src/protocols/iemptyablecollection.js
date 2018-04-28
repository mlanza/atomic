import {protocol, satisfies} from "../protocol";
export const IEmptyableCollection = protocol({
  empty: null
});
export const empty = IEmptyableCollection.empty;
export const isEmptyableCollection = satisfies(IEmptyableCollection);
export default IEmptyableCollection;