

const e = new Error('abc');
// const e = 'abcd';

const serializedError = JSON.stringify(e,
    Object.getOwnPropertyNames(e)
);


console.log(serializedError);


if (typeof JSON.parse(serializedError) === 'string') {
    console.log(serializedError)
} else {
    const deserializedError = Object.assign(new Error(),
        JSON.parse(serializedError)
    );

    console.log(deserializedError);
}

