import { Action, NodeStatus } from "@rbxts/behaviour-tree";


export const ActionWalkToTarget = (walkSpeed: number, goalDistance: number): Action => {
    return new Action((blackBoard) => {
        const handle = blackBoard.getVariable("handle") as BasePart;
        const target = blackBoard.getVariable("target") as BasePart;
        if (!target) {
            return NodeStatus.FAILURE;
        }

        const position = target.CFrame.Position;

        //is close to position?
        if (handle.Position.sub(position).Magnitude < goalDistance) {
            return NodeStatus.SUCCESS;
        }
        
        // Mover o Handle em direção a posição com a velocidade definida
        const direction = position.sub(handle.Position).Unit;
        handle.CFrame = handle.CFrame.add(direction.mul(walkSpeed));
        
        return NodeStatus.SUCCESS
    });
};