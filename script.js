document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll('.box.preview');
  const mainPage = document.getElementById('mainPage');
  const dynamicContentContainer = document.getElementById('dynamic-content-container');
  const contentDiv = document.getElementById('content');
  const backBtn = document.getElementById('back-btn');
  const centeredHeading = document.querySelector('.centered-heading');
  const mainHeading = document.getElementById('heading');
  const paymentModal = document.getElementById('paymentModal');
  const text = "Hey Harshit";
  console.log("🧠 Running initializeAudioPlayer()...");
  console.log(contentDiv.innerHTML); // Check what was actually loaded


  let i = 0;

  // Typewriter effect for "Hey Safiya"
  centeredHeading.textContent = "";
  const typingInterval = setInterval(() => {
    if (i < text.length) {
      centeredHeading.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);
      setTimeout(() => {
        document.body.classList.add('loaded');
        mainHeading.classList.add('interactive');
      }, 1500);
    }
  }, 150);

  // Load theme page on click
  boxes.forEach(box => {
    box.addEventListener('click', () => {
      const pageUrl = box.getAttribute('data-page');
      fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
          contentDiv.innerHTML = html;
          mainPage.classList.add('hidden');
          dynamicContentContainer.classList.remove('hidden');
          initializeAudioPlayer(); // After content loads
        })
        .catch(error => {
          console.error("Fetch error:", error);
          contentDiv.innerHTML = "<p style='color:red;'>Error loading page.</p>";
        });
    });
  });

  // Back button logic
  backBtn.addEventListener('click', () => {
    contentDiv.innerHTML = '';
    mainPage.classList.remove('hidden');
    dynamicContentContainer.classList.add('hidden');
  });

  // Audio player initializer
  function initializeAudioPlayer() {
    const audio = contentDiv.querySelector("#main-audio");
    const playPauseBtn = contentDiv.querySelector("#play-pause-btn");
    const nextBtn = contentDiv.querySelector("#next-btn");
    const prevBtn = contentDiv.querySelector("#prev-btn");
    const progressArea = contentDiv.querySelector(".progress-area");
    const progressBar = contentDiv.querySelector(".progress-bar");
    const progress = contentDiv.querySelector(".progress");
    const progressIndicator = contentDiv.querySelector(".progress-indicator");
    const currentTimeDisplay = contentDiv.querySelector(".current-time");
    const durationDisplay = contentDiv.querySelector(".duration");
    const items = contentDiv.querySelectorAll(".item");
    const images = contentDiv.querySelectorAll(".item img");

    let currentSongIndex = -1;

    if (!audio || !playPauseBtn || !nextBtn || !prevBtn || !progressArea) return;

    const loadSong = (index) => {
      if (index < 0 || index >= items.length) return;
      const songPath = items[index].getAttribute("data-song");
      audio.src = songPath;
      audio.load();
      items.forEach(item => item.classList.remove("playing"));
      images.forEach(img => img.classList.remove("playing-image"));
      items[index].classList.add("playing");
      images[index].classList.add("playing-image");
      currentSongIndex = index;
      prevBtn.disabled = currentSongIndex === 0;
      nextBtn.disabled = currentSongIndex === items.length - 1;
      updatePlayPauseButton();
    };

    const updatePlayPauseButton = () => {
      const icon = playPauseBtn.querySelector('img');
      icon.src = (!audio.paused && audio.readyState > 2)
        ? "additional/buttons/pause.png"
        : "additional/buttons/play.png";
    };

    const playPause = () => {
      if (audio.paused || audio.readyState === 0) {
        if (currentSongIndex === -1 && items.length > 0) loadSong(0);
        audio.play();
      } else {
        audio.pause();
      }
      updatePlayPauseButton();
    };

    const playNext = () => {
      if (currentSongIndex < items.length - 1) {
        loadSong(currentSongIndex + 1);
        audio.play().then(updatePlayPauseButton).catch(console.error);
      }
    };

    const playPrev = () => {
      if (currentSongIndex > 0) {
        loadSong(currentSongIndex - 1);
        audio.play();
        updatePlayPauseButton();
      }
    };

    images.forEach((img, idx) => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        loadSong(idx);
        audio.play().then(updatePlayPauseButton).catch(console.error);
      });
    });

    playPauseBtn.addEventListener('click', playPause);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);

    progressArea.addEventListener('click', (e) => {
      const width = progressArea.offsetWidth;
      const offsetX = e.offsetX;
      if (audio.duration) {
        audio.currentTime = (offsetX / width) * audio.duration;
      }
    });

    audio.addEventListener("timeupdate", (e) => {
      const current = e.target.currentTime;
      const total = e.target.duration || 0;
      const percent = (current / total) * 100;
      progress.style.width = `${percent}%`;
      progressIndicator.style.left = `${percent}%`;
      currentTimeDisplay.textContent = formatTime(current);
      durationDisplay.textContent = formatTime(total);
    });

    audio.addEventListener("ended", () => {
      playNext();
      setTimeout(updatePlayPauseButton, 100);
    });

    updatePlayPauseButton();
  }

  function formatTime(seconds) {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // Payment modal animation
  const heartContainer = document.getElementById('heartContainer');
  if (heartContainer && paymentModal) {
    heartContainer.addEventListener('click', () => {
      paymentModal.style.display = 'flex';
      setTimeout(() => paymentModal.style.opacity = '1', 50);
    });

    paymentModal.addEventListener('click', () => {
      paymentModal.style.opacity = '0';
      setTimeout(() => {
        paymentModal.style.display = 'none';
      }, 500);
    });
  }
});
