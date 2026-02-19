<script setup>
import { useRouter } from 'vue-router'
import { useLifeCycleStore } from '../stores/lifeCycle'

const router = useRouter()
const store = useLifeCycleStore()

const goToNext = () => {
  store.hasViewedDescription = true
  router.push('/instruction')
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="common-view-container paper-sheet">
    <div class="common-content-wrapper">
      <h1 class="common-main-title">はじめに</h1>

      <div class="common-info-card">
        <h2 class="common-card-title">しあわせ寿命って？</h2>
        <div class="common-title-underline"></div>

        <p class="description-text">
          しあわせ寿命とは、「生きるとは何か」という問いに最も主観的に近づく、新しい寿命のものさしです。<br />
          この本では、じぶんのこれまでの人生を振り返り、「じぶんだけのしあわせ寿命」を見える化することができます。
        </p>

        <div class="diagram-container">
          <!-- Shiawase Span Bubble -->
          <div class="bubble shiawase-bubble">
            <div class="new-badge">
              <span>NEW</span>
              <v-icon icon="mdi-creation" size="x-small" color="white" class="ml-1"></v-icon>
            </div>
            <div class="bubble-content">
              <span class="bubble-jp">しあわせ寿命</span>
              <span class="bubble-en">SHIAWASE span</span>
            </div>
          </div>

          <!-- Bottom Bubbles -->
          <div class="bottom-bubbles">
            <div class="bubble normal-bubble">
              <div class="bubble-content">
                <span class="bubble-jp">生命寿命</span>
                <span class="bubble-en">LIFE span</span>
              </div>
            </div>
            <div class="bubble normal-bubble">
              <div class="bubble-content">
                <span class="bubble-jp">健康寿命</span>
                <span class="bubble-en">HEALTH span</span>
              </div>
            </div>
          </div>
        </div>

        <p class="closing-text">
          なんとなくイメージはできたでしょうか？<br />
          次のページでは、しあわせ寿命のはかり方を説明します。
        </p>
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
/* Page specific styles */
.description-text {
  font-size: 1rem;
  line-height: 2;
  margin-bottom: 2rem;
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.diagram-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
  position: relative;
}

.bubble {
  border: 2px solid #8c7b6a;
  border-radius: 60px;
  background-color: #fffaf5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.bubble:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(74, 59, 42, 0.15);
}

.shiawase-bubble {
  width: 260px;
  height: 85px;
  border-color: #5c4b3a;
  border-width: 3px;
  margin-bottom: 1.5rem;
  z-index: 2;
  background-color: #ffffff;
}

.bottom-bubbles {
  display: flex;
  gap: 2rem;
  justify-content: center;
  width: 100%;
}

.normal-bubble {
  width: 160px;
  height: 65px;
  border-color: #d4c4b0;
  border-width: 2.5px;
}

.bubble-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.2;
}

.bubble-jp {
  font-weight: bold;
  font-size: 1.1rem;
  color: #4a3b2a;
  letter-spacing: 0.1em;
}

.bubble-en {
  font-size: 0.7rem;
  color: #8c7b6a;
  text-transform: uppercase;
  margin-top: 4px;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.new-badge {
  position: absolute;
  top: -14px;
  right: -10px;
  background-color: #6d5e50;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 20px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
}

.closing-text {
  font-size: 1rem;
  line-height: 1.8;
  text-align: center;
  width: 100%;
  color: #4a3b2a;
  margin-bottom: 0.5rem;
}

.back-btn {
  color: #4a3b2a !important;
  border: 1px solid #d4c4b0;
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .description-text {
    font-size: 0.95rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    text-align: left;
  }

  .diagram-container {
    margin-bottom: 2rem;
  }

  .shiawase-bubble {
    width: 220px;
    height: 70px;
    margin-bottom: 1rem;
  }

  .bottom-bubbles {
    gap: 0.8rem;
  }

  .normal-bubble {
    width: 130px;
    height: 55px;
  }

  .bubble-jp {
    font-size: 0.95rem;
  }

  .bubble-en {
    font-size: 0.6rem;
  }

  .closing-text {
    font-size: 0.95rem;
    text-align: left;
  }
}

@media (max-width: 380px) {
  .shiawase-bubble {
    width: 190px;
  }

  .normal-bubble {
    width: 110px;
  }
}
</style>
