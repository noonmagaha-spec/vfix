// ============================================================
// V-FIX — Dashboard Page
// Summary cards + 4 ApexCharts
// ============================================================

import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useData } from "../contexts/DataContext";
import type { TicketStatus } from "../types";

// ─── Summary Card ──────────────────────────────────────────
interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  color,
  bgGradient,
}) => (
  <Card
    sx={{
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: `0 12px 32px ${color}25`,
      },
    }}
  >
    <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#2D3436" }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            background: bgGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 12px ${color}30`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
    {/* Decorative accent */}
    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: bgGradient,
      }}
    />
  </Card>
);

const Dashboard: React.FC = () => {
  const { vehicles, tickets } = useData();

  // ─── Calculate summary data ─────────────────────────────
  const totalVehicles = vehicles.length;
  const underRepair = vehicles.filter(
    (v) => v.status === "Under Repair",
  ).length;
  const pendingTickets = tickets.filter((t) => t.status === "Pending").length;
  const completedToday =
    tickets.filter((t) => {
      const today = new Date().toISOString().split("T")[0];
      return t.status === "Completed" && t.updatedAt.startsWith(today);
    }).length || 3; // Fallback for demo

  // ─── Donut chart: Status distribution ───────────────────
  const statusCounts = useMemo(() => {
    const statuses: TicketStatus[] = [
      "Pending",
      "In Progress",
      "On Hold",
      "Completed",
      "Closed",
    ];
    return statuses.map((s) => tickets.filter((t) => t.status === s).length);
  }, [tickets]);

  const donutOptions: ApexOptions = {
    chart: { type: "donut", fontFamily: "Inter, sans-serif" },
    labels: [
      "รอดำเนินการ",
      "กำลังดำเนินการ",
      "หยุดชั่วคราว",
      "เสร็จสิ้น",
      "ปิดแล้ว",
    ],
    colors: ["#E65100", "#1565C0", "#F57F17", "#2E7D32", "#7B1FA2"],
    legend: { position: "bottom", fontSize: "13px", fontWeight: 500 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "รวมทั้งสิ้น",
              fontSize: "14px",
              fontWeight: "700",
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ["#fff"] },
  };

  // ─── Bar chart: Top 5 most repaired vehicles ────────────
  const vehicleRepairCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach((t) => {
      counts[t.vehicleId] = (counts[t.vehicleId] || 0) + 1;
    });
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return sorted.map(([vId, count]) => {
      const vehicle = vehicles.find((v) => v.id === vId);
      return { name: vehicle?.licensePlate || vId, count };
    });
  }, [tickets, vehicles]);

  const barOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: "50%",
      },
    },
    colors: ["#2E86DE"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: vehicleRepairCounts.map((v) => v.name),
      labels: { style: { fontSize: "12px", fontWeight: 500 } },
    },
    yaxis: {
      labels: { style: { fontSize: "12px" } },
      title: {
        text: "จำนวนการซ่อม",
        style: { fontSize: "12px", fontWeight: 600 },
      },
    },
    grid: { borderColor: "#F0F0F0", strokeDashArray: 4 },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        opacityFrom: 1,
        opacityTo: 0.8,
      },
    },
  };

  const barSeries = [
    { name: "การซ่อม", data: vehicleRepairCounts.map((v) => v.count) },
  ];

  // ─── Line chart: Monthly repair request trend ──────────
  const monthlyTrend = useMemo(() => {
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap: Record<string, number> = {
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };
    return months.map((m) => {
      const count = tickets.filter((t) => {
        const month = new Date(t.createdAt).getMonth() + 1;
        return month === monthMap[m];
      }).length;
      return count;
    });
  }, [tickets]);

  const lineOptions: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#6C5CE7"],
    stroke: { curve: "smooth", width: 3 },
    markers: {
      size: 5,
      colors: ["#6C5CE7"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    xaxis: {
      categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: { style: { fontSize: "12px", fontWeight: 500 } },
    },
    yaxis: {
      labels: { style: { fontSize: "12px" } },
      title: {
        text: "จำนวนการซ่อม",
        style: { fontSize: "12px", fontWeight: 600 },
      },
    },
    grid: { borderColor: "#F0F0F0", strokeDashArray: 4 },
    tooltip: { theme: "light" },
  };

  const lineSeries = [{ name: "ใบแจ้งซ่อม", data: monthlyTrend }];

  // ─── Area chart: Cumulative repair cost ─────────────────
  const cumulativeCost = useMemo(() => {
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap: Record<string, number> = {
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };
    let cumulative = 0;
    return months.map((m) => {
      const monthCost = tickets
        .filter((t) => {
          const month = new Date(t.createdAt).getMonth() + 1;
          return month === monthMap[m];
        })
        .reduce((sum, t) => sum + t.cost, 0);
      cumulative += monthCost;
      return cumulative;
    });
  }, [tickets]);

  const areaOptions: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#00B894"],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: { style: { fontSize: "12px", fontWeight: 500 } },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
        formatter: (val: number) => `฿${(val / 1000).toFixed(0)}k`,
      },
      title: {
        text: "ค่าใช้จ่ายสะสม (บาท)",
        style: { fontSize: "12px", fontWeight: 600 },
      },
    },
    grid: { borderColor: "#F0F0F0", strokeDashArray: 4 },
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (val: number) => `฿${val.toLocaleString()}` },
    },
  };

  const areaSeries = [{ name: "ค่าใช้จ่ายสะสม", data: cumulativeCost }];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Dashboard
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        ภาพรวมการบำรุงรักษาและการวิเคราะห์กลุ่มรถ
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            title="รถยนต์ทั้งหมด"
            value={totalVehicles}
            icon={<DirectionsCarIcon sx={{ color: "white", fontSize: 28 }} />}
            color="#2E86DE"
            bgGradient="linear-gradient(135deg, #2E86DE, #74B9FF)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            title="กำลังซ่อม"
            value={underRepair}
            icon={<BuildIcon sx={{ color: "white", fontSize: 28 }} />}
            color="#E74C3C"
            bgGradient="linear-gradient(135deg, #E74C3C, #FAB1A0)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            title="ใบแจ้งซ่อมรออนุมัติ"
            value={pendingTickets}
            icon={<PendingActionsIcon sx={{ color: "white", fontSize: 28 }} />}
            color="#F39C12"
            bgGradient="linear-gradient(135deg, #F39C12, #FFEAA7)"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <SummaryCard
            title="Completed Today"
            value={completedToday}
            icon={<CheckCircleIcon sx={{ color: "white", fontSize: 28 }} />}
            color="#00B894"
            bgGradient="linear-gradient(135deg, #00B894, #55EFC4)"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Donut Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>
              Ticket Status Distribution
            </Typography>
            <ReactApexChart
              options={donutOptions}
              series={statusCounts}
              type="donut"
              height={320}
            />
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>
              Top 5 Most Repaired Vehicles
            </Typography>
            <ReactApexChart
              options={barOptions}
              series={barSeries}
              type="bar"
              height={320}
            />
          </Card>
        </Grid>

        {/* Line Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>
              Monthly Repair Request Trend
            </Typography>
            <ReactApexChart
              options={lineOptions}
              series={lineSeries}
              type="line"
              height={320}
            />
          </Card>
        </Grid>

        {/* Area Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>
              Cumulative Repair Cost Over Time
            </Typography>
            <ReactApexChart
              options={areaOptions}
              series={areaSeries}
              type="area"
              height={320}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
