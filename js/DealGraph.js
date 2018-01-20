
function getCheapestDeal(info, origin, destiny) {
    var cheapestRoutes = {};
    var cheapestGraph = {};
    var auxKey = "";
    info.forEach(function (el) {
        auxKey = el.departure + ' - ' + el.arrival;
        if (cheapestRoutes[auxKey] === undefined || cheapestRoutes[auxKey].cost >= el.cost) {
            cheapestRoutes[auxKey] = { "departure": el.departure, "arrival": el.arrival, "reference": el.reference, "cost": el.cost };
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
    cheapestArray.forEach(function (el, key) {
        if (key != cheapestArray.length - 1) {
            console.log(cheapestRoutes[el + " - " + cheapestArray[key + 1]]);
            totalCost += cheapestRoutes[el + " - " + cheapestArray[key + 1]].cost;
            // console.log('#' + (key + 1) + " flight: " + cheapestRoutes[el + " - " + cheapestArray[key + 1]].reference + " - Cost: " + cheapestRoutes[el + " - " + cheapestArray[key + 1]].cost);
        }
    });
    // console.log("Total Cost: " + totalCost + " " + info.currency);

    return [cheapestArray, totalCost, info.currency];
}


function getFastestDeal (info, origin, destiny) {

    var quickestRoutes = {};
    var quickestGraph = {};
    var auxKey = "";
    var time = 0;
    info.deals.forEach(function (el) {
        time = (parseInt(el.duration.h) * 60) + parseInt(el.duration.m); // minutes
        auxKey = el.departure + ' - ' + el.arrival;
        if (quickestRoutes[auxKey] === undefined || quickestRoutes[auxKey].time >= time) {
            quickestRoutes[auxKey] = { "departure": el.departure, "arrival": el.arrival, "reference": el.reference, "time": time };
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

    var totalDuration = 0;
    quickestArray.forEach(function (el, key) {
        if (key != quickestArray.length - 1) {
            totalDuration += quickestRoutes[el + " - " + quickestArray[key + 1]].time;
            console.log('#' + (key + 1) + " flight: " + quickestRoutes[el + " - " + quickestArray[key + 1]].reference + " - Duration: " + quickestRoutes[el + " - " + quickestArray[key + 1]].time);
        }
    });
    totalDuration = (totalDuration / 60);
    console.log("Total Duration: " + totalDuration + " hours");

    return [quickestArray, totalDuration]

}

