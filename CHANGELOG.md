# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/apostololeg/stat/compare/v1.2.1...v2.0.0) (2026-02-11)


### Bug Fixes

* **ci:** avoid find -exec in deploy chmod ([079a81a](https://github.com/apostololeg/stat/commit/079a81a0122f879c7b43047b10da6219f2c05414))
* **ci:** normalize deploy path for backup cleanup ([2201db8](https://github.com/apostololeg/stat/commit/2201db85a91f4eca5cd627ba446f5fa6ceb18d00))
* **deploy:** avoid empty DEPLOY_PATH in www-data yarn install ([3d760cc](https://github.com/apostololeg/stat/commit/3d760ccb54a7c7aaac6e0278832f76270c986a67))
* **deploy:** ensure www-data uses Node 18+ ([42dfe2b](https://github.com/apostololeg/stat/commit/42dfe2b245228e95682e4b06a969e7d287c11af0))
* **deploy:** install devDependencies for babel-node runtime ([edf07ac](https://github.com/apostololeg/stat/commit/edf07acea1c48954154fd006a59b251db93fbab4))
* **deploy:** purge libnode-dev before installing NodeSource nodejs ([3956d09](https://github.com/apostololeg/stat/commit/3956d0932c1d80631a5fda9c57d796ad61e5d8ec))
* **deploy:** set writable yarn/npm caches for www-data ([581bf5d](https://github.com/apostololeg/stat/commit/581bf5d1b4c3b9a30fbf812237036bf28d41404c))
* **report:** include full-day date range in report queries ([4bd3aa7](https://github.com/apostololeg/stat/commit/4bd3aa77f1af6509f4ea6031dc97eec3af1f1410))
* CI - deployment deps and dirs ([ad82368](https://github.com/apostololeg/stat/commit/ad8236833042baa24df88c84d27fa5dd0e863494))
* CI - no /config and /shared ([e639375](https://github.com/apostololeg/stat/commit/e63937530ae60f2ac87d527e030fd000b284b371))
* client/launcher - await for DOMContentLoaded ([def12d3](https://github.com/apostololeg/stat/commit/def12d3814db7f18962ec3837a44c7171d8ac693))
* Deploy - env variables usage ([25acdc4](https://github.com/apostololeg/stat/commit/25acdc4670014e7c6a127f8a53de19be1859382e))
* deploy - exclude /config and /shared ([388206d](https://github.com/apostololeg/stat/commit/388206df746c6dfdebd90dcb66ea7c53b8b10331))
* Deploy script - build:prod ([21b8546](https://github.com/apostololeg/stat/commit/21b85462b4f9e6027973b5a271822f730e56e6d5))
* deploy server files and restart server after deployment ([c6e8ef9](https://github.com/apostololeg/stat/commit/c6e8ef9685681a018c81ea4e180fa8bba0e737a4))
* ensure VPS installs deps before starting service ([9e855a1](https://github.com/apostololeg/stat/commit/9e855a1b935d0c7ad8b0c39399e3176488838fc7))
* resolve systemd service yarn script execution issue ([488d7d2](https://github.com/apostololeg/stat/commit/488d7d247396ce5cb53c82442e2250884bf938bb))
* restore prod server start ([6256cc2](https://github.com/apostololeg/stat/commit/6256cc2eb51334d32036d4c86d9dd2eeafc6f3bc))
* use babel-node directly in systemd service instead of yarn ([265746b](https://github.com/apostololeg/stat/commit/265746b70b139bd304424dd2d9404f371f513d9c))

### [1.2.1](https://github.com/apostololeg/stat/compare/v1.2.0...v1.2.1) (2025-09-21)

## [1.2.0](https://github.com/apostololeg/stat/compare/v1.1.0...v1.2.0) (2025-09-21)


### Features

* EmbedButton - copy; update ui and store pkgs ([7abc950](https://github.com/apostololeg/stat/commit/7abc950681fe485af91096ace3bda84e6bfad3de))
* Project - edit/delete ([31a4119](https://github.com/apostololeg/stat/commit/31a411924265d6fe575146bba220fca587eae6f3))
* Reload report ([42c7dc9](https://github.com/apostololeg/stat/commit/42c7dc9fda7f8477640824d8073b645dd69b35d1))
* Report - collect and include plotData ([d953324](https://github.com/apostololeg/stat/commit/d953324bd060811922eea7268a1889e6048fd894))
* Reports - caching by pid and interval ([589a90e](https://github.com/apostololeg/stat/commit/589a90e7a521d305c4a1bf9921307d1e0c054701))


### Bug Fixes

* disable brotli ([ac83fb9](https://github.com/apostololeg/stat/commit/ac83fb9dff019a078e983cb20bf7a21af3571037))
* Report counts and format ([b12845c](https://github.com/apostololeg/stat/commit/b12845c690c03dfa9b664eb8c0e2c42c8095212b))
* standart-version - postchangelog replace issue links ([89c63c4](https://github.com/apostololeg/stat/commit/89c63c42406a79a573247628c7602f4502f82fcb))

## [1.1.0](https://github.com/apostololeg/stat/compare/v1.0.0...v1.1.0) (2025-05-01)


### Features

* Ensure origin 🔐 ([05b13b8](https://github.com/apostololeg/stat/commit/05b13b8756c2ee3ae2df2c2ba91abae486c6921e))
* Report page - date range selector ([b681020](https://github.com/apostololeg/stat/commit/b68102049da8865d9c92c64a1aa9058d09445ce4))
* Save selected date interval to LS ([b26e147](https://github.com/apostololeg/stat/commit/b26e147bad5cb76faf1cb8e648024cf92e12cac4))

## 1.0.0 (2025-04-24)


### Features

* agent ([4ed685e](https://github.com/apostololeg/stat/commit/4ed685eda53cc125ce263b83ff745843efb91dda))
* Define country by timezone ([26ce019](https://github.com/apostololeg/stat/commit/26ce01907288b401a51d6d3b876d9982ce23253f))
* project page layout udpate ([b9ff560](https://github.com/apostololeg/stat/commit/b9ff560cca232fdd91c346410f77a06248a57885))
* project stats layout update ([be08859](https://github.com/apostololeg/stat/commit/be08859267f3aa14abf4ca28190b8bc77203eed0))
* statsSDK.reprt({ event: 'custom-event' }) ([732efa4](https://github.com/apostololeg/stat/commit/732efa4a091f40d8dd9b61a8fa54dc1bcc37ad2b))


### Bug Fixes

* allowed domains ([06bc334](https://github.com/apostololeg/stat/commit/06bc334459ad98fed0a5c08edcd191a2aabdb434))
* COOKIE_TOKEN_NAME_CLIENT ([25f5f34](https://github.com/apostololeg/stat/commit/25f5f348b9eb8cc02afd59c2aeb435ef6323c834))
* cors for prodcution ([3e473dc](https://github.com/apostololeg/stat/commit/3e473dc32e970ead4d545fe506b084d023deea23))
* get actual url ([4fc0bf4](https://github.com/apostololeg/stat/commit/4fc0bf40c2ab0d67e07fa04fe900578acec115b7))
* pick only pathname, without query string ([a8e92c1](https://github.com/apostololeg/stat/commit/a8e92c16864299863252beb116410be97e3e150f))
* Properly handle 'popstate' event ([f568ff3](https://github.com/apostololeg/stat/commit/f568ff366c1f21728734f0f30b5db0367a91d704))
* root '/' path ([8ef3089](https://github.com/apostololeg/stat/commit/8ef308950dc2e2b2b0b92a88db3bf8c3e6845de6))
* subscribe to pushstate,replacestate,popstate ([46166d8](https://github.com/apostololeg/stat/commit/46166d83b68ce02875b4f3b414de2310cf75f970))

### 0.0.1 (2020-10-11)
