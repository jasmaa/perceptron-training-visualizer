
function zip(a, b) {
  return a.map((_, i) => [a[i], b[i]]);
}

export function trainStep(data, w, b) {

  // Shuffle data
  //data = [...data];
  //data.sort(() => Math.random() - 0.5);

  for (const [x, y] of data) {
    const a = zip(w, x).map(([w_d, x_d]) => x_d * w_d)
      .reduce((acc, x) => acc + x, b);

    if (y * a <= 0) {
      w = zip(w, x).map(([w_d, x_d]) => w_d + y * x_d);
      b = b + y;
    }
  }

  return [w, b]
}