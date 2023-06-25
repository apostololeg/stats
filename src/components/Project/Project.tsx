import { withStore } from 'justorm/react';
import { useEffect, useState } from 'react';
import { buildInterval } from 'store/reports';

import S from './Project.styl';
import { Container } from 'components/UI/Container/Container';

const today = new Date().setHours(0, 0, 0, 0);
const todayEnd = new Date().setHours(23, 59, 59, 999);

export default withStore({
  projects: ['items'],
  reports: ['items'],
})(function Project({ pathParams: { pid }, store: { projects, reports } }) {
  const [[startDate, endDate], setDates] = useState([
    today - 1000 * 60 * 60 * 24 * 7, // 7 days
    todayEnd,
  ]);

  const data = projects.items.find(project => project.id === pid);
  const projectReport = reports.items[pid];
  const startDateISO = new Date(startDate).toISOString();
  const endDateISO = new Date(endDate).toISOString();
  const interval = buildInterval(startDateISO, endDateISO);
  const report = projectReport?.[interval];

  console.log('interval', interval);

  useEffect(() => {
    if (!report) {
      reports.load({
        pid,
        startDate: startDateISO,
        endDate: endDateISO,
      });
    }
  }, [data, report]);

  if (!data) return null;

  return (
    <Container className={S.root}>
      <h1>{data.name}</h1>
      {report && (
        <>
          <h2>Countries</h2>
          <p>
            {Object.entries(report.countries).map(
              ([country, count]) => `${country}: ${count}\n`
            )}
          </p>

          <h2>Users</h2>
          <p>{report.users}</p>

          <h2>Pages</h2>
          <p>
            {Object.entries(report.pages).map(
              ([page, count]) => `${page}: ${count};\n`
            )}
          </p>
        </>
      )}
    </Container>
  );
});
