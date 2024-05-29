import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

const RetrieveBin = ({ row, column, greenBin }) => {
  const renderBins = () => {
    let bins = [];
    for (let r = 0; r < row; r++) {
      for (let c = 0; c < column; c++) {
        const isGreen = greenBin.position === `${r + 1}-${c + 1}`;
        bins.push(
          <Box
            key={`${r}-${c}`}
            sx={{
              width: `${320 / column}px`,
              height: `${260 / row}px`,
              margin: "4px",
              backgroundColor: isGreen ? "green" : "grey",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid black",
            }}
          >
            {`${r + 1}-${c + 1}`}
          </Box>
        );
      }
    }
    return bins;
  };

  return (
    <Box flex={1}>
      <Typography variant="h6" gutterBottom>
        Retrieve Bin
      </Typography>
      <Box display="flex" flexWrap="wrap" width="400px">
        {renderBins()}
      </Box>
    </Box>
  );
};

RetrieveBin.propTypes = {
  row: PropTypes.number,
  column: PropTypes.number,
  greenBin: PropTypes.object,
};

export default RetrieveBin;
