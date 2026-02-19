<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLifeCycleStore } from '../stores/lifeCycle'

const router = useRouter()
const store = useLifeCycleStore()

const nickname = ref(store.nickname || '')
const age = ref(store.age ? store.age.toString() : '')
const valid = ref(false)

// Validation rules
const nicknameRules = [
  (v) => !!v || 'ニックネームは必須です',
  (v) => /^[a-zA-Z0-9]+$/.test(v) || '半角英数字のみで入力してください',
]

const ageRules = [
  (v) => !!v || '年齢は必須です',
  (v) => /^[0-9]+$/.test(v) || '半角数字のみで入力してください',
  (v) => (parseInt(v) > 0 && parseInt(v) < 150) || '正しい年齢を入力してください',
]

const submit = () => {
  if (valid.value) {
    store.setUserInfo(nickname.value, age.value)

    if (store.relevantPhases.length > 0) {
      const firstPhase = store.relevantPhases[0]
      // Assuming route uses phaseSlug 'phaseX'
      router.push(`/survey/phase${firstPhase.id}`)
    } else {
      alert('対象となるフェーズがありません（年齢設定を確認してください）')
    }
  }
}

const goBack = () => {
  router.push('/intro-start')
}
</script>

<template>
  <div class="common-view-container paper-sheet">
    <div class="common-content-wrapper">
      <h1 class="common-main-title">はじめに</h1>

      <div class="common-info-card profile-card">
        <div class="profile-intro-text">
          <p>
            しあわせ寿命をはかるために、あなたのことを教えてください。<br />
            ニックネームとあなたの現在の年齢を入力してください。
          </p>
          <p class="note-text">※使用できる文字は半角英数字のみです</p>
        </div>

        <v-form v-model="valid" @submit.prevent="submit" class="profile-form">
          <div class="form-group">
            <label class="form-label">ニックネーム</label>
            <v-text-field
              v-model="nickname"
              :rules="nicknameRules"
              placeholder="NAME"
              variant="outlined"
              color="#4a3b2a"
              bg-color="white"
              density="comfortable"
              hide-details="auto"
              class="custom-input"
            ></v-text-field>
          </div>

          <div class="form-group">
            <label class="form-label">年齢</label>
            <div class="age-input-row">
              <v-text-field
                v-model="age"
                :rules="ageRules"
                placeholder="0"
                variant="outlined"
                color="#4a3b2a"
                bg-color="white"
                density="comfortable"
                hide-details="auto"
                class="custom-input age-input"
                type="number"
              ></v-text-field>
              <span class="age-unit">歳</span>
            </div>
          </div>

          <div class="form-action">
            <v-btn
              type="submit"
              class="start-btn"
              :disabled="!valid"
              color="#4e3b30"
              height="56"
              width="240"
              flat
            >
              はじめる
            </v-btn>
          </div>
        </v-form>
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
/* Page specific styles matching Step 216 image */

.profile-card {
  align-items: flex-start; /* Left align content inside card */
  text-align: left;
  padding: 3rem; /* More padding */
}

.profile-intro-text {
  margin-bottom: 2.5rem;
  width: 100%;
}

.profile-intro-text p {
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 0.5rem;
  font-weight: bold; /* Looks slightly bold in image? Or just distinct */
}

.note-text {
  font-size: 0.8rem;
  color: #d7ccc8; /* Light brown/gray */
  font-weight: normal;
}

.profile-form {
  width: 100%;
}

.form-group {
  margin-bottom: 2rem;
}

.form-label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #4a3b2a;
}

.custom-input :deep(.v-field__outline__start),
.custom-input :deep(.v-field__outline__end),
.custom-input :deep(.v-field__outline__notch) {
  border-color: #d4c4b0 !important;
}

.custom-input :deep(input) {
  font-family: inherit;
  letter-spacing: 0.05em;
  font-size: 1rem;
  padding-top: 10px;
  padding-bottom: 10px;
}

.age-input-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.age-input {
  max-width: 120px;
}

.age-unit {
  font-size: 1.2rem;
  font-weight: bold;
  color: #4a3b2a;
}

.form-action {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.start-btn {
  font-weight: bold;
  letter-spacing: 0.1em;
  font-size: 1.1rem;
  color: white !important;
  border-radius: 4px;
}

/* Footer override */
.footer-action-override {
  justify-content: flex-start;
}

.back-btn {
  color: #4a3b2a !important;
  border: 1px solid #d4c4b0;
}

/* Responsive */
@media (max-width: 600px) {
  .profile-card {
    padding: 2rem 1rem; /* Slightly tighter padding */
  }

  .profile-intro-text p {
    font-size: 0.8rem; /* Smaller text as requested */
    line-height: 1.8;
  }

  .note-text {
    font-size: 0.7rem;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-action {
    margin-top: 2rem;
  }

  .start-btn {
    width: 100%;
    height: 48px; /* Slightly shorter button */
    font-size: 1rem;
  }
}
</style>
