import { useEffect, useMemo, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { getSpecialityDistribution } from '@app/api/StatisticsServic';
import { SpecialityDistributionFilter as FilterDto } from '@app/types/SpecialityDistributionFilter';
import SpecialityDistributionFilter from './SpecialityDistributionFilter';
import DashboardCardHeader from './DashboardCardHeader';

import './DoctorsPerSpecialityChart.scss';

type SortKey = 'count-desc' | 'count-asc' | 'name-asc';

interface Row {
  id: number;
  name: string;
  count: number;
}

const SORT_OPTIONS: { key: SortKey; label: string; icon: string }[] = [
  { key: 'count-desc', label: 'Most', icon: 'fas fa-arrow-down-wide-short' },
  { key: 'count-asc', label: 'Least', icon: 'fas fa-arrow-up-short-wide' },
  { key: 'name-asc', label: 'A–Z', icon: 'fas fa-arrow-down-a-z' },
];

// Vertical bars laid out left→right; the plot grows past the card and scrolls.
const COLUMN_WIDTH = 78;
const PLOT_HEIGHT = 360;
const X_AXIS_HEIGHT = 104;
const Y_AXIS_WIDTH = 44;
const AXIS_COL_WIDTH = 52;
// Only top/bottom margins + X-axis height govern vertical alignment between the
// pinned axis chart and the scrolling chart, so those must match; left/right can differ.
const CHART_MARGIN = { top: 28, right: 24, bottom: 0, left: 0 };
const AXIS_MARGIN = { top: 28, right: 0, bottom: 0, left: 0 };

// Single measure => single hue (secondary brand indigo→purple); magnitude carried by bar height.
const BAR_TOP = '#667eea';
const BAR_BOTTOM = '#764ba2';
const BAR_ACTIVE_TOP = '#5568d3';
const BAR_ACTIVE_BOTTOM = '#6a3f8f';

const niceCeil = (value: number): number => {
  if (value <= 5) return 5;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  for (const step of [1, 2, 2.5, 5, 10]) {
    const candidate = step * pow;
    if (candidate >= value) return candidate;
  }
  return 10 * pow;
};

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const row: Row = payload[0].payload;
  return (
    <div className="spec-chart-tooltip">
      <div className="spec-chart-tooltip__name">{row.name}</div>
      <div className="spec-chart-tooltip__value">
        <span className="spec-chart-tooltip__dot" />
        {row.count.toLocaleString()} doctor{row.count === 1 ? '' : 's'}
      </div>
    </div>
  );
};

// Rotated, truncated speciality labels; full name via native SVG <title> on hover.
const XAxisTick = ({ x, y, payload }: any) => {
  const label: string = payload.value;
  const text = label.length > 15 ? `${label.slice(0, 14)}…` : label;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        transform="rotate(-38)"
        textAnchor="end"
        dy={6}
        dx={2}
        className="spec-chart-xtick"
      >
        <title>{label}</title>
        {text}
      </text>
    </g>
  );
};

