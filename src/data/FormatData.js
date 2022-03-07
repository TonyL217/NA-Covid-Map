import * as data from './stateGeo.json';
import papaParse from 'papaparse';

const { features } = data
let statesGeoData = features;
let url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_state.csv"



const loadData = async (setGeo, setStyles) => {
    loadGeoData(setGeo).then((geoData) => {
        const colors = ["#FFEDA0", "#FED976", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"];
        setStyles({ colors });
        setGeo(geoData);
    });
}

const getRanges = (setStyles, styles, geoData) => {
    if (geoData.length) {
        const ranges = loadRanges(geoData);
        let newStyles = Object.assign({}, styles)
        newStyles.ranges = ranges
        setStyles(newStyles)
    }
}

const colorMap = (setGeo, geoData, ranges, colors) => {


}

const loadRanges = (statesGeoData) => {
    const rangesLength = 7

    let covidCounts = []
    statesGeoData.forEach((state) => {
        covidCounts.push((state.properties.covidCount))
    })
    covidCounts = covidCounts.sort((a, b) => a - b);
    console.log(covidCounts)

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
    
    return ranges
}


let loadGeoData = async (setState) => {
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

                const colors = ["#FFEDA0", "#FED976", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"];
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


export { loadData, getRanges, colorMap };