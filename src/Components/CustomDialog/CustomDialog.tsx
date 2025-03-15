import { Dialog } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import './CustomDialog.scss';

type CustomDialogProps = {
  open: boolean;
  onClose: () => void;
  dialog_title: string;
  children: React.ReactNode; 
};

const CustomDialog: React.FC<CustomDialogProps> = ({ open, onClose, dialog_title, children }) => {
  return (
    <Dialog open={open} onClose={onClose}>

      <div className="dialog-header">
        <h2>{dialog_title}</h2>
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className="dialog-content">
        {children}
      </div>

    </Dialog>
  );
};

export default CustomDialog;
