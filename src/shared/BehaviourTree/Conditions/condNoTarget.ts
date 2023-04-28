import { Condition, NodeStatus, Sequence } from "@rbxts/behaviour-tree";
import { hasCurrentTarget } from "../CoreNodes/hasCurrentTarget";
import { isCurrentTargetValid } from "../CoreNodes/isCurrentTargetValid";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";

export const condNoTarget = new Condition((blackBoard: Blackboard) => {
	const seq = new Sequence();
	seq.addChild(hasCurrentTarget);
	seq.addChild(isCurrentTargetValid);
	seq.tick(blackBoard);
	return seq.status !== NodeStatus.SUCCESS;
});
