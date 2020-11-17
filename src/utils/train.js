
/**
 * Zips arrays a and b into new array of form [a_i, b_i]
 * 
 * @param {*} a 
 * @param {*} b 
 */
function zip(a, b) {
  return a.map((_, i) => [a[i], b[i]]);
}

/**
 * Trains one epoch using simple perceptron training
 * 
 * @param {*} data Array of data points in form [[x_1, x_2, ..., x_n], y]
 * @param {*} w Model weight vector
 * @param {*} b Model bias
 */
export function trainStep(data, w, b) {

  // Shuffle data
  //data = [...data];
  //data.sort(() => Math.random() - 0.5);

  for (const [x, y] of data) {
    const a = zip(w, x).map(([w_d, x_d]) => x_d * w_d)
      .reduce((acc, x) => acc + x, b);

    // Updates model on misclassification
    if (y * a <= 0) {
      w = zip(w, x).map(([w_d, x_d]) => w_d + y * x_d);
      b = b + y;
    }
  }

  return [w, b];
}