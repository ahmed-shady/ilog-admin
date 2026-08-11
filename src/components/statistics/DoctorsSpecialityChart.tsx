import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { SpecialityDistribution } from "@app/api/StatisticsServic";
import Speciality from "@app/types/Speciality";
import { Country } from "@app/types/Country";
import DoctorTypeEnum from "@app/types/DoctorTypeEnum";
import { getDoctorsSpecialityDistribution } from "../../api/StatisticsServic";

const BAR_COLORS = [
  "#3abeff",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

interface Props {
  selectedSpecialities: Speciality[];
  selectedCountries: Country[];
  selectedDegrees: DoctorTypeEnum[];
}

const DoctorsSpecialityChart = ({
  selectedSpecialities,
  selectedCountries,
  selectedDegrees,
}: Props) => {
  const [chartData, setChartData] = useState<SpecialityDistribution[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDoctorsSpecialityDistribution(
      selectedSpecialities
        .map((s) => s.id)
        .filter((id): id is number => id !== undefined),
      selectedCountries.map((c) => c.name),
      selectedDegrees,
    )
      .then(setChartData)
      .catch(() => setChartData([]))
      .finally(() => setLoading(false));
  }, [selectedSpecialities, selectedCountries, selectedDegrees]);

  if (loading) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="fas fa-spinner fa-spin fa-2x mb-2 d-block"></i>
        Loading chart data...
      </div>
    );
  }

  const barWidth = 60;
  const chartWidth = Math.max(chartData.length * barWidth, 400);

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <div style={{ width: chartWidth, minWidth: "100%" }}>
        <BarChart
          width={chartWidth}
          height={380}
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="speciality"
            angle={-35}
            textAnchor="end"
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => [value, "Doctors"]} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default DoctorsSpecialityChart;
