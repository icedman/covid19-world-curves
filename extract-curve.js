const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const axios = require('axios');

const link = 'https://www.worldometers.info/coronavirus/country/xxx';
let currentCountry;

const Highcharts = {
    setOptions: () => {},
    chart: (title, data) => {
        fs.writeFileSync(`../data/${currentCountry}-${title}.json`, JSON.stringify(data, null, 4));
    }
}

async function download(country) {
    try {
        let res = await axios.get(link.replace('xxx', country));
        fs.writeFileSync(`../data/${country}.html`, res.data);
        console.log(country);
    } catch(err) {
        console.log(country + ' failed to download');
    }
}

async function processContent(content) {
    let dom = new JSDOM(content);
    let doc = dom.window.document;

    // console.log(content);
    // console.log(dom);

    let scs = doc.querySelectorAll('script');
    Array.prototype.forEach.call(scs, s => {
        let code = s.innerHTML;
        if (code.includes('Highcharts') && code.includes('title')) {
            eval(code);
        }
    });
}

async function processCountry(country) {
    currentCountry = country;
    let content = fs.readFileSync(`../data/${country}.html`);
    processContent(content);
}

// let cc = Array.prototype.map.call(document.querySelectorAll('a.mt_a'), a => { var aa = a.href.split('country/'); return aa[1].replace('/','') })

const countries = ["us", "italy", "spain", "china", "germany", "iran", "france", "uk", "switzerland", "belgium","netherlands", "south-korea", "turkey", "austria", "canada", "portugal", "israel", "norway", "brazil", "australia", "sweden", "malaysia", "ireland", "denmark", "poland", "philippines", "indonesia", "greece", "india", "china-hong-kong-sar", "iraq", "algeria"]
// const countries = ["china", "italy", "us", "spain", "philippines"]

countries.forEach(c => { download(c)});
countries.forEach(c => { processCountry(c)});

// download('italy');
// download('philippines');
// processCountry('italy');
// processCountry('philippines');