import { Condition } from "@rbxts/behaviour-tree";

export const CondHasBlackboardVariable = (variableName: string): Condition => {
	return new Condition((blackBoard) => {
		return blackBoard.getVariable(variableName) !== undefined;
	});
};

export const CondNoBlackboardVariable = (variableName: string): Condition => {
	return new Condition((blackBoard) => {
		return blackBoard.getVariable(variableName) === undefined;
	});
};
