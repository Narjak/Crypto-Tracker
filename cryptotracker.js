registerPlugin({
    name: 'Crypto Tracker - Test Phase',
    version: '0.0.1',
    description: 'Add Crypto currency to channel or channel description',
    author: 'Narjak',
    requiredModules: ['http'],
    vars: [
        {
                name: 'updateinterval',
                title: 'Update Interval - How often should the coins be updated in minutes.',
                type: 'number'  
        },
        {     
            name: 'addcrypto',
            title: 'Add Crypto Currency',
            type: 'array',
            vars: [
            {
                name: 'addchannel',
                title: 'Add Channel',
                type: 'channel'
            },
            {
                name: 'cryptocurrency',
                title: 'Choose Crypto Curreny',
                type: 'select',
                options: [
                    'Bitcoin - BTC'
                ]
            },
            {
                name: 'fiat',
                title: 'fiat currency',
                type: 'select',
                options: [
                    'EURO',
                    'USD'
                ]
            },
            {
                name: 'prefix',
                title: 'Prefix',
                type: 'string'
            }
            ]
        }
        ]
}, (_, config, meta) => {
    const debug = true;
    const engine = require('engine');
    const backend = require('backend');
    const audio = require('audio');
    const http = require('http');
    engine.log('Crypto Tracker by Narjak successfully loaded!');
    var Run = function(){
        for (let {addchannel: addchannel, showoption: showoption, cryptocurrency: cryptocurrency, fiat: fiat, prefix: prefix} of config.addcrypto) {
            let url_crypto = "";
            let fiattag = "";
            let url_fiat = "";
            if (cryptocurrency == 0)
            {
                url_crypto = "btc";
            }
            if (fiat == 0){
                url_fiat = "eur";
                fiattag = "€";
            }
            else
            { 
                url_fiat = "usd";
                fiattag = "$";
            }
            let url =  "https://www.bitstamp.net/api/v2/ticker/" + url_crypto + url_fiat;

            http.simpleRequest({
            'method': 'GET',
            'url': url,
            'timeout': 6000,
            }, function (error, response) {
            if (error) {
                engine.log(" Error: " + error);
                return;
            }
            
            if (response.statusCode != 200) {
                engine.log("HTTP Error: " + response.status);
                return;
            }
            //http success
            let result = JSON.parse(response.data);
            let channel_id = backend.getChannelByID(addchannel);
            let date = new Date();
            let datetime;
            if (fiat == 0) {
                engine.log("time de");
                datetime = date.toLocaleString('de-DE');
            }else {
                engine.log("time us");
                datetime = date.toLocaleString('en-US');
            }
            let channelname = prefix + " " + result.last + fiattag;
            channel_id.setName(channelname);
            channel_id.setDescription("last updated: " + datetime);
            engine.log(prefix  + " - " + result.last + fiattag);
            if (debug == true){
                engine.log("Crypto was updated!")
                engine.log("Debug: " + "fiat: " + fiat + "cryptocurrency: " + cryptocurrency + "prefix:" + prefix);
                engine.log("Debug: " + "url:" + url);
            }

        });
        }
    }
    setInterval(Run, config.updateinterval * 60000);
    Run();
});

