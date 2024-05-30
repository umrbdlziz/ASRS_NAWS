import PropTypes from "prop-types";
import { Box, Grid } from "@mui/material";

const Layout = ({ data, currSide, currRack, greenPigeonhole }) => {
  let layout = data[currSide];

  // Fixed height and width for the entire layout
  const fixedHeight = 400 / Object.keys(layout).length;
  const fixedWidth = 400;

  const renderLevel = (level, row, col) => {
    const cellHeight = fixedHeight / row;
    const cellWidth = fixedWidth / col;

    const cells = [];
    for (let r = row - 1; r >= 0; r--) {
      for (let c = 0; c < col; c++) {
        const position = `${currRack}-${currSide}-${level}-${r + 1}-${c + 1}`;
        const isGreen = greenPigeonhole.includes(position);
        cells.push(
          <Grid item xs={12 / col} key={`row-${r}-col-${c}`}>
            <Box
              sx={{
                border: "0.5px solid black",
                background: isGreen ? "green" : "red",
                height: cellHeight,
                width: cellWidth,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              {`${r + 1}-${c + 1}`}
            </Box>
          </Grid>
        );
      }
    }
    return cells;
  };

  const renderLevels = () => {
    return Object.entries(layout)
      .reverse()
      .map(([levelName, layout]) => {
        const [row, col] = Object.entries(layout)[0];
        return (
          <div key={levelName} style={{ width: fixedWidth }}>
            <Grid container>
              {renderLevel(levelName, parseInt(row), parseInt(col))}
            </Grid>
          </div>
        );
      });
  };

  return <div>{renderLevels()}</div>;
};

Layout.propTypes = {
  data: PropTypes.object,
  currRack: PropTypes.string,
  currSide: PropTypes.string,
  greenPigeonhole: PropTypes.array,
};

export default Layout;
