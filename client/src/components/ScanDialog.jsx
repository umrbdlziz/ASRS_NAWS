import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";

const ScanDialog = ({ open, onClose, onRetry, onComplete, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Scan Bin</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message ? "Scan Success" : "Scan Failed"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {message ? (
          <Button onClick={onComplete} color="secondary">
            Complete
          </Button>
        ) : (
          <Button onClick={onRetry} color="secondary">
            Retry
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ScanDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  message: PropTypes.bool.isRequired,
};

export default ScanDialog;
