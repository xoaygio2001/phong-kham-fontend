import EventEmitter from 'events';
import { execPath } from 'process';

const _emitter = new EventEmitter();
_emitter.setMaxListeners(0); // unlimit lister

export const emitter = _emitter;
