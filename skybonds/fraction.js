function pow(x, n) {
  let result = x;
  for (let i = 1; i < n; i++) {
    result *= x;
  }
  return result;
}

function fractionMutable(parts, accuracy = 3) {
  if (parts.length > 5e6) {
    throw new Error("fractionMutable: To big input array (max 5 000 000)");
  }
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
const searchParams = new URLSearchParams(window.location.search);
const size = searchParams.has("size") ? searchParams.get("size") : 1e4;
const accuracy = searchParams.has("accuracy")
  ? parseInt(searchParams.get("accuracy"))
  : 3;
const testArr = [];

const result = document.getElementById("result");
result.innerText = `
Длина входного массива: ${size
  .toString()
  .replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$& ")}
Точность: ${accuracy}
...создается входной массив`;

window.setTimeout(() => {
  for (let i = 0; i < size; i += 1) {
    const rnd = Math.round(Math.random() * 1000) / 10;
    const n = rnd % 2 ? rnd : rnd / 10;
    testArr.push(n.toString());
  }

  result.innerText += `
Пример входного массива ${JSON.stringify(
  testArr.slice(0, 5).concat("..."),
  null,
  2
)}
...выполняется тест`;
  const startTs = window.performance.now();

  window.setTimeout(() => {
    try {
      fractionMutable(testArr, accuracy);

      result.innerText += `
...готово
Время обработки входного массива: ${window.performance.now() - startTs}ms
Накопленная погрешность округлений: ${testArr[testArr.length - 1]};
Пример результирующего массива ${JSON.stringify(
  testArr.slice(0, 5).concat("..."),
  null,
  2
)}
      `;
    } catch (err) {
      result.innerText += `\nError ${err.message}`;
    }
  }, 300);
}, 300);
