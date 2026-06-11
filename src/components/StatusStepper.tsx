// ============================================================
// V-FIX — Status Stepper Component
// Visual stepper for ticket status flow
// ============================================================

import React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import type { TicketStatus } from "../types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";

const STATUS_FLOW: TicketStatus[] = [
  "Pending",
  "In Progress",
  "On Hold",
  "Completed",
  "Closed",
];

// Thai status labels
const statusThaiLabels: Record<TicketStatus, string> = {
  Pending: "รอดำเนินการ",
  "In Progress": "กำลังดำเนินการ",
  "On Hold": "หยุดชั่วคราว",
  Completed: "เสร็จสิ้น",
  Closed: "ปิดแล้ว",
};

interface StatusStepperProps {
  currentStatus: TicketStatus;
}

const StatusStepper: React.FC<StatusStepperProps> = ({ currentStatus }) => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  const getStepIcon = (index: number) => {
    if (index < currentIndex) {
      return <CheckCircleIcon sx={{ color: "#00B894", fontSize: 28 }} />;
    }
    if (index === currentIndex) {
      if (currentStatus === "On Hold") {
        return (
          <PauseCircleFilledIcon sx={{ color: "#FDCB6E", fontSize: 28 }} />
        );
      }
      return <RadioButtonCheckedIcon sx={{ color: "#2E86DE", fontSize: 28 }} />;
    }
    return <RadioButtonUncheckedIcon sx={{ color: "#DFE6E9", fontSize: 28 }} />;
  };

  return (
    <Stepper
      activeStep={currentIndex}
      alternativeLabel
      sx={{
        "& .MuiStepConnector-line": {
          borderColor: "#DFE6E9",
          borderTopWidth: 3,
        },
        "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
          borderColor: "#00B894",
        },
        "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
          borderColor: "#00B894",
        },
      }}
    >
      {STATUS_FLOW.map((label, index) => (
        <Step key={label} completed={index < currentIndex}>
          <StepLabel
            slots={{ stepIcon: () => getStepIcon(index) }}
            sx={{
              "& .MuiStepLabel-label": {
                mt: 1,
                fontWeight: index === currentIndex ? 700 : 400,
                color: index === currentIndex ? "#2D3436" : "#B2BEC3",
                fontSize: "0.8rem",
              },
            }}
          >
            {statusThaiLabels[label]}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StatusStepper;
