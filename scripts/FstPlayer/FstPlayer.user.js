// ==UserScript==
// @name FstPlayer
// @match *://*/*
// @author KaninchenSpeed (https://github.com/KaninchenSpeed)
// @license CC-BY-SA
// @version 1.0
// ==/UserScript==

// Settings

const disable_when_focus_on_video = true;

// Settings end

window.addEventListener('keydown', e => {
	if (e.key === ' ') {
    if (disable_when_focus_on_video && document.activeElement.tagName === 'VIDEO') {
      return;
    }
    
    const video = document.querySelector('video');
    if (!video) {
      return;
    }
    
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    e.preventDefault();
  }
});