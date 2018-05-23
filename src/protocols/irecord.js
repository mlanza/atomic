import {protocol, satisfies} from "../types/protocol";
export const IRecord = protocol({});
export const isRecord = satisfies(IRecord);
export default IRecord;