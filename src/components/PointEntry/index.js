import React, { useState } from 'react';
import { Table, Button, Input } from 'reactstrap';
import style from './style.module.css';

export default function PointEntry({ data, setData }) {

  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);
  const [label, setLabel] = useState(-1);

  return (
    <Table className={style['scroll-table']}>
      <thead>
        <tr>
          <th>x1</th>
          <th>x2</th>
          <th>label</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map(([x, y], i) => (
            <tr key={i}>
              <td>{x[0]}</td>
              <td>{x[1]}</td>
              <td>{y}</td>
              <td><Button color="danger" onClick={() => {
                setData(curr => {
                  const newData = [...curr];
                  newData.splice(i, 1);
                  console.log(newData);
                  return newData;
                })
              }}>Remove</Button></td>
            </tr>
          ))
        }
        <tr>
          <td><Input value={x1} onChange={e => setX1(e.target.value)} /></td>
          <td><Input value={x2} onChange={e => setX2(e.target.value)} /></td>
          <td><Input value={label} onChange={e => setLabel(e.target.value)} /></td>
          <td><Button color="success" onClick={() => {
            setData(curr => [...curr, [[parseInt(x1), parseInt(x2)], parseInt(label)]])
          }}>Add</Button></td>
        </tr>
      </tbody>
    </Table>
  );
}