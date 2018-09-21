export * from "./node-list/construct";
import NodeList from "./node-list/construct";
export default NodeList;
export {NodeList};
import behave from "./node-list/behave";
behave(NodeList);