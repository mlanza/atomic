export * from "./nodelist/construct";
import NodeList from "./nodelist/construct";
export default NodeList;
export {NodeList};
import behave from "./nodelist/behave";
behave(NodeList);