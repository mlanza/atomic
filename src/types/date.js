export * from "./date/construct";
import Date from "./date/construct";
export default Date;
import behave from "./date/behave";
behave(Date);

function ceil(dt){
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23, 59, 59, 999);
}

function floor(dt){
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}
