import { Component } from 'react';
import { withStore } from 'justorm/react';
import { Checkbox, Icon, Notifications, Theme, VH, dom } from '@homecode/ui';

import Routes from 'components/Routes/Routes';
import ProjectsList from 'components/ProjectsList/ProjectsList';

import S from './App.styl';
import Header from 'components/Header/Header';
import ButtonLink from 'components/UI/ButtonLink/ButtonLink';
import AddProject from 'components/AddProject/AddProject';

require('./store');
// require('tools/i18n');

dom.watchControllerFlag();

@withStore({
  app: ['theme'],
  user: ['isLogged'],
  projects: [],
})
class App extends Component<{ store: any }> {
  state = { isInited: false };
  prevPanelVisible = false;

  componentDidMount() {
    this.props.store.projects.load();
  }

  getRoutePath = () => this.props.store.router?.path || '/';

  render() {
    const { store } = this.props;
    const { app, user } = store;

    return (
      <>
        <VH />
        <Theme config={app.currThemeConfig} />
        <div className={S.root}>
          <div className={S.sidebar}>
            <Header />
            <div className={S.list}>
              <ProjectsList itemProps={{ className: S.listItem, size: 'l' }} />
              {user.isLogged && <AddProject />}
            </div>
            <div className={S.darkThemeCheckbox}>
              {app.theme === 'dark' ? '🌚' : '🌝'}
              <Checkbox
                size="l"
                onChange={app.toggleTheme}
                checked={app.isDarkTheme()}
              />
            </div>
          </div>

          <div className={S.content}>
            <Routes />
          </div>
        </div>
        <Notifications />
      </>
    );
  }
}

export default App;
