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

export function setDeepValue(
  obj: object,
  path: Array<string | number>,
  value: string | object,
  selectionStart: number | null,
  point: string
): object {
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
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
  // Копируем ссылку на объект newObj
  let current: any = newObj;

  // Цикл согласно пути path находит текст в котором необходимо произвести изменения
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (i === path.length - 1) {
      
      //Удаление If Then Else
      if (point === "delet" && typeof key === "number") {
        const connectLines = current[key - 1] + current[key + 1];
        current[key] = connectLines;
        current.splice(key - 1, 1);
        current.splice(key, 1);

        //Вставка переменной
      } else if (point === "name") {
        current[key] = insertVariables(current[key], value, selectionStart);

        //Вставка If Then Else
      } else if (point === "ifThenElse" && typeof key === "number") {
        const beginningOfLine = current[key].slice(
          0,
          selectionStart === null ? 0 : selectionStart
        );
        const endOfLine = current[key].slice(
          selectionStart === null ? 0 : selectionStart
        );
        current[key] = beginningOfLine;
        current.splice(key + 1, 0, value);
        current.splice(key + 2, 0, endOfLine);

        // Вставка текста
      } else if (point === "change") {
        current[key] = value;
      }
    } else {
      if (Array.isArray(current[key])) {
        current[key] = [...current[key]];
      } else {
        current[key] = { ...current[key] };
      }
      current = current[key];
    }
  }
  return newObj;
}
