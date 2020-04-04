import React, { Fragment } from 'react';
// import logo from './logo.svg';
// import './App.css';

import http from 'axios';

const countries = ["us", "italy", "spain", "china", "germany", "iran", "france", "uk", "switzerland", "belgium","netherlands", "south-korea", "turkey", "austria", "canada", "portugal", "israel", "norway", "brazil", "australia", "sweden", "malaysia", "ireland", "denmark", "poland", "philippines", "indonesia", "greece", "india", "china-hong-kong-sar", "iraq", "algeria"] // const countries = ["china", "italy", "us", "spain", "philippines"]
// const countries = ["us", "italy", "spain", "china", "philippines"]


function Chartress(props) {
  const data = props.data;
  const title = data.title;
  const country = data.country;

  const dataset = data.dataset || [];
  const datasetCount = dataset.length;

  const key = props.report + '-' + country;

  setTimeout(() => {
    let sel = document.querySelector(`#${key}`);
    if (!sel) {
      // console.log(country);
      return;
    }
    sel.innerHTML = '';
    try {
      console.log(data);
      let chart = window.chartress(sel, data);
    } catch(err) {
      // suppress some errors
    }
  }, 100)

  if (!datasetCount) {
    return <div></div>
  }

  return <div className="chart">
    <div className="title">{country} - {title.text}</div>
    <div id={`${key}`}></div>
  </div>
}

function Chart(props) {
  const data = props.data;
  const title = data.title;
  const country = data.country;

  const dataset = (data.dataset || []);

  const datasetCount = dataset.length;

  const key = props.report + '-' + country;

  setTimeout(() => {
    let sel = document.querySelector(`#${key}`);
    if (!sel) {
      // console.log(country);
      return;
    }

    let ctx = sel.getContext('2d');
    let labels = dataset[0].data.map((m,idx) => {
      return idx
    })

    let bar = new window.Chart(ctx, {
                type: 'bar',
                data: {
                  labels,
                  datasets: dataset,
                },
                options: {
                    responsive: true,
                    legend: {
                        display: false,
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: country + ' - ' + data.title.text
                    }
                }
            });

  }, 0)

  if (!datasetCount) {
    return <div></div>
  }

  return <div className="chart">
    {/*<div className="title">{country} - {title.text}</div>*/}
    <canvas id={`${key}`}></canvas>
  </div>
}


const XChart = Chart;

function App() {

  const [ daily, setDaily ] = React.useState([])
  const [ total, setTotal ] = React.useState([])
  const [ deaths, setDeaths ] = React.useState([])
  const [ rate, setRate ] = React.useState([])

  const updateSummary = (res) => {
    let s = {};
    let countryRate = []
    console.log('summary');
    res[1].forEach(t => {
      s[t.country] = s[t.country] || {}
      s[t.country].cases = t.dataset[0].data;
    })
    res[2].forEach(t => {
      s[t.country] = s[t.country] || {}
      s[t.country].deaths = t.dataset[0].data;
    })

    Object.keys(s).forEach(k => {
      s[k].rate = [];
      let lastRate = 0;
      s[k].cases.forEach((c,idx)=>{
        let rate = s[k].deaths[idx] / (c || 1);
        s[k].rate.push(rate);
        lastRate = rate;
      })

      countryRate.push({ country: k, rate: lastRate.toFixed(4)})
    })

    setRate(countryRate);
  }

  const loadCountry = (c, w) => {
    return new Promise((resolve, reject) => {
      http.get(`./data/${c}-${w}.json`)
      .then(res => {

        let linechart = {
          country: c.toUpperCase(),
          title: res.data.title,
          dataset: res.data.series.map(s => {
            return {
              ...s,
              label: s.name,
              plot: [ ... s.data ],
              backgroundColor: '#f00'
            }
          }),
        }

        resolve({
          data: [
            linechart
        ]});
      })
    })
  }

  React.useEffect(() => {
    let r1 = 0;
    let r2 = 0;
    let r3 = 0;
    let p1 = new Promise(function(r,e) { r1 = r; return r; });
    let p2 = new Promise(function(r,e) { r2 = r; return r; });
    let p3 = new Promise(function(r,e) { r3 = r; return r; });

    let d = countries.map(c => { return loadCountry(c, 'graph-cases-daily')});
    Promise.all(d).then(res => {
      let state = res.map(r => {
          return r.data[0]
        });
      setDaily(state)
      r1(state);
    })

    let t = countries.map(c => { return loadCountry(c, 'coronavirus-cases-linear')});
    Promise.all(t).then(res => {
      let state = res.map(r => {
          return r.data[0]
        });
      setTotal(state)
      r2(state);
    })

    let x = countries.map(c => { return loadCountry(c, 'coronavirus-deaths-linear')});
    Promise.all(x).then(res => {
      let state = res.map(r => {
          return r.data[0]
        });
      setDeaths(state)
      r3(state);
    })

    Promise.all([p1,p2,p3]).then(res => {
      setTimeout(()=>{updateSummary(res)}, 500);
    })
  }, [] );

  return (
    <div className="App">
    <div style={{display:'flex'}}>
    <div style={{flex:2}}>
      {daily.map((d,idx) => {
        return <Fragment>
          <a id={d.country}></a>
          <XChart key={'daily-'+idx} data={d} report='daily'/>
          </Fragment>
      })}
    </div>
    <div style={{flex:2}}>
      {total.map((d,idx) => {
        return <XChart key={'total-'+idx} data={d} report='total'/>
      })}
    </div>
    <div style={{flex:2}}>
      {
        deaths.map((d,idx) => {
        return <XChart key={'deaths-'+idx} data={d} report='deaths'/>
      })}
    </div>
    <div style={{flex:1.2}}>
      <h2>Rate</h2>
      <table>
      <tbody>
      {rate.map((d,idx)=>{
        return <tr key={'rate-'+idx}>
          <td>{idx+1}</td>
          <td><a href={`#${d.country}`}>{d.country}</a></td>
          <td>{d.rate}</td>
          </tr>
      })}
      </tbody>
      </table>
    </div>
    </div>
    </div>
  );
}

export default App;
  