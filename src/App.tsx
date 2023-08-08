import React, { useEffect, useRef, useState } from "react";
import { setDeepValue } from "./components/setDeepValue";
import TemplateBlock from "./components/TemplateBlock/TemplateBlock";
import TemplatePreviewBlock from "./components/TemplatePreviewBlock/TemplatePreviewBlock";
import { DataContext } from "./Context";
import varNames from "./JSON/varNames.json";
import Button from "./components/Button";
import "./App.css";
import { CSSTransition } from "react-transition-group";

function App() {
  const [show, setShow] = useState<boolean>(false);
  const [data, setState] = useState<object>([""]);
  const [cursorPosition, setCursorPosition] = useState<any>();
  const [activePath, setPath] = useState<Array<string | number> | null>(null);
  const [arrVarNames, setArrVarNames] = useState<Array<string>>([]);
  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);

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

  const el = document.querySelector(
    `[data-path="${activePath && activePath.join("-")}"]`
  ) as HTMLInputElement;
  const widgetController = (value: string | (string | number)[]) => {
    if (Array.isArray(value)) {
      update(value, "", null, "delet");
      return;
    }
    if (activePath === null) {
      return;
    }
    if (value === "ifThenElse") {
      update(
        activePath,
        {
          if: "",
          then: [""],
          else: [""],
        },
        el.selectionStart,
        "ifThenElse"
      );
    }
  };

  async function saveToLocalStorage(data: Object) {
    try {
      localStorage.setItem("data", JSON.stringify(data));
    } catch (e: any) {
      console.error(e.message);
      return null;
    }
  }
  const addedVarName = (e: string): void => {
    if (activePath === null) {
      return;
    }
    if (el.selectionStart !== 0 && e !== "ifThenElse") {
      setCursorPosition({ el: activePath, selectionStart: el.selectionStart });
    }
    if (
      cursorPosition &&
      cursorPosition.el === activePath &&
      el.selectionStart === 0
    ) {
      if (e === "ifThenElse") {
        console.log(cursorPosition);
        update(
          activePath,
          {
            if: "",
            then: [""],
            else: [""],
          },
          cursorPosition.selectionStart,
          "ifThenElse"
        );
      } else {
        let selectionStart1 = cursorPosition.selectionStart + e.length + 2;
        setCursorPosition({
          ...cursorPosition,
          selectionStart: selectionStart1,
        });
        update(activePath, e, cursorPosition.selectionStart, "name");
      }
    } else {
      if (e === "ifThenElse") {
        update(
          activePath,
          {
            if: "",
            then: [""],
            else: [""],
          },
          el.selectionStart,
          "ifThenElse"
        );
      } else {
        let selectionStart1 = el.selectionStart! + e.length + 2;
        setCursorPosition({
          el: activePath,
          selectionStart: selectionStart1,
        });

        update(activePath, e, el.selectionStart, "name");
      }
    }
  };

  useEffect(() => {
    let data = localStorage.getItem("data");
    let arrVarNames = localStorage.getItem("arrVarNames");
    if (arrVarNames !== null) {
      let parsedData = JSON.parse(arrVarNames); // преобразуем строку в объект
      setArrVarNames(parsedData);
    } else {
      setArrVarNames(varNames);
    }
    if (data !== null) {
      let parsedData = JSON.parse(data); // преобразуем строку в объект
      setState(parsedData);
    } else {
      console.log("Данные не найдены в localStorage.");
    }
  }, []);

  return (
    <DataContext.Provider value={{ update, setPath, setShow }}>
      <div className="App">
        {!show && (
          <Button onClick={() => setShow(true)} className={"start"}>
            Message Editor
          </Button>
        )}

        {show && (
          <>
            <div className="App__body">
              <div className="templateBlock">
                <div className="btns">
                  {arrVarNames.map((e, index) => (
                    <Button
                      key={index}
                      onClick={() => addedVarName(e)}
                      className="names"
                    >{`{${e}}`}</Button>
                  ))}
                  <Button
                    onClick={() => addedVarName("ifThenElse")}
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
                {
                  <Button
                    onClick={() => setInProp(!inProp)}
                    className={"names"}
                  >
                    Preview
                  </Button>
                }
              </div>
              <div className="templatePreviewBlock">
                <CSSTransition
                  nodeRef={nodeRef}
                  in={inProp}
                  timeout={200}
                  classNames="my-node"
                >
                  <div ref={nodeRef}>
                    {inProp && (
                      <TemplatePreviewBlock
                        data={data as Array<object>}
                        arrVarNames={arrVarNames}
                      />
                    )}
                  </div>
                </CSSTransition>
              </div>
            </div>
            <Button
              onClick={() => saveToLocalStorage(data)}
              className="names"
              children="Save"
            />
          </>
        )}
      </div>

      {show && <Button onClick={() => setShow(false)} className={"close"} />}
    </DataContext.Provider>
  );
}
export default App;
