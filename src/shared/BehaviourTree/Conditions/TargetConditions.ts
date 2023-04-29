import { Condition } from "@rbxts/behaviour-tree";

export const CondNoTarget = (): Condition => {
	return new Condition((blackBoard) => {
		return blackBoard.getVariable("target") === undefined;
	});
};

export const CondHasTarget = (): Condition => {
	return new Condition((blackBoard) => {
		return blackBoard.getVariable("target") !== undefined;
	});
};
