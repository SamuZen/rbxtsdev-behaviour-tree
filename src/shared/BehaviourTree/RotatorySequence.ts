import { Action, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";

const RotatorySequence = new Sequence();

RotatorySequence.addChild(new Action(() => print("Running RotatorySequence")));
RotatorySequence.addChild(
	new Action((blackBoard: Blackboard) => {
		const handle = blackBoard.getVariable("handle") as BasePart;
		handle.CFrame = handle.CFrame.mul(CFrame.Angles(0, 0.1, 0));
		print("Rotating!");
	}),
);

export { RotatorySequence };
