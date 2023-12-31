import React from "react";
import App from "./App";
import { render, screen, fireEvent } from "@testing-library/react";
import { transformText } from "./components/TemplatePreviewBlock/transformText";

test("renders App button 'Message Editor'", () => {
  render(<App />);
  const button = screen.getByText(/Message Editor/i);
  expect(button).toBeInTheDocument();
  fireEvent.click(button);
  expect(screen.queryByText(/Message Editor/i)).toBeNull();
});

describe("function transformText", () => {
  test("transformText", () => {
    const variableValue = {
      company: "",
      firstname: "",
      lastname: "",
      position: "",
    };

    const data = [
      "Example of the initial text",
      {
        if: "",
        then: [
          "Condition initial",
          {
            if: "",
            then: ["Then"],
            else: ["Else"],
          },
          "Condition final",
        ],
        else: ["Condition Else"],
      },
      "Last text",
    ];
    const arrVarNames = ["firstname", "lastname", "company", "position"];

    expect(transformText(data, variableValue, arrVarNames)).toBe(
      "Example of the initial textCondition ElseLast text"
    );
  });
  test("transformText, the first If", () => {
    const variableValue = {
      company: "",
      firstname: "",
      lastname: "",
      position: "",
    };

    const data = [
      "Example of the initial text",
      {
        if: "If",
        then: [
          "Condition initial",
          {
            if: "",
            then: ["Then"],
            else: ["Else"],
          },
          "Condition final",
        ],
        else: ["Condition Else"],
      },
      "Last text",
    ];
    const arrVarNames = ["firstname", "lastname", "company", "position"];

    expect(transformText(data, variableValue, arrVarNames)).toBe(
      "Example of the initial textCondition initialElseCondition finalLast text"
    );
  });

  test("transformText, the second If", () => {
    const variableValue = {
      company: "",
      firstname: "",
      lastname: "",
      position: "",
    };

    const data = [
      "Example of the initial text",
      {
        if: "If",
        then: [
          "Condition initial",
          {
            if: "If",
            then: ["Then"],
            else: ["Else"],
          },
          "Condition final",
        ],
        else: ["Condition Else"],
      },
      "Last text",
    ];
    const arrVarNames = ["firstname", "lastname", "company", "position"];

    expect(transformText(data, variableValue, arrVarNames)).toBe(
      "Example of the initial textCondition initialThenCondition finalLast text"
    );
  });
  test("transformText,THEN, added variableValue", () => {
    const variableValue = {
      firstname: "Alex",
      lastname: "Rassel",
      company: "Apple",
      position: "Developer",
    };

    const data = [
      "Example of the initial text",
      {
        if: "{firstname}",
        then: [
          "{firstname} Condition initial",
          {
            if: "{lastname}",
            then: ["{lastname}"],
            else: ["Else"],
          },
          "Condition final",
        ],
        else: ["Condition Else"],
      },
      "Last text {company}",
    ];
    const arrVarNames = ["firstname", "lastname", "company", "position"];

    expect(transformText(data, variableValue, arrVarNames)).toBe(
      "Example of the initial textAlex Condition initialRasselCondition finalLast text Apple"
    );
  });

  test("transformText, THEN, there is no firstname variable", () => {
    const variableValue = {
      firstname: "",
      lastname: "Rassel",
      company: "Apple",
      position: "Developer",
    };

    const data = [
      "Example of the initial text",
      {
        if: "{firstname}",
        then: [
          "{firstname} Condition initial",
          {
            if: "{lastname}",
            then: ["{lastname}"],
            else: ["Else"],
          },
          "Condition final",
        ],
        else: ["Condition Else"],
      },
      "Last text {company}",
    ];
    const arrVarNames = ["firstname", "lastname", "company", "position"];

    expect(transformText(data, variableValue, arrVarNames)).toBe(
      "Example of the initial textCondition ElseLast text Apple"
    );
  });

  test("transformText, THEN,  there is no lastname variable", () => {
    const variableValue = {
      firstname: "Alex",
      lastname: "",
      company: "Apple",
      position: "Developer",
    };

    const data = [
      "Example of the initial text",
      {
        if: "{firstname}",
        then: [
          "{firstname} Condition initial",
          {
            if: "{lastname}",
            then: ["{lastname}"],
            else: ["Else"],
          },
          "Condition final",
        ],
        else: ["Condition Else"],
      },
      "Last text {company}",
    ];
    const arrVarNames = ["firstname", "lastname", "company", "position"];

    expect(transformText(data, variableValue, arrVarNames)).toBe(
      "Example of the initial textAlex Condition initialElseCondition finalLast text Apple"
    );
  });
  test("transformText, ELSE, there is no firstname variable", () => {
    const variableValue = {
      firstname: "",
      lastname: "Rassel",
      company: "Apple",
      position: "Developer",
    };

    const data = [
      "Example of the initial text",
      {
        if: "{firstname}",
        then: [
          "{firstname} Condition initial",
          {
            if: "{lastname}",
            then: ["{lastname}"],
            else: ["Else"],
          },
          "Condition final",
        ],
        else: [
          "{lastname} Condition initial ELSE",
          {
            if: "{lastname}",
            then: ["{lastname}"],
            else: ["Else"],
          },
          "Condition final",
        ],
      },
      "Last text {company}",
    ];
    const arrVarNames = ["firstname", "lastname", "company", "position"];

    expect(transformText(data, variableValue, arrVarNames)).toBe(
      "Example of the initial textRassel Condition initial ELSERasselCondition finalLast text Apple"
    );
  });

  
});
