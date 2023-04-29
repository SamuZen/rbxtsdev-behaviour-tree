import { Condition, NodeStatus } from "@rbxts/behaviour-tree";

export const CondIsTargetCloserThan = (checkDistance: number): Condition => {
	return new Condition((blackBoard) => {
        const target = blackBoard.getVariable("target") as BasePart;
        if (target === undefined) return false;
        if (target.Parent === undefined) return false;
        if (target.Parent.Parent === undefined) return false;

        const handle = blackBoard.getVariable("handle") as BasePart;
        const targetDistance = handle.Position.sub(target.Position).Magnitude;

        if (targetDistance > checkDistance) {
            blackBoard.setVariable("target", undefined);
            return false;
        };
		return true;
	});
};
