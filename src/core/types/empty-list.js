export * from "./empty-list/construct";
import {EmptyList} from "./empty-list/construct";
import {behaveAsEmptyList} from "./empty-list/behave";
behaveAsEmptyList(EmptyList);