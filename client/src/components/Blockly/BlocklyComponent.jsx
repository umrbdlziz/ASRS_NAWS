import { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import "blockly/blocks";
import "blockly/javascript";
import { Button } from "@mui/material";

import PropTypes from "prop-types";

const BlocklyComponent = ({ handlePatternSave, children }) => {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);

  useEffect(() => {
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
    });

    return () => {
      workspace.dispose();
    };
  }, []);

  Blockly.defineBlocksWithJsonArray([
    {
      type: "side",
      message0: "Side %1 %2 %3 Side",
      args0: [
        {
          type: "field_dropdown",
          name: "side_name",
          options: [
            ["SA", "SA"],
            ["SB", "SB"],
          ],
        },
        {
          type: "input_dummy",
        },
        {
          type: "input_statement",
          name: "level",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 158,
      tooltip: "name of side must be unique",
      helpUrl: "",
    },
    {
      type: "level",
      message0: "Level %1 rows %2 columns %3",
      args0: [
        {
          type: "field_input",
          name: "level_name",
          text: "L1",
        },
        {
          type: "field_number",
          name: "rows",
          value: 1,
        },
        {
          type: "field_number",
          name: "columns",
          value: 1,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 198,
      tooltip: "name of level must be unique for each side",
      helpUrl: "",
    },
  ]);

  javascriptGenerator.forBlock["side"] = function (block) {
    const sideName = block.getFieldValue("side_name");
    const level = javascriptGenerator.statementToCode(block, "level");

    return `"${sideName}":{${level}},`;
  };

  javascriptGenerator.forBlock["level"] = function (block) {
    const levelName = block.getFieldValue("level_name");
    const rows = block.getFieldValue("rows");
    const columns = block.getFieldValue("columns");

    return `"${levelName}":{"${rows}":${columns}},`;
  };

  const generateCode = () => {
    const code = `{${javascriptGenerator.workspaceToCode(
      Blockly.getMainWorkspace()
    )}}`;
    console.log(JSON.parse(code.replaceAll(",}", "}")));
    handlePatternSave(code.replaceAll(",}", "}"));
  };

  return (
    <div style={{ display: "flex", height: "75vh" }}>
      <div ref={blocklyDiv} style={{ flex: 1 }}></div>
      <xml
        ref={toolbox}
        style={{ display: "none" }}
        xmlns="http://www.w3.org/1999/xhtml"
      >
        {children}
      </xml>
      <div style={{ padding: "16px" }}>
        <Button variant="contained" color="primary" onClick={generateCode}>
          Generate Code
        </Button>
      </div>
    </div>
  );
};

BlocklyComponent.propTypes = {
  children: PropTypes.node,
  handlePatternSave: PropTypes.func,
};

export default BlocklyComponent;
