import React from "react";
import ConditionalTemplateBlock from "../ConditionalTemplateBlock/ConditionalTemplateBlock";
import { useDataUpdate } from "../../Context";
import styles from "./TemplateBlock.module.scss";
import { Mention, MentionsInput } from "react-mentions";
import { Data } from "../../Types";

interface TemplateBlockProps {
  data: Data;
  path: Array<string | number>;
}
const TemplateBlock = ({
  data,
  path,
}: TemplateBlockProps) => {
  const { update, setPath } = useDataUpdate();
 
  return (
    <div className={styles.block}>
      {data.map((val, index) => {
        const curPath = path.concat(index);
        if (typeof val === "string") {
          return (
            <div key={index}>
              <MentionsInput
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
            />
          </div>
        );
      })}
    </div>
  );
};

export default TemplateBlock;
