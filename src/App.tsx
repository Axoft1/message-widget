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
  const [data, setState] = useState<object>(['']);
  const [cursorPosition, setCursorPosition] = useState<any>(0);
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
  
  const widgetController = (value: string | (string | number)[]) => {
    
    if (Array.isArray(value)) {
      update(value, "", null, "delet");
      return;
    }
    if (activePath === null) {
      return;
    }
    const el = document.querySelector(`[data-path="${activePath.join("-")}"]`);
  
    
    if ((el as HTMLInputElement).selectionStart !==  0) {      
      setCursorPosition((e:any)=> e=(el as HTMLInputElement).selectionStart);
    }
    if (value === "ifThenElse") {
      update(
        activePath,
        {
          if: "",
          then: [""],
          else: [""],
        },
        (el as HTMLInputElement).selectionStart,
        "ifThenElse"
        );
      } else {
      update(
        activePath,
        value,
        (el as HTMLInputElement).selectionStart === 0
          ? cursorPosition
          : (el as HTMLInputElement).selectionStart,
        "name"
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
