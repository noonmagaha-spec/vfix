/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// V-FIX — User Management Page
// User table + Add/Edit dialogs
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
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useData } from "../contexts/DataContext";
import type { User, Role } from "../types";

const roles: Role[] = ["Admin", "Technician", "Driver"];

const roleColors: Record<Role, string> = {
  Admin: "#6C5CE7",
  Technician: "#0984E3",
  Driver: "#00B894",
};

// ─── Validation Schema ─────────────────────────────────────
const userSchema = yup.object().shape({
  name: yup.string().required("ชื่อสถานกลายตอง"),
  email: yup.string().email("อีเมลไม่ถูกต้อง").required("อีเมลตองการ"),
  phone: yup.string().required("เบอร์โทรฟดัตอง"),
  role: yup.string().oneOf(roles).required("บทบาทใช่งานตองการ"),
});

type UserFormData = yup.InferType<typeof userSchema>;

const UserManagement: React.FC = () => {
  const { users, addUser, updateUser } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: yupResolver(userSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "Driver",
    },
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    reset({ name: "", email: "", phone: "", role: "Driver" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setDialogOpen(true);
  };

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateUser(editingUser.id, data as Partial<User>);
    } else {
      const newUser: User = {
        id: `USR-${String(users.length + 1).padStart(3, "0")}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role as Role,
        assignedVehicleIds: [],
      };
      addUser(newUser);
    }
    setDialogOpen(false);
  };

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
            จัดการผู้ใช้งาน
          </Typography>
          <Typography variant="body2" color="text.secondary">
            จัดการสิทธิมผู้ใช้งานและาถิคารผู้ปฏิบัติ
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ px: 3 }}
        >
          เพิ่มผู้ใช้งานใหม่
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ผู้ใช้งาน</TableCell>
                <TableCell>บทบาท</TableCell>
                <TableCell>ข้อมูลติดต่อ</TableCell>
                <TableCell align="center">จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: roleColors[user.role],
                            width: 40,
                            height: 40,
                            fontWeight: 700,
                          }}
                        >
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{ fontWeight: 700, fontSize: "0.9rem" }}
                          >
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{
                          backgroundColor: `${roleColors[user.role]}20`,
                          color: roleColors[user.role],
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.phone}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(user)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
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
          count={users.length}
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
          {editingUser ? "Edit User" : "Add New User"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Role"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                    fullWidth
                  >
                    {roles.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    fullWidth
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingUser ? "Update" : "Add User"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
