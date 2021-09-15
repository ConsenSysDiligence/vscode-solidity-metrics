# Change Log

## v0.0.19
- update: solidity-metrics / solidity parser

## v0.0.18
- fix: exported metrics report does not render in browser - #10

## v0.0.17
- update: solidity-metrics ([Changelog](https://github.com/ConsenSys/solidity-metrics/releases/tag/v0.0.16))
  - new metric: External Dependencies
  
![image](https://user-images.githubusercontent.com/2865694/103999393-1e008d00-519d-11eb-9ccd-77e1387781b1.png)

## v0.0.16
- fix: report not rendering first time metrics is used (blank page)
- update: solidity-metrics ([Changelog](https://github.com/ConsenSys/solidity-metrics/releases/tag/v0.0.15))

## v0.0.15
- update: solidity-metrics ([Changelog](https://github.com/ConsenSys/solidity-metrics/releases/tag/v0.0.14)) - fixes #9

**IMPORTANT** metrics changed: `nSLOC -> nLines` and `nSLOC` now only counts code lines.

## v0.0.14
- update: solidity-metrics (show abstract contracts)

## v0.0.13
- new: now integrates [solidity-doppelganger](https://github.com/tintinweb/solidity-doppelganger) detection
- update: dependencies (solidity-metrics, parser, surya)

## v0.0.12
- fixed: report not rendering - #6
- update: showdown to 1.9.1 (due to security issue in 1.9.0)

## v0.0.11
- show progress
- show warnings if no report could be produced because no valid files were found
- safeguard surya calls from breaking the report
- update dependencies

## v0.0.10
- update: `solidity-code-metrics` to 0.0.7 (updating surya to 0.4.1.dev2)

## v0.0.9
- fix: package.json cleanup
- update: `solidity-code-metrics` with solidity v0.6.0 support

## v0.0.8
- Adopt VS Code's 'asWebviewUri' API - #1

## v0.0.7
- new: allow to export the metrics report
- fixed: surya report now shows relative paths
- new: webpack websrc/main.js

## v0.0.6
- fixed "undefined.trim()" when parsing repo fetchHEAD

## v0.0.5  
- added complexity rating

## v0.0.4
- fixed capabilities: create/create2
- added capabilities: delegatecall
- fixed log charts start at 0

## v0.0.3
- new metrics
- new charts
- detects capabilities
- hide avg in charts

## v0.0.1 - v0.0.2
- Initial release
