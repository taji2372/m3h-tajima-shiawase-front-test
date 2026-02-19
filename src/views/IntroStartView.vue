<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const startSurvey = () => {
  router.push('/profile')
}

const goBack = () => {
  router.push('/instruction')
}
</script>

<template>
  <div class="common-view-container paper-sheet">
    <div class="common-content-wrapper">
      <h1 class="common-main-title">はじめに</h1>

      <div class="common-info-card">
        <h2 class="common-card-title">しあわせ寿命のはかり方</h2>
        <div class="common-title-underline"></div>

        <div class="intro-text">
          <p>
            しあわせ寿命をはかることで、「じぶん自身が、どれだけ深く、じぶんらしく生きたか」を振り返ります。<br />
            じぶんのこれまでの人生の道のりを振り返り、過去と現在のじぶんを見つめ、<br />
            実際にあなただけの「しあわせ寿命」をはかってみましょう！
          </p>
        </div>

        <div class="cta-container">
          <button class="cta-btn" @click="startSurvey">
            <span class="cta-main-text">しあわせ寿命をはかる</span>
            <span class="cta-sub-text">所要時間：約10分</span>
          </button>
        </div>
      </div>

      <div class="common-action-buttons footer-action-override">
        <v-btn
          @click="goBack"
          class="common-action-btn back-btn"
          color="white"
          variant="flat"
          height="48"
        >
          戻る
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Only view-specific styles here */

.intro-text {
  width: 100%;
  max-width: 700px;
  text-align: center;
  margin-bottom: 3rem;
}

.intro-text p {
  font-size: 1rem;
  line-height: 2;
  letter-spacing: 0.05em;
}

.cta-container {
  margin-bottom: 1rem;
}

.cta-btn {
  background-color: #4e3b30;
  color: white;
  width: 320px;
  height: 100px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cta-btn:hover {
  transform: translateY(-2px);
  background-color: #5d463a;
}

.cta-main-text {
  font-size: 1.25rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.cta-sub-text {
  font-size: 0.8rem;
  opacity: 0.8;
  letter-spacing: 0.05em;
}

/* Override footer justify-content for single button */
.footer-action-override {
  justify-content: flex-start;
}

.back-btn {
  color: #4a3b2a !important;
  border: 1px solid #d4c4b0;
}

/* Responsive adjustments specific to this page if any beyond common */
@media (max-width: 768px) {
  /* Ensure container centers content on mobile */
  .common-view-container {
    align-items: center;
    justify-content: center;
  }

  .intro-text {
    margin-bottom: 2rem;
  }

  .intro-text p {
    font-size: 0.8rem; /* Smaller body text */
    line-height: 1.8;
  }

  .cta-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .cta-btn {
    width: 100%;
    max-width: 240px; /* Slightly narrower */
    height: auto;
    padding: 1rem 0.8rem; /* Less padding */
  }

  .cta-main-text {
    font-size: 0.9rem; /* Smaller button text */
    margin-bottom: 0.3rem;
  }

  .cta-sub-text {
    font-size: 0.7rem; /* Smaller sub text */
  }

  /* Reset footer alignment for mobile if needed */
  .footer-action-override {
    justify-content: flex-start;
  }

  /* Force common card padding for this view too if needed */
  .common-info-card {
    padding: 2rem 1rem;
  }
}
</style>
