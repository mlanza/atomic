export * from "./htmldocument/construct";
import HTMLDocument from "./htmldocument/construct";
export default HTMLDocument;
export {HTMLDocument};
import behave from "./htmldocument/behave";
behave(HTMLDocument);