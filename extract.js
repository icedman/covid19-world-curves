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
    try {
        let content = fs.readFileSync(`../data/${country}.html`);
        processContent(content);
    } catch (err) {
        console.log(`!!${country}`);
    }
}

// let cc = Array.prototype.map.call(document.querySelectorAll('a.mt_a'), a => { var aa = a.href.split('country/'); return aa[1].replace('/','') })

// const countries = ["china", "italy", "us", "spain", "philippines"]

const countries = ["us","spain","italy","france","germany","uk","china","iran","turkey","belgium","russia","brazil","canada","netherlands","switzerland","portugal","austria","india","ireland","sweden","israel","peru","south-korea","chile","japan","poland","ecuador","romania","saudi-arabia","denmark","pakistan","norway","australia","czech-republic","mexico","indonesia","philippines","united-arab-emirates","serbia","malaysia","singapore","belarus","qatar","ukraine","dominican-republic","panama","finland","luxembourg","colombia","egypt","thailand","argentina","south-africa","morocco","algeria","moldova","greece","bangladesh","croatia","hungary","iceland","bahrain","kuwait","kazakhstan","iraq","estonia","new-zealand","uzbekistan","azerbaijan","slovenia","armenia","bosnia-and-herzegovina","lithuania","macedonia","oman","slovakia","china-hong-kong-sar","cameroon","cuba","afghanistan","bulgaria","tunisia","cyprus","djibouti","andorra","cote-d-ivoire","latvia","lebanon","costa-rica","ghana","niger","burkina-faso","albania","uruguay","kyrgyzstan","guinea","channel-islands","bolivia","honduras","nigeria","san-marino","malta","jordan","state-of-palestine","reunion","taiwan","georgia","senegal","mauritius","montenegro","isle-of-man","democratic-republic-of-the-congo","viet-nam","kenya","mayotte","sri-lanka","guatemala","venezuela","paraguay","faeroe-islands","el-salvador","mali","martinique","tanzania","guadeloupe","congo","jamaica","rwanda","brunei-darussalam","gibraltar","cambodia","madagascar","trinidad-and-tobago","ethiopia","french-guiana","aruba","gabon","monaco","myanmar","bermuda","togo","somalia","liechtenstein","equatorial-guinea","liberia","barbados","cayman-islands","sint-maarten","guyana","cabo-verde","french-polynesia","uganda","bahamas","zambia","libya","china-macao-sar","haiti","guinea-bissau","saint-martin","benin","eritrea","mozambique","syria","sudan","mongolia","nepal","maldives","chad","sierra-leone","zimbabwe","antigua-and-barbuda","angola","laos","belize","new-caledonia","timor-leste","malawi","fiji","swaziland","dominica","namibia","botswana","saint-lucia","curacao","grenada","saint-kitts-and-nevis","central-african-republic","saint-vincent-and-the-grenadines","turks-and-caicos-islands","falkland-islands-malvinas","greenland","montserrat","seychelles","suriname","gambia","nicaragua","holy-see","mauritania","papua-new-guinea","saint-barthelemy","western-sahara","burundi","bhutan","british-virgin-islands","sao-tome-and-principe","south-sudan","anguilla","caribbean-netherlands","saint-pierre-and-miquelon","yemen"];

// const countries = ['djibouti',
// 'andorra',
// 'taiwan',
// 'georgia',
// 'trinidad-and-tobago',
// 'ethiopia',
// 'western-sahara']

countries.forEach(c => { processCountry(c)});

// download('italy');
// download('philippines');
// processCountry('italy');
// processCountry('philippines');