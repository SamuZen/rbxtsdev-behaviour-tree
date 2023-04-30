import { Action, Condition, MemorySequence, NodeStatus, Sequence } from "@rbxts/behaviour-tree";
import { ActionSetBlackboardVariable } from "../Blackboard/BlackboardActions";
import { ActionRotateToTarget } from "../Movement.ts/MovementActions";
import { ActionWaitTime } from "../Utils/UtilsActions";
import { ActionComplexMoveThroughWaypoints } from "../Movement.ts/MovementComplexActions";
import { CondIsTargetCloserThan } from "../Target/TargetConditions";
import { CondHasTarget } from "shared/BehaviourTree/Conditions/TargetConditions";
import { DebugPosition, DebugWaypoints } from "shared/Debug/DebugUtils";
import { ActionWarnReturn } from "../Log/LogActions";

const Players = game.GetService("Players");

export type SkillMultiSliceData = {
	cooldown: number;
	prepDuration: number;
	recoveryDuration: number;
	speed: number;
	pastTargetDistance: number;
	loseTargetDistance: number;
	numSlices: number;
	sliceDistance: number;
};

function getPointsAroundPart(part: BasePart, numPoints: number, radius: number): Vector3[] {
	const points: Vector3[] = [];
	for (let i = 1; i <= numPoints; i++) {
		const angle = (i / numPoints) * 2 * math.pi;
		const x = radius * math.cos(angle);
		const z = radius * math.sin(angle);

		const position = part.Position.add(new Vector3(x, 0, z));
		const ray = new Ray(part.Position, position.sub(part.Position).Unit.mul(radius));

		DebugPosition(position, new Color3(1, 0, 0), 1);

		points.push(position);
	}
	return points;
}

function getPointsToPunchPart(part: BasePart, numPoints: number, radius: number): Vector3[] {
	const points: Vector3[] = [];
	for (let i = 1; i <= numPoints; i++) {
		const angle = (i / numPoints) * 2 * math.pi;
		const x = radius * math.cos(angle);
		const z = radius * math.sin(angle);

		const position = part.Position.add(new Vector3(x, 0, z));

		points.push(position);
	}

	// embaralhar os pontos
	for (let i = numPoints - 1; i > 0; i--) {
		const j = math.random(1, i + 1);
		[points[i], points[j]] = [points[j], points[i]];
	}

	const waypoints: Vector3[] = [];
	for (let i = 0; i < numPoints; i++) {
		waypoints.push(part.CFrame.Position);
		waypoints.push(points[i]);
	}

	DebugWaypoints(waypoints, new Color3(1, 0, 0), 2);
	return waypoints;
}

export const SkillMultiSlice = (data: SkillMultiSliceData): Sequence => {
	const root = new Sequence();

	//#region cooldown
	root.addCondition(
		new Condition((blackBoard) => {
			const lastT = root._blackboard.getVariable("cooldown") as number;
			if (lastT === undefined) {
				return true;
			}

			const delta = os.time() - lastT;
			return delta > data.cooldown;
		}),
	);

	root.addChild(CondHasTarget());
	//#endregion

	const skillSequence = new MemorySequence();

	// Preparation
	const preparationSequence = new Sequence();

	//preparationSequence.addChild(ActionRotateToTarget());
	//preparationSequence.addChild(ActionWaitTime(data.prepDuration));
	preparationSequence.addChild(
		//get positions
		new Action((blackBoard) => {
			const target = blackBoard.getVariable("target") as BasePart;
			const slicePoints = getPointsToPunchPart(target, data.numSlices, data.sliceDistance);
			blackBoard.setVariable("waypoints", slicePoints);
			return NodeStatus.SUCCESS;
		}),
	);

	// Movement
	const movementSequence = new MemorySequence();
	movementSequence.addChild(ActionComplexMoveThroughWaypoints(data.speed));
	movementSequence.addChild(ActionWaitTime(data.recoveryDuration));

	// Finalize
	skillSequence.addChild(preparationSequence);
	skillSequence.addChild(movementSequence);
	root.addChild(skillSequence);

	// Cooldown
	root.addChild(
		new Action((blackBoard) => {
			const getTime = () => {
				return os.time();
			};
			root._blackboard.setVariable("cooldown", getTime());
			return NodeStatus.SUCCESS;
		}),
	);

	return root;
};
