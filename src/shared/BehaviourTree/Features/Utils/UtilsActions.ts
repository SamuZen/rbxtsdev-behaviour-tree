import { Action, NodeStatus } from "@rbxts/behaviour-tree";


export const ActionWaitTime = (timeToWait: number): Action => {
	return new Action((blackBoard) => {
        if (blackBoard.getVariable("endTime") !== undefined) {
            const timeLeft = (blackBoard.getVariable("endTime") as number) - time();
            if (timeLeft <= 0) {
                blackBoard.setVariable("endTime", undefined);
                return NodeStatus.SUCCESS;
            }
            return NodeStatus.RUNNING;
        }

        const endTime = time() + timeToWait;
        blackBoard.setVariable("endTime", endTime);
        return NodeStatus.RUNNING;
    })
};