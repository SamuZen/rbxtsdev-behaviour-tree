import { Condition } from "@rbxts/behaviour-tree";

export const CondIsNearSpawn = (distance: number): Condition => {
    return new Condition((blackBoard) => {
        const handle = blackBoard.getVariable("handle") as BasePart;
        const spawnPosition = blackBoard.getVariable("spawnPosition") as Vector3;
        return handle.Position.sub(spawnPosition).Magnitude < distance;
    });
}