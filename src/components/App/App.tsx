import { Checkbox, Notifications, Scroll, Theme, VH, dom } from '@homecode/ui';
import cn from 'classnames';

import Header from 'components/Header/Header';
import ProjectsList from 'components/ProjectsList/ProjectsList';
import Routes from 'components/Routes/Routes';
import { useStore } from 'justorm/react';

import S from './App.styl';

require('./store');
// @ts-ignore
// require('tools/i18n');

dom.watchControllerFlag();

export default function App() {
  const { app } = useStore({
    app: ['theme', 'isSidebarOpen'],
    projects: [],
  });

  return (
    <>
      <VH />
      <Theme config={app.currThemeConfig} />
      <div className={S.root}>
        <div className={cn(S.sidebar, app.isSidebarOpen && S.isOpen)}>
          <Header />

          <Scroll
            y
            offset={{ y: { before: 20, after: 20 } }}
            className={S.list}
            autoHide
            fadeSize="l"
          >
            <ProjectsList
              itemProps={{
                className: S.listItem,
                size: 'l',
                onClick: app.toggleSidebar,
              }}
            />
          </Scroll>

          <div className={S.darkThemeCheckbox}>
            {app.theme === 'dark' ? '🌚' : '🌝'}
            <Checkbox
              size="l"
              onChange={app.toggleTheme}
              checked={app.isDarkTheme()}
            />
          </div>

          <div className={S.version}>{VERSION}</div>
        </div>

        <div className={S.content}>
          <Routes />
        </div>
      </div>
      <Notifications />
    </>
  );
}
