import {doto, overload, constantly} from "../../core";
import {specify} from "../../types/protocol/concrete";
import IConfigured from "./instance";

function config2(self, configuration){
  return doto(self,
    specify(IConfigured, {config: constantly(configuration)}));
}

export const config = overload(null, IConfigured.config, config2);
