// ============================================================
// V-FIX — Ticket Detail Page
// Stepper, timeline, and role-based actions
// ============================================================

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { useData } from "../contexts/DataContext";
import { useRole } from "../contexts/RoleContext";
import StatusStepper from "../components/StatusStepper";
import TechnicianWorkflow from "../components/TechnicianWorkflow";
import { StatusChip, UrgencyChip } from "../components/StatusChip";
import type { Ticket } from "../types";
import {
  getRepairCategoryLabel,
  getVehicleTypeLabel,
  getTicketStatusLabel,
} from "../data/constants";

interface TicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, onBack }) => {
  const { getVehicleById, getUserById, tickets, updateTicket } = useData();
  const { currentRole, currentUser } = useRole();

  const ticket = tickets.find((t) => t.id === ticketId);
  const vehicle = ticket ? getVehicleById(ticket.vehicleId) : null;
  const driver = ticket ? getUserById(ticket.driverId) : null;
  const technician = ticket?.technicianId
    ? getUserById(ticket.technicianId)
    : null;

  // Action states
  const [commentInput, setCommentInput] = useState("");

  if (!ticket || !vehicle) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
          กลับไปยังรายการ
        </Button>
        <Typography sx={{ mt: 4 }}>ไม่พบใบแจ้งซ่อมนี้</Typography>
      </Box>
    );
  }

  // Wrapper for TechnicianWorkflow onUpdate callback
  const handleTechnicianWorkflowUpdate = (updates: Partial<Ticket>) => {
    updateTicket(ticket.id, updates);
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;

    const now = new Date().toISOString();
    const newComment = {
      id: `C-${new Date().getTime()}`,
      author: currentUser.name,
      text: commentInput,
      timestamp: now,
    };

    updateTicket(ticket.id, {
      comments: [...ticket.comments, newComment],
      updatedAt: now,
    });

    setCommentInput("");
  };

  const handleApprove = () => {
    const now = new Date().toISOString();
    updateTicket(ticket.id, {
      status: "Closed",
      updatedAt: now,
      statusHistory: [
        ...ticket.statusHistory,
        {
          status: "Closed",
          timestamp: now,
          actor: currentUser.name,
          note: "อนุมัติและปิดงานโดยผู้ดูแลระบบ",
        },
      ],
    });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <IconButton onClick={onBack} sx={{ bgcolor: "white", boxShadow: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography
            variant="h5"
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            ใบแจ้ง {ticket.id}
            <StatusChip status={ticket.status} size="medium" />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            สร้างเมื่อ {new Date(ticket.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* Stepper */}
      <Card sx={{ mb: 3, p: 3 }}>
        <StatusStepper currentStatus={ticket.status} />
      </Card>

      <Grid container spacing={3}>
        {/* Left Column: Details & Actions */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                รายละเอียดปัญหา
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <UrgencyChip urgency={ticket.urgency} size="medium" />
                <Typography
                  variant="body2"
                  sx={{
                    bgcolor: "#F0F4F8",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  ประเภท: {getRepairCategoryLabel(ticket.category)}
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {ticket.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", mb: 3, color: "text.secondary" }}
              >
                {ticket.description}
              </Typography>

              {ticket.notes && (
                <Box sx={{ bgcolor: "#FFF8E1", p: 2, borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle2" color="#F57F17" gutterBottom>
                    หมายเหตุเพิ่มเติม
                  </Typography>
                  <Typography variant="body2">{ticket.notes}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    ข้อมูลรถยนต์
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {vehicle.licensePlate}
                  </Typography>
                  <Typography variant="body2">
                    {vehicle.brand} {vehicle.model} ({vehicle.year})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ประเภท: {vehicle.type ? getVehicleTypeLabel(vehicle.type) : '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    บุคลากร
                  </Typography>
                  <Typography variant="body2">
                    <strong>รายงานโดย:</strong> {driver?.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>ช่าง:</strong>{" "}
                    {technician ? (
                      technician.name
                    ) : (
                      <span style={{ color: "#E74C3C" }}>
                        ยังไม่มีผู้รับผิดชอบ
                      </span>
                    )}
                  </Typography>
                </Grid>
              </Grid>

              {ticket.cost > 0 && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "#E8F5E9",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: "#2E7D32" }}
                  >
                    ค่าซ่อมทั้งหมด
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 800, color: "#2E7D32" }}
                  >
                    ฿{ticket.cost.toLocaleString()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Actions (Role Based) */}
          {currentRole === "Technician" && ticket.status !== "Closed" && (
            <TechnicianWorkflow
              ticket={ticket}
              currentUser={currentUser}
              onUpdate={handleTechnicianWorkflowUpdate}
            />
          )}

          {currentRole === "Admin" && ticket.status === "Completed" && (
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  อนุมัติการซ่อม
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  ใบแจ้งนี้เสร็จสิ้นแล้ว คุณสามารถทำการอนุมัติเพื่อปิดงาน
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  size="large"
                >
                  อนุมัติ & ปิดใบแจ้ง
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                หมายเหตุ & การสนทนา
              </Typography>

              {ticket.comments.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, fontStyle: "italic" }}
                >
                  ยังไม่มีหมายเหตุ
                </Typography>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {ticket.comments.map((comment) => (
                    <Box
                      key={comment.id}
                      sx={{ bgcolor: "#F8FAFD", p: 2, borderRadius: 2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700 }}
                        >
                          {comment.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{comment.text}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {currentRole !== "Driver" && ticket.status !== "Closed" && (
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="เพิ่มหมายเหตุ..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    multiline
                    maxRows={3}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddComment}
                    disabled={!commentInput.trim()}
                  >
                    โพสต์
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Timeline */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                ประวัติสถานะ
              </Typography>
              <Timeline sx={{ p: 0, m: 0 }}>
                {ticket.statusHistory.map((history, index) => {
                  const isLast = index === ticket.statusHistory.length - 1;
                  return (
                    <TimelineItem key={index} sx={{ minHeight: 70 }}>
                      <TimelineOppositeContent sx={{ display: "none" }} />
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            bgcolor:
                              history.status === "Completed" ||
                              history.status === "Closed"
                                ? "#00B894"
                                : "#2E86DE",
                            boxShadow: "none",
                          }}
                        />
                        {!isLast && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: "12px", px: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            {getTicketStatusLabel(history.status)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 1 }}
                        >
                          {new Date(history.timestamp).toLocaleString()} •{" "}
                          {history.actor}
                        </Typography>
                        {history.note && (
                          <Typography
                            variant="body2"
                            sx={{
                              bgcolor: "#F0F4F8",
                              p: 1,
                              borderRadius: 1,
                              mt: 1,
                            }}
                          >
                            {history.note}
                          </Typography>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketDetail;
