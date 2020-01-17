function compose(...fns) {
    return fns.reduceRight((f1, f2) => {
        return (...args) => {
            return f2(f1(...args));
        };
    });
}

export {
    compose,
};
