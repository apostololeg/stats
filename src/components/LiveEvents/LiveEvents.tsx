import {
  Button,
  DatePickerInput,
  DateTime,
  GridLayout,
  LS,
  Link,
  Table,
  useDebounceCallback,
  useEvent,
} from '@homecode/ui';
import cn from 'classnames';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useStore } from 'justorm/react';
import liveStore, { LiveEvent, useLive } from 'store/live';
import { rangeBoundsMs } from 'store/reports';
import { useUser } from 'store/user';
import { reportEvent } from 'tools/analytics';
import { countryNameToFlagEmoji } from 'tools/countryFlag';

import { ColumnFilter } from './ColumnFilter';
import { LiveBars } from './LiveBars';
import S from './LiveEvents.styl';
import { LivePlot } from './LivePlot';
import {
  ColumnFilterValue,
  ColumnFilters,
  FilterColumn,
  FilterOption,
  LIVE_EVENTS_FILTERS_LS_KEY,
  LiveEventRow,
  applyColumnFilters,
  mergeFilterOptions,
  optionsFromApi,
  optionsFromRows,
  parseStoredFilters,
  truncateId,
} from './liveFilters';
import {
  LIVE_DATE_INTERVAL_LS_KEY,
  eventsInRange,
  lastWeekInterval,
  readLiveDateInterval,
} from './liveRange';

const SAME_ROW_TOLERANCE_PX = 8;

function useSideBySideChartHeight() {
  const barsRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const bars = barsRef.current;
    const plot = plotRef.current;
    if (!bars || !plot) return;

    const sync = () => {
      const sameRow =
        Math.abs(
          bars.getBoundingClientRect().top - plot.getBoundingClientRect().top,
        ) < SAME_ROW_TOLERANCE_PX;
      const next = sameRow && bars.offsetHeight > 0 ? bars.offsetHeight : null;

      setHeight(prev => (prev === next ? prev : next));
    };

    const observer = new ResizeObserver(sync);
    observer.observe(bars);
    if (bars.parentElement) observer.observe(bars.parentElement);
    sync();

    return () => observer.disconnect();
  }, []);

  return { barsRef, plotRef, height };
}

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
        multiple
        onChange={next => onChange(column, next)}
      />
    </div>
  );
}

