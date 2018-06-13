import {protocol, satisfies} from "../types/protocol";
export const ISequential = protocol();
export const isSequential = satisfies(ISequential);