import { Action, NodeStatus } from "@rbxts/behaviour-tree";

export const ActionSetBlackboardVariable = (variableName: string, value: unknown): Action => {
	return new Action((blackBoard) => {
		blackBoard.setVariable(variableName, value);
		return NodeStatus.SUCCESS;
	});
};

export const ActionSetBlackboardVariableFunc = (variableName: string, func: () => unknown): Action => {
	return new Action((blackBoard) => {
		blackBoard.setVariable(variableName, func());
		return NodeStatus.SUCCESS;
	});
};