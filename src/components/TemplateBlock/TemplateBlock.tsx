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
  const { update, setPath } = useDataUpdate();
  return (
    <div className={styles.block}>
      {data.map((val, index) => {
        const curPath = path.concat(index);
        if (typeof val === "string") {
          return (
            <div key={index}>
              {/* <MentionsInput
                className="mentionWrapper"
                value={val}
                onChange={(evt) => {
                  update(curPath, evt.target.value, null, "change");
                }}
              >
                <Mention trigger="@" data={null} />
              </MentionsInput> */}
              <textarea
                // cols={40}
                rows={2}
                value={val}
                data-path={curPath.join("-")}
                onFocus={() => {
                  setPath(curPath);
                }}
                onChange={(evt) => {
                  update(curPath, evt.target.value, null, "change");
                }}
              />
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
