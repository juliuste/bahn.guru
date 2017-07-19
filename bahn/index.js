'use strict'

const params = require('./lib/params')
const options = require('./lib/options')
const station = require('./lib/station')
const route = require('./lib/route')

const shopLink = (from, to, cl, bc, date) => {

    let bahncard = bc
    if(cl === 1){
        if(bc === 2) bahncard = 1
        if(bc === 4) bahncard = 3
    }
    const data = {
        "startSucheSofort": true,
        "startBhfName": from.name,
        "startBhfId": "00"+from.id,
        "zielBhfName": to.name,
        "zielBhfId": "00"+to.id,
        "schnelleVerbindungen": true,
        "klasse": cl,
        "tripType": "single",
        "datumHin": date,
        "travellers": [{"typ":"E","bc":bahncard}]
    }

    return 'https://ps.bahn.de/preissuche/preissuche/psc_start.post?country=DEU&lang=de&dbkanal_007=L01_S01_D001_KIN0001_qf-sparpreis-svb-kl2_lz03&ps=1&psc-anfragedata-json='+JSON.stringify(data)
}

module.exports = {params, options, station, route, shopLink}
