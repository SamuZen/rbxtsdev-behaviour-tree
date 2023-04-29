import { Action, NodeStatus } from "@rbxts/behaviour-tree";

export const ActionSetBlackboardVariable = (variableName: string, value: unknown): Action => {
	return new Action((blackBoard) => {
		blackBoard.setVariable(variableName, value);
		return NodeStatus.SUCCESS;
	});
};
