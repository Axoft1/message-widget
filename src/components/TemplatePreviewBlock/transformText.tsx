/**
 * transformText
 *
 * Функция преобразует object data в string
 * @param {Array<object>} data Изначальный объект
 * @param {object} variableValue Ключом является переменная arrVarNames, значением вводимы текст input
 * @param {Array<string>} arrVarNames Массив переменных
 * @returns {string}
 */

export const transformText = (
  data: Array<string | object>,
  variableValue: object,
  arrVarNames: Array<string>
): string => {
  const filterText = (str: string):string => {    
    let newText = str.replace(/\{([\w]*?)\}/g, (match, key): string =>
      key in variableValue
        ? `${variableValue[key as keyof typeof variableValue]}`
        : ""
    );    
    return newText;
  };
  let text = "";
  const object = (ob: any) => {
    let txt = "";
    for (let key in ob) {
      if (key === "if") {
        let t = filterText(ob[key]).trim();
        if (t.length > 0) {
          txt += `${ob["then"][0]}`;
          if (ob["then"][1]) {
            txt += `${object(ob["then"][1])}`;
            txt += `${ob["then"][2]}`;
          }
        } else {
          txt += `${ob["else"][0]}`;
          if (ob["else"][1]) {
            txt += `${object(ob["else"][1])}`;
            txt += `${ob["else"][2]}`;
          }
        }
      }
    }
    return txt;
  };
  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] === "string") {
      text += `${filterText(data[i] as string)}`;
    } else if (typeof data[i] === "object") {
      text += `${filterText(object(data[i]))}`;
    } else if (Array.isArray(data[i])) {
      transformText(data[i] as Array<object>, variableValue, arrVarNames);
    }
  }

  return text;
};
