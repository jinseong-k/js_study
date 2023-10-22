function map(array, f) {
  let result = [];
  for (let item of array) {
    result.push(f(item));
  }
  return result;
}

let result = map([1,2,3,4], el => el * 2);
console.log(result);