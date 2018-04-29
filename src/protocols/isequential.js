import {protocol, satisfies} from "../protocol";
export const ISequential = protocol({});
export const isSequential = satisfies(ISequential);
export default ISequential;