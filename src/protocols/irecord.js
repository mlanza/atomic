import {protocol, satisfies} from "../protocol";
export const IRecord = protocol({});
export const isRecord = satisfies(IRecord);
export default IRecord;