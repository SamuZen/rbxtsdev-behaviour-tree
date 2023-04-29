import { BehaviourTree, NodeStatus, Selector, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";
import { ActionSetBlackboardVariable } from "shared/BehaviourTree/Features/Blackboard/BlackboardActions";
import {
	CondHasBlackboardVariable,
	CondNoBlackboardVariable,
} from "shared/BehaviourTree/Features/Blackboard/BlackboardConditions";

import { ActionWarnReturn } from "shared/BehaviourTree/Features/Log/LogActions";
import { ActionComplexMoveNearSpawn } from "shared/BehaviourTree/Features/Movement.ts/MovementComplexActions";
import { ActionFindTarget } from "shared/BehaviourTree/Features/Target/TargetActions";

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

		const selector = new Selector().addCondition(CondNoBlackboardVariable("target"));
		selector.addChild(ActionFindTarget());
		selector.addChild(ActionComplexMoveNearSpawn());
		root.addChild(selector);

		const sequence = new Sequence().addCondition(CondHasBlackboardVariable("target"));
		sequence.addChild(ActionSetBlackboardVariable("target", undefined));
		// sequence.addChild(isCurrentTargetValid);
		// sequence.addChild(walkToTarget);
		root.addChild(sequence);

		this.behaviourTree = new BehaviourTree(root, blackBoard);
	}

	public update() {
		this.behaviourTree.tick();
	}
}
