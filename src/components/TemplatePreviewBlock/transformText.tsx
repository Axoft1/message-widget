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
  data: Array<object>,
  variableValue: object,
  arrVarNames: Array<string>
): string => {
  const filterText = (str: any) => {
    for (let i = 0; i < arrVarNames.length; i++) {
      if (
        variableValue[arrVarNames[i] as keyof typeof variableValue] !==
        undefined
      ) {
        str = str.replaceAll(
          `{${arrVarNames[i]}}`,
          `${variableValue[arrVarNames[i] as keyof typeof variableValue]}`
        );
      } else {
        str = str.replaceAll(`{${arrVarNames[i]}}`, "");
      }
    }
    return str;
  };
  let text = "";
  const object = (ob: any) => {
    let txt = "";
    for (let key in ob) {
      if (key === "if") {
        let t = filterText(ob[key]);
        if (t.length > 0) {
          typeof ob["then"][0] === "object"
            ? (txt += object(ob["then"][0]))
            : (txt += ob["then"][0]);
        } else {
          txt += ob["else"][0];
        }
      }
    }
    return txt;
  };
  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] === "string") {
      text += `${filterText(data[i])} `;
    } else if (typeof data[i] === "object") {
      text += `${filterText(object(data[i]))} `;
    } else if (Array.isArray(data[i])) {
      transformText(data[i] as Array<object>, variableValue, arrVarNames);
    }
  }
  return text;
};
