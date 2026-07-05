/**
 * Set the theme before first paint to avoid a flash of the wrong mode.
 * Loaded synchronously in <head>. Order of precedence: saved cookie,
 * then the visitor's OS-level color-scheme preference.
 */
(function () {
  var m = document.cookie.match(/(?:^|; )theme=(dark|light)/);
  var saved = m && m[1];
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));
})();
