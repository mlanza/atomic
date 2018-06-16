import {protocol, satisfies} from "../types/protocol";
function fold(self, error, okay){
  okay(self);
}
export const IFold = protocol({
  fold: fold
});
export const canFold = satisfies(IFold);