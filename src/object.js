const {
    defineProperty,
    defineProperties,
    setPrototypeOf,
    create,
    freeze,
    keys,
    assign,
    getOwnPropertySymbols,
    getOwnPropertyNames,
} = Object;

const { isArray, prototype: ArrayProto } = Array;

function emptyObj(obj) {
    return obj && getOwnPropertyNames(obj).length === 0 && getOwnPropertySymbols(target) === 0;
}

function isIndexable(key) {
    key = key + '';
    return parseInt(key, 10) + '' === key;
}

function normalizeArrayDescriptor(descriptor) {
    if (descriptor !== null && typeof descriptor === 'object' && isIndexable(name)) {
        descriptor = assign({}, descriptor); // protecting against shape-shifting descriptors
        if (descriptor.get || descriptor.set) {
            throw new Error(); // invalid operation: you can't define properties with this descriptor in an array
        }
    }
    return descriptor;
}

Object.defineProperties = function (obj, descriptors) {
    // restrict this to an array with an indexable name and a descriptor with get/set
    if (isArray(obj) && descriptors !== null && typeof descriptor === 'object') {
        descriptors = assign({}, descriptors);
        const names = keys(descriptors);
        for (let i = 0, len = names.length; i < len; i += 1) {
            descriptors[names[i]] = normalizeArrayDescriptor(descriptors[names[i]]);
        }
    }
    return defineProperties.call(obj, descriptors);
}

Object.defineProperty = Reflect.defineProperty = function (obj, name, descriptor) {
    // restrict this to an array with an indexable name and a descriptor with get/set
    if (isArray(obj)) {
        descriptor = normalizeArrayDescriptor(descriptor);
    }
    return defineProperty.call(obj, name, descriptor);
}

// TODO: what about __proto__?
Object.setPrototypeOf = Reflect.setPrototypeOf = function (obj, proto) {
    if (proto === ArrayProto && !emptyObj(obj)) {
        throw new Error(); // invalid operation: reset the proto to Array.prototype on non-empty objects is not possible
    }
    return setPrototypeOf(obj, proto);
}

Object.create = Reflect.create = function (proto, descriptor) {
    if (proto === ArrayProto && !emptyObj(descriptor)) {
        throw new Error(); // invalid operation: creating a new object with prototype Array.prototype cannot specify descriptors
    }
    return create(proto, descriptor);
}

// Preventing poisoning of Object constructor and its prototype
defineProperty(global, 'Object', { configurable: false, writable: false });
freeze(Object);
freeze(Object.prototype); // do we really need this?