const DoctorsPerSpecialityChart = () => {
  const [filter, setFilter] = useState<FilterDto | null>(null);
  const [counts, setCounts] = useState<Row[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('count-desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Refetch the distribution whenever the filter changes (single request).
  useEffect(() => {
    if (filter === null) return;
    let cancelled = false;

    setLoading(true);
    setError(false);
    getSpecialityDistribution(filter)
      .then((res) => {
        if (cancelled) return;
        setCounts(
          res.map((r) => ({ id: r.speciality.id!, name: r.speciality.name, count: r.doctorsCount }))
        );
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filter]);

  const data = useMemo(() => {
    const rows = [...counts];
    rows.sort((a, b) => {
      if (sortKey === 'name-asc') return a.name.localeCompare(b.name);
      if (sortKey === 'count-asc') return a.count - b.count;
      return b.count - a.count;
    });
    return rows;
  }, [counts, sortKey]);

  const totalDoctors = useMemo(() => counts.reduce((sum, r) => sum + r.count, 0), [counts]);
  const topSpeciality = useMemo(
    () => counts.reduce<Row | null>((top, r) => (!top || r.count > top.count ? r : top), null),
    [counts]
  );
  const avgPerSpeciality = counts.length ? Math.round(totalDoctors / counts.length) : 0;
  const yMax = useMemo(
    () => niceCeil(Math.ceil(Math.max(1, ...data.map((r) => r.count)) * 1.02)),
    [data]
  );

  const hasData = data.length > 0;
  const chartWidth = data.length * COLUMN_WIDTH;

  return (
    <Card className="shadow-sm border-0 mx-0 spec-chart-card">
      <Card.Header className="p-0 border-0 bg-transparent">
        <DashboardCardHeader
          icon="fas fa-user-md"
          title="Doctors by Speciality"
          subtitle="Registered doctors across each speciality"
          actions={
            hasData ? (
              <div className="spec-chart-kpis">
                <div className="spec-chart-kpi">
                  <span className="spec-chart-kpi__value">{totalDoctors.toLocaleString()}</span>
                  <span className="spec-chart-kpi__label">Total doctors</span>
                </div>
                <div className="spec-chart-kpi">
                  <span className="spec-chart-kpi__value">{data.length}</span>
                  <span className="spec-chart-kpi__label">Specialities</span>
                </div>
                {topSpeciality && (
                  <div className="spec-chart-kpi spec-chart-kpi--top">
                    <span className="spec-chart-kpi__value" title={topSpeciality.name}>
                      {topSpeciality.name}
                    </span>
                    <span className="spec-chart-kpi__label">
                      <i className="fas fa-crown me-1" />
                      Top speciality
                    </span>
                  </div>
                )}
              </div>
            ) : undefined
          }
        />
      </Card.Header>

      <Card.Body className="spec-chart-body">
        {/* Filters — dedicated component, in its own box */}
        <SpecialityDistributionFilter onChange={setFilter} />

        {/* Sort control */}
        <div className="spec-chart-subbar">
          <span className="spec-chart-subbar__hint">
            {hasData ? `${data.length} specialities shown` : ''}
          </span>
          <div className="spec-chart-subbar__sort">
            <span className="spec-chart-subbar__label">Sort</span>
            <div className="spec-chart-segmented" role="group" aria-label="Sort specialities">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={opt.key === sortKey ? 'is-active' : ''}
                  onClick={() => setSortKey(opt.key)}
                >
                  <i className={opt.icon} />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart canvas */}
        <div className="spec-chart-canvas">
          {loading && (
            <div className="spec-chart-overlay">
              <Spinner animation="border" size="sm" variant="primary" role="status" />
              <span>Loading…</span>
            </div>
          )}

          {!loading && error && (
            <div className="spec-chart-empty">
              <i className="fas fa-triangle-exclamation" />
              <span>Couldn't load speciality statistics. Please try again.</span>
            </div>
          )}

          {!loading && !error && !hasData && (
            <div className="spec-chart-empty">
              <i className="fas fa-chart-column" />
              <span>No doctors match the selected filters.</span>
            </div>
          )}

          {hasData && (
            <div className="spec-chart-plot">
              {/* Sticky left axis — stays in place while the columns scroll */}
              <div className="spec-chart-plot__axis" style={{ width: AXIS_COL_WIDTH }}>
                <ResponsiveContainer width="100%" height={PLOT_HEIGHT}>
                  <BarChart data={data} margin={AXIS_MARGIN}>
                    <YAxis
                      type="number"
                      domain={[0, yMax]}
                      width={Y_AXIS_WIDTH}
                      tickCount={5}
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                    />
                    <XAxis
                      dataKey="name"
                      height={X_AXIS_HEIGHT}
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Scrollable columns */}
              <div className="spec-chart-scroll">
                <div style={{ minWidth: '100%', width: chartWidth }}>
                  <ResponsiveContainer width="100%" height={PLOT_HEIGHT}>
                    <BarChart data={data} margin={CHART_MARGIN} barCategoryGap="34%">
                      <defs>
                        <linearGradient id="specBar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BAR_TOP} />
                          <stop offset="100%" stopColor={BAR_BOTTOM} />
                        </linearGradient>
                        <linearGradient id="specBarActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BAR_ACTIVE_TOP} />
                          <stop offset="100%" stopColor={BAR_ACTIVE_BOTTOM} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#eef2f6" />
                      <XAxis
                        dataKey="name"
                        height={X_AXIS_HEIGHT}
                        interval={0}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tick={<XAxisTick />}
                      />
                      <YAxis type="number" domain={[0, yMax]} tickCount={5} hide />
                      <Tooltip
                        content={<ChartTooltip />}
                        cursor={{ fill: 'rgba(102, 126, 234, 0.10)' }}
                      />
                      <Bar
                        dataKey="count"
                        fill="url(#specBar)"
                        activeBar={{ fill: 'url(#specBarActive)' }}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={36}
                        isAnimationActive
                      >
                        <LabelList
                          dataKey="count"
                          position="top"
                          formatter={(value: any) => Number(value).toLocaleString()}
                          style={{ fill: '#334155', fontSize: 12, fontWeight: 700 }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default DoctorsPerSpecialityChart;
