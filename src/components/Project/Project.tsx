import { useStore } from 'justorm/react';
import { useEffect, useState } from 'react';
import { buildInterval } from 'store/reports';

import { DatePickerInput } from '@homecode/ui';
import S from './Project.styl';
import { Container } from 'components/UI/Container/Container';

const today = new Date().setHours(0, 0, 0, 0);
const todayEnd = new Date().setHours(23, 59, 59, 999);
const week = 1000 * 60 * 60 * 24 * 7;

const startDate = new Date(today - week);
const endDate = new Date(todayEnd);

export default function Project({ pathParams: { pid } }) {
  const { projects, reports } = useStore({
    projects: ['items'],
    reports: ['items', 'isLoading'],
  });
  const [dateInterval, setDateInterval] = useState([
    startDate.toLocaleDateString('sv-SE'),
    endDate.toLocaleDateString('sv-SE'),
  ]);

  const data = projects.items.find(project => project.id === pid);
  const projectReport = reports.items[pid];
  const startDateISO = startDate.toISOString();
  const endDateISO = endDate.toISOString();
  const interval = buildInterval(...dateInterval);
  const report = projectReport?.[interval];
  const eventsEntries = Object.entries(report?.events ?? {});
  const pagesEntries = Object.entries(report?.pages ?? {});

  console.log('dateInterval', dateInterval);

  useEffect(() => {
    if (!data) {
      projects.load(pid);
    }
  }, [pid]);

  useEffect(() => {
    if (!report) {
      reports.load({
        pid,
        startDate: dateInterval[0],
        endDate: dateInterval[1],
      });
    }
  }, [pid, dateInterval]);

  return (
    <Container className={S.root}>
      <h1>
        {data?.name}
        <div className={S.gap} />
        <DatePickerInput
          size="s"
          value={dateInterval}
          onChange={setDateInterval}
          buttonProps={{ round: true }}
          popupProps={{
            blur: true,
            elevation: 1,
            contentProps: { className: S.datePicker },
          }}
        />
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
