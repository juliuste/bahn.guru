'use strict'

const params = require('./lib/params')
const options = require('./lib/options')
const station = require('./lib/station')
const journeys = require('./lib/journeys')
const settings = require('./settings')

const shopLink = (origin, destination, date, params) => {
    const bc = params.bc
    date = date.format('DD.MM.YY')

    let bahncard = bc
    if(params.class === 1){
        if(bc === 2) bahncard = 1
        if(bc === 4) bahncard = 3
    }
    const data = {
        "startSucheSofort": true,
        "startBhfName": origin.name,
        "startBhfId": "00"+origin.id,
        "zielBhfName": destination.name,
        "zielBhfId": "00"+destination.id,
        "schnelleVerbindungen": true,
        "klasse": params.class,
        "tripType": "single",
        "datumHin": date,
        "travellers": [{"typ":"E","bc":bahncard}]
    }

    return 'https://ps.bahn.de/preissuche/preissuche/psc_start.post?country=DEU&lang=de&dbkanal_007=L01_S01_D001_KIN0001_qf-sparpreis-svb-kl2_lz03&ps=1&psc-anfragedata-json='+JSON.stringify(data)
}

module.exports = {params, options, station, journeys, shopLink, settings}
