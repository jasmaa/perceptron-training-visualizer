import React, { useState, useEffect } from 'react';
import Chart from 'chart.js';
import { trainStep } from './utils/train';

let chart;
const nData = 50;

export default function App() {
  const [data, setData] = useState(null);
  const [dataType, setDataType] = useState('linear');
  const [epoch, setEpoch] = useState(0);
  const [planePoints, setPlanePoints] = useState([]);
  const [params, setParams] = useState({ w: [...Array(2)].map(_ => 0), b: 0 }); // assume 2d data

  useEffect(() => {
    const newData = generateData(dataType);
    setData(newData);
    if (chart) {
      chart.destroy();
    }
    createChart(newData, planePoints);
  }, []);

  useEffect(() => {
    const newData = generateData(dataType);
    setParams({ w: [...Array(2)].map(_ => 0), b: 0 });
    if (chart) {
      chart.destroy();
    }
    createChart(newData, planePoints);
  }, [dataType]);

  const generateData = type => {
    switch (type) {
      case 'linear':
        return [...Array(nData)].map((_, i) => {
          return i > nData / 2
            ? [[Math.random() - 4, Math.random()], -1]
            : [[Math.random() + 4, Math.random()], 1]
        });
      case 'circle':
        return [...Array(nData)].map((_, i) => {
          const theta = 2 * Math.PI * Math.random();
          return i > nData / 2
            ? [[Math.cos(theta), Math.sin(theta)], -1]
            : [[2 * Math.cos(theta), 2 * Math.sin(theta)], 1]
        });
    }
  }

  const createChart = (pointData, separatorData) => {
    const ctx = document.getElementById("graph");

    const negPoints = [];
    const posPoints = [];
    for (const [x, y] of pointData) {
      switch (y) {
        case -1:
          negPoints.push({ x: x[0], y: x[1] });
          break;
        case 1:
          posPoints.push({ x: x[0], y: x[1] });
          break;
      }
    }

    chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: '+1',
          data: posPoints,
          backgroundColor: 'red',
          pointRadius: 5,
        },
        {
          label: '-1',
          data: negPoints,
          backgroundColor: 'blue',
          pointRadius: 5,
        },
        {
          label: 'separator',
          data: separatorData,
          borderColor: 'orange',
          borderWidth: 3,
          pointRadius: 0,
          fill: false,
          tension: 0,
          showLine: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  const update = () => {

    const [w, b] = trainStep(data, [...params.w], params.b);
    setParams({ w, b });

    // Build separator
    let separatorData = []
    if (w[1] !== 0) {
      const x2y = x => (-w[0] * x - b) / w[1];
      const xs = data.map(([x, _]) => x[0]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      separatorData = [{ x: minX, y: x2y(minX) }, { x: maxX, y: x2y(maxX) }];
    } else if (w[1] === 0 && w[0] !== 0) {
      const y2x = y => (-w[1] * y - b) / w[0];
      const ys = data.map(([x, _]) => x[1]);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      separatorData = [{ x: y2x(minY), y: minY }, { x: y2x(maxY), y: maxY }];
    }
    setPlanePoints(separatorData);

    setEpoch(epoch + 1);

    // Create chart
    if (chart) {
      chart.destroy();
    }
    createChart(data, separatorData);
  }

  return (
    <div>
      <h1>A Really Bad Perceptron Training Visualization</h1>
      <pre>Epoch: {epoch}</pre>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      <select onChange={e => {
        setDataType(e.target.value);
      }}>
        <option value="linear">Linear</option>
        <option value="circle">Circle</option>
      </select>
      <button onClick={update}>Train</button>
      <div style={{ width: '500px', height: '500px' }}>
        <canvas id="graph" width="500" height="500"></canvas>
      </div>
    </div>
  );
}