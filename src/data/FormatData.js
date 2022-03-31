import * as data from './stateGeo.json';
import papaParse from 'papaparse';

const { features } = data;
let statesGeoData = features;
let url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_state.csv";

const loadGeoData = async () => {
    let result = new Promise((resolve, reject) => {
        papaParse.parse(url, {
            download: true,
            header: true,
            complete: (covidCounts, file) => {
                //remove princess cruises and puerto rico from us states as they do not count
                covidCounts = covidCounts.data.filter((covidCounts) => (covidCounts.ISO3 === "USA") && (!covidCounts.Province_State.includes('Princess')));
                statesGeoData = statesGeoData.filter((elem) => elem.properties.NAME !== "Puerto Rico");
                let alaska = statesGeoData.find((state) => state.properties.NAME === "Alaska");
                //prevents pieces of alaska from appearin on the other side of the world
                alaska.geometry.coordinates.forEach(coord => {
                    coord.forEach(region => {
                        region.forEach(latlng => {
                            if (latlng[0] > 0) {
                                latlng[0] = latlng[0] - 360;
                            }
                        })
                    })
                });

                statesGeoData.forEach((geoState,id) => {
                    let match = covidCounts.find((covidState) => (covidState.Province_State === geoState.properties.NAME));
                    geoState.properties.covidCount = parseInt(match.Confirmed);
                    geoState.properties.covidCountDeci = match.Confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    geoState.properties.id = parseInt(geoState.properties.STATE);
                })
                resolve(statesGeoData);
            },
            error: (err) => {
                throw `error fetching covidCounts: ${err}`;
            }
        })
    })
    return result;
}

const loadStatsData = (statesGeoData) => {
    const rangesLength = 7;

    let sortedCovidCounts = [];
    let totalCounts = 0;
    let covidCount;
    statesGeoData.forEach((state) => {
        covidCount = state.properties.covidCount;
        sortedCovidCounts.push((covidCount));
        totalCounts += covidCount;
    })
    sortedCovidCounts = sortedCovidCounts.sort((a, b) => a - b);

    const ranges = [];
    let leastCount = sortedCovidCounts[0];
    leastCount -= Math.pow(10, parseInt(Math.log10(10, leastCount)) - 1).toPrecision(2);
    let maxCount = (sortedCovidCounts[sortedCovidCounts.length - 1]).toPrecision(2);
    let diff = ((maxCount - leastCount) / rangesLength).toPrecision(2);
    let from, to;

    for (let i = 0; i < rangesLength; i++) {
        from = parseFloat(leastCount) + (parseFloat(diff) * i) - 1;
        to = parseFloat(leastCount) + parseFloat(diff) * (i + 1);
        ranges.push([from, to]);
    }
    return { totalCounts, ranges };
}

export { loadGeoData, loadStatsData };