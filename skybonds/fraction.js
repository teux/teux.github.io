function pow(x, n) {
  let result = x;
  for (let i = 1; i < n; i++) {
    result *= x;
  }
  return result;
}

function fractionMutable(parts, accuracy = 4) {
  const mul = pow(10, accuracy + 2);
  const div = pow(10, accuracy);
  let acc1 = 0;
  let acc2 = 0;
  let part;

  // Сумма долей в acc1
  for (let i = 0; i < parts.length; i += 1) {
    part = parseFloat(parts[i], 10);
    acc1 += part;
    parts[i] = part;
  }

  // Расчитать доли как проценты и просуммировать их в acc2
  for (let i = 0; i < parts.length; i += 1) {
    part = (parts[i] / acc1) * mul;
    part = Math.round(part) / div;
    acc2 += part;
    parts[i] = part.toFixed(accuracy);
  }

  // Накопленная погрешность округлений
  if (parts.length) {
    parts.push((100 - acc2).toFixed(accuracy));
  }
}

/** TEST */
const code = document.getElementById('code');
const result = document.getElementById('result');
code.innerText = `
/**
 * Заменяет доли в исходном массиве на их процентное выражение.
 * Алгоритмическая сложность O(1) - два прохода на любое количество входных данных.
 * Ипользование памяти O(1) - входный массив мутируется, новые структуры данных не создаются.
 * @param {Array[string]} parts 
 * @param {number} accuracy Количество знаков после заяптой в рассчитанных процентах.
 * /
${fractionMutable.toString()}
`;

const TEST_SIZE = 1e4;
const testArr = [];

for (let i = 0; i < TEST_SIZE; i += 1) {
  const rnd = Math.round(Math.random() * 1000) / 10;
  const n = rnd % 2 ? rnd : rnd / 10;
  testArr.push(n.toString());
}

result.innerText = `
Длина входного массива: ${TEST_SIZE.toString().replace(
  /\d{1,3}(?=(\d{3})+(?!\d))/g,
  '$& '
)}
Пример входного массива ${JSON.stringify(
  testArr.slice(0, 5).concat('...'),
  null,
  2
)}
...выполняется тест`;
const startTs = window.performance.now();

window.setTimeout(() => {
  fractionMutable(testArr);

  result.innerText += `
...готово
Время обработки входного массива: ${window.performance.now() - startTs}ms
Накопленная погрешность округлений: ${testArr[testArr.length - 1]};
Пример результирующего массива ${JSON.stringify(
    testArr.slice(0, 5).concat('...'),
    null,
    2
  )}
`;
}, 300);
