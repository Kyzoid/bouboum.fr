document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('nav-toggle').onclick = () => {
    document.getElementById("nav-content").classList.toggle("hidden");
  }
});