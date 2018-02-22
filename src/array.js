const {
    defineProperty,
    freeze,
} = Object;

// Preventing poisoning of Array constructor and its prototype
defineProperty(global, 'Array', { configurable: false, writable: false });
freeze(Array);
freeze(Array.prototype); // do we really need this?