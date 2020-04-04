import React from 'react';
// import logo from './logo.svg';
// import './App.css';

import http from 'axios';

const countries = ["us", "italy", "spain", "china", "germany", "iran", "france", "uk", "switzerland", "belgium","netherlands", "south-korea", "turkey", "austria", "canada", "portugal", "israel", "norway", "brazil", "australia", "sweden", "malaysia", "ireland", "denmark", "poland", "philippines", "indonesia", "greece", "india", "china-hong-kong-sar", "iraq", "algeria"] // const countries = ["china", "italy", "us", "spain", "philippines"]
// const countries = ["us", "italy", "spain", "china", "philippines"]

/*
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
  }, 200)

  if (!datasetCount) {
    return <div></div>
  }

  return <div className="chart">
    <div className="title">{country} - {title.text}</div>
    <div id={`${key}`}></div>
  </div>
}
*/

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
      return '' // idx
    })

    let bar = new window.Chart(ctx, {
                type: 'line',
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


function App() {

  const [ daily, setDaily ] = React.useState([])
  const [ total, setTotal ] = React.useState([])

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
              plot: [ ... s.data ]
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
    let d = countries.map(c => { return loadCountry(c, 'graph-cases-daily')});
    Promise.all(d).then(res => {
      setDaily(res.map(r => {
          return r.data[0]
        })
      )
    })

    let t = countries.map(c => { return loadCountry(c, 'coronavirus-cases-log')});
    Promise.all(t).then(res => {

      // res.forEach(r => {
      //   let x = r.data[0];
      //   x.dataset[0].plot[0] = 0;      
      //   for(let i=1; i<x.dataset[0].data.length; i++) {
      //     let k = x.dataset[0].data[i];
      //     let p = x.dataset[0].data[i-1];
      //     x.dataset[0].plot[i] = (k - p); // /(p+0.001);
      //   }
      //   x.dataset[0].data = x.dataset[0].plot;  
      // })

      setTotal(res.map(r => {
          return r.data[0]
        })
      )
    })
  }, [] );

  return (
    <div className="App" style={{display:'flex'}}>
    <div style={{flex:1}}>
      {daily.map((d,idx) => {
        return <Chart key={'daily-'+idx} data={d} report='daily'/>
      })}
    </div>
    <div style={{flex:1}}>
      {total.map((d,idx) => {
        return <Chart key={'total-'+idx} data={d} report='total'/>
      })}
    </div>
    </div>
  );
}

export default App;
  