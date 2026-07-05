import { useState, useCallback } from "react";
import AsyncSelect from "react-select/async";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { listCountries } from "@app/api/CountryService";
import {
  getDoctorsAgeDistribution,
  CountryAgeDistribution,
} from "@app/api/StatisticsServic";
import { Country } from "@app/types/Country";
import selectStyle from "@app/pages/doctors/util/SelectStyle";

const COUNTRY_COLORS = [
  "#3abeff",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

const AGE_GROUPS = ["0-20", "20-30", "30-40", "40-50", "50+"];

interface ChartDataRow {
  ageGroup: string;
  [country: string]: string | number;
}

const buildChartData = (stats: CountryAgeDistribution[]): ChartDataRow[] => {
  return AGE_GROUPS.map((group) => {
    const row: ChartDataRow = { ageGroup: group };
    stats.forEach((countryStat) => {
      const match = countryStat.ageGroups.find((ag) => ag.ageGroup === group);
      row[countryStat.country] = match ? match.count : 0;
    });
    return row;
  });
};

const DoctorsAgeChart = () => {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [chartData, setChartData] = useState<ChartDataRow[]>([]);
  const [loading, setLoading] = useState(false);

  const countriesLoader = useCallback(
    async (inputValue: string): Promise<Country[]> => {
      let data = allCountries;
      if (!data.length) {
        data = await listCountries();
        setAllCountries(data);
      }

      if (!inputValue) return data;
      const lower = inputValue.toLowerCase();
      return data
        .filter((c) => c.name.toLowerCase().includes(lower))
        .sort(
          (a, b) =>
            a.name.toLowerCase().indexOf(lower) -
            b.name.toLowerCase().indexOf(lower),
        );
    },
    [allCountries],
  );

  const handleCountryChange = async (selected: Country[]) => {
    setSelectedCountries(selected);
    if (!selected.length) {
      setChartData([]);
      return;
    }
    setLoading(true);
    try {
      const stats = await getDoctorsAgeDistribution(
        selected.map((c) => c.name),
      );
      setChartData(buildChartData(stats));
    } catch {
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctors-age-chart">
      <div className="age-chart-controls">
        <AsyncSelect
          placeholder="Select country..."
          cacheOptions
          isMulti
          defaultOptions
          loadOptions={countriesLoader}
          value={selectedCountries}
          styles={selectStyle}
          formatOptionLabel={(country: Country) => (
            <div className="country-option">
              <img alt={country.code} src={country.image} />
              <span>{country.name}</span>
            </div>
          )}
          /*@ts-ignore*/
          onChange={handleCountryChange}
          getOptionValue={(option: Country) => option.name}
        />
      </div>

      <div className="age-chart-body">
        {loading && (
          <div className="age-chart-loading">
            <i className="fas fa-spinner fa-spin me-2"></i>
            Loading data...
          </div>
        )}

        {!loading && selectedCountries.length === 0 && (
          <div className="age-chart-placeholder">
            <i className="fas fa-chart-bar"></i>
            <p>Select one or more countries to view doctor age distribution</p>
          </div>
        )}

        {!loading && selectedCountries.length > 0 && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e9ecef"
              />
              <XAxis
                dataKey="ageGroup"
                tick={{ fill: "#6c757d", fontSize: 13, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6c757d", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "13px" }} />
              {selectedCountries.map((country, idx) => (
                <Bar
                  key={country.name}
                  dataKey={country.name}
                  fill={COUNTRY_COLORS[idx % COUNTRY_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DoctorsAgeChart;
