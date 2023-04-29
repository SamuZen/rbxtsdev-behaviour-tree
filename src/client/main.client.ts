import { Action, BehaviourTree, Condition, Sequence } from "@rbxts/behaviour-tree";
import { Mob } from "shared/Mob/Mob";

const RunService = game.GetService("RunService");
const Workspace = game.GetService("Workspace");

function createMob(i: number) {
	const part = new Instance("Part");
	part.Size = new Vector3(1, 1, 1);
	part.Name = tostring(i);
	part.Anchored = true;
	part.PivotTo(new CFrame(i * 0, 5, -30));
	part.Parent = Workspace;

	const mob = new Mob(part);
	RunService.Heartbeat.Connect(() => mob.update());
}

for (let i = 0; i < 500; i++) {
	createMob(i);
}
