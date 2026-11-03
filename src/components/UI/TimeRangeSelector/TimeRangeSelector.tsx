import { Button, DatePickerInput } from '@homecode/ui';
import cn from 'classnames';

import S from './TimeRangeSelector.styl';
import { ShiftUnit, shiftRange } from './shiftRange';

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  datePickerClassName?: string;
};

const SHIFTS: {
  unit: ShiftUnit;
  step: number;
  label: string;
  title: string;
}[] = [
  { unit: 'month', step: -1, label: '−1M', title: 'Month before' },
  { unit: 'week', step: -1, label: '−1W', title: 'Week before' },
  { unit: 'week', step: 1, label: '+1W', title: 'Week after' },
  { unit: 'month', step: 1, label: '+1M', title: 'Month after' },
];

export function TimeRangeSelector({
  value,
  onChange,
  className,
  datePickerClassName,
}: Props) {
  const renderShift = ({ unit, step, label, title }: (typeof SHIFTS)[0]) => (
    <Button
      key={`${unit}${step}`}
      className={S.shift}
      variant="clear"
      size="s"
      round
      title={title}
      aria-label={title}
      onClick={() => {
        onChange(shiftRange(value, unit, step));
      }}
    >
      {label}
    </Button>
  );

  return (
    <div className={cn(S.root, className)}>
      {SHIFTS.slice(0, 2).map(renderShift)}
      <DatePickerInput
        size="s"
        value={value}
        onChange={onChange}
        buttonProps={{ round: true }}
        popupProps={{
          blur: true,
          animation: false,
          elevation: 1,
          contentProps: { className: datePickerClassName },
        }}
      />
      {SHIFTS.slice(2).map(renderShift)}
    </div>
  );
}
