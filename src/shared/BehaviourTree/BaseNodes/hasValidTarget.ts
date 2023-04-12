import { Sequence } from "@rbxts/behaviour-tree";
import { hasCurrentTarget } from "../CoreNodes/hasCurrentTarget";
import { isCurrentTargetValid } from "../CoreNodes/isCurrentTargetValid";

const seq = new Sequence();
seq.addChild(hasCurrentTarget);
seq.addChild(isCurrentTargetValid);

export { seq as hasValidTarget };
