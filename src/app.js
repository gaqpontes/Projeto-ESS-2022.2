import newDirectDistances from "./data/newDirectDistances.json" assert { type: "json" };
import newRealDistances from "./data/newRealDistances.json" assert { type: "json" };
import lines from "./data/lines.json" assert { type: "json" };

function calcA() {
  let frontier = [];
  const trainSpeed = 30;
  const transferTime = 4 / 60;

  let startingStation = "E5".toLowerCase();
  let finalStation = "E9".toLowerCase();
  let actualStation = startingStation;

  let initialFrontier = {
    station: actualStation,
    stationColors: [],
    stationHistory: [],
    f: null,
    g: 0,
    h: calcHeuristics(actualStation, finalStation),
  };
  initialFrontier.f = initialFrontier.g + initialFrontier.h;
  initialFrontier.stationColors = getLineColorsByStation(actualStation);
  frontier.push(initialFrontier);

  while (actualStation != finalStation && frontier.length > 0) {
    let node = frontier.shift();
    let possibleNodes = newRealDistances.find((stationInfo) => {
      return stationInfo.stationCode == node.station;
    }).distances;
    possibleNodes.forEach((pNode) => {
      //if the node was already visited skip it
      if (node.stationHistory.includes(pNode.stationCode) == true) {
        return;
      }

      let nColors = getLineColorsByStation(pNode.stationCode);

      let foundStationColor = [];

      nColors.forEach((nodeColor) => {
        if (node.stationColors.includes(nodeColor)) {
          foundStationColor.push(nodeColor);
        }
      });

      let pNodeHeuristics = calcHeuristics(pNode.stationCode, finalStation);
      let pNodeCost = node.g + pNode.distance / trainSpeed;
      let pNodeHistory = [...node.stationHistory];
      if (foundStationColor.length == 0) {
        pNodeCost += transferTime;
      }

      pNodeHistory.push(node.station);

      insertNode({
        station: pNode.stationCode,
        stationColors: foundStationColor,
        stationHistory: pNodeHistory,
        f: pNodeHeuristics + pNodeCost,
        g: pNodeCost,
        h: pNodeHeuristics,
      });
    });
    actualStation = frontier[0].station;
  }
  frontier[0].stationHistory.push(actualStation);
  console.log("Path: " + frontier[0].stationHistory);
  console.log("Time in minutes: " + (frontier[0].f * 60).toFixed(2));
}

/**
 * gets the straight line distance of two stations.
 * @param {String} from - the starting station.
 * @param {String} to - the destination station.
 * @returns {Number}
 */
function calcHeuristics(from, to) {
  let station = newDirectDistances.find((stationInfo) => {
    return stationInfo.stationCode == from;
  });
  let result = station.distances.find((distanceInfo) => {
    return distanceInfo.stationCode == to;
  });
  return result?.distance / trainSpeed;
}

/**
 * gets all the station color names.
 * @param {String} stationCode - the starting station.
 * @returns {String[]}
 */
function getLineColorsByStation(stationCode) {
  let result = lines.find((stationInfo) => {
    return stationInfo.stationCode == stationCode;
  });
  return result.stationColors;
}

function insertNode(frontierToInsert) {
  let index = frontier.findIndex((element) => {
    return element.f > frontierToInsert.f;
  });
  if (index == -1) {
    frontier.push(frontierToInsert);
    return;
  }
  frontier = [
    ...frontier.slice(0).splice(0, index),
    frontierToInsert,
    ...frontier.slice(0).splice(index),
  ];
}
