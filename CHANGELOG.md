# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.7.0] - 2019-05-21

### Added

- Dispatch `addToCart` and `removeFromCart` events.

## [0.6.1] - 2019-05-17

### Fixed

- Pass right `page` param on `pageView` event.
- Remove duplicate `pageView` hit, removing handling of `pageInfo` event.

## [0.6.0] - 2019-05-17

### Added

- Dispatch `productImpression` events.

## [0.5.0] - 2019-05-15

### Added

- Dispatch `productClick` events.

## [0.3.1] - 2019-05-14

### Changed

- Add skuName in variant property.

## [0.3.0] - 2019-05-14

### Fixed

- Add `send` event to each enhanced commerce event.

## [0.2.0] - 2019-05-08

### Added

- Dispatch `purchase` for ecommerce enhanced.
- Dispatch `orderPlaced` event.

## [0.1.0] - 2019-05-06

### Added

- Added listener for `productDetails` event.

## [0.0.2] - 2019-05-01

### Added

- Added listener for pageview events.