export default function LiveEvents() {
  const live = useLive([
    'events',
    'rangeEvents',
    'isLoadingRange',
    'status',
    'filterOptions',
  ]);
  const user = useUser(['isLogged', 'isInited']);
  const { projects } = useStore({ projects: ['items'] });
  const [dateInterval, setDateIntervalState] = useState(() =>
    readLiveDateInterval(LS.get(LIVE_DATE_INTERVAL_LS_KEY)),
  );
  const [filters, setFilters] = useState<ColumnFilters>(() =>
    parseStoredFilters(LS.get(LIVE_EVENTS_FILTERS_LS_KEY)),
  );
  const [pageHidden, setPageHidden] = useState(
    () => document.visibilityState === 'hidden',
  );
  const [arrivedWhileHiddenIds, setArrivedWhileHiddenIds] = useState<
    Set<string>
  >(() => new Set());
  const seenEventIdsRef = useRef(new Set<string>());
  const { barsRef, plotRef, height: plotHeight } = useSideBySideChartHeight();

  const onVisibilityChange = useCallback(() => {
    const hidden = document.visibilityState === 'hidden';
    setPageHidden(hidden);
    if (!hidden) setArrivedWhileHiddenIds(new Set());
  }, []);

  useEvent({ event: 'visibilitychange', callback: onVisibilityChange });

  useEffect(() => {
    const nextIds = new Set<string>(
      live.events.map((event: LiveEvent) => event.id),
    );

    if (pageHidden) {
      const added: string[] = [];
      for (const id of nextIds) {
        if (!seenEventIdsRef.current.has(id)) added.push(id);
      }
      if (added.length > 0) {
        setArrivedWhileHiddenIds(prev => {
          const next = new Set(prev);
          added.forEach(id => next.add(id));
          return next;
        });
      }
    }

    seenEventIdsRef.current = nextIds;
  }, [live.events, pageHidden]);

  const setDateInterval = (next: string[]) => {
    const ordered = readLiveDateInterval(next);
    setDateIntervalState(ordered);
    LS.set(LIVE_DATE_INTERVAL_LS_KEY, ordered);
  };

  const isLastWeek =
    dateInterval[0] === lastWeekInterval[0] &&
    dateInterval[1] === lastWeekInterval[1];

  const loadRange = useDebounceCallback(
    (startDate: string, endDate: string) => {
      liveStore.loadRange(startDate, endDate);
    },
    500,
    [],
  );

  const onDateIntervalChange = (next: string[]) => {
    setDateInterval(next);
    reportEvent('date_interval_change');
  };

  const onLastWeekClick = () => {
    setDateInterval(lastWeekInterval);
    reportEvent('last_week_click');
  };

  const bounds = useMemo(
    () => rangeBoundsMs(dateInterval[0], dateInterval[1]),
    [dateInterval],
  );

  const rangedEvents = useMemo(
    () =>
      eventsInRange(
        live.rangeEvents,
        live.events,
        dateInterval[0],
        dateInterval[1],
      ),
    [live.rangeEvents, live.events, dateInterval],
  );

  const projectNames = useMemo(
    () =>
      Object.fromEntries(
        (projects.items ?? []).map(({ id, name }) => [id, name]),
      ),
    [projects.items],
  );

  const tableData = useMemo<LiveEventRow[]>(
    () =>
      rangedEvents.map(event => {
        const { page, event: eventName, country: countryName } = event.data;
        const country = countryName ?? '—';

        return {
          ...event,
          projectName: projectNames[event.pid] ?? event.pid,
          type: page ? 'page' : 'event',
          name: page ?? eventName ?? '—',
          country,
          countryFlag: countryNameToFlagEmoji(countryName),
          className: arrivedWhileHiddenIds.has(event.id)
            ? S.arrivedWhileHidden
            : undefined,
        };
      }),
    [rangedEvents, projectNames, arrivedWhileHiddenIds],
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
        const next = { ...prev };

        if (!value || (Array.isArray(value) && value.length === 0)) {
          delete next[column];
        } else {
          next[column] = value;
        }

        LS.set(LIVE_EVENTS_FILTERS_LS_KEY, next);
        return next;
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

  useEffect(() => {
    loadRange(dateInterval[0], dateInterval[1]);
  }, [dateInterval, loadRange]);

  useEffect(() => {
    if (!user.isInited || !user.isLogged) return;
    liveStore.connect();
  }, [user.isInited, user.isLogged]);

  let emptyLabel = 'No matching events';
  if (tableData.length === 0) {
    emptyLabel = live.isLoadingRange
      ? 'Loading events…'
      : 'No events in this range';
  }

  return (
    <div className={S.root}>
      <div className={S.toolbar}>
        <div className={S.controls}>
          {!isLastWeek && (
            <Button variant="clear" size="s" round onClick={onLastWeekClick}>
              Last week
            </Button>
          )}
          <DatePickerInput
            size="s"
            value={dateInterval}
            onChange={onDateIntervalChange}
            buttonProps={{ round: true }}
            popupProps={{
              blur: true,
              animation: false,
              elevation: 1,
              contentProps: { className: S.datePicker },
            }}
          />
        </div>
        <span className={cn(S.status, S[live.status])}>
          {STATUS_LABEL[live.status]}
        </span>
      </div>

      <div className={cn(live.isLoadingRange && S.isLoading)}>
        <GridLayout colWidth={400} className={S.charts}>
          <LiveBars rootRef={barsRef} rows={tableData} />
          <LivePlot
            rootRef={plotRef}
            height={plotHeight}
            events={rangedEvents}
            from={bounds.start}
            to={bounds.end}
          />
        </GridLayout>

        <div className={S.tableWrap}>
          <Table className={S.table} columns={columns} data={filteredData} />
        </div>
        {filteredData.length === 0 && <p className={S.empty}>{emptyLabel}</p>}
      </div>
    </div>
  );
}
