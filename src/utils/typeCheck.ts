


export type VariableCheckUnitType = {
    name: string,
    type: 'string' | 'number' | 'array',
    checked?: boolean
}

export const checkVariableType = (data: any, checkList:VariableCheckUnitType[]) => {

    const checkListNames = checkList.map(v => v.name);

    let toDeleteUnacceptVariableNames: string[] = [];
    if (data) {
        for (let i in data) {
            const tI = checkListNames.findIndex(v => v === i);
            if (tI > -1) {
                const tType = checkList[tI].type;
                if (tType === 'array' && Array.isArray(data[i])) {
                    checkList[tI]['checked'] = true;
                } else if (typeof data[i] === tType) {
                    checkList[tI]['checked'] = true;
                } else {
                    throw new Error(`Request input variable type check error. Type of '${i}' shoud be '${tType}'.`);
                }
            } else {
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
    } else {
        throw new Error(`Request input data is undefined.`);
    }
    return true;
}