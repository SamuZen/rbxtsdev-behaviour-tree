import { BehaviourTree, Selector, Sequence } from "@rbxts/behaviour-tree";
import { Blackboard } from "@rbxts/behaviour-tree/out/Blackboard";
import { ActionSetBlackboardVariable } from "../Features/Blackboard/BlackboardActions";
import { CondNoBlackboardVariable, CondHasBlackboardVariable } from "../Features/Blackboard/BlackboardConditions";
import { ActionWalkToTarget } from "../Features/Movement.ts/MovementActions";
import { ActionComplexMoveNearSpawn } from "../Features/Movement.ts/MovementComplexActions";
import { CondIsNearSpawn } from "../Features/Movement.ts/MovementConditions";
import { ActionFindTarget } from "../Features/Target/TargetActions";
import { CondIsTargetCloserThan } from "../Features/Target/TargetConditions";

export const ElevatorAgent = (handle: BasePart, spawn: BasePart): BehaviourTree => {

    // ### Blackboard
    const blackBoard = new Blackboard();
    blackBoard.setVariable("handle", handle);
    blackBoard.setVariable("spawnPart", spawn);
    blackBoard.setVariable("spawnPosition", spawn.GetPivot().Position);

    // ### Attributes
    const engagementDistance = 10
    const walkSpeed = 0.2
    const restTime = 1
    const goalDistance = 3
    const maxDistance = 20
    const maxFollowDistance = 60

    // ### Behaviour Tree
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

    return new BehaviourTree(root, blackBoard);
}