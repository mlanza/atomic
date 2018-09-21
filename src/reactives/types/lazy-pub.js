export * from "./lazy-pub/construct";
export * from "./lazy-pub/concrete";
import LazyPub from "./lazy-pub/construct";
export default LazyPub;
import behave from "./lazy-pub/behave";
behave(LazyPub);