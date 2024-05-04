function haversine(theta) {
    return Math.pow(Math.sin(theta / 2), 2);
}

const RADIUS = 6378100;

function toRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function toDegrees(radians) {
    var pi = Math.PI;
    return Number(radians) * (180/pi);
}

function calculateDistance(startLat, startLong, endLat, endLong) {
    const dLat = toRadians(endLat - startLat);
    const dLong = toRadians(endLong - startLong);

    // console.log(endLat);

    startLat = toRadians(startLat);
    endLat = toRadians(endLat);

    const a = haversine(dLat) + Math.cos(startLat) * Math.cos(endLat) * haversine(dLong);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return RADIUS * c;
}

function calculateHeading(startLat, startLong, endLat, endLong) {
    const dLong = toRadians(endLong - startLong);

    startLat = toRadians(startLat);
    endLat = toRadians(endLat);

    const a = Math.cos(endLat) * Math.sin(dLong);
    const b = Math.cos(startLat) * Math.sin(endLat) - Math.cos(endLat) * Math.sin(startLat) * Math.cos(dLong);

    let angle = Math.atan2(a, b);
    angle = toDegrees(angle);

    return angle;
}

function getInstruction(dist, diff) {
    // if (diff < 15 || diff > 345) {
    //     return `Go straight for ${dist.toFixed(2)} meters`;
    // } else if (15 <= diff && diff < 45) {
    //     return `Take slight right in ${dist.toFixed(2)} meters`;
    // } else if (45 <= diff && diff < 135) {
    //     return `Take right in ${dist.toFixed(2)} meters`;
    // } else if (135 <= diff && diff < 165) {
    //     return `Take sharp right in ${dist.toFixed(2)} meters`;
    // } else if (165 <= diff && diff < 195) {
    //     return `Take u-turn in ${dist.toFixed(2)} meters`;
    // } else if (195 <= diff && diff < 225) {
    //     return `Take sharp left in ${dist.toFixed(2)} meters`;
    // } else if (225 <= diff && diff < 315) {
    //     return `Take left in ${dist.toFixed(2)} meters`;
    // } else if (315 <= diff && diff < 345) {
    //     return `Take slight left in ${dist.toFixed(2)} meters`;
    // } else {
    //     return 'Invalid Data';
    // }

    if (diff < 45 || diff > 315) {
        return `Go straight for ${dist.toFixed(2)} meters`;
    } else if (45 <= diff && diff < 135) {
        return `Take right in ${dist.toFixed(2)} meters`;
    } else if (135 <= diff && diff < 165) {
        return `Take sharp right in ${dist.toFixed(2)} meters`;
    } else if (165 <= diff && diff < 195) {
        return `Take u-turn in ${dist.toFixed(2)} meters`;
    } else if (195 <= diff && diff < 225) {
        return `Take sharp left in ${dist.toFixed(2)} meters`;
    } else if (225 <= diff && diff < 315) {
        return `Take left in ${dist.toFixed(2)} meters`;
    } else {
        return 'Invalid Data';
    }
}

export function fetchInstructions(route) {
    const count = route.nodeCount;
    // console.log(count);

    const nodeList = route.nodeList;
    let lats = [];
    let longs = [];
    let path = [];
    let instructions = [];

    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        const nodeLat = node.latitute;
        const nodeLong = node.longtitude;

        lats.push(Number(nodeLat));
        longs.push(Number(nodeLong));
    }

    for (let i = 0; i < nodeList.length; i++) {
        if (i === nodeList.length - 2) {
            const dist = calculateDistance(lats[i], longs[i], lats[i + 1], longs[i + 1]);
            instructions.push(`Your destination is in ${dist.toFixed(2)} meters`);
            path.push({
                latitude: lats[i],
                longitude: longs[i]
            });
            path.push({
                latitude: lats[i + 1],
                longitude: longs[i + 1]
            });
            break;
        }

        const dist = calculateDistance(lats[i], longs[i], lats[i + 1], longs[i + 1]);
        const h1 = calculateHeading(lats[i], longs[i], lats[i + 1], longs[i + 1]);
        const h2 = calculateHeading(lats[i + 1], longs[i + 1], lats[i + 2], longs[i + 2]);

        // console.log(dist, h1, h2);
        const diff = ((h2 - h1) + 360) % 360;
        if (instructions.length > 0 && instructions[instructions.length - 1].substring(0, 2) === "Go") {
            if (getInstruction(dist, diff).substring(0, 2) === "Go") {
                let prevDistString = "";
                for (let j = 16; j < instructions[instructions.length - 1].length; j++) {
                    if (instructions[instructions.length - 1][j] === ' ') break;
                    prevDistString += instructions[instructions.length - 1][j];
                }
                let prevDist = Number.parseFloat(prevDistString);
                prevDist += dist;
                instructions.pop();
                instructions.push(`Go straight for ${prevDist.toFixed(2)} meters`);
            } else {
                instructions.push(getInstruction(dist, diff));
            }
        } else {
            instructions.push(getInstruction(dist, diff));
            path.push({
                latitude: lats[i],
                longitude: longs[i]
            });
        }
    }

    // -----------------------------------------------------------

    lats = [];
    longs = [];
    instructions = [];
    let originalPath = path;

    for (let i = 0; i < path.length; i++) {
        lats.push(Number(path[i].latitude));
        longs.push(Number(path[i].longitude));
    }

    for (let i = 0; i < path.length; i++) {
        if (i === path.length - 2) {
            const dist = calculateDistance(lats[i], longs[i], lats[i + 1], longs[i + 1]);
            instructions.push(`Your destination is in ${dist.toFixed(2)} meters`);
            break;
        }

        const dist = calculateDistance(lats[i], longs[i], lats[i + 1], longs[i + 1]);
        const h1 = calculateHeading(lats[i], longs[i], lats[i + 1], longs[i + 1]);
        const h2 = calculateHeading(lats[i + 1], longs[i + 1], lats[i + 2], longs[i + 2]);

        const diff = ((h2 - h1) + 360) % 360;
        instructions.push(getInstruction(dist, diff));
    }

    // for (let i in path) console.log(path[i]);

    console.log(originalPath.length + " " + instructions.length)

    return {
        simplifiedPath: originalPath,
        instructions: instructions
    };
}