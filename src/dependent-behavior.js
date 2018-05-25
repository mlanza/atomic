import {Pipeline, Multimethod} from "./types";
import behavePipeline from "./types/pipeline/behave-depend";
import behaveMultimethod from "./types/multimethod/behave-depend";

behavePipeline(Pipeline);
behaveMultimethod(Multimethod);