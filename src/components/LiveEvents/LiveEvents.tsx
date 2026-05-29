import { DateTime, Link, Table } from '@homecode/ui';
import cn from 'classnames';
import { useMemo } from 'react';

import { useStore } from 'justorm/react';
import { LiveEvent, useLive } from 'store/live';
import { countryNameToFlagEmoji } from 'tools/countryFlag';

import S from './LiveEvents.styl';
import { LivePlot } from './LivePlot';

const STATUS_LABEL = {
  idle: 'Idle',
  connecting: 'Connecting…',
  connected: 'Live',
  disconnected: 'Reconnecting…',
};

const ID_PREVIEW_LENGTH = 6;

function truncateId(id: string): string {
  return id.length > ID_PREVIEW_LENGTH
    ? `${id.slice(0, ID_PREVIEW_LENGTH)}...`
    : id;
}

type LiveEventRow = LiveEvent & {
  projectName: string;
  type: string;
  name: string;
  country: string;
  countryFlag: string;
};

const COLUMNS = [
  {
    id: 'time',
    label: 'Time',
    render: ({ time }: LiveEventRow) => (
      <span title={time}>
        <DateTime value={time} format="fromNow" />
      </span>
    ),
  },
  {
    id: 'country',
    label: 'Country',
    render: ({ country, countryFlag }: LiveEventRow) => (
      <span title={country !== '—' ? country : undefined}>{countryFlag}</span>
    ),
  },
  {
    id: 'project',
    label: 'Project',
    render: ({ projectName, pid }: LiveEventRow) => {
      const isRawPid = projectName === pid;
      const label = isRawPid ? truncateId(projectName) : projectName;

      return (
        <Link
          href={`/project/${pid}`}
          className={S.projectLink}
          title={projectName}
          isClear
          inline
        >
          {label}
        </Link>
      );
    },
  },
  {
    id: 'type',
    label: 'Type',
    dataField: 'type',
  },
  {
    id: 'name',
    label: 'Name',
    render: ({ name }: LiveEventRow) => (
      <span className={S.cellEllipsis} title={name}>
        {name}
      </span>
    ),
  },
  {
    id: 'client',
    label: 'Client',
    render: ({ cid }: LiveEventRow) => (
      <span title={cid}>{truncateId(cid)}</span>
    ),
  },
];

export default function LiveEvents() {
  const live = useLive(['events', 'status']);
  const { projects } = useStore({ projects: ['items'] });

  const projectNames = useMemo(
    () =>
      Object.fromEntries(
        (projects.items ?? []).map(({ id, name }) => [id, name]),
      ),
    [projects.items],
  );

  const tableData = useMemo<LiveEventRow[]>(
    () =>
      live.events.map(event => {
        const { page, event: eventName, country: countryName } = event.data;
        const country = countryName ?? '—';

        return {
          ...event,
          projectName: projectNames[event.pid] ?? event.pid,
          type: page ? 'page' : 'event',
          name: page ?? eventName ?? '—',
          country,
          countryFlag: countryNameToFlagEmoji(countryName),
        };
      }),
    [live.events, projectNames],
  );

  return (
    <div className={S.root}>
      <div className={S.header}>
        <span className={cn(S.status, S[live.status])}>
          {STATUS_LABEL[live.status]}
        </span>
      </div>

      <LivePlot events={live.events} />

      {tableData.length > 0 ? (
        <div className={S.tableWrap}>
          <Table columns={COLUMNS} data={tableData} />
        </div>
      ) : (
        <p className={S.empty}>No live events yet</p>
      )}
    </div>
  );
}
