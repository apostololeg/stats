import { DateTime, Link, Table } from '@homecode/ui';
import cn from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useStore } from 'justorm/react';
import liveStore, { useLive } from 'store/live';
import { countryNameToFlagEmoji } from 'tools/countryFlag';

import { ColumnFilter } from './ColumnFilter';
import S from './LiveEvents.styl';
import { LivePlot } from './LivePlot';
import {
  ColumnFilterValue,
  ColumnFilters,
  FilterColumn,
  FilterOption,
  LiveEventRow,
  applyColumnFilters,
  mergeFilterOptions,
  optionsFromApi,
  optionsFromRows,
  truncateId,
} from './liveFilters';

const STATUS_LABEL = {
  idle: 'Idle',
  connecting: 'Connecting…',
  connected: 'Live',
  disconnected: 'Reconnecting…',
};

function HeaderCell({
  label,
  column,
  options,
  value,
  onChange,
}: {
  label: string;
  column: FilterColumn;
  options: FilterOption[];
  value?: ColumnFilterValue;
  onChange: (column: FilterColumn, value?: ColumnFilterValue) => void;
}) {
  return (
    <div className={S.headerCell}>
      <span>{label}</span>
      <ColumnFilter
        label={label}
        options={options}
        value={value}
        multiple={column === 'country'}
        onChange={next => onChange(column, next)}
      />
    </div>
  );
}

export default function LiveEvents() {
  const live = useLive(['events', 'status', 'filterOptions']);
  const { projects } = useStore({ projects: ['items'] });
  const [filters, setFilters] = useState<ColumnFilters>({});

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

  const columnOptions = useMemo(
    () =>
      mergeFilterOptions(
        optionsFromRows(tableData),
        optionsFromApi(live.filterOptions),
      ),
    [tableData, live.filterOptions],
  );

  const filteredData = useMemo(
    () => applyColumnFilters(tableData, filters),
    [tableData, filters],
  );

  const onFilterChange = useCallback(
    (column: FilterColumn, value?: ColumnFilterValue) => {
      setFilters(prev => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          const next = { ...prev };
          delete next[column];
          return next;
        }

        return { ...prev, [column]: value };
      });
    },
    [],
  );

  const columns = useMemo(
    () => [
      {
        id: 'time',
        label: (
          <HeaderCell
            label="Time"
            column="time"
            options={columnOptions.time}
            value={filters.time}
            onChange={onFilterChange}
          />
        ),
        render: ({ time }: LiveEventRow) => (
          <span title={time}>
            <DateTime value={time} format="fromNow" />
          </span>
        ),
      },
      {
        id: 'country',
        label: (
          <HeaderCell
            label="Country"
            column="country"
            options={columnOptions.country}
            value={filters.country}
            onChange={onFilterChange}
          />
        ),
        render: ({ country, countryFlag }: LiveEventRow) => (
          <span title={country}>{countryFlag}</span>
        ),
      },
      {
        id: 'project',
        label: (
          <HeaderCell
            label="Project"
            column="project"
            options={columnOptions.project}
            value={filters.project}
            onChange={onFilterChange}
          />
        ),
        render: ({ projectName, pid }: LiveEventRow) => {
          const isRawPid = projectName === pid;
          const label = isRawPid ? truncateId(projectName) : projectName;

          return (
            <Link
              href={`//project/${pid}`}
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
        label: (
          <HeaderCell
            label="Type"
            column="type"
            options={columnOptions.type}
            value={filters.type}
            onChange={onFilterChange}
          />
        ),
        dataField: 'type',
      },
      {
        id: 'name',
        label: (
          <HeaderCell
            label="Name"
            column="name"
            options={columnOptions.name}
            value={filters.name}
            onChange={onFilterChange}
          />
        ),
        render: ({ name }: LiveEventRow) => (
          <span className={S.cellEllipsis} title={name}>
            {name}
          </span>
        ),
      },
      {
        id: 'client',
        label: (
          <HeaderCell
            label="Client"
            column="client"
            options={columnOptions.client}
            value={filters.client}
            onChange={onFilterChange}
          />
        ),
        render: ({ cid }: LiveEventRow) => (
          <span title={cid}>{truncateId(cid)}</span>
        ),
      },
    ],
    [columnOptions, filters, onFilterChange],
  );

  useEffect(() => {
    liveStore.loadFilterOptions();
  }, []);

  return (
    <div className={S.root}>
      <div className={S.header}>
        <span className={cn(S.status, S[live.status])}>
          {STATUS_LABEL[live.status]}
        </span>
      </div>

      <LivePlot events={live.events} />

      <div className={S.tableWrap}>
        <Table className={S.table} columns={columns} data={filteredData} />
      </div>
      {filteredData.length === 0 && (
        <p className={S.empty}>
          {tableData.length === 0 ? 'No live events yet' : 'No matching events'}
        </p>
      )}
    </div>
  );
}
