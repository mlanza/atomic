export * from "./xml-document/construct";
import XMLDocument from "./xml-document/construct";
export default XMLDocument;
export {XMLDocument};
import behave from "./xml-document/behave";
behave(XMLDocument);