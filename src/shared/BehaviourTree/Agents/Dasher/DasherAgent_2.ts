import { BehaviourTree, Selector, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";
import { ActionSetBlackboardVariable } from "../../Features/Blackboard/BlackboardActions";
import { CondNoBlackboardVariable, CondHasBlackboardVariable } from "../../Features/Blackboard/BlackboardConditions";
import { ActionRotateToTarget, ActionWalkToTarget } from "../../Features/Movement.ts/MovementActions";
import { ActionComplexMoveNearSpawn } from "../../Features/Movement.ts/MovementComplexActions";
import { CondIsNearSpawn } from "../../Features/Movement.ts/MovementConditions";
import { ActionFindTarget } from "../../Features/Target/TargetActions";
import { CondIsTargetCloserThan } from "../../Features/Target/TargetConditions";
import { SkillDash, SkillDashData } from "../../Features/Skills/Dash";

export const DasherAgent_2 = (handle: BasePart, spawn: BasePart): BehaviourTree => {
	// ### Blackboard
	const blackBoard = new Blackboard();
	blackBoard.setVariable("handle", handle);
	blackBoard.setVariable("spawnPart", spawn);
	blackBoard.setVariable("spawnPosition", spawn.GetPivot().Position);

	// ### Visual
	handle.Color = Color3.fromRGB(117, 13, 13);

	// ### Attributes
	const distanceToTargetPlayer = 15;
	const distanceToLooseTargetWhenFollowing = 45;
	const distanteToKeepFromTarget = 14;
	const idleSpeed = 0.2;
	const followSpeed = 0.2;
	const restTimeWhenIdle = 1;
	const maxDistanceFromSpawn = 60;

	// ## Skill Dash
	const dashData: SkillDashData = {
		cooldown: 6,
		prepDuration: 0.5,
		recoveryDuration: 0.1,
		speed: 0.6,
		pastTargetDistance: 10,
		loseTargetDistance: 30,
		activationPercentage: 100,
		activationInterval: 0.5,
	};

	// ### Behaviour Tree
	const root = new Selector();

	const selectorNoTarget = new Selector().addCondition(CondNoBlackboardVariable("target"));
	selectorNoTarget.addChild(ActionFindTarget(distanceToTargetPlayer));
	selectorNoTarget.addChild(ActionComplexMoveNearSpawn(idleSpeed, restTimeWhenIdle));
	root.addChild(selectorNoTarget);

	const selectorTarget = new Selector().addCondition(CondHasBlackboardVariable("target"));
	selectorTarget.addChild(SkillDash(dashData));
	selectorTarget.addChild(SkillDash(dashData));
	selectorTarget.addChild(SkillDash(dashData));

	const sequenceFollow = new Sequence();
	sequenceFollow.addChild(
		CondIsTargetCloserThan(distanceToLooseTargetWhenFollowing).case(
			false,
			ActionSetBlackboardVariable("target", undefined),
		),
	);
	sequenceFollow.addChild(
		CondIsNearSpawn(maxDistanceFromSpawn).case(false, ActionSetBlackboardVariable("target", undefined)),
	);
	sequenceFollow.addChild(ActionRotateToTarget());
	sequenceFollow.addChild(ActionWalkToTarget(followSpeed, distanteToKeepFromTarget));
	selectorTarget.addChild(sequenceFollow);

	root.addChild(selectorTarget);

	return new BehaviourTree(root, blackBoard);
};
