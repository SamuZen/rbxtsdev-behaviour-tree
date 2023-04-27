import { BehaviourTree, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";
import { waitValidTargetAndRotate } from "shared/BehaviourTree/Behaviours/waitValidTargetAndRotate";
import { walkAround } from "shared/BehaviourTree/Behaviours/walkAround";

export class Mob {
	private behaviourTree: BehaviourTree;
	private handle: BasePart;

	constructor(handle: BasePart) {
		this.handle = handle;
		const blackBoard = new Blackboard();
		blackBoard.setVariable("handle", this.handle);
		blackBoard.setVariable("spawnPosition", this.handle.GetPivot().Position);

		blackBoard.setVariable("maxTargetDistance", 10);
		blackBoard.setVariable("wanderDistance", 30);
		blackBoard.setVariable("speed", 5);
		blackBoard.setVariable("waitTime", 1);

		//this.behaviourTree = new BehaviourTree(waitValidTargetAndRotate, blackBoard);
		this.behaviourTree = new BehaviourTree(walkAround, blackBoard);
	}

	public update() {
		this.behaviourTree.tick();
	}
}
