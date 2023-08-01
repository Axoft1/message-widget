import React, { useEffect, useState } from "react";
import { setDeepValue } from "./components/setDeepValue";
import TemplateBlock from "./components/TemplateBlock/TemplateBlock";
import TemplatePreviewBlock from "./components/TemplatePreviewBlock/TemplatePreviewBlock";
import { DataContext } from "./Context";
import varNames from "./JSON/varNames.json";
import Button from "./components/Button";
import "./App.css";

const initialData = [
  "Lorem ipsum dolor sit amet",
  {
    if: "",
    then: [
      "Condition",
      {
        if: "",
        then: ["Condition Then"],
        else: ["Condition Else"],
      },
      " Then",
    ],
    else: ["Condition Else"],
  },
  "Xotam ex eligendi optio est inventore, odio enim!",
];

function App() {
  const [show, setShow] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const [data, setState] = useState<object>(initialData);
  const [activePath, setPath] = useState<Array<string | number> | null>(null);
  const [arrVarNames, setArrVarNames] = useState<Array<string>>([]);

  const update = (
    path: Array<string | number>,
    val: string | object,
    selectionStart: number | null,
    point: string
  ) => {
    setState((prevData: object): object =>
      setDeepValue(prevData, path, val, selectionStart, point)
    );
  };

  const widgetController = (value: string | (string | number)[]) => {
    if (Array.isArray(value)) {
      update(value, "", null, "delet");
      return;
    }
    if (activePath === null) {
      return;
    }
    const el = document.querySelector(`[data-path="${activePath.join("-")}"]`);

    if (value === "ifThenElse") {
      update(
        activePath,
        {
          if: "",
          then: ["Condition Then"],
          else: ["Condition Else"],
        },
        (el as HTMLInputElement).selectionStart,
        "ifThenElse"
      );
    } else {
      update(
        activePath,
        value,
        (el as HTMLInputElement).selectionStart,
        "name"
      );
    }
  };
  useEffect(() => {
    setArrVarNames(varNames);
  }, []);
  return (
    <DataContext.Provider value={{ update, setPath, setShow }}>
      <div className="App">
        {show && (
          <Button onClick={() => setShow(true)} className={"start"}>
            Message Editor
          </Button>
        )}

        {!show && (
          <div className="App__body">
            <div className="templateBlock">
              <div className="btns">
                {arrVarNames.map((e, index) => (
                  <Button
                    key={index}
                    onClick={() => widgetController(e)}
                    className="names"
                  >{`{${e}}`}</Button>
                ))}
                <Button
                  onClick={() => widgetController("ifThenElse")}
                  className="names"
                >
                  Add If-Then-Else
                </Button>
              </div>
              <div className="template">
                <TemplateBlock
                  widgetController={widgetController}
                  data={data as Array<object>}
                  path={[]}
                />
              </div>
            </div>
            {preview && (
              <TemplatePreviewBlock
                data={data as Array<object>}
                arrVarNames={arrVarNames}
              />
            )}
          </div>
        )}
      </div>
      {
        <Button onClick={() => setPreview(!preview)} className={"names"}>
          Preview
        </Button>
      }
      {show && <Button onClick={() => setShow(false)} className={"close"} />}
    </DataContext.Provider>
  );
}
export default App;
