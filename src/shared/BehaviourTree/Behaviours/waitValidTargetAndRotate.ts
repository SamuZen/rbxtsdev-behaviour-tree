import { Action, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";
import { waitForValidTarget } from "./waitForValidTarget";

const sequence = new Sequence();

sequence.addChild(waitForValidTarget);
sequence.addChild(
	new Action((blackBoard: Blackboard) => {
		const handle = blackBoard.getVariable("handle") as BasePart;
		handle.CFrame = handle.CFrame.mul(CFrame.Angles(0, 0.1, 0));
	}),
);

export { sequence as waitValidTargetAndRotate };
