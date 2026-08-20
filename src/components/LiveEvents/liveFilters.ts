import { LiveEvent, LiveFilterOptions } from 'store/live';
import { countryNameToFlagEmoji } from 'tools/countryFlag';

export const ID_PREVIEW_LENGTH = 6;

export type LiveEventRow = LiveEvent & {
  projectName: string;
  type: string;
  name: string;
  country: string;
  countryFlag: string;
};

export type FilterColumn =
  | 'time'
  | 'country'
  | 'project'
  | 'type'
  | 'name'
  | 'client';

export type FilterOption = { id: string; label: string };

export type FilterOptionsByColumn = Record<FilterColumn, FilterOption[]>;

export type ColumnFilters = Partial<Record<FilterColumn, string>>;

export const FILTER_COLUMNS: FilterColumn[] = [
  'time',
  'country',
  'project',
  'type',
  'name',
  'client',
];

export function truncateId(id: string): string {
  return id.length > ID_PREVIEW_LENGTH
    ? `${id.slice(0, ID_PREVIEW_LENGTH)}...`
    : id;
}

function option(id: string, label = id): FilterOption {
  return { id, label };
}

function countryLabel(id: string, flag?: string): string {
  if (id === '—') return '—';
  return `${flag ?? countryNameToFlagEmoji(id)} ${id}`;
}

function uniqueById(options: FilterOption[]): FilterOption[] {
  const seen = new Set<string>();
  const result: FilterOption[] = [];

  for (const item of options) {
    if (!item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    result.push(item);
  }

  return result;
}

function sortOptions(column: FilterColumn, options: FilterOption[]) {
  if (column === 'time') {
    return options.sort((a, b) => b.id.localeCompare(a.id));
  }

  return options.sort((a, b) => a.label.localeCompare(b.label));
}

export function getColumnValue(
  row: LiveEventRow,
  column: FilterColumn,
): string {
  if (column === 'time') return row.time.slice(0, 10);
  if (column === 'country') return row.country;
  if (column === 'project') return row.pid;
  if (column === 'type') return row.type;
  if (column === 'name') return row.name;
  return row.cid;
}

export function applyColumnFilters(
  rows: LiveEventRow[],
  filters: ColumnFilters,
): LiveEventRow[] {
  const active = FILTER_COLUMNS.filter(column => filters[column]);

  if (active.length === 0) return rows;

  return rows.filter(row =>
    active.every(column => getColumnValue(row, column) === filters[column]),
  );
}

export function optionsFromRows(rows: LiveEventRow[]): FilterOptionsByColumn {
  const time = new Set<string>();
  const country = new Map<string, FilterOption>();
  const project = new Map<string, FilterOption>();
  const type = new Set<string>();
  const name = new Set<string>();
  const client = new Map<string, FilterOption>();

  for (const row of rows) {
    time.add(row.time.slice(0, 10));
    country.set(row.country, {
      id: row.country,
      label: countryLabel(row.country, row.countryFlag),
    });
    project.set(row.pid, { id: row.pid, label: row.projectName });
    type.add(row.type);
    name.add(row.name);
    client.set(row.cid, { id: row.cid, label: truncateId(row.cid) });
  }

  return {
    time: sortOptions(
      'time',
      [...time].map(id => option(id)),
    ),
    country: sortOptions('country', [...country.values()]),
    project: sortOptions('project', [...project.values()]),
    type: sortOptions(
      'type',
      [...type].map(id => option(id)),
    ),
    name: sortOptions(
      'name',
      [...name].map(id => option(id)),
    ),
    client: sortOptions('client', [...client.values()]),
  };
}

export function optionsFromApi(
  api: LiveFilterOptions | null,
): FilterOptionsByColumn {
  return {
    time: (api?.time ?? []).map(id => option(id)),
    country: (api?.country ?? []).map(id => option(id, countryLabel(id))),
    project: (api?.project ?? []).map(item =>
      option(item.id, item.name || item.id),
    ),
    type: (api?.type?.length ? api.type : ['page', 'event']).map(id =>
      option(id),
    ),
    name: (api?.name ?? []).map(id => option(id)),
    client: (api?.client ?? []).map(id => option(id, truncateId(id))),
  };
}

export function mergeFilterOptions(
  fromRows: FilterOptionsByColumn,
  fromApi: FilterOptionsByColumn,
): FilterOptionsByColumn {
  return FILTER_COLUMNS.reduce((acc, column) => {
    acc[column] = sortOptions(
      column,
      uniqueById([...fromApi[column], ...fromRows[column]]),
    );
    return acc;
  }, {} as FilterOptionsByColumn);
}
