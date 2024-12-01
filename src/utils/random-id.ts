/**
 * https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
 */

export const getUniqueID = () =>{
    return String(Date.now())+Math.random().toString(36).replace(/[^a-z]+/g, '').substring(2, 10);
}