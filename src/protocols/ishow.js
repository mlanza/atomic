import {protocol, satisfies} from "../protocol";
import {partial} from "../core";

export const IShow = protocol({
  show: null
});

export const show = IShow.show;
export const isShow = partial(satisfies, IShow);
export default IShow;