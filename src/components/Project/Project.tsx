import { useStore } from 'justorm/react';
import { useEffect, useRef, useState } from 'react';
import { buildInterval, Report } from 'store/reports';
import cn from 'classnames';

import { Button, DatePickerInput, LS, useDebounce } from '@homecode/ui';
import S from './Project.styl';
import { Container } from 'components/UI/Container/Container';

const today = new Date().setHours(0, 0, 0, 0);
const todayEnd = new Date().setHours(23, 59, 59, 999);
const week = 1000 * 60 * 60 * 24 * 7;
const lastWeekInterval = [
  new Date(today - week).toLocaleDateString('sv-SE'),
  new Date(todayEnd).toLocaleDateString('sv-SE'),
];
const INITIAL_DATE_INTERVAL =
  LS.get('project.dateInterval') || lastWeekInterval;

export default function Project({ pathParams: { pid } }) {
  const { projects, reports } = useStore({
    projects: ['items', 'loadingByPid'],
    reports: ['items', 'isLoadingByInterval'],
  });

  const [report, setReport] = useState<Report | null>(null);
  const [dateInterval, setDateInterval] = useState(INITIAL_DATE_INTERVAL);
  const dateIntervalRef = useRef(dateInterval);
  const intervalStr = buildInterval(dateInterval[0], dateInterval[1]);

  const isLastWeek =
    dateInterval[0] === lastWeekInterval[0] &&
    dateInterval[1] === lastWeekInterval[1];

  const getReportByInterval = () => {
    const interval = buildInterval(dateInterval[0], dateInterval[1]);
    return projectReport?.[interval];
  };

  const data = projects.items.find(project => project.id === pid);
  const projectReport = reports.items[pid];
  const reportByInterval = getReportByInterval();
  const eventsEntries = Object.entries(report?.events ?? {});
  const pagesEntries = Object.entries(report?.pages ?? {});

  const isLoading =
    projects.loadingByPid[pid] || reports.isLoadingByInterval[intervalStr];

  const updateReport = useDebounce(() => {
    const [startDate, endDate] = dateIntervalRef.current;
    reports.load({ pid, startDate, endDate });
  }, 500);

  const setReportByInterval = () => {
    const report = getReportByInterval();
    if (report) setReport(report);
    else updateReport(dateInterval);
  };

  const onDateIntervalChange = (dateInterval: string[]) => {
    setDateInterval(dateInterval);
    dateIntervalRef.current = dateInterval;
    LS.set('project.dateInterval', dateInterval);

    setReportByInterval();
  };

  useEffect(() => {
    if (!data) {
      projects.load(pid);
    }
  }, [pid]);

  useEffect(() => {
    if (!report) updateReport(dateInterval);
  }, [pid]);

  useEffect(() => {
    if (reportByInterval) setReport(reportByInterval);
    else updateReport(dateInterval);
  }, [reportByInterval]);

  return (
    <Container className={cn(S.root, isLoading && S.isLoading)}>
      <h1>
        {data?.name}
        <div className={S.gap} />
        <div className={S.controls}>
          {!isLastWeek && (
            <Button
              variant="clear"
              size="s"
              round
              onClick={() => {
                const startDate = new Date(today - week);
                const endDate = new Date(todayEnd);
                setDateInterval([
                  startDate.toLocaleDateString('sv-SE'),
                  endDate.toLocaleDateString('sv-SE'),
                ]);
              }}
            >
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
      </h1>

      {report && (
        <>
          <h2>Users by country</h2>

          <table>
            <tbody>
              {Object.entries(report.countries).map(([country, count]) => (
                <tr key={country}>
                  <td>{count as number}</td>
                  <td>{country}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>{report.users}</td>
                <td>Total</td>
              </tr>
            </tfoot>
          </table>

          <h2>Pages views</h2>
          {pagesEntries.length > 0 ? (
            <table>
              <tbody>
                {pagesEntries.map(([page, count]) => (
                  <tr key={page}>
                    <td>{count as number}</td>
                    <td>{page}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>{pagesEntries.length}</td>
                  <td>Total</td>
                </tr>
              </tfoot>
            </table>
          ) : (
            'No Pages'
          )}

          <h2>Events</h2>
          {eventsEntries.length > 0 ? (
            <table>
              <tbody>
                {eventsEntries.map(([event, count]) => (
                  <tr key={event}>
                    <td>{count as number}</td>
                    <td>{event}</td>
                  </tr>
                ))}
              </tbody>
              {eventsEntries.length > 1 && (
                <tfoot>
                  <tr>
                    <td>{eventsEntries.length}</td>
                    <td>Total</td>
                  </tr>
                </tfoot>
              )}
            </table>
          ) : (
            'No Events'
          )}
        </>
      )}
    </Container>
  );
}
