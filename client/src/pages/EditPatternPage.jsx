import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";

import BlocklyComponent, { Block } from "../components/Blockly";
import { ServerContext } from "../context";
import CustomSnackbar from "../components/utils/CustomSnackbar";

const EditPatternPage = () => {
  const { pattern_id } = useParams();
  const { SERVER_URL } = useContext(ServerContext);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState({});

  const handlePatternSave = async (pattern) => {
    // Save the pattern to the database
    try {
      const saveData = await axios.post(`${SERVER_URL}/warehouse/add_pattern`, {
        pattern_id,
        pattern,
      });
      setOpenSnackbar(true);
      setMessage({
        message: `${saveData.data.changes} pattern update successfully`,
        severity: "success",
      });
    } catch (error) {
      console.log("Error in /add_pattern:", error);
    }
  };

  return (
    <div style={{ margin: "10px" }}>
      <h2>Pigeonhole Customization</h2>
      <BlocklyComponent handlePatternSave={handlePatternSave}>
        <Block type="side"></Block>
        <Block type="level"></Block>
      </BlocklyComponent>
      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={message.message}
        severity={message.severity}
      />
    </div>
  );
};

export default EditPatternPage;
