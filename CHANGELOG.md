# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [1.1.0](https://github.com/vandat696/cuuho247/compare/cuuho247-v1.0.0...cuuho247-v1.1.0) (2026-05-10)


### Features

* **auth:** implement multi-role authentication with JWT ([0a78c38](https://github.com/vandat696/cuuho247/commit/0a78c38626d6161073a806b9412eda999004f4ec))
* **env:** add example environment configuration file ([fa242f5](https://github.com/vandat696/cuuho247/commit/fa242f5ba332a19f24401b5bd5e8e1ab824469cb))
* **validation:** add validation for spaces and vietnamese characters in password schema ([da62013](https://github.com/vandat696/cuuho247/commit/da620135331db49e3679c9bf7db1218921ce1c54))

## 1.0.0 (2026-05-05)


### Features

* **frontend:** initialize components and layout for frontend ([b7f2443](https://github.com/vandat696/cuuho247/commit/b7f24439cbc9d07136b6dcb1b225c673cc92c137))
* **frontend:** initialize components and layout for frontend ([f75a40f](https://github.com/vandat696/cuuho247/commit/f75a40fc8dcf342661a4d78ea3aa7fa30491728c))
* **models:** initialize mongooses models for all collections ([7c2e988](https://github.com/vandat696/cuuho247/commit/7c2e988657d62115cd54ad4387a3a568d165b0aa))
* **models:** initialize mongooses models for all collections ([538387d](https://github.com/vandat696/cuuho247/commit/538387d963383318735a47fc1eee1b29a4f7fa98))


### Bug Fixes

* apply review feedback on Input, Card, Button components and backend DB connection ([fb7ff97](https://github.com/vandat696/cuuho247/commit/fb7ff9793e82cf1df06efff525eeeb4a7ef0f6e5))
* fix card typography ([ba85ca4](https://github.com/vandat696/cuuho247/commit/ba85ca4a601a84918705a87e6b238e6e8fec915f))
* migrate components to mui ([89bfae0](https://github.com/vandat696/cuuho247/commit/89bfae015fede84b3b9b856d63c4cbde78638ffb))
* migrate components to mui ([d018371](https://github.com/vandat696/cuuho247/commit/d018371d79c64e59080911b70e11d22a93e21a3e))
* resolve PR review comments ([2b242ed](https://github.com/vandat696/cuuho247/commit/2b242edee0519dacc909dea21db359bcc83d4333))

## [Unreleased]

- Pre-release stage. Version bumps are managed by release-please when a release PR is created and merged.

## [0.1.0] - 2026-05-05

### Added

- Initial repository setup, environment bootstrapping, and base project structure.
- Backend data layer foundation with Mongoose models for core collections.
- Frontend component and layout initialization for the first UI showcase.
- Monorepo root scripts to run/build backend and frontend together.

### Changed

- Refactored model shared schemas to improve reuse and consistency.
- Improved backend database configuration and common UI components after review feedback.
- Migrated frontend component styling toward MUI-based implementation.
