// ============================================================
// V-FIX — Ticket List Page
// Filterable ticket table with pagination
// ============================================================

import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useData } from "../contexts/DataContext";
import { useRole } from "../contexts/RoleContext";
import { StatusChip, UrgencyChip } from "../components/StatusChip";
import type { TicketStatus, UrgencyLevel, RepairCategory } from "../types";
import {
  TICKET_STATUS_OPTIONS,
  URGENCY_LEVEL_OPTIONS,
  getTicketStatusLabel,
  getUrgencyLevelLabel,
  getRepairCategoryLabel,
} from "../data/constants";

const TicketList: React.FC<{ onNavigateToDetail: (id: string) => void }> = ({
  onNavigateToDetail,
}) => {
  const { tickets, vehicles, getUserById } = useData();
  const { currentRole, currentUser } = useRole();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | "All">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Filter logic ─────────────────────────────────────────
  const filteredTickets = useMemo(() => {
    let result = tickets;

    // Role-based filtering
    if (currentRole === "Driver") {
      result = result.filter((t) => t.driverId === currentUser.id);
    } else if (currentRole === "Technician") {
      // Techs see all, or you could filter by assigned, but specs say "Technician: see ALL tickets with filters"
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Urgency filter
    if (urgencyFilter !== "All") {
      result = result.filter((t) => t.urgency === urgencyFilter);
    }

    // Search query (ID, title, vehicle plate)
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((t) => {
        const vehicle = vehicles.find((v) => v.id === t.vehicleId);
        return (
          t.id.toLowerCase().includes(lowerQuery) ||
          t.title.toLowerCase().includes(lowerQuery) ||
          (vehicle?.licensePlate.toLowerCase().includes(lowerQuery) ?? false)
        );
      });
    }

    // Sort by newest first
    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [
    tickets,
    currentRole,
    currentUser.id,
    statusFilter,
    urgencyFilter,
    searchQuery,
    vehicles,
  ]);

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
            ใบแจ้งซ่อม
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentRole === "Driver"
              ? "ใบแจ้งซ่อมที่คุณส่งมา"
              : "จัดการใบแจ้งซ่อมรถทั้งหมด"}
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="ค้นหาใบแจ้ง"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ID, ชื่องาน, ทะเบียน..."
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <TextField
            select
            label="สถานะ"
            size="small"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as TicketStatus | "All")
            }
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">ทั้งหมด</MenuItem>
            {TICKET_STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {getTicketStatusLabel(status)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="ความเร่งด่วน"
            size="small"
            value={urgencyFilter}
            onChange={(e) =>
              setUrgencyFilter(e.target.value as UrgencyLevel | "All")
            }
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">ทั้งหมด</MenuItem>
            {URGENCY_LEVEL_OPTIONS.map((urgency) => (
              <MenuItem key={urgency} value={urgency}>
                {getUrgencyLevelLabel(urgency)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Card>

      {/* Ticket Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>เลขที่ใบแจ้ง</TableCell>
                <TableCell>รถยนต์</TableCell>
                <TableCell>รายละเอียดปัญหา</TableCell>
                <TableCell>รายงานโดย</TableCell>
                <TableCell>วันที่</TableCell>
                <TableCell align="center">ความเร่งด่วน</TableCell>
                <TableCell align="center">สถานะ</TableCell>
                <TableCell align="center">การดำเนิน</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      ไม่พบใบแจ้งซ่อมที่ตรงกับเงื่อนไขการค้นหา
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((ticket) => {
                    const vehicle = vehicles.find(
                      (v) => v.id === ticket.vehicleId,
                    );
                    const driver = getUserById(ticket.driverId);

                    return (
                      <TableRow
                        key={ticket.id}
                        hover
                        onClick={() => onNavigateToDetail(ticket.id)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>
                          <Typography
                            sx={{ fontWeight: 700, fontSize: "0.85rem" }}
                          >
                            {ticket.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "0.85rem" }}
                          >
                            {vehicle?.licensePlate}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {vehicle?.brand} {vehicle?.model}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 250 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={ticket.title}
                          >
                            {ticket.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getRepairCategoryLabel(ticket.category)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {driver?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <UrgencyChip urgency={ticket.urgency} />
                        </TableCell>
                        <TableCell align="center">
                          <StatusChip status={ticket.status} />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="ดูรายละเอียด">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToDetail(ticket.id);
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>
    </Box>
  );
};

export default TicketList;
