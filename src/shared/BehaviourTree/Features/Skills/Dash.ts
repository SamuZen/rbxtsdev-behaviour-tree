import { Action, Condition, MemorySequence, NodeStatus, Sequence } from "@rbxts/behaviour-tree";
import { ActionSetBlackboardVariable, ActionSetBlackboardVariableFunc } from "../Blackboard/BlackboardActions";
import { ActionRotateToTarget } from "../Movement.ts/MovementActions";
import { ActionWaitTime } from "../Utils/UtilsActions";
import { ActionComplexDashForward } from "../Movement.ts/MovementComplexActions";
import { CondIsTargetCloserThan } from "../Target/TargetConditions";
import { CondHasTarget } from "shared/BehaviourTree/Conditions/TargetConditions";

const Players = game.GetService("Players");

export type SkillDashData = {
	cooldown: number,
	prepDuration: number,
	recoveryDuration: number,
	speed: number,
	pastTargetDistance: number,
	loseTargetDistance: number,
}

export const SkillDash = (data: SkillDashData): Sequence => {
	const sequence = new Sequence().addCondition(new Condition((blackBoard) => {
		const lastT = blackBoard.getVariable("UseSkillDash") as number
		if (lastT === undefined) { return true }

		const delta = os.time() - lastT;
		return delta > data.cooldown;
	}));

	sequence.addChild(CondIsTargetCloserThan(data.loseTargetDistance).case(false, ActionSetBlackboardVariable("target", undefined)));
	sequence.addChild(CondHasTarget());
	
		const sequenceAction = new MemorySequence();
			const sequencePrep = new Sequence();
				sequencePrep.addChild(ActionRotateToTarget());
				sequencePrep.addChild(ActionWaitTime(data.prepDuration));
			const sequenceDash = new MemorySequence();
				sequenceDash.addChild(ActionComplexDashForward(data.speed, data.pastTargetDistance));
				sequenceDash.addChild(ActionWaitTime(data.recoveryDuration));

		sequenceAction.addChild(sequencePrep);
		sequenceAction.addChild(sequenceDash);
	
	sequence.addChild(sequenceAction);
	sequence.addChild(new Action((blackBoard) => {
		return NodeStatus.SUCCESS;
	}));
	sequence.addChild(ActionSetBlackboardVariableFunc("UseSkillDash", () => { return os.time() }));

	return sequence;
};
