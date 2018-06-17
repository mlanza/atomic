import {overload, identity, constantly} from "../core";
import {IFunctor} from "../protocols/ifunctor";
import {reducing} from "../api/reduce";

export const fmap = overload(constantly(identity), IFunctor.fmap, reducing(IFunctor.fmap));