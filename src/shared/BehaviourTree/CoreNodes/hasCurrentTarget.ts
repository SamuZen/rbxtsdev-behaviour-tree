import { Condition, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";

export const hasCurrentTarget = new Condition((blackBoard: Blackboard) => {
	const target = blackBoard.getVariable("target") as BasePart;
	if (target) {
		return true;
	}
	return false;
});
