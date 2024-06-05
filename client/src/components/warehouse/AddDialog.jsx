import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";

const AddDialog = ({
  type,
  open,
  onClose,
  onComplete,
  dialogTitle,
  dialogContent,
  value,
  setValue,
  patterns,
  soNO,
  station,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContent}</DialogContentText>
        <TextField
          margin="dense"
          label={`${type} Name`}
          type="text"
          fullWidth
          value={value.id}
          onChange={(e) => setValue({ ...value, id: e.target.value })}
        />
        {type === "rack" && (
          <TextField
            margin="dense"
            label="Rack Pattern"
            fullWidth
            select
            value={value.pattern}
            onChange={(e) => setValue({ ...value, pattern: e.target.value })}
          >
            {patterns.map((pattern) => (
              <MenuItem key={pattern.pattern_id} value={pattern.pattern_id}>
                {pattern.pattern_id}
              </MenuItem>
            ))}
          </TextField>
        )}
        {type === "retrieveRack" && (
          <div style={{ display: "flex", gap: "15px" }}>
            <TextField
              type="number"
              margin="dense"
              label="Retrieve Rack Row"
              value={value.row}
              onChange={(e) => setValue({ ...value, row: e.target.value })}
            />
            <TextField
              type="number"
              margin="dense"
              label="Retrieve Rack Column"
              value={value.column}
              onChange={(e) => setValue({ ...value, column: e.target.value })}
            />
          </div>
        )}
        {type === "bin" && (
          <>
            <TextField
              margin="dense"
              label="Shipping Order No"
              fullWidth
              select
              value={value.soNo}
              onChange={(e) => setValue({ ...value, soNo: e.target.value })}
            >
              {soNO.map((number) => (
                <MenuItem key={number.so_no} value={number.so_no}>
                  {number.so_no}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Station Id"
              fullWidth
              select
              value={value.station}
              onChange={(e) => setValue({ ...value, station: e.target.value })}
            >
              {station.map((stn) => (
                <MenuItem key={stn.station_id} value={stn.station_id}>
                  {stn.station_id}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Position"
              type="text"
              fullWidth
              value={value.position}
              onChange={(e) => setValue({ ...value, position: e.target.value })}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onComplete} color="secondary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddDialog.propTypes = {
  type: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  dialogContent: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  patterns: PropTypes.array,
  soNO: PropTypes.array,
  station: PropTypes.array,
};

export default AddDialog;
