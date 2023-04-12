import { BehaviourTree, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";
import { RotatorySequence } from "shared/BehaviourTree/RotatorySequence";

export class Mob {
	private behaviourTree: BehaviourTree;
	private handle: BasePart;

	constructor(handle: BasePart) {
		this.handle = handle;
		const blackBoard = new Blackboard();
		blackBoard.setVariable("handle", this.handle);
		this.behaviourTree = new BehaviourTree(RotatorySequence, blackBoard);
	}

	public update() {
		this.behaviourTree.tick();
	}
}
