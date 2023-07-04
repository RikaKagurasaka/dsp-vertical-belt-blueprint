import {BlueprintBuilding, toStr} from "../blueprint/parser.ts";

export function generate(config:any) {
    let bp = {
        header: {
            layout: 10,
            icons: [0, 0, 0, 0, 0],
            time: config.time,
            gameVersion: config.gameVersion,
            shortDesc: config.name,
            desc: ""
        },
        version: 1,
        cursorOffset: {x: 1, y: 1},
        cursorTargetArea: 0,
        dragBoxSize: {x: 3, y: 3},
        primaryAreaIdx: 0,
        areas: [
            {
                index: 0,
                parentIndex: -1,
                tropicAnchor: 0,
                areaSegments: 200,
                anchorLocalOffset: {x: 0, y: 0},
                size: {x: 3, y: 3}
            }
        ],
        buildings: [] as BlueprintBuilding[]
    }

    function newBelt(coords: number[]) {
        return {
            index: 0,
            areaIndex: 0,
            localOffset: [
                {x: coords[0] + 1, y: coords[1] + 1, z: coords[2]},
                {x: coords[0] + 1, y: coords[1] + 1, z: coords[2]},
            ],
            yaw: [180, 180],
            itemId: config.itemId,
            modelIndex: 37,
            outputObjIdx: -1,
            inputObjIdx: -1,
            outputToSlot: 1,
            inputFromSlot: 0,
            outputFromSlot: 0,
            inputToSlot: 1,
            outputOffset: 0,
            inputOffset: 0,
            recipeId: 0,
            filterId: 0,
            parameters: null
        } as BlueprintBuilding
    }

    bp.buildings = []
    if (config.inputOffset) {
        bp.buildings.push(newBelt([...config.inputOffset, config.from]))
    }
    if (config.to > config.from)
        for (let i = 0; i <= (config.to - config.from); i += 1 / config.stepDensity) {
            bp.buildings.push(newBelt([i * config.stepOffset[0], i * config.stepOffset[1], i + config.from]))
        }
    else
        for (let i = 0; i >= (config.to - config.from); i -= 1 / config.stepDensity) {
            bp.buildings.push(newBelt([i * config.stepOffset[0], i * config.stepOffset[1], i + config.from]))
        }
    if (config.outputOffset) {
        bp.buildings.push(newBelt([
            config.outputOffset[0] + (config.to - config.from) * config.stepOffset[0],
            config.outputOffset[1] + (config.to - config.from) * config.stepOffset[1],
            config.to]))
    }
    if (config.reversed) {
        bp.buildings = Array.from(bp.buildings).reverse();
    }
    for (let index = 0; index < bp.buildings.length; index++) {
        bp.buildings[index].index = index;
        if (index < bp.buildings.length - 1) {
            bp.buildings[index].outputObjIdx = index + 1;
        }
    }
    return toStr(bp);
}