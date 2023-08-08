/**
 * setDeepValue
 *
 * Функция для вставки переменных в шаблоне на соответствующие значения
 * @param {object} obj Изначальный объект
 * @param {Array} path Путь до строки
 * @param {string} value Переменная для вставки в текст
 * @param {number | null} selectionStart Позиция курсора в строке
 * @param {nstring} point Ключ
 * @returns {object}
 */

import { Data, DataItem } from "../Types";

export function setDeepValue(
  obj: Data,
  path: Array<string | number>,
  value: string | object,
  selectionStart: number | null,
  point: "delet" | "ifThenElse" | "name" | "change"
): Data {
  //Проверка, нет ли недопустимых входных данных или пути
  if (!obj || typeof obj !== "object" || !path || !path.length) {
    throw new Error("Invalid input or path");
  }
  /**
   * insertVariables
   *
   * Функция для вставки переменных в тексте на соответствующие значения
   * @param {string} current Текст
   * @param {string} value Переменная для вставки в текст
   * @param {number} selectionStart Позиция курсора в строке
   */
  const insertVariables = (
    current: string,
    value: string | object,
    selectionStart: number | null
  ) => {
    if (typeof value === "string") {
      const updatedText =
        current.slice(0, selectionStart === null ? 0 : selectionStart) +
        `{${value}}` +
        current.slice(selectionStart === null ? 0 : selectionStart);
      return updatedText;
    }
  };
  // Создаем копию объекта
  const newObj = JSON.parse(JSON.stringify(obj));
  // Копируем ссылку на объект newObj
  let current: Data = newObj;

  // Цикл согласно пути path находит текст в котором необходимо произвести изменения
  for (let i = 0; i < path.length; i++) {
    const key: string | number = path[i];
    if (i === path.length - 1) {
      //Удаление If Then Else
      if (point === "delet" && typeof key === "number") {
        const connectLines: string = `${current[key - 1]}${current[key + 1]}`;
        current[key] = connectLines;
        current.splice(key - 1, 1);
        current.splice(key, 1);

        //Вставка переменной
      } else if (point === "name" ) {
        current[key as keyof typeof current] = insertVariables(
          current[key as keyof typeof current] as string,
          value,
          selectionStart
        );

        //Вставка If Then Else
      } else if (point === "ifThenElse" && typeof key === "number") {
        
          const beginningOfLine: string = (current[key] as string).slice(
            0,
            selectionStart === null ? 0 : selectionStart
          );
          const endOfLine: string = (current[key] as string).slice(
            selectionStart === null ? 0 : selectionStart
          );
          current[key] = beginningOfLine;
          current.splice(key + 1, 0, value);
          current.splice(key + 2, 0, endOfLine);
        

        // Вставка текста
      } else if (point === "change") {
        current[key as number] = value;
      }
    } else {
      if (Array.isArray(current[key as keyof typeof current])) {
        current[key ] = [...current[key ]] as Data;
      } else {
        current[key] = { ...current[key ] } as DataItem;
      }
      current = current[key];
    }
  }
  return newObj;
}
