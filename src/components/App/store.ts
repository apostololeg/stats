import { createStore } from 'justorm/react';
import { LS } from '@homecode/ui';

import { getThemeConfig } from './theme';

require('store');

const initialThemeType =
  (LS.get('theme') as 'light' | 'dark') ??
  (window.matchMedia('(prefers-color-scheme:light)') ? 'light' : 'dark');

const activeColor = '#0071ff';

export default createStore('app', {
  update: null,
  theme: initialThemeType,
  currThemeConfig: getThemeConfig(initialThemeType, activeColor),
  isSidebarOpen: false,

  isDarkTheme() {
    return this.theme === 'dark';
  },

  toggleTheme() {
    this.setTheme(this.isDarkTheme() ? 'light' : 'dark');
  },

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  },

  setTheme(theme) {
    this.theme = theme;
    this.updateTheme(theme);

    localStorage.setItem('theme', theme);
  },

  // @ts-ignore
  updateTheme(theme = this.theme) {
    this.currThemeConfig = getThemeConfig(theme, activeColor);
  },

  setUpdater(cb) {
    this.update = cb;
  },
});
