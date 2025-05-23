import cn from 'classnames';

import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import { activeColor } from 'components/App/store';

import S from './Plot.styl';
import { DateTime } from '@homecode/ui';

export type PlotDataItem = {
  value: number;
  name: string;
};

export type LineChartData = {
  name: string;
  data: PlotDataItem[];
};

interface Props {
  // data: LineChartData[];
  data: Record<string, number>;
  className?: string;
}

const LINE_CHART_MARGIN = {
  // top: 10,
  // right: 10,
  // left: -30,
  // bottom: 10,
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
};

export function Plot({ data, className }: Props) {
  const chartData = Object.entries(data).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className={cn(S.root, className)}>
      {/* <div className={S.title}>{title}</div> */}
      <ResponsiveContainer>
        <LineChart data={chartData} margin={LINE_CHART_MARGIN}>
          <YAxis fontSize={10} className={S.yAxis} />
          <Tooltip
            content={d => {
              const { value, name, payload } = d.payload?.[0] ?? {};
              return (
                <div className={S.tooltip}>
                  <span className={S.tooltipLabel}>
                    <DateTime value={payload?.date} format="fromNow" />
                  </span>
                  &nbsp;
                  <b>{value}</b>
                  <p className={S.fillDate}>{payload?.date}</p>
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={activeColor}
            dot={false}
            activeDot={{ r: 8 }}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-in-out"
            animateNewValues={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
