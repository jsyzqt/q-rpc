const isError = (e: any) => {
    return e &&
        e.stack &&
        e.message &&
        typeof e.stack === 'string' &&
        typeof e.message === 'string';
};

export const serializationError = (e: any) => {
    let serializedError: string;
    if(e){
        if (isError(e)) {
            serializedError = JSON.stringify(e, Object.getOwnPropertyNames(e));
        } else if (typeof e === 'string') {
            serializedError = e;
        } else {
            serializedError = JSON.stringify(e);
        }
        return serializedError;
    }
}