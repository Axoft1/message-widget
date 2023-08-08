/**
 * transformText
 *
 * Функция преобразует object data в string
 * @param {Array<object>} data Изначальный объект
 * @param {object} variableValue Ключом является переменная arrVarNames, значением вводимы текст input
 * @param {Array<string>} arrVarNames Массив переменных
 * @returns {string}
 */

import { Data } from "../../Types";

  export const transformText = (
    data: Data,
    variableValue: object,
    arrVarNames: Array<string>
  ): string => {
    //Замена переменных в тексте
    const filterText = (str: string): string => {
      return str.replace(/\{([\w]*?)\}/g, (match, key) => {
        return key in variableValue
          ? `${variableValue[key as keyof typeof variableValue]}`
          : match;
      });
    };

    //Распределение условий IfThenElse
    const processObject = (ob: any): string => {
      let txt = "";
      if ("if" in ob) {
        const condition = filterText(ob.if).trim();
        if (condition.length > 0) {
          txt += `${filterText(ob.then[0])}`;
          if (ob.then[1]) {
            txt += `${processObject(ob.then[1])}`;
            txt += `${filterText(ob.then[2])}`;
          }
        } else {
          txt += `${filterText(ob.else[0])}`;
          if (ob.else[1]) {
            txt += `${processObject(ob.else[1])}`;
            txt += `${filterText(ob.else[2])}`;
          }
        }
      }
      return txt;
    };

    //Сборка текста
    let text = "";
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] === "string") {
        text += filterText(data[i] as string);
      } else if (typeof data[i] === "object") {
        text += processObject(data[i]);
      } else if (Array.isArray(data[i])) {
        text += transformText(
          data[i] as Array<object>,
          variableValue,
          arrVarNames
        );
      }
    }
    return text;
  };

