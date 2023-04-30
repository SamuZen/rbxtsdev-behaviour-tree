const Workspace = game.GetService("Workspace");
const Debris = game.GetService("Debris");

export const DebugPosition = (position: Vector3, color: Color3, duration: number) => {
	const part = new Instance("Part");
	part.Anchored = true;
	part.CanCollide = false;
	part.CanQuery = false;
	part.Size = new Vector3(0.5, 0.5, 0.5);
	part.Transparency = 0.5;
	part.Color = color;
	part.Position = position;
	part.Parent = Workspace;

	Debris.AddItem(part, duration);
};

export const DebugWaypoints = (waypoints: Vector3[], color: Color3, duration: number) => {
	const parent = new Instance("Folder");
	parent.Name = "DebugWaypoints";
	parent.Parent = Workspace;
	const numWaypoints = waypoints.size();

	for (let i = 0; i < numWaypoints; i++) {
		// Cria uma instância "Part" para o waypoint atual
		const color = new Color3(i / numWaypoints, 1 - i / numWaypoints, 0);
		DebugPosition(waypoints[i], color, duration);

		// Se houver mais um waypoint, cria uma instância "Part" para o segmento entre eles
		if (i < numWaypoints - 1) {
			const nextWaypoint = waypoints[i + 1];
			const direction = nextWaypoint.sub(waypoints[i]);
			const distance = direction.Magnitude;
			const midpoint = waypoints[i].add(direction.div(2));
			const thickness = 0.1;

			const partSegment = new Instance("Part");
			partSegment.Anchored = true;
			partSegment.CanCollide = false;
			partSegment.Size = new Vector3(thickness, thickness, distance);
			partSegment.Transparency = 0.5;
			partSegment.Color = color;
			partSegment.CFrame = new CFrame(midpoint, nextWaypoint);
			partSegment.Parent = parent;
			partSegment.CanQuery = false;
		}
	}

	Debris.AddItem(parent, duration);
};

export const DebugRay = (raycastResult: RaycastResult) => {
	DebugPosition(raycastResult.Position, new Color3(1, 0, 0), 1);
};
