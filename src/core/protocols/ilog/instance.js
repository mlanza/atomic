import {protocol} from "../../types/protocol";
function log(self, message, level){
  const send = self && self[level || "log"];
  if (send) {
    send(message);
  } else {
    throw new Error(`No logging support for level ${level}.`);
  }
}
export const ILog = protocol({
  log: log
});
export default ILog;