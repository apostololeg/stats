import cn from 'classnames';
import { type Ref, useMemo } from 'react';

import { activeColor } from 'components/App/store';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import S from './LiveBars.styl';
import { LiveEventRow, truncateId } from './liveFilters';

const PAGE_VIEWS_COLOR = '#22c55e';
const TOP_PROJECTS_LIMIT = 7;

const BAR_CHART_MARGIN = {
  top: 8,
  right: 12,
  bottom: 4,
  left: 0,
};

function projectLabel(name: string, pid: string) {
  if (name === pid) return truncateId(name);
  return name;
}

interface Props {
  rows: LiveEventRow[];
  className?: string;
  rootRef?: Ref<HTMLDivElement>;
}

export function LiveBars({ rows, className, rootRef }: Props) {
  const chartData = useMemo(() => {
    const byProject = new Map<
      string,
      { pid: string; project: string; events: number; pageViews: number }
    >();

    rows.forEach(row => {
      const item = byProject.get(row.pid) ?? {
        pid: row.pid,
        project: projectLabel(row.projectName, row.pid),
        events: 0,
        pageViews: 0,
      };

      if (row.type === 'page') item.pageViews += 1;
      else item.events += 1;

      byProject.set(row.pid, item);
    });

    return [...byProject.values()]
      .sort(
        (a, b) =>
          b.events + b.pageViews - (a.events + a.pageViews) ||
          a.project.localeCompare(b.project),
      )
      .slice(0, TOP_PROJECTS_LIMIT);
  }, [rows]);

  const labels = useMemo(
    () => Object.fromEntries(chartData.map(item => [item.pid, item.project])),
    [chartData],
  );

  return (
    <div ref={rootRef} className={cn(S.root, className)}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={BAR_CHART_MARGIN} barGap={2}>
          <XAxis
            dataKey="pid"
            fontSize={10}
            className={S.xAxis}
            interval={0}
            tickFormatter={pid => labels[pid] ?? pid}
          />
          <YAxis fontSize={10} className={S.yAxis} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'transparent' }}
            content={d => {
              const row = d.payload?.[0]?.payload;
              if (!row) return null;

              return (
                <div className={S.tooltip}>
                  <span className={S.tooltipLabel}>{row.project}</span>
                  <br />
                  <b>{row.events}</b> events
                  <br />
                  <b>{row.pageViews}</b> page views
                </div>
              );
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{
              fontSize: 12,
              color: 'var(--accent-color)',
            }}
          />
          <Bar
            dataKey="events"
            name="Events"
            fill={activeColor}
            maxBarSize={42}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="pageViews"
            name="Page views"
            fill={PAGE_VIEWS_COLOR}
            maxBarSize={42}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
