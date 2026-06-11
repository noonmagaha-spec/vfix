// ============================================================
// V-FIX — Status Chip Component
// Pastel-colored chips for ticket status display
// ============================================================

import React from "react";
import Chip from "@mui/material/Chip";
import type { TicketStatus, UrgencyLevel } from "../types";

// ─── Status mappings (English to Thai) ──────────────────────
const statusThaiMap: Record<TicketStatus, string> = {
  Pending: "รอดำเนินการ",
  "In Progress": "กำลังดำเนินการ",
  "On Hold": "หยุดชั่วคราว",
  Completed: "เสร็จสิ้น",
  Closed: "ปิดแล้ว",
};

// ─── Urgency mappings (English to Thai) ────────────────────
const urgencyThaiMap: Record<UrgencyLevel, string> = {
  Low: "ต่ำ",
  Medium: "ปานกลาง",
  High: "สูง",
  Critical: "วิกฤต",
};

// ─── Status color mapping ──────────────────────────────────
const statusColors: Record<TicketStatus, { bg: string; color: string }> = {
  Pending: { bg: "#FFF3E0", color: "#E65100" },
  "In Progress": { bg: "#E3F2FD", color: "#1565C0" },
  "On Hold": { bg: "#FFF8E1", color: "#F57F17" },
  Completed: { bg: "#E8F5E9", color: "#2E7D32" },
  Closed: { bg: "#F3E5F5", color: "#7B1FA2" },
};

// ─── Urgency color mapping ─────────────────────────────────
const urgencyColors: Record<UrgencyLevel, { bg: string; color: string }> = {
  Low: { bg: "#E8F5E9", color: "#388E3C" },
  Medium: { bg: "#FFF8E1", color: "#F9A825" },
  High: { bg: "#FFF3E0", color: "#E65100" },
  Critical: { bg: "#FFEBEE", color: "#C62828" },
};

interface StatusChipProps {
  status: TicketStatus;
  size?: "small" | "medium";
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = "small",
}) => {
  const colors = statusColors[status];
  return (
    <Chip
      label={statusThaiMap[status]}
      size={size}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 700,
        fontSize: size === "small" ? "0.7rem" : "0.8rem",
        border: `1px solid ${colors.color}20`,
      }}
    />
  );
};

interface UrgencyChipProps {
  urgency: UrgencyLevel;
  size?: "small" | "medium";
}

export const UrgencyChip: React.FC<UrgencyChipProps> = ({
  urgency,
  size = "small",
}) => {
  const colors = urgencyColors[urgency];
  return (
    <Chip
      label={urgencyThaiMap[urgency]}
      size={size}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 700,
        fontSize: size === "small" ? "0.7rem" : "0.8rem",
        border: `1px solid ${colors.color}20`,
      }}
    />
  );
};
