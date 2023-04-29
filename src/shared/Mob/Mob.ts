import { BehaviourTree, NodeStatus, Selector, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";
import { ActionSetBlackboardVariable } from "shared/BehaviourTree/Features/Blackboard/BlackboardActions";
import {
	CondHasBlackboardVariable,
	CondNoBlackboardVariable,
} from "shared/BehaviourTree/Features/Blackboard/BlackboardConditions";

import { ActionWarnReturn } from "shared/BehaviourTree/Features/Log/LogActions";
import { ActionWalkToTarget } from "shared/BehaviourTree/Features/Movement.ts/MovementActions";
import { ActionComplexMoveNearSpawn } from "shared/BehaviourTree/Features/Movement.ts/MovementComplexActions";
import { CondIsNearSpawn } from "shared/BehaviourTree/Features/Movement.ts/MovementConditions";
import { ActionFindTarget } from "shared/BehaviourTree/Features/Target/TargetActions";
import { CondIsTargetCloserThan } from "shared/BehaviourTree/Features/Target/TargetConditions";

const Workspace = game.GetService("Workspace");

export class Mob {
	private behaviourTree: BehaviourTree;
	private handle: BasePart;

	constructor(handle: BasePart, spawn: BasePart) {
		this.handle = handle;
		const blackBoard = new Blackboard();
		blackBoard.setVariable("handle", this.handle);
		blackBoard.setVariable("spawnPart", spawn);
		blackBoard.setVariable("spawnPosition", spawn.GetPivot().Position);

		const engagementDistance = 10
		const walkSpeed = 0.2
		const restTime = 1
		const goalDistance = 3
		const maxDistance = 20
		const maxFollowDistance = 60

		//this.behaviourTree = new BehaviourTree(waitValidTargetAndRotate, blackBoard);
		const root = new Selector();

		const selector = new Selector().addCondition(CondNoBlackboardVariable("target"));
		selector.addChild(ActionFindTarget(engagementDistance));
		selector.addChild(ActionComplexMoveNearSpawn(walkSpeed, maxDistance, restTime));
		root.addChild(selector);

		const sequence = new Sequence().addCondition(CondHasBlackboardVariable("target"));
		sequence.addChild(CondIsTargetCloserThan(engagementDistance * 2).case(false, ActionSetBlackboardVariable("target", undefined)));
		sequence.addChild(CondIsNearSpawn(maxFollowDistance).case(false, ActionSetBlackboardVariable("target", undefined)))
		sequence.addChild(ActionWalkToTarget(walkSpeed, goalDistance));
		root.addChild(sequence);

		this.behaviourTree = new BehaviourTree(root, blackBoard);
	}

	public update() {
		this.behaviourTree.tick();
	}
}
