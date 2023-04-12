import { BehaviourTree, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";
import { waitValidTargetAndRotate } from "shared/BehaviourTree/Behaviours/waitValidTargetAndRotate";

export class Mob {
	private behaviourTree: BehaviourTree;
	private handle: BasePart;

	constructor(handle: BasePart) {
		this.handle = handle;
		const blackBoard = new Blackboard();
		blackBoard.setVariable("handle", this.handle);
		blackBoard.setVariable("maxTargetDistance", 10);

		this.behaviourTree = new BehaviourTree(waitValidTargetAndRotate, blackBoard);
	}

	public update() {
		this.behaviourTree.tick();
	}
}
