import { Action, NodeStatus } from "@rbxts/behaviour-tree";

export const ActionWarnReturn = (msg: string, status: NodeStatus): Action => {
	return new Action((blackBoard) => {
		warn(msg);
		return status;
	});
};
