import {protocol, satisfies} from "../types/protocol";
export const IDescriptive = protocol();
export const isDescriptive = satisfies(IDescriptive);