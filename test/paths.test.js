"use strict";
/**
 * Globs the extension hands to vscode.workspace.findFiles(), for the paths VS Code
 * reports on Windows and posix. Run with `npm test` (node:test, no vscode needed).
 *
 * On Windows `uri.fsPath` uses `\`, and the extension's basePath is `fsPath + "/"`,
 * so it mixes separators (issue #19: "No valid solidity source files found").
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const { SolidityMetricsContainer } = require("solidity-code-metrics");
const {
  contextMenuGlob,
  activeFileGlob,
  scopeFilePatterns,
} = require("../src/paths");

const PLATFORMS = [
  {
    platform: "win32",
    ws: "c:\\Users\\dev\\audit",
    file: "c:\\Users\\dev\\audit\\contracts\\Token.sol",
    folder: "c:\\Users\\dev\\audit\\contracts",
  },
  {
    platform: "darwin",
    ws: "/Users/dev/My Audit (v2)",
    file: "/Users/dev/My Audit (v2)/contracts/Token.sol",
    folder: "/Users/dev/My Audit (v2)/contracts",
  },
];

function container(wsPath) {
  return new SolidityMetricsContainer("test", {
    basePath: wsPath + "/", // what the extension passes
    disableDoppelGanger: true,
    repoInfo: {},
  });
}

// findFiles matches workspace-relative paths with `/` separators
const REL = "contracts/Token.sol";

for (const { platform, ws, file, folder } of PLATFORMS) {
  test(`${platform}: right-click a .sol file`, () => {
    const glob = contextMenuGlob(container(ws), ws, [file]);
    assert.equal(glob, "{contracts/Token.sol}");
  });

  test(`${platform}: right-click a folder`, () => {
    const glob = contextMenuGlob(container(ws), ws, [folder]);
    assert.equal(glob, "{contracts/**/*.sol}");
  });

  test(`${platform}: right-click the workspace root`, () => {
    assert.equal(contextMenuGlob(container(ws), ws, [ws]), "{**/*.sol}");
  });

  test(`${platform}: multi-select a file and a folder`, () => {
    const glob = contextMenuGlob(container(ws), ws, [file, folder]);
    assert.equal(glob, "{contracts/Token.sol,contracts/**/*.sol}");
  });

  test(`${platform}: active file`, () => {
    assert.equal(activeFileGlob(container(ws), file), REL);
  });
}

test("scope file: lines are workspace-relative, ./ stripped, CRLF and blank lines ignored", () => {
  assert.deepEqual(
    scopeFilePatterns("src/Token.sol\r\n./script/*.sol\r\n\r\n"),
    ["src/Token.sol", "script/*.sol"],
  );
});

test("scope file: Windows separators become /", () => {
  assert.deepEqual(scopeFilePatterns("src\\Token.sol\n.\\script\\*.sol\n"), [
    "src/Token.sol",
    "script/*.sol",
  ]);
});

test("scope file: surrounding whitespace is trimmed", () => {
  assert.deepEqual(scopeFilePatterns("  src/Token.sol  \n"), ["src/Token.sol"]);
});

const { truffleGlob, excludedFilesGlob } = require("../src/paths");
const EXCLUSIONS = "{**/node_modules,**/mock*}";

for (const { platform, ws, file, folder } of PLATFORMS) {
  test(`${platform}: truffle discovery glob for a file, a folder and the root`, () => {
    assert.equal(
      truffleGlob(container(ws), [file, folder, ws]),
      "{contracts/Token.sol,contracts/**/truffle*.js,**/truffle*.js}",
    );
  });

  test(`${platform}: excluded-files glob skips selected .sol files`, () => {
    assert.deepEqual(excludedFilesGlob(container(ws), [file, folder, ws], EXCLUSIONS), [
      "contracts/**/node_modules/**/*.sol",
      "contracts/**/mock*/**/*.sol",
      "**/node_modules/**/*.sol",
      "**/mock*/**/*.sol",
    ]);
  });
}
