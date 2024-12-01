

// @ts-ignore
const error3 = new Error("Error message", { dee: "http error" });
// @ts-ignore
// error3.cause = 'bbbbb'
console.log(error3); // false