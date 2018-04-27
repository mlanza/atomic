import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const ICounted = protocol({count: null});
export const count = ICounted.count;
export const isCounted = partial(satisfies, ICounted);
export default ICounted;