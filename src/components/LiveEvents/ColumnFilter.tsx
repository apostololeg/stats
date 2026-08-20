import { Button, Chip, Icon, Select2 } from '@homecode/ui';
import cn from 'classnames';
import { SVGProps, useState } from 'react';

import S from './LiveEvents.styl';
import { FilterOption } from './liveFilters';

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
  value?: string;
  onChange: (value?: string) => void;
};

export function ColumnFilter({ label, options, value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(option => option.id === value);
  const selectedLabel = selected?.label ?? value;

  const clear = () => {
    setIsOpen(false);
    onChange(undefined);
  };

  if (value && !isOpen) {
    return (
      <Chip className={S.filterChip} size="s" onClick={clear} onRemove={clear}>
        <span title={selectedLabel}>{selectedLabel}</span>
      </Chip>
    );
  }

  return (
    <Select2
      className={cn(S.filterButton, isOpen && S.filterSelect)}
      size="s"
      isSearchable
      isOpen={isOpen}
      disableLabel
      closeOnSelect
      options={options}
      value={value ?? null}
      inputProps={{ autoFocus: true, placeholder: 'Filter' }}
      popupProps={{ animated: false, elevation: 2 }}
      trigger={
        !isOpen && (
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
        )
      }
      onChange={next => {
        const id = Array.isArray(next) ? next[0] : next;

        setIsOpen(false);
        onChange(id == null || id === '' ? undefined : String(id));
      }}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    />
  );
}
