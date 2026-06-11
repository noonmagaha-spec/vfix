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

const vehicleTypes: VehicleType[] = [
  "Delivery Truck",
  "Passenger Van",
  "Pickup Truck",
  "Motorcycle",
  "Sedan",
];
const vehicleStatuses: VehicleStatus[] = [
  "Active",
  "Under Repair",
  "Out of Service",
];

// ─── Validation Schema ─────────────────────────────────────
const vehicleSchema = yup.object().shape({
  licensePlate: yup
    .string()
    .required("License plate is required")
    .min(2, "Too short"),
  type: yup.string().oneOf(vehicleTypes).required("Vehicle type is required"),
  brand: yup.string().required("Brand is required"),
  model: yup.string().required("Model is required"),
  year: yup.number().required("Year is required").min(2000).max(2025),
  status: yup.string().oneOf(vehicleStatuses).required("Status is required"),
  mileage: yup.number().required("Mileage is required").min(0),
});

type VehicleFormData = yup.InferType<typeof vehicleSchema>;

const statusColors: Record<VehicleStatus, { bg: string; color: string }> = {
  Active: { bg: "#E8F5E9", color: "#2E7D32" },
  "Under Repair": { bg: "#FFF3E0", color: "#E65100" },
  "Out of Service": { bg: "#FFEBEE", color: "#C62828" },
};

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
      type: "Delivery Truck",
      brand: "",
      model: "",
      year: 2024,
      status: "Active",
      mileage: 0,
    },
  });

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    reset({
      licensePlate: "",
      type: "Delivery Truck",
      brand: "",
      model: "",
      year: 2024,
      status: "Active",
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
                <TableCell>ระยะไมล์</TableCell>
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
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>
                      {vehicle.brand} {vehicle.model}
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                    <TableCell>
                      <Chip
                        label={vehicle.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColors[vehicle.status].bg,
                          color: statusColors[vehicle.status].color,
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Repair History">
                        <IconButton
                          size="small"
                          onClick={() => handleViewHistory(vehicle)}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(vehicle)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
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
          {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
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
                    label="License Plate"
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
                    label="Vehicle Type"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    fullWidth
                  >
                    {vehicleTypes.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
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
                      label="Brand"
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
                      label="Model"
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
                      label="Year"
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
                      label="Mileage (km)"
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
                    label="Status"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    fullWidth
                  >
                    {vehicleStatuses.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingVehicle ? "Update" : "Add Vehicle"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this vehicle? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
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
          Repair History — {historyVehicle?.licensePlate}
        </DialogTitle>
        <DialogContent>
          {repairHistory.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ py: 3, textAlign: "center" }}
            >
              No repair history found for this vehicle.
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
          <Button onClick={() => setHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleManagement;
