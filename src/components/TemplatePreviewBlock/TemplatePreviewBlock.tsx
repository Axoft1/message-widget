import React, { useEffect, useState } from "react";
import { transformText } from "./transformText";
import styles from './TemplatePreviewBlock.module.scss'
import { MentionsInput, Mention } from "react-mentions";

interface TemplatePreviewBlockProps {
  data: Array<object>;
  arrVarNames: Array<string>;
}
const TemplatePreviewBlock = ({
  data,
  arrVarNames,
}: TemplatePreviewBlockProps) => {
  const [variableValue, setVariableValue] = useState({});
  
  const variableHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVariableValue((variableValue) => ({
      ...variableValue,
      [e.target.placeholder]: e.target.value,
    }));
  };

  useEffect(() => {
    for (let key in arrVarNames) {
      setVariableValue((variableValue) => ({
        ...variableValue,
        [arrVarNames[key]]: "",
      }));
    }
  }, [arrVarNames]);

  return (
    <div className={styles.previewBlock}>
      
      <textarea
        cols={40}
        readOnly={true}
        value={transformText(data, variableValue, arrVarNames)}
      />
      <div className={styles.inputs}>
        Variables: {""}
        {arrVarNames.map((el: string, index: number) => (
          <input
            key={index}
            type="text"
            placeholder={el}
            onChange={variableHandler}
          />
        ))}
      </div>
      <div className={styles.overlay}></div>
    </div>
  );
};

export default TemplatePreviewBlock;
