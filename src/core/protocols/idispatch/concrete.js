import IDispatch from "./instance";
export const dispatch = IDispatch.dispatch;
export function dispatches(self, command){
  return function(){
    return dispatch(self, command);
  }
}