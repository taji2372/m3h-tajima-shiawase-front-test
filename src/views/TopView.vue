<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLifeCycleStore } from '../stores/lifeCycle'

const router = useRouter()
const store = useLifeCycleStore()

const showConsentModal = ref(false)

onMounted(() => {
  // Always show consent modal on mount if not already decided?
  // Or just show it every time TopView is loaded as per "When Top screen is displayed"
  // User said: "Top画面が表示される際、モーダル画面で同意書を表示してください。"
  showConsentModal.value = true
})

const handleConsent = (agreed) => {
  store.setConsent(agreed)
  showConsentModal.value = false
}

const startStory = () => {
  router.push('/description')
}
</script>

<template>
  <div class="top-view">
    <h1 class="title">SHIAWASEspan</h1>

    <div class="action-container">
      <v-btn @click="startStory" block class="submit-btn" size="large" variant="flat">
        Start Story
      </v-btn>
    </div>

    <!-- Consent Modal -->
    <v-dialog v-model="showConsentModal" persistent max-width="800">
      <v-card class="consent-card">
        <v-card-title class="headline">研究参加への同意</v-card-title>
        <v-card-text>
          <p class="consent-text">
            本アンケートデータの収集・保管に関して、下記の内容をご確認の上、同意いただける場合は「同意して進む」を選択してください。
          </p>
          <div class="consent-details mt-3">
            <ul>
              <li>回答データは匿名で処理され、研究目的のみに使用されます。</li>
              <li>個人を特定する情報は収集されません。</li>
              <li>いつでも回答を中止することができます。</li>
            </ul>
          </div>
        </v-card-text>
        <v-card-actions class="justify-center pb-6">
          <v-btn color="#4a3b2a" variant="flat" class="mx-4 px-6" @click="handleConsent(false)">
            同意せず進む
          </v-btn>
          <v-btn
            color="#4a3b2a"
            variant="flat"
            class="mx-4 px-6 agree-btn"
            @click="handleConsent(true)"
          >
            同意して進む
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.top-view {
  /* Paper Styles */
  background-color: #fdfbf7; /* var(--paper-color) */
  width: 100%;
  height: 100%;
  padding: 2rem;
  box-shadow:
    2px 2px 0px rgba(0, 0, 0, 0.1),
    15px 15px 40px rgba(0, 0, 0, 0.2);
  border-radius: 3px;

  /* Flex Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center vertically */
  position: relative;
}

.title {
  font-size: 3rem;
  margin-bottom: 3rem;
  color: #4a3b2a;
  letter-spacing: 0.1em;
  text-align: center;
  word-break: break-all; /* Prevent overflow */
}

.action-container {
  width: 100%;
  max-width: 400px;
}

.submit-btn {
  background-color: #4a3b2a !important;
  color: #fdfbf7 !important;
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  letter-spacing: 0.1em;
}

/* Consent Modal Styles */
.consent-card {
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  border: 1px solid #d4c4b0;
}

.headline {
  background-color: #fdfbf7;
  color: #4a3b2a;
  border-bottom: 1px solid #e8dfd0;
  font-weight: bold;
}

.consent-details ul {
  padding-left: 1.5rem;
  color: #5c4b3a;
}

.consent-details li {
  margin-bottom: 0.5rem;
}

.v-btn--variant-flat {
  color: #fff !important;
}

.agree-btn {
  /* Specific override if needed, but above covers it */
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .top-view {
    padding: 1rem; /* Reduce padding */
  }

  .title {
    font-size: 2rem; /* Reduce font size */
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.6rem;
  }
}

.consent-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a3b2a;
  margin-bottom: 1rem;
}
</style>
