<script setup>
import { useRouter } from 'vue-router'
import { useLifeCycleStore } from '../stores/lifeCycle'

const router = useRouter()
const store = useLifeCycleStore()

const handleClose = () => {
  // Clear all storage and store state before returning to Top
  localStorage.clear()
  sessionStorage.clear()
  store.$reset() // Assuming Pinia store has $reset or re-init logic if needed

  router.push('/')
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="finish-view paper-sheet">
    <div class="content-wrapper">
      <div class="message-container">
        <h1 class="main-message">
          「じぶんのしあわせ」は、<br />
          じぶんだけのもの。
        </h1>
        <p class="sub-message">
          これから先、しあわせのかたちが変わることもあるかもしれません。<br />
          これからの人生をできるだけしあわせに、じぶんで道を選んで、じぶんの足で歩い<br />
          ていくために「じぶんのしあわせ」を信じて、大切にしてあげてください。
        </p>

        <button class="close-book-btn" @click="handleClose">本を閉じる</button>
      </div>

      <div class="footer-area">
        <button class="back-btn" @click="handleBack">戻る</button>
      </div>
      <div class="mobile-spacer"></div>
    </div>
  </div>
</template>

<style scoped>
.finish-view {
  width: 100%;
  height: 100%; /* Fill the page-wrapper/book-container exactly */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fdfbf7;
  position: relative;
  overflow: hidden;
}

/* Book Binding Shadow Effect */
.finish-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 60px; /* Bit wider for realism */
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.05) 40%, transparent);
  pointer-events: none;
  z-index: 10;
}

/* Page shadow on right? Usually book has shadow near binding */

.content-wrapper {
  width: 100%;
  max-width: 900px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 2rem;
  z-index: 1;
}

.message-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 3rem;
  margin-top: 4rem; /* Push down slightly */
}

.main-message {
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  font-size: 2.2rem; /* Slightly larger */
  font-weight: bold;
  color: #4e3b30;
  line-height: 1.5;
  letter-spacing: 0.1em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle depth */
}

.sub-message {
  font-size: 1rem;
  color: #3e2723; /* Dark brown */
  line-height: 2.2;
  letter-spacing: 0.08em;
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  font-weight: 500;
}

.close-book-btn {
  background-color: #4e3b30;
  color: white;
  border: none;
  padding: 1.2rem 5rem; /* Wider padding */
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 3rem;
  letter-spacing: 0.1em;
  box-shadow: 0 4px 10px rgba(78, 59, 48, 0.3);
}

.close-book-btn:hover {
  background-color: #5d463a;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(78, 59, 48, 0.4);
}

.close-book-btn:active {
  transform: translateY(0);
}

.footer-area {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-bottom: 5rem;
  padding-left: 2rem;
  margin-top: auto; /* Push to bottom if flex container has height */
}

.back-btn {
  background-color: white;
  border: 1px solid #8d6e63;
  color: #8d6e63;
  padding: 0.8rem 3rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: bold;
}

.back-btn:hover {
  background-color: #faf8f4;
}

@media (max-width: 768px) {
  .finish-view {
    overflow-y: auto;
    align-items: flex-start;
  }

  .content-wrapper {
    height: auto;
    min-height: 100%;
    padding: 1.5rem 1rem 8rem;
    justify-content: flex-start; /* Prevent top cutoff */
  }

  .message-container {
    justify-content: flex-start; /* Prevent vertical centering clipping */
    margin-top: 2rem;
    gap: 2rem;
  }

  .main-message {
    font-size: 1.6rem;
  }
  .sub-message {
    font-size: 0.9rem;
    padding: 0 1rem;
    line-height: 1.8;
  }
  .close-book-btn {
    padding: 1rem 3rem;
    width: 80%;
  }
  .footer-area {
    padding-left: 0;
    justify-content: center;
    padding-bottom: 8rem;
    margin-top: 3rem; /* Add space between buttons */
  }
  .finish-view::before {
    position: fixed; /* Fix shadow to screen so it doesn't cut off on scroll */
    height: 100vh;
    width: 20px; /* Smaller shadow on mobile */
  }
}

@media (max-width: 480px) {
  .main-message {
    font-size: 1.4rem;
  }

  .sub-message {
    font-size: 0.85rem;
  }
}

.mobile-spacer {
  display: none;
}
@media (max-width: 768px) {
  .mobile-spacer {
    display: block;
    width: 100%;
    height: 80px; /* Force vertical space */
    flex-shrink: 0;
  }
}
</style>
