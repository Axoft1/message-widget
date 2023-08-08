import React from "react";
import ConditionalTemplateBlock from "../ConditionalTemplateBlock/ConditionalTemplateBlock";
import { useDataUpdate } from "../../Context";
import styles from "./TemplateBlock.module.scss";
import { Mention, MentionsInput } from "react-mentions";

interface TemplateBlockProps {
  data: Array<object>;
  path: Array<string | number>;
  widgetController: (t: Array<string | number>) => void;
}
const TemplateBlock = ({
  data,
  path,
  widgetController,
}: TemplateBlockProps) => {
  const { update, setPath, setCursorPosition } = useDataUpdate();
  const click = (e: any) => {
    setCursorPosition(e.target.selectionStart);
  };
  return (
    <div className={styles.block}>
      {data.map((val, index) => {
        const curPath = path.concat(index);
        if (typeof val === "string") {
          return (
            <div key={index}>
              <MentionsInput
                onClick={click}
                key={index}
                className={styles.mentionWrapper}
                data-path={curPath.join("-")}
                onFocus={() => {
                  setPath(curPath);
                }}
                value={val}
                onChange={(evt) => {
                  update(curPath, evt.target.value, null, "change");
                }}
              >
                <Mention className={styles.mention} data={[]} trigger={""} />
              </MentionsInput>
            </div>
          );
        }

        return (
          <div key={index}>
            <ConditionalTemplateBlock
              condition={
                val as {
                  if: string;
                  then: Array<object>;
                  else: Array<object>;
                }
              }
              path={curPath}
              widgetController={widgetController}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TemplateBlock;
