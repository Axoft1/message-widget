import { useDataUpdate } from "../../Context";
import Button from "../Button";
import TemplateBlock from "../TemplateBlock/TemplateBlock";
import styles from "./ConditionalTemplateBlock.module.scss";

interface ConditionalTemplateBlockProps {
  condition: {
    if: string;
    then: Array<object>;
    else: Array<object>;
  };
  path: Array<string | number>;
  widgetController: (t: Array<string | number>) => void;
}
const ConditionalTemplateBlock = ({
  condition,
  path,
  widgetController,
}: ConditionalTemplateBlockProps) => {
  const { update, setPath } = useDataUpdate();
  const ifPath = path.concat("if");
  return (
    <div className={styles.conditionalBlock}>
      <div className={styles.btn}>
        <Button
          onClick={() => {
            widgetController(path);
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
          <input
            value={condition.if}
            data-path={ifPath.join("-")}
            onFocus={() => {
              setPath(ifPath);
            }}
            onChange={(evt) => {
              update(ifPath, evt.target.value, null, "change");
            }}
          />{" "}
        </div>
        <div className={styles.ifBlock}>
          THEN{" "}
          <TemplateBlock
            widgetController={widgetController}
            data={condition.then as Array<object>}
            path={path.concat("then")}
          />
        </div>
        <div className={styles.ifBlock}>
          ELSE{" "}
          <TemplateBlock
            widgetController={widgetController}
            data={condition.else as Array<object>}
            path={path.concat("else")}
          />
        </div>
      </div>
    </div>
  );
};

export default ConditionalTemplateBlock;
