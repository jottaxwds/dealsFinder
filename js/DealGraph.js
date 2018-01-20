// Functions to get the cheapest or fastest by applying algorythm
// using Graph...
function getCheapestDeal(info, origin, destiny) {
    var cheapestRoutes = {};
    var cheapestGraph = {};
    var auxKey = "";
    var time = 0;
    info.forEach(function (el) {
        time = (parseInt(el.duration.h) * 60) + parseInt(el.duration.m); 
        auxKey = el.departure + ' - ' + el.arrival;
        if (cheapestRoutes[auxKey] === undefined || cheapestRoutes[auxKey].cost >= el.cost) {
            cheapestRoutes[auxKey] = { 
                "departure": el.departure,
                "arrival": el.arrival,
                "reference": el.reference,
                "cost": el.cost,
                "time": time,
                "timeFormat": el.duration.h + "h " + el.duration.m + "min",
                "transportType": el.transport
            };
        }
        if (cheapestGraph[el.departure] === undefined) {
            cheapestGraph[el.departure] = {};
            cheapestGraph[el.departure][el.arrival] = el.cost;
        }
        else if (cheapestGraph[el.departure][el.arrival] === undefined) {
            cheapestGraph[el.departure][el.arrival] = el.cost;
        }
        else if (cheapestGraph[el.departure][el.arrival] > el.cost) {
            cheapestGraph[el.departure][el.arrival] = el.cost;
        }
    });
    var graph1 = new Graph(cheapestGraph);
    cheapestArray = graph1.findShortestPath(origin, destiny); // cheapest

    var totalCost = 0;
    var totalDuration = 0;
    var resultArray=[];
    cheapestArray.forEach(function (el, key) {
        if (key != cheapestArray.length - 1) {
            resultArray.push(cheapestRoutes[el + " - " + cheapestArray[key + 1]]);
            totalDuration += cheapestRoutes[el + " - " + cheapestArray[key + 1]].time;
            totalCost += cheapestRoutes[el + " - " + cheapestArray[key + 1]].cost;
        }
    });

    return [resultArray, totalDuration, totalCost];
}


function getFastestDeal (info, origin, destiny) {
    debugger;
    var quickestRoutes = {};
    var quickestGraph = {};
    var auxKey = "";
    var time = 0;
    var totalCost = 0;

    info.forEach(function (el) {
        time = (parseInt(el.duration.h) * 60) + parseInt(el.duration.m); // minutes
        auxKey = el.departure + ' - ' + el.arrival;
        if (quickestRoutes[auxKey] === undefined || quickestRoutes[auxKey].time >= time) {           
            quickestRoutes[auxKey] = {
                "departure": el.departure,
                "arrival": el.arrival,
                "reference": el.reference,
                "cost": el.cost,
                "time": time,
                "timeFormat": el.duration.h + "h " + el.duration.m +"min",
                "transportType": el.transport
            };
        }
        if (quickestGraph[el.departure] === undefined) {
            quickestGraph[el.departure] = {};
            quickestGraph[el.departure][el.arrival] = time;
        }
        else if (quickestGraph[el.departure][el.arrival] === undefined) {
            quickestGraph[el.departure][el.arrival] = time;
        }
        else if (quickestGraph[el.departure][el.arrival] > time) {
            quickestGraph[el.departure][el.arrival] = time;
        }
    });

    var graph1 = new Graph(quickestGraph);
    quickestArray = graph1.findShortestPath(origin, destiny); // Fastest

    var resultArray = [];
    var totalDuration = 0;
    quickestArray.forEach(function (el, key) {
        if (key != quickestArray.length - 1) {
            totalDuration += quickestRoutes[el + " - " + quickestArray[key + 1]].time;
            resultArray.push(quickestRoutes[el + " - " + quickestArray[key + 1]]);
            totalCost += quickestRoutes[el + " - " + quickestArray[key + 1]].cost;
        }
    });
    return [resultArray, totalDuration, totalCost];

}

