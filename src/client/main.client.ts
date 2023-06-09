import { Action, BehaviourTree, Condition, Sequence } from "@rbxts/behaviour-tree";
import { RobotId } from "_database/game/robots/ids";
import { Mob } from "shared/Mob/Mob";

const RunService = game.GetService("RunService");
const Workspace = game.GetService("Workspace");

function createMob(spawn: BasePart, mobType: string) {
	const part = new Instance("Part");
	part.Size = new Vector3(3, 1, 3);
	part.Anchored = true;
	part.PivotTo(spawn.CFrame);
	part.Parent = Workspace;
	part.Name = spawn.Name;

	const level = tonumber(spawn.Name);

	if (level === undefined) {
		error("Spawn part must have a level number as Name.");
	}

	const mob = new Mob(part, spawn, RobotId[mobType as keyof typeof RobotId], level);
	RunService.Heartbeat.Connect(() => mob.update());
}

const SpawnsFolder = Workspace.FindFirstChild("Spawns") as Folder;
for (const robotTypeFolder of SpawnsFolder.GetChildren()) {
	const robotType = robotTypeFolder.Name;
	for (const spawnPart of robotTypeFolder.GetChildren()) {
		const mob = createMob(spawnPart as BasePart, robotType);
	}
}
