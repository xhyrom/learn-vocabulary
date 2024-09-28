import { useEffect, useState } from "preact/hooks";
import type { FormProps } from "./forms/Form";

export function Settings() {
  const [inputType, setInputType] = useState(
    localStorage.getItem("input-type") || "buttons",
  );
  const [strategy, setStrategy] = useState(
    localStorage.getItem("strategy") || "sk-de",
  );

  useEffect(() => {
    localStorage.setItem("input-type", inputType);
  }, [inputType]);

  useEffect(() => {
    localStorage.setItem("strategy", strategy);
  }, [strategy]);

  const handleInputType = (event) => {
    setInputType(event.target.value);
  };

  const handleStrategyChange = (event) => {
    setStrategy(event.target.value);
  };

  return (
    <div className="fixed bottom-0 right-0 p-8">
      <div className="mb-4">
        <label htmlFor="input-type" className="mr-2">
          input type:
        </label>
        <select
          id="input-type"
          className="h-6 w-24 text-black"
          value={inputType}
          onChange={handleInputType}
        >
          <option value="buttons">buttons</option>
          <option value="inputs">inputs</option>
          <option value="both">both</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="strategy" className="mr-2">
          strategy:
        </label>
        <select
          id="strategy"
          className="h-6 w-24 text-black"
          value={strategy}
          onChange={handleStrategyChange}
        >
          <option value="sk-de">sk{"->"}de</option>
          <option value="de-sk">de{"->"}sk</option>
          <option value="both">both</option>
        </select>
      </div>
    </div>
  );
}

export function getInputType() {
  return localStorage.getItem("input-type") || "both";
}

export function getStrategy(): FormProps["strategy"] | "both" {
  return (
    (localStorage.getItem("strategy") as FormProps["strategy"] | "both") ||
    "de-sk"
  );
}
