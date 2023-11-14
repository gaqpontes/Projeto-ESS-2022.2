const trainSpeed = 30;
const transferTime = 25 / 60;
let frontier = [];

function calcA() {

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
  frontier = [];
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

const newDirectDistances = [
  {
    "stationCode": "e1",
    "distances": [
      { "stationCode": "e1", "distance": 0 },
      { "stationCode": "e2", "distance": 10 },
      { "stationCode": "e3", "distance": 18.5 },
      { "stationCode": "e4", "distance": 24.8 },
      { "stationCode": "e5", "distance": 36.4 },
      { "stationCode": "e6", "distance": 38.8 },
      { "stationCode": "e7", "distance": 35.8 },
      { "stationCode": "e8", "distance": 25.4 },
      { "stationCode": "e9", "distance": 17.6 },
      { "stationCode": "e10", "distance": 9.1 },
      { "stationCode": "e11", "distance": 16.7 },
      { "stationCode": "e12", "distance": 27.3 },
      { "stationCode": "e13", "distance": 27.6 },
      { "stationCode": "e14", "distance": 29.8 }
    ]
  },
  {
    "stationCode": "e2",
    "distances": [
      { "stationCode": "e1", "distance": 10 },
      { "stationCode": "e2", "distance": 0 },
      { "stationCode": "e3", "distance": 8.5 },
      { "stationCode": "e4", "distance": 14.8 },
      { "stationCode": "e5", "distance": 26.6 },
      { "stationCode": "e6", "distance": 29.1 },
      { "stationCode": "e7", "distance": 26.1 },
      { "stationCode": "e8", "distance": 17.3 },
      { "stationCode": "e9", "distance": 10 },
      { "stationCode": "e10", "distance": 3.5 },
      { "stationCode": "e11", "distance": 15.5 },
      { "stationCode": "e12", "distance": 20.9 },
      { "stationCode": "e13", "distance": 19.1 },
      { "stationCode": "e14", "distance": 21.8 }
    ]
  },
  {
    "stationCode": "e3",
    "distances": [
      { "stationCode": "e1", "distance": 18.5 },
      { "stationCode": "e2", "distance": 8.5 },
      { "stationCode": "e3", "distance": 0 },
      { "stationCode": "e4", "distance": 6.3 },
      { "stationCode": "e5", "distance": 18.2 },
      { "stationCode": "e6", "distance": 20.6 },
      { "stationCode": "e7", "distance": 17.6 },
      { "stationCode": "e8", "distance": 13.6 },
      { "stationCode": "e9", "distance": 9.4 },
      { "stationCode": "e10", "distance": 10.3 },
      { "stationCode": "e11", "distance": 19.5 },
      { "stationCode": "e12", "distance": 19.1 },
      { "stationCode": "e13", "distance": 12.1 },
      { "stationCode": "e14", "distance": 16.6 }
    ]
  },
  {
    "stationCode": "e4",
    "distances": [
      { "stationCode": "e1", "distance": 24.8 },
      { "stationCode": "e2", "distance": 14.8 },
      { "stationCode": "e3", "distance": 6.3 },
      { "stationCode": "e4", "distance": 0 },
      { "stationCode": "e5", "distance": 12 },
      { "stationCode": "e6", "distance": 14.4 },
      { "stationCode": "e7", "distance": 11.5 },
      { "stationCode": "e8", "distance": 12.4 },
      { "stationCode": "e9", "distance": 12.6 },
      { "stationCode": "e10", "distance": 16.7 },
      { "stationCode": "e11", "distance": 23.6 },
      { "stationCode": "e12", "distance": 18.6},
      { "stationCode": "e13", "distance": 10.6 },
      { "stationCode": "e14", "distance": 15.4 }
    ]
  },
  {
    "stationCode": "e5",
    "distances": [
      { "stationCode": "e1", "distance": 36.4 },
      { "stationCode": "e2", "distance": 26.6 },
      { "stationCode": "e3", "distance": 18.2 },
      { "stationCode": "e4", "distance": 12 },
      { "stationCode": "e5", "distance": 0 },
      { "stationCode": "e6", "distance": 3 },
      { "stationCode": "e7", "distance": 2.4 },
      { "stationCode": "e8", "distance": 19.4 },
      { "stationCode": "e9", "distance": 23.3 },
      { "stationCode": "e10", "distance": 28.2 },
      { "stationCode": "e11", "distance": 34.2 },
      { "stationCode": "e12", "distance": 24.8 },
      { "stationCode": "e13", "distance": 14.5 },
      { "stationCode": "e14", "distance": 17.9 }
    ]
  },
  {
    "stationCode": "e6",
    "distances": [
      { "stationCode": "e1", "distance": 38.8 },
      { "stationCode": "e2", "distance": 29.1 },
      { "stationCode": "e3", "distance": 20.6 },
      { "stationCode": "e4", "distance": 14.4 },
      { "stationCode": "e5", "distance": 3 },
      { "stationCode": "e6", "distance": 0 },
      { "stationCode": "e7", "distance": 3.3 },
      { "stationCode": "e8", "distance": 22.3 },
      { "stationCode": "e9", "distance": 25.7 },
      { "stationCode": "e10", "distance": 30.3 },
      { "stationCode": "e11", "distance": 36.7 },
      { "stationCode": "e12", "distance": 27.6 },
      { "stationCode": "e13", "distance": 15.2 },
      { "stationCode": "e14", "distance": 18.2 }
    ]
  },
  {
    "stationCode": "e7",
    "distances": [
      { "stationCode": "e1", "distance": 35.8 },
      { "stationCode": "e2", "distance": 26.1 },
      { "stationCode": "e3", "distance": 17.6 },
      { "stationCode": "e4", "distance": 11.5 },
      { "stationCode": "e5", "distance": 2.4 },
      { "stationCode": "e6", "distance": 3.3 },
      { "stationCode": "e7", "distance": 0 },
      { "stationCode": "e8", "distance": 20 },
      { "stationCode": "e9", "distance": 23 },
      { "stationCode": "e10", "distance": 27.3 },
      { "stationCode": "e11", "distance": 34.2 },
      { "stationCode": "e12", "distance": 25.7 },
      { "stationCode": "e13", "distance": 12.4 },
      { "stationCode": "e14", "distance": 15.6 }
    ]
  },
  {
    "stationCode": "e8",
    "distances": [
      { "stationCode": "e1", "distance": 25.4 },
      { "stationCode": "e2", "distance": 17.3 },
      { "stationCode": "e3", "distance": 13.6 },
      { "stationCode": "e4", "distance": 12.4 },
      { "stationCode": "e5", "distance": 19.4 },
      { "stationCode": "e6", "distance": 22.3 },
      { "stationCode": "e7", "distance": 20 },
      { "stationCode": "e8", "distance": 0 },
      { "stationCode": "e9", "distance": 8.2 },
      { "stationCode": "e10", "distance": 20.3 },
      { "stationCode": "e11", "distance": 16.1 },
      { "stationCode": "e12", "distance": 6.4 },
      { "stationCode": "e13", "distance": 22.7 },
      { "stationCode": "e14", "distance": 27.6 }
    ]
  },
  {
    "stationCode": "e9",
    "distances": [
      { "stationCode": "e1", "distance": 17.6 },
      { "stationCode": "e2", "distance": 10 },
      { "stationCode": "e3", "distance": 9.4 },
      { "stationCode": "e4", "distance": 12.6 },
      { "stationCode": "e5", "distance": 23.3 },
      { "stationCode": "e6", "distance": 25.7 },
      { "stationCode": "e7", "distance": 23 },
      { "stationCode": "e8", "distance": 8.2 },
      { "stationCode": "e9", "distance": 0 },
      { "stationCode": "e10", "distance": 13.5 },
      { "stationCode": "e11", "distance": 11.2 },
      { "stationCode": "e12", "distance": 10.9 },
      { "stationCode": "e13", "distance": 21.2 },
      { "stationCode": "e14", "distance": 26.6 }
    ]
  },
  {
    "stationCode": "e10",
    "distances": [
      { "stationCode": "e1", "distance": 9.1 },
      { "stationCode": "e2", "distance": 3.5 },
      { "stationCode": "e3", "distance": 10.3 },
      { "stationCode": "e4", "distance": 16.7 },
      { "stationCode": "e5", "distance": 28.2 },
      { "stationCode": "e6", "distance": 30.3 },
      { "stationCode": "e7", "distance": 27.3 },
      { "stationCode": "e8", "distance": 20.3 },
      { "stationCode": "e9", "distance": 13.5 },
      { "stationCode": "e10", "distance": 0 },
      { "stationCode": "e11", "distance": 17.6 },
      { "stationCode": "e12", "distance": 24.2 },
      { "stationCode": "e13", "distance": 18.7 },
      { "stationCode": "e14", "distance": 21.2 }
    ]
  },
  {
    "stationCode": "e11",
    "distances": [
      { "stationCode": "e1", "distance": 16.7 },
      { "stationCode": "e2", "distance": 15.5 },
      { "stationCode": "e3", "distance": 19.5 },
      { "stationCode": "e4", "distance": 23.6 },
      { "stationCode": "e5", "distance": 34.2 },
      { "stationCode": "e6", "distance": 36.7 },
      { "stationCode": "e7", "distance": 34.2 },
      { "stationCode": "e8", "distance": 16.1 },
      { "stationCode": "e9", "distance": 11.2 },
      { "stationCode": "e10", "distance": 17.6 },
      { "stationCode": "e11", "distance": 0 },
      { "stationCode": "e12", "distance": 14.2 },
      { "stationCode": "e13", "distance": 31.5 },
      { "stationCode": "e14", "distance": 35.5 }
    ]
  },
  {
    "stationCode": "e12",
    "distances": [
      { "stationCode": "e1", "distance": 27.3 },
      { "stationCode": "e2", "distance": 20.9 },
      { "stationCode": "e3", "distance": 19.1 },
      { "stationCode": "e4", "distance": 18.6 },
      { "stationCode": "e5", "distance": 24.8 },
      { "stationCode": "e6", "distance": 27.6 },
      { "stationCode": "e7", "distance": 25.7 },
      { "stationCode": "e8", "distance": 6.4 },
      { "stationCode": "e9", "distance": 10.9 },
      { "stationCode": "e10", "distance": 24.2 },
      { "stationCode": "e11", "distance": 14.2 },
      { "stationCode": "e12", "distance": 0 },
      { "stationCode": "e13", "distance": 28.8 },
      { "stationCode": "e14", "distance": 33.6 }
    ]
  },
  {
    "stationCode": "e13",
    "distances": [
      { "stationCode": "e1", "distance": 27.6 },
      { "stationCode": "e2", "distance": 19.1 },
      { "stationCode": "e3", "distance": 12.1 },
      { "stationCode": "e4", "distance": 10.6 },
      { "stationCode": "e5", "distance": 14.5 },
      { "stationCode": "e6", "distance": 15.2 },
      { "stationCode": "e7", "distance": 12.4 },
      { "stationCode": "e8", "distance": 22.7 },
      { "stationCode": "e9", "distance": 21.2 },
      { "stationCode": "e10", "distance": 18.7 },
      { "stationCode": "e11", "distance": 31.5 },
      { "stationCode": "e12", "distance": 28.8 },
      { "stationCode": "e13", "distance": 0 },
      { "stationCode": "e14", "distance": 5.1 }
    ]
  },
  {
    "stationCode": "e14",
    "distances": [
      { "stationCode": "e1", "distance": 29.8 },
      { "stationCode": "e2", "distance": 21.8 },
      { "stationCode": "e3", "distance": 16.6 },
      { "stationCode": "e4", "distance": 15.4 },
      { "stationCode": "e5", "distance": 17.9 },
      { "stationCode": "e6", "distance": 18.2 },
      { "stationCode": "e7", "distance": 15.6 },
      { "stationCode": "e8", "distance": 27.6 },
      { "stationCode": "e9", "distance": 26.6 },
      { "stationCode": "e10", "distance": 21.2 },
      { "stationCode": "e11", "distance": 35.5 },
      { "stationCode": "e12", "distance": 66.6 },
      { "stationCode": "e13", "distance": 5.1 },
      { "stationCode": "e14", "distance": 0 }
    ]
  }
];
const newRealDistances = [
  {
    "stationCode": "e1",
    "distances": [{ "stationCode": "e2", "distance": 10 }]
  },
  {
    "stationCode": "e2",
    "distances": [
      { "stationCode": "e1", "distance": 10 },
      { "stationCode": "e3", "distance": 8.5 },
      { "stationCode": "e9", "distance": 10 },
      { "stationCode": "e10", "distance": 3.5 }
    ]
  },
  {
    "stationCode": "e3",
    "distances": [
      { "stationCode": "e2", "distance": 8.5 },
      { "stationCode": "e4", "distance": 6.3 },
      { "stationCode": "e9", "distance": 9.4 },
      { "stationCode": "e13", "distance": 18.7 }
    ]
  },
  {
    "stationCode": "e4",
    "distances": [
      { "stationCode": "e3", "distance": 6.3 },
      { "stationCode": "e5", "distance": 13 },
      { "stationCode": "e8", "distance": 15.3 },
      { "stationCode": "e13", "distance": 12.8 },
      { "stationCode": "e14", "distance": 11 }
    ]
  },
  {
    "stationCode": "e5",
    "distances": [
      { "stationCode": "e4", "distance": 13 },
      { "stationCode": "e6", "distance": 3 },
      { "stationCode": "e7", "distance": 2.4 },
      { "stationCode": "e8", "distance": 30 }
    ]
  },
  {
    "stationCode": "e6",
    "distances": [{ "stationCode": "e6", "distance": 3 }]
  },
  {
    "stationCode": "e7",
    "distances": [{ "stationCode": "e5", "distance": 2.4 }]
  },
  {
    "stationCode": "e8",
    "distances": [
      { "stationCode": "e5", "distance": 30 },
      { "stationCode": "e4", "distance": 15.3 },
      { "stationCode": "e9", "distance": 9.6 },
      { "stationCode": "e12", "distance": 6.4 }
    ]
  },
  {
    "stationCode": "e9",
    "distances": [
      { "stationCode": "e2", "distance": 10 },
      { "stationCode": "e3", "distance": 9.4 },
      { "stationCode": "e8", "distance": 9.6 },
      { "stationCode": "e11", "distance": 12.2 }
    ]
  },
  {
    "stationCode": "e10",
    "distances": [{ "stationCode": "e2", "distance": 3.5 }]
  },
  {
    "stationCode": "e11",
    "distances": [{ "stationCode": "e9", "distance": 12.2 }]
  },
  {
    "stationCode": "e12",
    "distances": [{ "stationCode": "e8", "distance": 6.4 }]
  },
  {
    "stationCode": "e13",
    "distances": [
      { "stationCode": "e3", "distance": 18.7 },
      { "stationCode": "e4", "distance": 12.8 }
    ]
  },
  {
    "stationCode": "e14",
    "distances": [
      { "stationCode": "e4", "distance": 11 },
      { "stationCode": "e13", "distance": 5.1 }
    ]
  }
];
const lines = [
  { "stationCode": "e1", "stationColors": ["blue"] },
  { "stationCode": "e2", "stationColors": ["blue", "yellow"] },
  { "stationCode": "e3", "stationColors": ["blue", "red"] },
  { "stationCode": "e4", "stationColors": ["blue", "green"] },
  { "stationCode": "e5", "stationColors": ["blue", "yellow"] },
  { "stationCode": "e6", "stationColors": ["blue"] },
  { "stationCode": "e7", "stationColors": ["yellow"] },
  { "stationCode": "e8", "stationColors": ["yellow", "green"] },
  { "stationCode": "e9", "stationColors": ["yellow", "red"] },
  { "stationCode": "e10", "stationColors": ["yellow"] },
  { "stationCode": "e11", "stationColors": ["red"] },
  { "stationCode": "e12", "stationColors": ["green"] },
  { "stationCode": "e13", "stationColors": ["green", "red"] },
  { "stationCode": "e14", "stationColors": ["green"] }
];