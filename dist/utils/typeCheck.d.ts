export type VariableCheckUnitType = {
    name: string;
    type: 'string' | 'number' | 'array';
    checked?: boolean;
};
export declare const checkVariableType: (data: any, checkList: VariableCheckUnitType[]) => boolean;
//# sourceMappingURL=typeCheck.d.ts.map