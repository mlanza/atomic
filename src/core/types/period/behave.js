import {constantly, effect, identity} from '../../core';
import {implement} from '../protocol';
import {IArray, ISteppable, ISequential, ICollection, IComparable, INext, IEquiv, IReduce, IKVReduce, ISeqable, IShow, IFind, ICounted, IAssociative, IEmptyableCollection, ILookup, ISeq, IInclusive} from '../../protocols';
import {reduced, unreduced, isReduced} from '../reduced';
import {lazySeq} from '../lazyseq';
import behave from '../range/behave';

export default behave;