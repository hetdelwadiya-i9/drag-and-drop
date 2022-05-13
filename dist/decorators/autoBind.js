export function autoBind(_, _2, descriptor) {
    const method = descriptor.value;
    const ajtDescriptor = {
        configurable: true,
        get() {
            const bound = method.bind(this);
            return bound;
        }
    };
    return ajtDescriptor;
}
//# sourceMappingURL=autoBind.js.map