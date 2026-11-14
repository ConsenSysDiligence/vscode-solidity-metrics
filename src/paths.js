"use strict";
/**
 * @author github.com/tintinweb
 * @license MIT
 *
 * Builds the globs handed to vscode.workspace.findFiles(). Kept free of the
 * vscode API so it can be tested with Windows paths on any host.
 *
 * findFiles() matches workspace-relative globs with `/` separators. On Windows
 * `uri.fsPath` uses `\`, so paths go through metrics.toRelativeGlob() instead of
 * a string replace of basePath (issue #19).
 * */

/** `suffix` under the workspace-relative folder `rel`; '' is the workspace itself. */
function underFolder(rel, suffix) {
  return rel === "" ? suffix : rel + "/" + suffix;
}

/** Selected .sol files as-is, folders as `<folder>/<suffix>`. */
function selectionGlob(metrics, selectedFsPaths, suffix) {
  return (
    "{" +
    selectedFsPaths
      .map((fsPath) => {
        const rel = metrics.toRelativeGlob(fsPath);
        return fsPath.endsWith(".sol") ? rel : underFolder(rel, suffix);
      })
      .join(",") +
    "}"
  );
}

/** Glob (relative to the workspace) for the files and folders selected in the explorer. */
function contextMenuGlob(metrics, wsPath, selectedFsPaths) {
  return selectionGlob(metrics, selectedFsPaths, "**/*.sol");
}

/** Glob for truffle configs under the selected folders. */
function truffleGlob(metrics, selectedFsPaths) {
  return selectionGlob(metrics, selectedFsPaths, "**/truffle*.js");
}

/** Globs for .sol files the exclusion patterns remove from the selected folders. */
function excludedFilesGlob(metrics, selectedFsPaths, exclusions) {
  const patterns = exclusions.replace("{", "").replace("}", "").split(",");
  const globs = [];
  for (const fsPath of selectedFsPaths) {
    if (fsPath.endsWith(".sol")) {
      continue; //ignore explicitly selected files
    }
    const rel = metrics.toRelativeGlob(fsPath);
    for (const g of patterns) {
      globs.push(underFolder(rel, g + "/**/*.sol"));
    }
  }
  return globs;
}

/** Path of the active file relative to the workspace. */
function activeFileGlob(metrics, fileName) {
  return metrics.toRelativeGlob(fileName);
}

/** Glob patterns listed in a scope file, one per line, relative to the workspace. */
function scopeFilePatterns(content) {
  return content
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.replace(/\\/g, "/").replace(/^\.\//, "")); //replace "./" path prefix if present
}

module.exports = {
  contextMenuGlob,
  truffleGlob,
  excludedFilesGlob,
  activeFileGlob,
  scopeFilePatterns,
};
