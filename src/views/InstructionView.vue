<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToNext = () => {
  router.push('/intro-start')
}

const goBack = () => {
  router.push('/description')
}
</script>

<template>
  <div class="common-view-container paper-sheet">
    <div class="common-content-wrapper">
      <h1 class="common-main-title">はじめに</h1>

      <div class="common-info-card">
        <h2 class="common-card-title">しあわせ寿命のはかり方</h2>
        <div class="common-title-underline"></div>

        <div class="intro-text-section">
          <p>
            この本では、実際にしあわせ寿命をはかっていきます。<br />
            しあわせ寿命には、正解はありません。じぶんの人生を振り返って、感じた気持ちを「正直に」回答してください。
          </p>
          <p class="mt-4">
            6 項目に関することについてお尋ねします。<br />直感的に、あなたの当時の状態に最も近い場所を選んでください。
          </p>
        </div>

        <div class="steps-container">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              当時、あなたが人生についてどう思っていたかを記入してください。
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              「1」の入力内容から、あなたの思いが自動的に入力されます。<br />
              もし思っていたものと違っていたら、当時のあなたがどのように思っていたか、より近いほうに修正してください。
            </div>
          </div>
        </div>

        <!-- Mockup Diagram Code -->
        <div class="mockup-diagram">
          <!-- Header -->
          <div class="diagram-header-row">
            <span class="diag-title-main">ENVIRONMENT</span>
            <div class="help-icon-large">?</div>

            <!-- Tooltip for Help -->
            <div class="tooltip-bubble help-tooltip">
              <div class="tooltip-content">
                「?」マークをクリックすると、<br />
                設問の説明を見ることができます。
              </div>
              <div class="tooltip-arrow-left"></div>
            </div>
          </div>

          <div class="diag-subtitle">あなたのまわりの世界</div>

          <div class="diag-question">
            あなたが暮らしている場所やそのとき出会った「まわりの世界」はどうだった？
          </div>

          <!-- Interaction Area -->
          <div class="interaction-area">
            <!-- Keyword Boxes Row -->
            <div class="keywords-row">
              <div class="keyword-box left-box">
                退屈<br />きびしい<br />せまい
                <div class="box-tail"></div>
              </div>
              <div class="keyword-box right-box">
                安心<br />ひろい<br />たのしい
                <div class="box-tail"></div>
              </div>
            </div>

            <!-- Slider Control Row -->
            <div class="slider-control-row">
              <div class="arrow-btn left-arrow">
                <v-icon icon="mdi-chevron-left" color="white"></v-icon>
              </div>

              <div class="slider-track-container">
                <div class="track-line"></div>
                <div class="track-line-active"></div>
                <div class="track-handle">
                  0
                  <!-- Tooltip for Handle -->
                  <div class="tooltip-bubble handle-tooltip">
                    <div class="tooltip-content">
                      当時のあなたがどう思っていたか、<br />
                      より近いほうに動かしてください。
                    </div>
                    <div class="tooltip-arrow-top"></div>
                  </div>
                </div>
              </div>

              <div class="arrow-btn right-arrow">
                <v-icon icon="mdi-chevron-right" color="white"></v-icon>
              </div>
            </div>

            <!-- Ticks Row -->
            <div class="ticks-row">
              <span>10</span>
              <span>0</span>
              <span>10</span>
            </div>
          </div>
        </div>
      </div>

      <div class="common-action-buttons">
        <v-btn
          @click="goBack"
          class="common-action-btn back-btn"
          color="white"
          variant="flat"
          height="48"
        >
          戻る
        </v-btn>

        <v-btn
          @click="goToNext"
          class="common-action-btn next-btn"
          color="#4a3b2a"
          theme="dark"
          variant="flat"
          height="48"
        >
          次へ
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Page Specific Styles Only */

.intro-text-section {
  width: 100%;
  max-width: 800px;
  margin-bottom: 2.5rem;
  text-align: center;
}

.intro-text-section p {
  font-size: 1rem;
  line-height: 2 !important;
  letter-spacing: 0.05em;
  color: #4a3b2a;
}

/* Steps */
.steps-container {
  width: 100%;
  max-width: 650px; /* Narrower for readability */
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
  /* Centered block */
  margin-left: auto;
  margin-right: auto;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
}

.step-number {
  background-color: #6d5e50;
  color: white;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-family: sans-serif;
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 2px;
  font-size: 1.1rem;
}

.step-text {
  font-weight: 500;
  line-height: 1.8;
  font-size: 1rem;
  color: #4a3b2a;
  text-align: left;
}

/* Mockup Diagram Styling */
.mockup-diagram {
  width: 100%;
  max-width: 800px; /* Wider card */
  border: 1px solid #d7ccc8;
  background-color: #fff;
  padding: 3rem 2rem;
  position: relative;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.diagram-header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  position: relative;
}

.diag-title-main {
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  font-size: 1.8rem;
  letter-spacing: 0.15em;
  color: #4e3b30;
  font-weight: bold;
}

.help-icon-large {
  background-color: #5d4037;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: help;
  font-family: sans-serif;
}

.diag-subtitle {
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  font-size: 1rem;
  color: #a1887f; /* Lighter brown/gray */
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
}

.diag-question {
  text-align: center;
  font-size: 1.1rem;
  color: #4e3b30;
  margin-bottom: 3rem;
  line-height: 1.8;
  font-weight: 500;
}

/* Interaction Area */
.interaction-area {
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.keywords-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px; /* Align with arrows approx */
  margin-bottom: 0.5rem;
}

