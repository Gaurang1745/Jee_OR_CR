import "./styles.css";
import React from "react";

//

import CustomStyles from "./components/CustomStyles";
import DynamicContainer from "./components/DynamicContainer";
import Line from "./components/Line";

const components = [
  ["Line", Line],
  ["Dynamic / Overflow Container", DynamicContainer],
  ["Custom Styles", CustomStyles],
];

function graph() {
  return (
    <div>
      {components.map(([label, Comp]) => {
        return (
          <div key={label + ""}>
            <h1>{label}</h1>
            <div>
              <Comp />
            </div>
          </div>
        );
      })}
      <div style={{ height: "50rem" }} />
    </div>
  );
}

export default graph;
