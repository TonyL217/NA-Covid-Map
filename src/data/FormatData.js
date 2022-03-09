import * as data from './stateGeo.json';
import papaParse from 'papaparse';

const { features } = data
let statesGeoData = features;
let url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_state.csv"



const loadData = async (setGeo) => {
    loadGeoData(setGeo).then((geoData) => {
        setGeo(geoData);
    });
}

let loadGeoData = async () => {
    let result = new Promise((resolve, reject) => {
        papaParse.parse(url, {
            download: true,
            header: true,
            complete: (covidCounts, file) => {
                //remove princess cruises and puerto rico from us states as they do not count
                covidCounts = covidCounts.data.filter((covidCounts) => (covidCounts.ISO3 === "USA") && (!covidCounts.Province_State.includes('Princess')))
                statesGeoData = statesGeoData.filter((elem) => elem.properties.NAME !== "Puerto Rico")
                let alaska = statesGeoData.find((state) => state.properties.NAME === "Alaska")
                //prevents pieces of alaska from appearin on the other side of the world
                alaska.geometry.coordinates.forEach(coord => {
                    coord.forEach(region => {
                        region.forEach(latlng => {
                            if (latlng[0] > 0) {
                                latlng[0] = latlng[0] - 360
                            }
                        })
                    })
                })

                statesGeoData.forEach((geoState) => {
                    let match = covidCounts.find((covidState) => (covidState.Province_State === geoState.properties.NAME))
                    geoState.properties.covidCount = parseInt(match.Confirmed);
                    geoState.properties.covidCountDeci = match.Confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                })
                resolve(statesGeoData);
            },
        })
    })
    return result;
}

const loadStats = (setStats, statesGeoData) => {
    const rangesLength = 7

    let covidCounts = []
    let totalCounts = 0;
    let covidCount;
    statesGeoData.forEach((state) => {
        covidCount = state.properties.covidCount
        covidCounts.push((covidCount))
        totalCounts += covidCount
    })
    covidCounts = covidCounts.sort((a, b) => a - b);

    const ranges = []
    let leastCount = covidCounts[0].toPrecision(2)
    let maxCount = (covidCounts[covidCounts.length - 1]).toPrecision(2)
    let diff = ((maxCount - leastCount) / rangesLength).toPrecision(2)

    let from, to;
    for (let i = 0; i < rangesLength; i++) {
        to = parseFloat(leastCount) + parseFloat(diff) * (i + 1)
        from = parseFloat(leastCount) + (parseFloat(diff) * i) - 1
        ranges.push([from, to])
    }
    setStats({ totalCounts, covidCounts, ranges })
}




export { loadData, loadStats };