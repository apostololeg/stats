import cn from 'classnames';
import { useMemo } from 'react';

import { activeColor } from 'components/App/store';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LiveEvent } from 'store/live';

import S from './LivePlot.styl';

const WINDOW_MS = 2 * 60 * 60 * 1000;
const BUCKET_MS = 60 * 1000;

const LINE_CHART_MARGIN = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 0,
};

function bucketEvents(events: LiveEvent[]) {
  const now = Date.now();
  const startBucket = Math.floor((now - WINDOW_MS) / BUCKET_MS) * BUCKET_MS;
  const endBucket = Math.floor(now / BUCKET_MS) * BUCKET_MS;
  const buckets: Record<number, number> = {};

  for (let t = startBucket; t <= endBucket; t += BUCKET_MS) {
    buckets[t] = 0;
  }

  events.forEach(({ time }) => {
    const ts = new Date(time).getTime();
    if (Number.isNaN(ts)) return;
    const bucket = Math.floor(ts / BUCKET_MS) * BUCKET_MS;
    if (buckets[bucket] === undefined) return;
    buckets[bucket]++;
  });

  return Object.entries(buckets).map(([ts, count]) => ({
    time: Number(ts),
    label: new Date(Number(ts)).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    count,
  }));
}

interface Props {
  events: LiveEvent[];
  className?: string;
}

export function LivePlot({ events, className }: Props) {
  const chartData = useMemo(() => bucketEvents(events), [events]);

  return (
    <div className={cn(S.root, className)}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={LINE_CHART_MARGIN}>
          <XAxis dataKey="label" fontSize={10} className={S.xAxis} />
          <YAxis fontSize={10} className={S.yAxis} allowDecimals={false} />
          <Tooltip
            content={d => {
              const { value, payload } = d.payload?.[0] ?? {};
              return (
                <div className={S.tooltip}>
                  <b>{value}</b>
                  <br />
                  <span className={S.tooltipLabel}>{payload?.label}</span>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={activeColor}
            dot={false}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
