export * from "./html-document/construct";
import HTMLDocument from "./html-document/construct";
export default HTMLDocument;
export {HTMLDocument};
import behave from "./html-document/behave";
behave(HTMLDocument);