/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// V-FIX — Submit Repair Request Page
// Form with react-hook-form + yup validation
// ============================================================

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import SendIcon from "@mui/icons-material/Send";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useData } from "../contexts/DataContext";
import { useRole } from "../contexts/RoleContext";
import type { Ticket, UrgencyLevel, RepairCategory } from "../types";
import {
  URGENCY_LEVEL_OPTIONS,
  REPAIR_CATEGORY_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  getUrgencyLevelLabel,
  getRepairCategoryLabel,
  getVehicleTypeLabel,
} from "../data/constants";

// ─── Validation Schema ─────────────────────────────────────
const repairSchema = yup.object().shape({
  vehicleId: yup.string().required("กรุณาเลือกรถยนต์"),
  description: yup
    .string()
    .required("กรุณาระบุรายละเอียดปัญหา")
    .min(10, "รายละเอียดต้องมีความยาวอย่างน้อย 10 อักขระ"),
  urgency: yup.string().oneOf(URGENCY_LEVEL_OPTIONS).required("กรุณาเลือกความเร่งด่วน"),
  category: yup
    .string()
    .oneOf(REPAIR_CATEGORY_OPTIONS)
    .required("กรุณาเลือกประเภทการซ่อม"),
  notes: yup.string().default(""),
});

type RepairFormData = yup.InferType<typeof repairSchema>;

const SubmitRepairRequest: React.FC = () => {
  const { vehicles, tickets, addTicket } = useData();
  const { currentUser } = useRole();
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RepairFormData>({
    resolver: yupResolver(repairSchema) as any,
    defaultValues: {
      vehicleId: "",
      description: "",
      urgency: URGENCY_LEVEL_OPTIONS[1], // Medium
      category: REPAIR_CATEGORY_OPTIONS[0], // Engine
      notes: "",
    },
  });

  const onSubmit = (data: RepairFormData) => {
    const newId = `VFX-2024-${String(tickets.length + 1).padStart(4, "0")}`;
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      id: newId,
      vehicleId: data.vehicleId,
      driverId: currentUser.id,
      title: data.description.slice(0, 50),
      description: data.description,
      urgency: data.urgency as UrgencyLevel,
      category: data.category as RepairCategory,
      status: "Pending",
      notes: data.notes || "",
      cost: 0,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: "Pending",
          timestamp: now,
          actor: currentUser.name,
          note: "ส่งคำขอแจ้งซ่อม",
        },
      ],
      comments: [],
    };

    addTicket(newTicket);
    setTicketId(newId);
    setSubmitted(true);
  };

  const handleNewRequest = () => {
    setSubmitted(false);
    setTicketId("");
    reset();
  };

  // ─── Success Screen ───────────────────────────────────────
  if (submitted) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Fade in timeout={600}>
          <Card
            sx={{ maxWidth: 480, width: "100%", textAlign: "center", p: 4 }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00B894, #55EFC4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: "0 8px 24px rgba(0,184,148,0.3)",
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 44, color: "white" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              ส่งคำขอสำเร็จ!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              เรารับคำขอแจ้งซ่อมรถของคุณแล้ว รอสักครู่เพื่อให้ช่างซ่อมตรวจสอบ
            </Typography>
            <Chip
              label={ticketId}
              sx={{
                fontSize: "1.1rem",
                fontWeight: 800,
                py: 2.5,
                px: 2,
                mb: 3,
                backgroundColor: "#E3F2FD",
                color: "#1565C0",
                letterSpacing: "0.05em",
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              กรุณาติดตามสถานะของคำขอผ่านหน้า "คำขอแจ้งซ่อมของฉัน"
            </Typography>
            <Button
              variant="contained"
              onClick={handleNewRequest}
              sx={{ px: 4 }}
            >
              ส่งคำขอใหม่
            </Button>
          </Card>
        </Fade>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 700 }}>
        แจ้งซ่อมรถยนต์ใหม่
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        กรอกข้อมูลรายละเอียดปัญหารถของคุณ เพื่อให้ช่างซ่อมได้ประเมินสถานการณ์
      </Typography>

      <Card
        sx={{
          maxWidth: 680,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Vehicle Selection */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#2D3436",
                  }}
                >
                  1. เลือกรถยนต์
                </Typography>
                <Controller
                  name="vehicleId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="เลือกรถยนต์ของคุณ"
                      error={!!errors.vehicleId}
                      helperText={errors.vehicleId?.message}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    >
                      {vehicles.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                          {v.licensePlate} — {v.brand} {v.model} ({v.type ? getVehicleTypeLabel(v.type) : '-'})
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>

              {/* Problem Description */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#2D3436",
                  }}
                >
                  2. อธิบายปัญหา
                </Typography>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="รายละเอียดของปัญหา"
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      placeholder="เช่น เสียงแปลกในเครื่องยนต์ หรือไฟเตือนติดขึ้นมา..."
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Urgency & Category */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#2D3436",
                  }}
                >
                  3. ความเร่งด่วนและประเภท
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Controller
                    name="urgency"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="ความเร่งด่วน"
                        error={!!errors.urgency}
                        helperText={errors.urgency?.message}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      >
                        {URGENCY_LEVEL_OPTIONS.map((u) => (
                          <MenuItem key={u} value={u}>
                            {getUrgencyLevelLabel(u)}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="ประเภทการซ่อม"
                        error={!!errors.category}
                        helperText={errors.category?.message}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      >
                        {REPAIR_CATEGORY_OPTIONS.map((c) => (
                          <MenuItem key={c} value={c}>
                            {getRepairCategoryLabel(c)}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Box>
              </Box>

              {/* Additional Notes */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "#2D3436",
                  }}
                >
                  4. หมายเหตุเพิ่มเติม (ไม่บังคับ)
                </Typography>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ข้อมูลเพิ่มเติม"
                      multiline
                      rows={2}
                      placeholder="เช่น เวลาที่ปัญหาเกิดขึ้น หรือสิ่งที่ลองแก้แล้ว..."
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              <Alert severity="info" sx={{ borderRadius: 2 }}>
                ส่งคำขอจาก: <strong>{currentUser.name}</strong> (
                {currentUser.role})
              </Alert>

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              >
                ส่งคำขอแจ้งซ่อม
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubmitRepairRequest;
