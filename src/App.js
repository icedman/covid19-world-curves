import React from 'react';
// import logo from './logo.svg';
// import './App.css';

import http from 'axios';

const countries = ["china", "italy", "us", "spain", "germany", "iran", "france", "switzerland", "south-korea", "uk", "netherlands", "austria", "belgium", "norway", "canada", "portugal", "australia", "sweden", "brazil", "malaysia", "denmark", "ireland", "poland", "greece", "indonesia", "philippines", "china-hong-kong-sar", "iraq", "algeria" ]
// const countries = ["china", "italy", "us", "spain", "philippines"]

function Chart(props) {
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

function App() {

  const [ daily, setDaily ] = React.useState([])
  const [ total, setTotal ] = React.useState([])

  const loadCountry = (c, w) => {
    return new Promise((resolve, reject) => {
      http.get(`./data/${c}-graph-${w}.json`)
      .then(res => {

        let linechart = {
          country: c.toUpperCase(),
          title: res.data.title,
          dataset: res.data.series.map(s => {
            return {
              ...s,
              plot: s.data
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
    let d = countries.map(c => { return loadCountry(c, 'cases-daily')});
    Promise.all(d).then(res => {

      setDaily(res.map(r => {
          return r.data[0]
        })
      )
    })

    let t = countries.map(c => { return loadCountry(c, 'active-cases-total')});
    Promise.all(t).then(res => {
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
  