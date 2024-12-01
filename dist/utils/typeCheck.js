"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVariableType = void 0;
const checkVariableType = (data, checkList) => {
    const checkListNames = checkList.map(v => v.name);
    let toDeleteUnacceptVariableNames = [];
    if (data) {
        for (let i in data) {
            const tI = checkListNames.findIndex(v => v === i);
            if (tI > -1) {
                const tType = checkList[tI].type;
                if (tType === 'array' && Array.isArray(data[i])) {
                    checkList[tI]['checked'] = true;
                }
                else if (typeof data[i] === tType) {
                    checkList[tI]['checked'] = true;
                }
                else {
                    throw new Error(`Request input variable type check error. Type of '${i}' shoud be '${tType}'.`);
                }
            }
            else {
                toDeleteUnacceptVariableNames.push(i);
            }
        }
        if (toDeleteUnacceptVariableNames.length > 0) {
            for (let j in toDeleteUnacceptVariableNames) {
                // @ts-ignore
                delete data[j];
            }
            throw new Error(`Unexcept variable in request input, which are ${JSON.stringify(toDeleteUnacceptVariableNames)}`);
        }
        for (let k in checkList) {
            if (!checkList[k].checked) {
                throw new Error(`Request input variable type check error. Type of '${checkList[k].name}' unfound'.`);
            }
        }
    }
    else {
        throw new Error(`Request input data is undefined.`);
    }
    return true;
};
exports.checkVariableType = checkVariableType;
//# sourceMappingURL=typeCheck.js.map