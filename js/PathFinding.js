pathfinding = {};

pathfinding.NavMesh = {
	"Node1":[
						{node: "Node2", requiresJump: false},
						{node: "Node6", requiresJump: false}
			],
	"Node2":[
						{node: "Node1", requiresJump: false},
						{node: "Node5", requiresJump: false}
			],
	"Node3":[
						{node: "Node6", requiresJump: false},
						{node: "Node10", requiresJump: false}
			],
	"Node4":[
						{node: "Node9", requiresJump: false},
						{node: "Node5", requiresJump: false}
			],
	"Node5":[
						{node: "Node2", requiresJump: true},
						{node: "Node4", requiresJump: false},
						{node: "Node7", requiresJump: false}
			],
	"Node6":[
						{node: "Node1", requiresJump: true},
						{node: "Node3", requiresJump: false},
						{node: "Node8", requiresJump: false},
			],
	"Node7":[
						{node: "Node5", requiresJump: false}
			],
	"Node8":[
						{node: "Node6", requiresJump: false}
			],
	"Node9":[
						{node: "Node4", requiresJump: true},
						{node: "Node10", requiresJump: false},
						{node: "Node11", requiresJump: false},
			],
	"Node10":[
						{node: "Node3", requiresJump: true},
						{node: "Node9", requiresJump: false},
						{node: "Node12", requiresJump: false},
			],
	"Node11":[
						{node: "Node17", requiresJump: true},
						{node: "Node14", requiresJump: false},
						{node: "Node9", requiresJump: false},
			],
	"Node12":[
						{node: "Node13", requiresJump: true},
						{node: "Node18", requiresJump: false},
						{node: "Node10", requiresJump: false},
			],
	"Node13":[
						{node: "Node12", requiresJump: true},
						{node: "Node18", requiresJump: false},
						{node: "Node16", requiresJump: false},
			],
	"Node14":[
						{node: "Node11", requiresJump: true},
						{node: "Node17", requiresJump: false},
						{node: "Node15", requiresJump: false},
			],
	"Node15":[
						{node: "Node14", requiresJump: false}
			],
	"Node16":[
						{node: "Node13", requiresJump: false}
			],
	"Node17":[
						{node: "Node11", requiresJump: true},
						{node: "Node14", requiresJump: true},
						{node: "Node21", requiresJump: false},
						{node: "Node19", requiresJump: false},
			],
	"Node18":[
						{node: "Node13", requiresJump: true},
						{node: "Node12", requiresJump: true},
						{node: "Node20", requiresJump: false},
						{node: "Node19", requiresJump: false},
			],
	"Node19":[
						{node: "Node17", requiresJump: false},
						{node: "Node18", requiresJump: false},
			],
	"Node20":[
						{node: "Node18", requiresJump: false}
			],
	"Node21":[
						{node: "Node17", requiresJump: false}
			]
};

pathfinding.PlatformNodes = {
	"Platform1": [{node:"Node1",requiresJump:false},{node:"Node2",requiresJump:false}],
	"Platform2": [{node:"Node3",requiresJump:false},{node:"Node6",requiresJump:false},{node:"Node8",requiresJump:false}],
	"Platform3": [{node:"Node4",requiresJump:false},{node:"Node5",requiresJump:false},{node:"Node7",requiresJump:false}],
	"Platform4": [{node:"Node13",requiresJump:false},{node:"Node16",requiresJump:false}],
	"Platform5": [{node:"Node9",requiresJump:false},{node:"Node10",requiresJump:false},{node:"Node11",requiresJump:false},{node:"Node12",requiresJump:false}],
	"Platform6": [{node:"Node14",requiresJump:false},{node:"Node15",requiresJump:false}],
	"Platform7": [{node:"Node17",requiresJump:false},{node:"Node18",requiresJump:false},{node:"Node19",requiresJump:false},{node:"Node20",requiresJump:false},{node:"Node21",requiresJump:false}]
};

pathfinding.PlatformAreas = {};

pathfinding.Nodes = {};

pathfinding.CalculateCost = function(start, dest) {
	var xs = 0;
	var ys = 0;
 
	xs = dest.x - start.x;
	xs = xs * xs;
	 
	ys = dest.y - start.y;
	ys = ys * ys;
	return Math.sqrt( xs + ys );
};

pathfinding.Astar = function(ent, ent2) {
	closedset = [];
	openset = [];
	camefrom = {};
	
	gScore = {};
	gScore["start"] = 0;
	
	var start_neighbors = [];
	var end_neighbors = [];
	var found = 0;
	var atSamePlat = false;
	
	for(platform in pathfinding.PlatformAreas) {
		var both = 0;
		if(ent.getBounds().overlaps(pathfinding.PlatformAreas[platform].getBounds())) {
			start_neighbors = pathfinding.PlatformNodes[platform];
			both++;
			found++;
		}
		
		if(ent2.getBounds().overlaps(pathfinding.PlatformAreas[platform].getBounds())) {
			end_neighbors = pathfinding.PlatformNodes[platform];
			both++;
			found++;
		}
		
		if(both >= 2)
			atSamePlat = true;
	}
	if(found < 2) 
		return null;
	
	var NodeStart = {node: "start", position: {x: ent.pos.x, y: ent.pos.y}, neighbors: start_neighbors};
	var NodeEnd = {node: "end", position: {x: ent2.pos.x, y: ent2.pos.y}, neighbors: end_neighbors};
	
	if(atSamePlat)
		return [NodeStart,NodeEnd];
		
	openset.push(NodeStart);
	
	fScore = {};
	fScore["start"] = gScore["start"] + pathfinding.CalculateCost(NodeStart.position, NodeEnd.position);
	while(openset.length > 0) {
		var min = null;
		var current = null;
		
		for(var i = 0; i < openset.length; i++) {
			if(current == null) {
				current = openset[i];
				min = fScore[openset[i].node];
			}
			else if (fScore[openset[i].node] < min) {
				current = openset[i];
				min = fScore[openset[i].node];
			}
		}
		
		if(current != null) {
			for(var i = 0; i < end_neighbors.length; i++) {
				if(end_neighbors[i].node == current.node) {
					return pathfinding.GetPath(camefrom, current, NodeEnd);
				}
			}
			
			var index = openset.indexOf(current);
			if (index > -1) {
				openset.splice(index, 1);
			}
			
			closedset.push(current);
			
			for(var i = 0; i < current.neighbors.length; i++) {
				if(closedset.indexOf(pathfinding.Nodes[current.neighbors[i].node]) != -1)
					continue;
				var neighbor = pathfinding.Nodes[current.neighbors[i].node];
				var tentative_g_score = gScore[current.node] + pathfinding.CalculateCost(current.position, neighbor.position);
				
				if(openset.indexOf(neighbor) < 0 || gScore[neighbor.node] == undefined && tentative_g_score < gScore[neighbor.node] ) {
					camefrom[neighbor.node] = current;
					gScore[neighbor.node] = tentative_g_score;
					fScore[neighbor.node] = gScore[neighbor.node] + pathfinding.CalculateCost(neighbor.position, NodeEnd.position);
					
					if(openset.indexOf(neighbor) < 0)
						openset.push(neighbor);
				}
			}
		}
	}
	
	return null;
}

pathfinding.GetPath = function(camefrom, current, NodeEnd) {
	var totalPath = [current];
	while(camefrom[current.node] != undefined) {
		current = camefrom[current.node];
		totalPath.push(current);
	}
	
	totalPath = totalPath.reverse();
	totalPath.push(NodeEnd);
	return totalPath;
}