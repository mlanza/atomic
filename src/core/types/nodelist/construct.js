export default NodeList;

export function isNodeList(self){
  return self.constructor === NodeList;
}
