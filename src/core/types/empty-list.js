export * from "./empty-list/construct.js";
import {EmptyList} from "./empty-list/construct.js";
import {behaveAsEmptyList} from "./empty-list/behave.js";
behaveAsEmptyList(EmptyList);