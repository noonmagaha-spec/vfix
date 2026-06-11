// ============================================================
// V-FIX — Reports Page
// Cost summaries and charts for Admin
// ============================================================

import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useData } from "../contexts/DataContext";
import { mockMonthlyCosts } from "../data/mockData";

const Reports: React.FC = () => {
  const { vehicles, tickets } = useData();

  const handleExport = () => {
    // Mock export functionality
    alert("Exporting report as Excel file... (Mock functionality)");
  };

  // ─── Chart 1: Cost per Vehicle (Bar) ─────────────────────
  const costPerVehicle = useMemo(() => {
    const costs: Record<string, number> = {};
    tickets.forEach((t) => {
      costs[t.vehicleId] = (costs[t.vehicleId] || 0) + t.cost;
    });
    return Object.entries(costs)
      .map(([vId, cost]) => {
        const vehicle = vehicles.find((v) => v.id === vId);
        return { name: vehicle?.licensePlate || vId, cost };
      })
      .filter((v) => v.cost > 0)
      .sort((a, b) => b.cost - a.cost);
  }, [tickets, vehicles]);

  const costBarOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
    },
    plotOptions: { bar: { borderRadius: 4, horizontal: true } },
    colors: ["#E74C3C"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: costPerVehicle.map((v) => v.name),
      labels: { formatter: (val) => `฿${(Number(val) / 1000).toFixed(0)}k` },
    },
    grid: { borderColor: "#F0F0F0", strokeDashArray: 4 },
  };

  const costBarSeries = [
    { name: "Total Cost", data: costPerVehicle.map((v) => v.cost) },
  ];

  // ─── Chart 2: Repair Frequency (Bar) ─────────────────────
  const repairFreq = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach((t) => {
      const type =
        vehicles.find((v) => v.id === t.vehicleId)?.type || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [tickets, vehicles]);

  const freqBarOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
    },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } },
    colors: ["#6C5CE7"],
    dataLabels: { enabled: false },
    xaxis: { categories: repairFreq.map((f) => f[0]) },
    yaxis: { title: { text: "Number of Repairs" } },
    grid: { borderColor: "#F0F0F0", strokeDashArray: 4 },
  };

  const freqBarSeries = [
    { name: "Repairs", data: repairFreq.map((f) => f[1]) },
  ];

  // ─── Table: Monthly Cost Summary ────────────────────────
  const months = [
    "2024-07",
    "2024-08",
    "2024-09",
    "2024-10",
    "2024-11",
    "2024-12",
  ];

  const getVehicleCostForMonth = (vehicleId: string, month: string) => {
    const record = mockMonthlyCosts.find(
      (m) => m.vehicleId === vehicleId && m.month === month,
    );
    return record ? record.cost : 0;
  };

  const calculateTotalForMonth = (month: string) => {
    return mockMonthlyCosts
      .filter((m) => m.month === month)
      .reduce((sum, m) => sum + m.cost, 0);
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
            รายละอิยโดย และรายงานการซ่อม
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ค่าช่อมและการวิเคราะห์สำหรับเชื่อกระคุณโครงการทึ่มถี่
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
        >
          ส่งออกเป็น Excel
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Cost per Vehicle */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>
              ค่าซ่อมทั้งหมดต่อรถยนต์
            </Typography>
            <ReactApexChart
              options={costBarOptions}
              series={costBarSeries}
              type="bar"
              height={320}
            />
          </Card>
        </Grid>

        {/* Repair Frequency by Type */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>
              จำนวนการซ่อมส่งประเภทรถยนต์
            </Typography>
            <ReactApexChart
              options={freqBarOptions}
              series={freqBarSeries}
              type="bar"
              height={320}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Cost Table */}
      <Card>
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
            สรุปค่าบริหารยอย่างรายเดือน (ไตรมาส 2567)
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>รถยนต์</TableCell>
                {months.map((m) => (
                  <TableCell key={m} align="right">
                    {m}
                  </TableCell>
                ))}
                <TableCell
                  align="right"
                  sx={{ fontWeight: 800, color: "#2E86DE" }}
                >
                  รวมทั้งหมด
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((v) => {
                let vTotal = 0;
                return (
                  <TableRow key={v.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                        {v.licensePlate}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {v.type}
                      </Typography>
                    </TableCell>
                    {months.map((m) => {
                      const cost = getVehicleCostForMonth(v.id, m);
                      vTotal += cost;
                      return (
                        <TableCell key={m} align="right">
                          {cost > 0 ? `฿${cost.toLocaleString()}` : "-"}
                        </TableCell>
                      );
                    })}
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 700, color: "#2E86DE" }}
                    >
                      ฿{vTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Grand Total Row */}
              <TableRow sx={{ backgroundColor: "#F8FAFD" }}>
                <TableCell sx={{ fontWeight: 800 }}>
                  รวมทั้งหมดทั้งเจ้าตัว
                </TableCell>
                {months.map((m) => (
                  <TableCell key={m} align="right" sx={{ fontWeight: 800 }}>
                    ฿{calculateTotalForMonth(m).toLocaleString()}
                  </TableCell>
                ))}
                <TableCell
                  align="right"
                  sx={{ fontWeight: 800, color: "#E74C3C" }}
                >
                  ฿
                  {months
                    .reduce((sum, m) => sum + calculateTotalForMonth(m), 0)
                    .toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Reports;
