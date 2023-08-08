import { Mention, MentionsInput } from "react-mentions";
import { useDataUpdate } from "../../Context";
import Button from "../Button";
import TemplateBlock from "../TemplateBlock/TemplateBlock";
import styles from "./ConditionalTemplateBlock.module.scss";
import style from "../TemplateBlock/TemplateBlock.module.scss";

interface ConditionalTemplateBlockProps {
  condition: {
    if: string;
    then: Array<object>;
    else: Array<object>;
  };
  path: Array<string | number>;
}
const ConditionalTemplateBlock = ({
  condition,
  path,
}: ConditionalTemplateBlockProps) => {
  const { update, setPath, deletIfThenElse } = useDataUpdate();
  const ifPath = path.concat("if");
  return (
    <div className={styles.conditionalBlock}>
      <div className={styles.btn}>
        <Button
          onClick={() => {
            deletIfThenElse(path);
          }}
          className="names"
        >
          Del
        </Button>
        <span></span>
      </div>
      <div>
        <div className={styles.ifBlock}>
          IF{" "}
          <MentionsInput
            value={condition.if}
            className={style.mentionWrapper}
            data-path={ifPath.join("-")}
            onFocus={() => {
              setPath(ifPath);
            }}
            onChange={(evt) => {
              update(ifPath, evt.target.value, null, "change")}}
          >
            <Mention className={styles.mention} data={[]} trigger={""} />
          </MentionsInput>         
        </div>
        <div className={styles.ifBlock}>
          THEN{" "}
          <TemplateBlock
            data={condition.then as Array<object>}
            path={path.concat("then")}
          />
        </div>
        <div className={styles.ifBlock}>
          ELSE{" "}
          <TemplateBlock
            data={condition.else as Array<object>}
            path={path.concat("else")}
          />
        </div>
      </div>
    </div>
  );
};

export default ConditionalTemplateBlock;
