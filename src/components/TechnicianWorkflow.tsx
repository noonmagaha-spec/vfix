// ============================================================
// V-FIX — Technician Workflow Component
// Modern step-by-step workflow for technicians
// ============================================================

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import type { Ticket, TicketStatus } from "../types";

interface TechnicianWorkflowProps {
  ticket: Ticket;
  currentUser: { id: string; name: string };
  onUpdate: (updates: Partial<Ticket>) => void;
}

const TechnicianWorkflow: React.FC<TechnicianWorkflowProps> = ({
  ticket,
  currentUser,
  onUpdate,
}) => {
  const [note, setNote] = useState("");
  const [cost, setCost] = useState(ticket.cost || "");
  const [showCostForm, setShowCostForm] = useState(false);

  const handleStartWork = () => {
    const now = new Date().toISOString();
    onUpdate({
      status: "In Progress" as TicketStatus,
      updatedAt: now,
      statusHistory: [
        ...ticket.statusHistory,
        {
          status: "In Progress",
          timestamp: now,
          actor: currentUser.name,
          note: note || "เริ่มดำเนินการซ่อม",
        },
      ],
      ...(note
        ? {
            comments: [
              ...ticket.comments,
              {
                id: `C-${now}`,
                author: currentUser.name,
                text: note,
                timestamp: now,
              },
            ],
          }
        : {}),
      technicianId: currentUser.id,
    });
    setNote("");
  };

  const handlePutOnHold = () => {
    const now = new Date().toISOString();
    onUpdate({
      status: "On Hold" as TicketStatus,
      updatedAt: now,
      statusHistory: [
        ...ticket.statusHistory,
        {
          status: "On Hold",
          timestamp: now,
          actor: currentUser.name,
          note: note || "หยุดชั่วคราว - รอเบิกอะไหล่",
        },
      ],
      ...(note
        ? {
            comments: [
              ...ticket.comments,
              {
                id: `C-${now}`,
                author: currentUser.name,
                text: note,
                timestamp: now,
              },
            ],
          }
        : {}),
    });
    setNote("");
  };

  const handleResumeWork = () => {
    const now = new Date().toISOString();
    onUpdate({
      status: "In Progress" as TicketStatus,
      updatedAt: now,
      statusHistory: [
        ...ticket.statusHistory,
        {
          status: "In Progress",
          timestamp: now,
          actor: currentUser.name,
          note: note || "ดำเนินการซ่อมต่อ",
        },
      ],
      ...(note
        ? {
            comments: [
              ...ticket.comments,
              {
                id: `C-${now}`,
                author: currentUser.name,
                text: note,
                timestamp: now,
              },
            ],
          }
        : {}),
    });
    setNote("");
  };

  const handleMarkComplete = () => {
    if (!cost || cost === 0) {
      setShowCostForm(true);
      return;
    }

    const now = new Date().toISOString();
    onUpdate({
      status: "Completed" as TicketStatus,
      cost: Number(cost),
      updatedAt: now,
      statusHistory: [
        ...ticket.statusHistory,
        {
          status: "Completed",
          timestamp: now,
          actor: currentUser.name,
          note: note || `ซ่อมเสร็จ - ค่าใช้ ฿${cost}`,
        },
      ],
      ...(note
        ? {
            comments: [
              ...ticket.comments,
              {
                id: `C-${now}`,
                author: currentUser.name,
                text: note,
                timestamp: now,
              },
            ],
          }
        : {}),
    });
    setNote("");
    setCost("");
    setShowCostForm(false);
  };

  return (
    <Box>
      {/* Action Cards based on Current Status */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* START WORK */}
        {ticket.status === "Pending" && (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ border: "2px solid #2E86DE", p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    เริ่มทำการซ่อม
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    คลิกเพื่อเริ่มการซ่อมรถเครื่องนี้
                  </Typography>
                </Box>
                <PlayArrowIcon
                  sx={{ fontSize: 40, color: "#2E86DE", opacity: 0.3 }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="หมายเหตุ เช่น: ตรวจสอบเบอร์หลัก, ลากรถเข้าอู่, ฯลฯ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={handleStartWork}
                sx={{
                  background: "linear-gradient(135deg, #2E86DE, #74B9FF)",
                  fontWeight: 700,
                  py: 1.5,
                }}
              >
                เริ่มดำเนินการ
              </Button>
            </Card>
          </Grid>
        )}

        {/* IN PROGRESS */}
        {ticket.status === "In Progress" && (
          <Grid container spacing={2} size={{ xs: 12 }}>
            {/* Put on Hold Option */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ border: "2px dashed #F39C12", p: 3, height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      หยุดชั่วคราว
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      รอเบิกอะไหล่ หรือรายการอื่น
                    </Typography>
                  </Box>
                  <PauseIcon
                    sx={{ fontSize: 40, color: "#F39C12", opacity: 0.3 }}
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  placeholder="เหตุผล เช่น: รอเบิกชุดเบรก, ผ้าเบรกหมด, ฯลฯ..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<PauseIcon />}
                  onClick={handlePutOnHold}
                  sx={{
                    fontWeight: 700,
                    borderColor: "#F39C12",
                    color: "#F39C12",
                    py: 1.2,
                  }}
                >
                  หยุดชั่วคราว
                </Button>
              </Card>
            </Grid>

            {/* Mark Complete Option */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  border: "2px dashed #27AE60",
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(39, 174, 96, 0.15)",
                    borderColor: "#1E8449",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      เสร็จสิ้น
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      บันทึกค่าใช้จ่ายและเสร็จสิ้นงาน
                    </Typography>
                  </Box>
                  <CheckCircleIcon
                    sx={{ fontSize: 40, color: "#27AE60", opacity: 0.3 }}
                  />
                </Box>
                {!showCostForm ? (
                  <>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      ค่าใช้จ่าย:{" "}
                      {ticket.cost > 0
                        ? `฿${ticket.cost.toLocaleString()}`
                        : "ยังไม่กำหนด"}
                    </Alert>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => setShowCostForm(true)}
                      sx={{
                        fontWeight: 700,
                        borderColor: "#27AE60",
                        color: "#27AE60",
                        py: 1.2,
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#F0FDF4",
                          borderColor: "#1E8449",
                          color: "#1E8449",
                        },
                      }}
                    >
                      ทำสมบูรณ์
                    </Button>
                  </>
                ) : (
                  <>
                    <TextField
                      fullWidth
                      type="number"
                      label="ค่าใช้จ่าย (บาท)"
                      size="small"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#F8FAFD",
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <AttachMoneyIcon
                              sx={{ mr: 1, color: "#27AE60", mb: 0.5 }}
                            />
                          ),
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      placeholder="หมายเหตุ เช่น: เปลี่ยนยาง, ซ่อมเบรก, ฯลฯ..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#F8FAFD",
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleMarkComplete}
                        sx={{
                          background:
                            "linear-gradient(135deg, #27AE60, #55EFC4)",
                          fontWeight: 700,
                          py: 1.2,
                          borderRadius: 2,
                          transition: "all 0.2s ease",
                          boxShadow: "0 4px 12px rgba(39, 174, 96, 0.3)",
                          "&:hover": {
                            boxShadow: "0 6px 20px rgba(39, 174, 96, 0.4)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        บันทึกและเสร็จสิ้น
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => setShowCostForm(false)}
                        sx={{
                          fontWeight: 700,
                          borderRadius: 2,
                          transition: "all 0.2s ease",
                          borderColor: "#BDBDBD",
                          color: "#666",
                          "&:hover": {
                            backgroundColor: "#F5F5F5",
                            borderColor: "#999",
                          },
                        }}
                      >
                        ยกเลิก
                      </Button>
                    </Box>
                  </>
                )}
              </Card>
            </Grid>
          </Grid>
        )}

        {/* ON HOLD */}
        {ticket.status === "On Hold" && (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ border: "2px solid #F39C12", p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    ดำเนินการต่อ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    เมื่อได้รับอะไหล่หรือพร้อมดำเนินการ ให้กลับมาทำต่อ
                  </Typography>
                </Box>
                <PlayArrowIcon
                  sx={{ fontSize: 40, color: "#F39C12", opacity: 0.3 }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="หมายเหตุ เช่น: ได้อะไหล่แล้ว, พร้อมดำเนินการต่อ, ฯลฯ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={handleResumeWork}
                sx={{
                  background: "linear-gradient(135deg, #F39C12, #FFEAA7)",
                  color: "#333",
                  fontWeight: 700,
                  py: 1.5,
                }}
              >
                ดำเนินการต่อ
              </Button>
            </Card>
          </Grid>
        )}

        {/* COMPLETED */}
        {ticket.status === "Completed" && (
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                border: "2px solid #27AE60",
                p: 3,
                bgcolor: "rgba(39, 174, 96, 0.03)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: "#27AE60" }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#27AE60", mb: 1 }}
                  >
                    ซ่อมเสร็จสิ้นแล้ว
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    อยู่ระหว่างรอการอนุมัติจากผู้จัดการ
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                    ค่าใช้จ่าย:{" "}
                    <span style={{ color: "#27AE60", fontWeight: 700 }}>
                      ฿{ticket.cost.toLocaleString()}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TechnicianWorkflow;
