import { Action, BehaviourTree, Condition, Selector, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";
import { findNewTarget } from "shared/BehaviourTree/BaseNodes/findNewTarget";
import { lookForValidTarget } from "shared/BehaviourTree/Behaviours/waitForValidTarget";
import { waitValidTargetAndRotate } from "shared/BehaviourTree/Behaviours/waitValidTargetAndRotate";
import { walkAround } from "shared/BehaviourTree/Behaviours/walkAround";
import { walkToTarget } from "shared/BehaviourTree/Behaviours/walkToTarget";
import { condHasTarget } from "shared/BehaviourTree/Conditions/condHasTarget";
import { condNoTarget } from "shared/BehaviourTree/Conditions/condNoTarget";
import { isCurrentTargetValid } from "shared/BehaviourTree/CoreNodes/isCurrentTargetValid";

export class Mob {
	private behaviourTree: BehaviourTree;
	private handle: BasePart;

	constructor(handle: BasePart) {
		this.handle = handle;
		const blackBoard = new Blackboard();
		blackBoard.setVariable("handle", this.handle);
		blackBoard.setVariable("spawnPosition", this.handle.GetPivot().Position);

		blackBoard.setVariable("maxTargetDistance", 10);
		blackBoard.setVariable("wanderDistance", 20);
		blackBoard.setVariable("speed", 0.2);
		blackBoard.setVariable("waitTime", 1);

		//this.behaviourTree = new BehaviourTree(waitValidTargetAndRotate, blackBoard);
		const root = new Selector();

		const selector = new Selector().addCondition(condNoTarget);
		selector.addChild(findNewTarget);
		selector.addChild(walkAround);
		root.addChild(selector);

		const sequence = new Sequence().addCondition(condHasTarget);
		sequence.addChild(isCurrentTargetValid);
		sequence.addChild(walkToTarget);
		root.addChild(sequence);

		this.behaviourTree = new BehaviourTree(root, blackBoard);
	}

	public update() {
		this.behaviourTree.tick();
	}
}