.keyword-box {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem 2rem;
  background-color: white;
  text-align: center;
  color: #8d6e63;
  font-size: 0.9rem;
  line-height: 1.6;
  position: relative;
  min-width: 140px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.box-tail {
  position: absolute;
  bottom: -6px;
  left: 50%; /* Center tail? Image 2 shows tail pointing to left/right corner? Image 2 shows tail pointing to handle? No, straight down? Image 2 shows slight tail. */
  transform: translateX(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  /* Simple CSS triangle approach mostly works with rotation */
}
.keyword-box.left-box .box-tail {
  left: 20px; /* Align with arrow/start more? */
  transform: rotate(45deg);
}
.keyword-box.right-box .box-tail {
  left: auto;
  right: 20px;
  transform: rotate(45deg);
}

/* Slider Controls */
.slider-control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
  position: relative;
}

.arrow-btn {
  background-color: #4e3b30;
  width: 44px;
  height: 44px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-track-container {
  flex: 1;
  position: relative;
  height: 44px; /* Layout height */
  display: flex;
  align-items: center;
}

.track-line {
  position: absolute;
  width: 100%;
  height: 6px; /* Thicker track */
  background-color: #efebe9; /* Beige */
  border-radius: 3px;
  top: 50%;
  transform: translateY(-50%);
}

.track-line-active {
  position: absolute;
  width: 50%; /* Mock active state */
  height: 6px;
  background-color: #4e3b30; /* Dark brown */
  border-radius: 3px 0 0 3px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.track-handle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #4e3b30;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
  position: absolute;
  left: 50%; /* Center */
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 3px solid #6d5e50; /* Slight border */
}

/* Ticks */
.ticks-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 5px;
  margin-top: 0.5rem;
  color: #4e3b30;
  font-size: 0.9rem;
  font-weight: bold;
  font-family: serif;
}

/* Tooltips */
.tooltip-bubble {
  position: absolute;
  background-color: #4e3b30;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  line-height: 1.6;
  z-index: 20;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  white-space: nowrap; /* Prevent weird wrapping */
}

/* Help Tooltip */
.help-tooltip {
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  margin-left: 20px; /* Space from icon */
}
.help-tooltip .tooltip-arrow-left {
  position: absolute;
  top: 50%;
  left: -8px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid #4e3b30;
}

/* Handle Tooltip */
.handle-tooltip {
  bottom: 100%; /* Above handle */
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 15px;
  text-align: left;
}
.handle-tooltip .tooltip-arrow-top {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #4e3b30;
}

/* Mobile */
@media (max-width: 768px) {
  /* Reduce top spacing */
  .intro-text-section {
    margin-bottom: 1rem;
  }

  .intro-text-section p {
    font-size: 0.85rem;
    line-height: 1.6 !important;
  }

  .steps-container {
    margin-bottom: 1.5rem;
    gap: 0.8rem;
  }

  /* Force override padding of the common card for this view ONLY */
  .common-info-card {
    padding: 1rem 0.5rem !important;
  }

  /* Mockup Diagram - compact mobile layout */
  .mockup-diagram {
    padding: 0.8rem 0.2rem; /* Extremely tight padding */
    width: 100%;
    margin-bottom: 0.5rem;
    border: none; /* Remove border to save space if needed, or keep thin */
    background-color: transparent; /* Seamless look */
  }

  .diagram-header-row {
    margin-bottom: 0.2rem;
    gap: 0.3rem;
    justify-content: center;
  }

  .diag-title-main {
    font-size: 1.1rem; /* Much smaller title */
    letter-spacing: 0.05em;
  }

  .diag-subtitle {
    font-size: 0.7rem;
    margin-bottom: 0.8rem;
  }

  .help-icon-large {
    width: 20px;
    height: 20px;
    font-size: 0.8rem;
  }

  .diag-question {
    font-size: 0.8rem;
    margin-bottom: 1rem;
    line-height: 1.4;
    padding: 0 0.5rem;
  }

  /* Keywords */
  .keywords-row {
    margin-bottom: 0.5rem;
    padding: 0;
    gap: 0.5rem;
  }

  .keyword-box {
    min-width: unset;
    padding: 0.4rem 0.2rem;
    font-size: 0.65rem; /* Tiny text */
    line-height: 1.3;
    width: 46%; /* Maximized width */
    height: auto;
  }

  .box-tail {
    width: 8px;
    height: 8px;
    bottom: -5px;
  }

  /* Slider Row */
  .slider-control-row {
    gap: 0.3rem;
    padding: 0 0.2rem;
  }

  .arrow-btn {
    width: 28px;
    height: 28px;
  }

  .track-handle {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
    border-width: 2px;
  }

  .track-line {
    height: 4px;
  }

  .ticks-row {
    font-size: 0.7rem;
  }

  /* Make Help Tooltip visible and adjusted for mobile */
  .help-tooltip {
    display: block; /* Show it */
    position: absolute;
    top: 100%; /* Below the icon */
    left: 50%;
    transform: translateX(-50%);
    margin-left: 0;
    margin-top: 10px; /* Space from icon */
    width: 200px; /* Constrain width */
    font-size: 0.7rem;
    padding: 0.6rem;
    white-space: normal; /* Allow wrapping */
    text-align: center;
    z-index: 100;
  }

  /* Remove the left arrow */
  .help-tooltip .tooltip-arrow-left {
    display: none;
  }

  /* Add a top arrow for mobile layout */
  .help-tooltip::before {
    content: '';
    position: absolute;
    bottom: 100%; /* At the top of tooltip */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #4e3b30;
  }

  .handle-tooltip {
    width: 160px;
    white-space: normal;
    text-align: center;
    padding: 0.5rem;
    font-size: 0.65rem;
    bottom: 120%;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  /* Steps text size */
  .step-text {
    font-size: 0.8rem;
    line-height: 1.4;
  }
  .step-number {
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
    margin-top: 0;
  }
}
</style>
