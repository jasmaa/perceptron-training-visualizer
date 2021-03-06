import React, { useState } from 'react';
import { Table, Button, Input } from 'reactstrap';
import style from './style.module.css';

/**
 * Tablulated data points
 * 
 * @param {*} param0 
 */
export default function PointEntry({ data, setData }) {

  const [x1, setX1] = useState(0);
  const [x2, setX2] = useState(0);
  const [label, setLabel] = useState(-1);

  /**
   * Converts value to int, returning 0 by default
   * 
   * @param {*} v 
   */
  const convertToInt = v => {
    v = parseInt(v);
    return isNaN(v) ? 0 : v;
  }

  /**
   * Adds current data point to list of points
   */
  const addDataPoint = () => {
    setData(curr => [...curr, [[convertToInt(x1), convertToInt(x2)], convertToInt(label)]]);
  }

  /**
   * Adds data point from key press
   * 
   * @param {*} e 
   */
  const addDataPointKey = e => {
    if (e.key === 'Enter') {
      addDataPoint();
    }
  }

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
                  return newData;
                })
              }}>Remove</Button></td>
            </tr>
          ))
        }
        <tr>
          <td><Input value={x1} onChange={e => setX1(e.target.value)} onKeyPress={addDataPointKey} /></td>
          <td><Input value={x2} onChange={e => setX2(e.target.value)} onKeyPress={addDataPointKey} /></td>
          <td>
            <select value={label} onChange={e => setLabel(e.target.value)} >
              <option value={1}>+1</option>
              <option value={-1}>-1</option>
            </select>
          </td>
          <td><Button color="success" onClick={addDataPoint}>Add</Button></td>
        </tr>
      </tbody>
    </Table>
  );
}