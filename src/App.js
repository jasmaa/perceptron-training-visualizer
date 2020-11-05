import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import Chart from 'chart.js';
import PointEntry from './components/PointEntry';
import DataGenerator from './components/DataGenerator';
import { trainStep } from './utils/train';
import { generateData } from './utils/generate';

let chart;
const nData = 50;

export default function App() {
  const [data, setData] = useState([
    [[1, 1], 1],
    [[10, 1], -1],
    [[1, 10], -1],
  ]);
  const [epoch, setEpoch] = useState(0);
  const [planePoints, setPlanePoints] = useState([]);
  const [params, setParams] = useState({ w: [...Array(2)].map(_ => 0), b: 0 }); // assume 2d data

  const generate = dataType => {
    const newData = generateData(dataType, nData);
    setData(newData);
    resetTraining();
  }

  const resetTraining = () => {
    setPlanePoints([]);
    setEpoch(0);
    setParams({ w: [...Array(2)].map(_ => 0), b: 0 });
  }

  useEffect(() => {
    if (!data) {
      return;
    }

    const negPoints = [];
    const posPoints = [];
    for (const [x, y] of data) {
      switch (y) {
        case -1:
          negPoints.push({ x: x[0], y: x[1] });
          break;
        case 1:
          posPoints.push({ x: x[0], y: x[1] });
          break;
      }
    }

    const ctx = document.getElementById("graph");
    if (chart) {
      chart.destroy();
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
          data: planePoints,
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
  }, [data, planePoints])

  const update = () => {

    const [w, b] = trainStep(data, [...params.w], params.b);
    setParams({ w, b });

    // Build separator
    let separatorData = [];
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
  }

  return (
    <Container>
      <Row className="mb-4">
        <h1>Simple Perceptron Training Visualization</h1>
      </Row>
      <Row>
        <Col>
          <pre>Epoch: {epoch}</pre>
          <pre>{JSON.stringify(params, null, 2)}</pre>

          <div className="d-flex justify-content-center">
            <div style={{ width: '500px', height: '500px' }}>
              <canvas id="graph" width="500" height="500"></canvas>
            </div>
          </div>
        </Col>
        <Col>
          <Row>
            <Col>
              <Row className="my-3">
                <div className="m-2">
                  <DataGenerator generate={generate} />
                </div>
                <Button color="danger" className="m-2" onClick={() => setData([])}>Clear Data</Button>
              </Row>
            </Col>
            <Col>
              <Row className="my-3">
                <Button color="danger" className="m-2" onClick={() => resetTraining()}>Reset Training</Button>
                <Button color="primary" className="m-2" onClick={update}>Train!</Button>
              </Row>
            </Col>
          </Row>

          <PointEntry data={data} setData={setData} />
        </Col>
      </Row>
    </Container >
  );
}