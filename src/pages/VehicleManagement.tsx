/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// V-FIX — Vehicle Management Page
// Vehicle table + CRUD dialogs with repair history
// ============================================================

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useData } from "../contexts/DataContext";
import { StatusChip } from "../components/StatusChip";
import type { Vehicle, VehicleType, VehicleStatus } from "../types";
import {
  VEHICLE_TYPE_OPTIONS,
  VEHICLE_STATUS_OPTIONS,
  getVehicleTypeLabel,
  getVehicleStatusLabel,
  STATUS_COLORS,
} from "../data/constants";

// ─── Validation Schema ─────────────────────────────────────
const vehicleSchema = yup.object().shape({
  licensePlate: yup
    .string()
    .required("กรุณาระบุทะเบียนรถ")
    .min(2, "ทะเบียนรถต้องมีอย่างน้อย 2 ตัวอักษร"),
  type: yup.string().oneOf(VEHICLE_TYPE_OPTIONS).required("กรุณาระบุประเภทรถ"),
  brand: yup.string().required("กรุณาระบุยี่ห้อ"),
  model: yup.string().required("กรุณาระบุรุ่น"),
  year: yup.number().required("กรุณาระบุปีที่ผลิต").min(2000).max(2025),
  status: yup.string().oneOf(VEHICLE_STATUS_OPTIONS).required("กรุณาระบุสถานะ"),
  mileage: yup.number().required("กรุณาระบุระยะทาง").min(0),
});

type VehicleFormData = yup.InferType<typeof vehicleSchema>;


const VehicleManagement: React.FC = () => {
  const {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getTicketsByVehicle,
  } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string>("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyVehicle, setHistoryVehicle] = useState<Vehicle | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: yupResolver(vehicleSchema) as any,
    defaultValues: {
      licensePlate: "",
      type: VEHICLE_TYPE_OPTIONS[0],
      brand: "",
      model: "",
      year: 2024,
      status: VEHICLE_STATUS_OPTIONS[0],
      mileage: 0,
    },
  });

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    reset({
      licensePlate: "",
      type: VEHICLE_TYPE_OPTIONS[0],
      brand: "",
      model: "",
      year: 2024,
      status: VEHICLE_STATUS_OPTIONS[0],
      mileage: 0,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    reset({
      licensePlate: vehicle.licensePlate,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      status: vehicle.status,
      mileage: vehicle.mileage,
    });
    setDialogOpen(true);
  };

  const onSubmit = (data: VehicleFormData) => {
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, data as Partial<Vehicle>);
    } else {
      const newVehicle: Vehicle = {
        id: `VH-${String(vehicles.length + 1).padStart(3, "0")}`,
        licensePlate: data.licensePlate,
        type: data.type as VehicleType,
        brand: data.brand,
        model: data.model,
        year: data.year,
        status: data.status as VehicleStatus,
        mileage: data.mileage,
        lastServiceDate: new Date().toISOString().split("T")[0],
      };
      addVehicle(newVehicle);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    deleteVehicle(deletingId);
    setDeleteConfirmOpen(false);
  };

  const handleViewHistory = (vehicle: Vehicle) => {
    setHistoryVehicle(vehicle);
    setHistoryOpen(true);
  };

  const repairHistory = historyVehicle
    ? getTicketsByVehicle(historyVehicle.id)
    : [];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            จัดการรถยนต์
          </Typography>
          <Typography variant="body2" color="text.secondary">
            จัดการกลุ่มรถยนต์จำนวน {vehicles.length} คน
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ px: 3 }}
        >
          เพิ่มรถยนต์ใหม่
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ทะเบียน</TableCell>
                <TableCell>ประเภท</TableCell>
                <TableCell>ยี่ห้อ / รุ่น</TableCell>
                <TableCell>ปีที่ผลิต</TableCell>
                <TableCell>ระยะทาง</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell align="center">จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                        {vehicle.licensePlate}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {vehicle.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{getVehicleTypeLabel(vehicle.type)}</TableCell>
                    <TableCell>
                      {vehicle.brand} {vehicle.model}
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                    <TableCell>
                      <Chip
                        label={getVehicleStatusLabel(vehicle.status)}
                        size="small"
                        sx={{
                          backgroundColor: STATUS_COLORS.vehicle[vehicle.status].bg,
                          color: STATUS_COLORS.vehicle[vehicle.status].color,
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="ประวัติการซ่อม">
                        <IconButton
                          size="small"
                          onClick={() => handleViewHistory(vehicle)}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="แก้ไข">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(vehicle)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="ลบ">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setDeletingId(vehicle.id);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={vehicles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingVehicle ? "แก้ไขข้อมูลรถยนต์" : "เพิ่มรถยนต์ใหม่"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
            >
              <Controller
                name="licensePlate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ทะเบียนรถ"
                    error={!!errors.licensePlate}
                    helperText={errors.licensePlate?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="ประเภทรถ"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    fullWidth
                  >
                    {VEHICLE_TYPE_OPTIONS.map((t) => (
                      <MenuItem key={t} value={t}>
                        {getVehicleTypeLabel(t)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ยี่ห้อ"
                      error={!!errors.brand}
                      helperText={errors.brand?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="model"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="รุ่น"
                      error={!!errors.model}
                      helperText={errors.model?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ปีที่ผลิต"
                      type="number"
                      error={!!errors.year}
                      helperText={errors.year?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="mileage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ระยะทาง (กม.)"
                      type="number"
                      error={!!errors.mileage}
                      helperText={errors.mileage?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="สถานะ"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    fullWidth
                  >
                    {VEHICLE_STATUS_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s}>
                        {getVehicleStatusLabel(s)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button type="submit" variant="contained">
              {editingVehicle ? "บันทึกการแก้ไข" : "เพิ่มรถยนต์"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>ยืนยันการลบ</DialogTitle>
        <DialogContent>
          <Typography>
            คุณแน่ใจหรือไม่ที่จะลบรถยนต์คันนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)}>ยกเลิก</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            ลบ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Repair History Dialog */}
      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          ประวัติการซ่อม — {historyVehicle?.licensePlate}
        </DialogTitle>
        <DialogContent>
          {repairHistory.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ py: 3, textAlign: "center" }}
            >
              ไม่พบประวัติการซ่อมสำหรับรถยนต์คันนี้
            </Typography>
          ) : (
            <Timeline position="alternate" sx={{ p: 0 }}>
              {repairHistory.map((ticket) => (
                <TimelineItem key={ticket.id}>
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        bgcolor:
                          ticket.status === "Completed" ||
                          ticket.status === "Closed"
                            ? "#00B894"
                            : ticket.status === "In Progress"
                              ? "#2E86DE"
                              : "#FDCB6E",
                      }}
                    />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {ticket.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ticket.id} •{" "}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <StatusChip status={ticket.status} />
                    </Box>
                    {ticket.cost > 0 && (
                      <Typography
                        variant="caption"
                        color="primary"
                        sx={{ mt: 0.5, display: "block", fontWeight: 600 }}
                      >
                        ฿{ticket.cost.toLocaleString()}
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setHistoryOpen(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleManagement;
