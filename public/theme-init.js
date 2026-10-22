// Resolve the theme before first paint: saved choice, else the OS preference.
(function () {
  var t = null;
  try { t = localStorage.getItem("hms-theme"); } catch { /* storage blocked */ }
  if (t !== "light" && t !== "dark") {
    t = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  var d = document.documentElement;
  d.setAttribute("data-theme", t);
  d.style.colorScheme = t;
})();
