import { Button, Chip, Icon, Input, Select2 } from '@homecode/ui';
import cn from 'classnames';
import { SVGProps, useState } from 'react';

import S from './LiveEvents.styl';
import {
  ColumnFilterValue,
  EXCLUDE_PREFIX,
  FilterOption,
  addFilterToken,
  getFilterId,
  isExcludeFilter,
  removeFilterToken,
  toExcludeFilter,
  toFilterTokens,
} from './liveFilters';

function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4 6h16l-6.5 7.5V19l-3 1.5V13.5L4 6z" />
    </svg>
  );
}

type Props = {
  label: string;
  options: FilterOption[];
  value?: ColumnFilterValue;
  multiple?: boolean;
  onChange: (value?: ColumnFilterValue) => void;
};

function chipLabelFor(
  token: string,
  options: FilterOption[],
): string | undefined {
  const filterId = getFilterId(token);
  const selected = options.find(option => option.id === filterId);
  const selectedLabel = selected?.label ?? filterId;
  if (!selectedLabel) return undefined;
  return isExcludeFilter(token)
    ? `${EXCLUDE_PREFIX}${selectedLabel}`
    : selectedLabel;
}

export function ColumnFilter({
  label,
  options,
  value,
  multiple,
  onChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const excludeMode = search.startsWith(EXCLUDE_PREFIX);
  const searchToken = excludeMode
    ? search.slice(EXCLUDE_PREFIX.length)
    : search;
  const tokens = toFilterTokens(value);
  const singleToken = multiple ? undefined : tokens[0];
  const filterId = getFilterId(singleToken);
  const selectedLabel = chipLabelFor(singleToken ?? '', options);

  const emit = (next: string[]) => {
    onChange(next.length === 0 ? undefined : multiple ? next : next[0]);
  };

  const clear = () => {
    setIsOpen(false);
    setSearch('');
    onChange(undefined);
  };

  const removeToken = (token: string) => {
    emit(removeFilterToken(value, token));
  };

  const chips =
    tokens.length > 0 ? (
      <div className={S.filterChips}>
        {tokens.map(token => {
          const chipLabel = chipLabelFor(token, options);
          const remove = () => (multiple ? removeToken(token) : clear());

          return (
            <Chip
              key={token}
              className={S.filterChip}
              size="s"
              onClick={remove}
              onRemove={remove}
            >
              <span title={chipLabel}>{chipLabel}</span>
            </Chip>
          );
        })}
      </div>
    ) : null;

  if (singleToken && !isOpen) {
    return chips;
  }

  return (
    <>
      <Select2
        className={cn(S.filterButton, isOpen && S.filterSelect)}
        size="s"
        isSearchable
        isOpen={isOpen}
        disableLabel
        closeOnSelect={!multiple}
        options={options}
        value={filterId ?? null}
        searchValue={searchToken}
        popupProps={{ animated: false, elevation: 2 }}
        trigger={
          !isOpen ? (
            <Button
              className={S.filterButton}
              type="button"
              variant="text"
              size="s"
              square
              aria-label={`Filter ${label}`}
              title={`Filter ${label}`}
              onClick={() => setIsOpen(true)}
            >
              <Icon size="s" icon={FilterIcon} />
            </Button>
          ) : (
            <Input
              size="s"
              autoFocus
              value={search}
              placeholder="Filter"
              onChange={(_, next) => setSearch(String(next))}
            />
          )
        }
        onChange={next => {
          const id = Array.isArray(next) ? next[0] : next;

          if (!multiple) {
            setIsOpen(false);
            setSearch('');
          } else {
            setSearch(excludeMode ? EXCLUDE_PREFIX : '');
          }

          if (id == null || id === '') {
            if (!multiple) onChange(undefined);
            return;
          }

          const nextId = String(id);
          const token = excludeMode ? toExcludeFilter(nextId) : nextId;
          emit(multiple ? addFilterToken(value, token) : [token]);
        }}
        onOpen={() => setIsOpen(true)}
        onClose={() => {
          setIsOpen(false);
          setSearch('');
        }}
      />
      {chips}
    </>
  );
}
