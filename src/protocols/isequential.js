import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const ISequential = protocol({});
export const isSequential = partial(satisfies, ISequential);
export default ISequential;