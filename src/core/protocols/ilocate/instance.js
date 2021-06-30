import {protocol} from "../../types/protocol.js";
import {query} from "../../protocols/iqueryable/concrete.js";
import {first} from "../../protocols/iseq/concrete.js";

function locate(self, selector){
  return first(query(self, selector));
}

export const ILocate = protocol({locate});
