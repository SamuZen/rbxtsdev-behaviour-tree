import { Action, Condition, MemorySequence, NodeStatus, Sequence } from "@rbxts/behaviour-tree";
import { ActionSetBlackboardVariable, ActionSetBlackboardVariableFunc } from "../Blackboard/BlackboardActions";
import { ActionRotateToTarget } from "../Movement.ts/MovementActions";
import { ActionWaitTime } from "../Utils/UtilsActions";
import { ActionComplexDashForward } from "../Movement.ts/MovementComplexActions";
import { CondIsTargetCloserThan } from "../Target/TargetConditions";
import { CondHasTarget } from "shared/BehaviourTree/Conditions/TargetConditions";
import { ActionWarnReturn } from "../Log/LogActions";

const Players = game.GetService("Players");
const rand = new Random();

export type SkillDashData = {
	cooldown: number;
	prepDuration: number;
	recoveryDuration: number;
	speed: number;
	pastTargetDistance: number;
	loseTargetDistance: number;

	activationPercentage: number;
	activationInterval: number;
};

export const SkillDash = (data: SkillDashData): Sequence => {
	const sequence = new Sequence();

	sequence.addCondition(
		new Condition((blackBoard) => {
			const lastT = sequence._blackboard.getVariable("cooldown") as number;
			if (lastT === undefined) {
				return true;
			}

			const delta = os.time() - lastT;
			return delta > data.cooldown;
		}),
	);
	sequence.addCondition(
		new Condition((blackBoard) => {
			//if already running, dont check
			const running = sequence._blackboard.getVariable("running") as boolean;
			if (running) {
				return true;
			}

			//check if should activate try based on interval
			const t = os.time();
			let lastCheck = sequence._blackboard.getVariable("lastCheck") as number | undefined;
			if (lastCheck === undefined) {
				lastCheck = 0;
			}
			if (t < lastCheck + data.activationInterval) {
				return false;
			}

			//check if should activate based on percentage
			warn("lets check");
			sequence._blackboard.setVariable("lastCheck", t);

			const c = rand.NextNumber() * 100;
			warn(c, data.activationPercentage);
			return c <= data.activationPercentage;
		}),
	);

	sequence.addChild(
		CondIsTargetCloserThan(data.loseTargetDistance).case(false, ActionSetBlackboardVariable("target", undefined)),
	);
	sequence.addChild(CondHasTarget());

	sequence.addChild(
		new Action((blackBoard) => {
			sequence._blackboard.setVariable("running", true);
			return NodeStatus.SUCCESS;
		}),
	);

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
	sequence.addChild(
		new Action((blackBoard) => {
			sequence._blackboard.setVariable("running", false);
			return NodeStatus.SUCCESS;
		}),
	);
	sequence.addChild(
		new Action((blackBoard) => {
			const getTime = () => {
				return os.time();
			};
			sequence._blackboard.setVariable("cooldown", getTime());
			return NodeStatus.SUCCESS;
		}),
	);

	return sequence;
};
