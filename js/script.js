const launchDate = new Date();
launchDate.setMonth(launchDate.getMonth() + 3);

function updateCountdown() {
  const now = new Date();
  const diff = launchDate - now;

  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days-number").textContent = days;
  document.getElementById("hours-number").textContent = hours;
  document.getElementById("minutes-number").textContent = minutes;
  document.getElementById("seconds-number").textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* YEAR */
document.getElementById("year").textContent = new Date().getFullYear();