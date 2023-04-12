import { Condition, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";

export const isCurrentTargetValid = new Condition((blackBoard: Blackboard) => {
	const target = blackBoard.getVariable("target") as BasePart;
	if (!target) {
		return false;
	}

	const handle = blackBoard.getVariable("handle") as BasePart;
	const distance = handle.Position.sub(target.Position).Magnitude;

	const maxDistance = blackBoard.getVariable("maxTargetDistance") as number;
	if (distance > maxDistance) {
		return false;
	}

	return true;
});
