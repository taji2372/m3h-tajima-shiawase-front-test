<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLifeCycleStore } from '../stores/lifeCycle'

const props = defineProps({
  phaseId: {
    type: Number,
    required: true,
  },
  step: {
    type: String,
    default: 'input', // 'input' or 'result'
  },
})

const router = useRouter()
const store = useLifeCycleStore()

const phase = computed(() => {
  return store.allPhases.find((p) => p.id === props.phaseId) || {}
})

const saved = store.getAnswer(props.phaseId)
// We need to sync reflection with store immediately if we want to separate input/result
const reflection = ref(saved.reflection || '')
const scores = reactive(saved.scores)

watch(
  () => props.phaseId,
  (newId) => {
    const data = store.getAnswer(newId)
    reflection.value = data.reflection || ''
    Object.assign(scores, data.scores)
  },
)

const isAnalyzing = ref(false)
const isLastPhase = computed(() => {
  const currentIndex = store.relevantPhases.findIndex((p) => p.id === props.phaseId)
  return currentIndex === store.relevantPhases.length - 1
})

const analyze = async () => {
  if (!reflection.value) return

  isAnalyzing.value = true
  try {
    const payload = {
      age: store.age,
      phase: props.phaseId !== undefined ? props.phaseId : 0, // Ensure phaseId is present
      episode: reflection.value,
    }
    console.log('Analyzing payload:', payload)

    const response = await fetch('https://shiawasepj-container.azurewebsites.net/AnalyzeEpisode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Analysis failed:', response.status, errorText)
      throw new Error(`Analysis failed: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log('Analysis result:', result)

    const answerData = {
      reflection: reflection.value,
      summary: result.summary,
      scores: result.scores,
    }
    store.saveAnswer(props.phaseId, answerData)
    // Safely assign scores, merging with existing structure if needed
    if (result.scores) {
      for (const key in result.scores) {
        if (
          scores[key] &&
          typeof scores[key] === 'object' &&
          result.scores[key] !== null &&
          typeof result.scores[key] === 'object'
        ) {
          // If both are objects (e.g. has value/switch), merge
          Object.assign(scores[key], result.scores[key])
        } else if (
          scores[key] &&
          typeof scores[key] === 'object' &&
          typeof result.scores[key] === 'number'
        ) {
          // If store has object but result is number (simple score update)
          scores[key].value = result.scores[key]
        } else {
          // Direct assignment
          scores[key] = result.scores[key]
        }
      }
    }

    router.push(`/survey/phase${props.phaseId}/result`)
  } catch (error) {
    console.error('API Error:', error)
    alert(`分析に失敗しました: ${error.message}`)
  } finally {
    isAnalyzing.value = false
  }
}

const handleNext = () => {
  store.saveAnswer(props.phaseId, { reflection: reflection.value, scores: scores })
  const currentIndex = store.relevantPhases.findIndex((p) => p.id === props.phaseId)
  if (currentIndex >= 0 && currentIndex < store.relevantPhases.length - 1) {
    const nextPhase = store.relevantPhases[currentIndex + 1]
    router.push(`/survey/phase${nextPhase.id}/input`)
  }
}

const handleSubmit = async () => {
  store.saveAnswer(props.phaseId, { reflection: reflection.value, scores: scores })
  try {
    await store.submitSurvey()
    router.push('/results')
  } catch {
    alert('Failed to submit survey. Please try again.')
  }
}

const handleBack = () => {
  if (props.step === 'result') {
    goToPhase(props.phaseId, 'input')
  } else {
    if (props.phaseId === 0) {
      router.push('/profile')
    } else {
      const currentIndex = store.relevantPhases.findIndex((p) => p.id === props.phaseId)
      if (currentIndex > 0) {
        const prevPhase = store.relevantPhases[currentIndex - 1]
        goToPhase(prevPhase.id, 'result')
      } else {
        router.push('/profile')
      }
    }
  }
}

const goToPhase = (targetPhaseId, targetStep = 'input') => {
  router.push(`/survey/phase${targetPhaseId}/${targetStep}`)
}

const formatPhaseRangeHeader = (p) => {
  if (!p) return ''
  if (p.range === 'NOW') return '現在'
  let range = p.range
  if (!range.includes('歳') && !range.includes('–') && !range.includes('-')) {
    return range + '歳'
  }
  return range.replace('–', '~').replace('-', '~') + (range.match(/\d$/) ? '歳' : '')
}

const formatPhaseMainTitle = (p) => {
  if (!p) return ''
  if (p.range === 'NOW') return '現在'
  let range = p.range
  if (!range.includes('歳')) range += '歳'
  return range
}

const formatRangeForInstruction = (p) => {
  if (!p) return ''
  if (p.range === 'NOW') return '現在'
  let range = p.range
  // Standardize to "13 ~ 15歳" format if possible
  return range.replace('–', '~').replace('-', '~') + (range.match(/\d$/) ? '歳' : '')
}

const SCORE_METADATA = {
  environment: {
    label: 'ENVIRONMENT',
    jaLabel: 'あなたのまわりの世界',
    description: 'あなたが暮らしている場所やそのとき出会った「まわりの世界」はどうだった？',
    tooltip: 'ENVIRONMENTとは...', // Deprecated but kept for ref
    modalDescription:
      'あなたが暮らしている場所や、その時出会った「じぶんのまわりの世界」のようす。\n家、学校、部活、塾、住んでいる町。そこは、あなたにとって安心できるものだった？きびしかった？',
    leftKeywords: ['退屈', 'きびしい', 'せまい'],
    rightKeywords: ['安心', 'ひろい', 'たのしい'],
  },
  health: {
    label: 'HEALTH',
    jaLabel: 'けんこう',
    description: 'あなたのこころとからだは、どんなふうだった？',
    tooltip: 'HEALTHとは...',
    leftKeywords: ['つらい', '体調よくない', 'だるかった'],
    rightKeywords: ['げんき', 'いきいき', 'うれしい'],
  },
  bond: {
    label: 'BOND',
    jaLabel: 'つながり',
    description: 'あなたにとって大切な「つながり」ってどんなものだった？',
    tooltip: 'BONDとは...',
    leftKeywords: ['さみしい', '孤独', 'しんどい'],
    rightKeywords: ['安心', '楽', '深い'],
    hasSwitch: true,
  },
  legacy: {
    label: 'GIFT',
    jaLabel: 'ギフト',
    description: 'あなたが、だれかから受け取ったもの、残しているものはどんなイメージ？',
    tooltip: 'GIFTとは...',
    leftKeywords: ['重い', 'くるしい', 'つめたい'],
    rightKeywords: ['だいじ', '役に立つ', 'あたたかい'],
    hasSwitch: true,
  },
  self: {
    label: 'SELF',
    jaLabel: 'じぶん',
    description: 'そのころのあなたにとって「じぶん」でいることは、どんなふうに感じていた？',
    tooltip: 'SELFとは...',
    leftKeywords: ['不安', 'はずかしい', 'いらいら'],
    rightKeywords: ['うれしい', '誇らしい', '心地よい'],
  },
  future: {
    label: 'FUTURE',
    jaLabel: 'みらい',
    description: 'これから先のこと。そのころのあなたは「みらい」をどんなふうに感じてた？',
    tooltip: 'FUTUREとは...',
    leftKeywords: ['こわい', 'みえない', 'もやもや'],
    rightKeywords: ['わくわく', '希望', 'たのしみ'],
  },
}
const getDisplayValue = (v) => (!v && v !== 0 ? '0' : Math.abs(v * 10).toFixed(0))
const updateSliderValue = (key, delta) => {
  const currentVal = scores[key].value !== undefined ? scores[key].value : scores[key]
  let newVal = Math.round((currentVal + delta) * 10) / 10
  if (newVal < -1.0) newVal = -1.0
  if (newVal > 1.0) newVal = 1.0
  if (typeof scores[key] === 'object') scores[key].value = newVal
  else scores[key] = newVal
}
const setSliderValue = (key, val) => {
  if (typeof scores[key] === 'object') scores[key].value = val
  else scores[key] = val
}
const updateSwitchValue = (key, val) => {
  if (typeof scores[key] === 'object') scores[key].switch = val
  else {
    const c = scores[key]
    scores[key] = { value: c, switch: val }
  }
}

const helpDialog = ref(false)
const currentHelpItem = ref({})
const openHelpModal = (meta) => {
  currentHelpItem.value = { ...meta }
  helpDialog.value = true
}
</script>

<template>
  <div class="common-view-container paper-sheet">
    <div class="common-content-wrapper">
      <h1 class="common-main-title">しあわせ寿命</h1>

      <!-- Content Card Container -->
      <div class="common-info-card survey-card">
        <!-- Progress Navigation -->
        <div class="progress-bar-container-inner">
          <div v-for="(p, index) in store.relevantPhases" :key="p.id" class="phase-progress-item">
            <div class="phase-progress-label">{{ formatPhaseRangeHeader(p) }}</div>
            <div class="phase-group">
              <div
                class="progress-segment left"
                :class="{
                  active: p.id === phaseId && step === 'input',
                  completed: p.id < phaseId || (p.id === phaseId && step === 'result'),
                }"
                @click="goToPhase(p.id, 'input')"
              ></div>
              <div
                class="progress-segment right"
                :class="{
                  active: p.id === phaseId && step === 'result',
                  completed: p.id < phaseId,
                }"
                @click="goToPhase(p.id, 'result')"
              ></div>
            </div>
          </div>
        </div>

        <!-- Episode Input Content -->
        <template v-if="step === 'input'">
          <div class="phase-header-block">
            <h2 class="phase-main-title">{{ formatPhaseMainTitle(phase) }}</h2>
            <div class="phase-subtitle">{{ phase.description }}</div>
            <div class="phase-underline"></div>
          </div>

          <div class="instruction-block">
            <p>この時、あなたはどのような人生を送っていたと思いますか？</p>
            <p>
              思い出せる範囲で、心に残っていることをできるだけ書いてみてください。<br />
              わからない場合は、わからないでもかまいません。<br />
              記入が終わったら「進む」を選択してください。
            </p>
          </div>

          <div class="input-block">
            <v-textarea
              v-model="reflection"
              variant="outlined"
              placeholder="記入してください"
              rows="12"
              no-resize
              class="episode-textarea"
              bg-color="white"
              color="#4a3b2a"
              hide-details
            ></v-textarea>
          </div>
        </template>

        <!-- Result Content (Redesigned) -->
        <template v-if="step === 'result'">
          <div class="phase-header-block mb-4">
            <h2 class="phase-main-title">{{ formatPhaseMainTitle(phase) }}</h2>
            <div class="phase-subtitle">{{ phase.description }}</div>
            <div class="phase-underline"></div>
          </div>

          <div class="instruction-block mb-5">
            <p>
              あなたが{{
                formatRangeForInstruction(phase)
              }}のときに、どう感じていたかを教えてください。
            </p>
          </div>

          <div class="result-stack">
            <div v-for="(meta, key) in SCORE_METADATA" :key="key" class="result-item">
              <!-- Title Row -->
              <div class="result-title-row">
                <div class="result-en-title">
                  {{ meta.label }}

                  <v-icon
                    v-if="meta.tooltip || meta.modalDescription"
                    icon="mdi-help-circle"
                    size="small"
                    class="help-icon ml-1"
                    color="#5d4037"
                    @click="openHelpModal(meta)"
                  ></v-icon>
                </div>
                <div class="result-ja-title">{{ meta.jaLabel }}</div>
              </div>

              <!-- Description -->
              <!-- Description moved below -->

              <!-- Switch (if applicable) - kept separate or integrated? Visually keep clean -->
              <!-- Switch moved below -->

              <!-- Visual Interaction Row -->
              <div class="result-visual-column">
                <!-- Bubbles Row -->
                <div class="bubbles-row bubbles-aligned">
                  <!-- Left Speech Box -->
                  <div class="speech-box left-box">
                    <div v-for="word in meta.leftKeywords" :key="word">{{ word }}</div>
                    <div class="speech-point bottom-point"></div>
                  </div>

                  <!-- Center Column (Description + Switch) -->
                  <div class="center-column">
                    <div class="center-description-text">
                      {{ meta.description }}
                    </div>
                    <!-- Switch (if applicable) -->
                    <div v-if="meta.hasSwitch" class="center-switch-container">
                      <v-btn-toggle
                        :model-value="scores[key]?.switch || 'OFF'"
                        @update:model-value="(val) => updateSwitchValue(key, val)"
                        mandatory
                        rounded="xl"
                        density="compact"
                        color="brown-darken-2"
                        class="custom-switch-toggle"
                      >
                        <v-btn value="OFF" size="small">OFF</v-btn>
                        <v-btn value="QUIET" size="small">QUIET</v-btn>
                        <v-btn value="ON" size="small">ON</v-btn>
                      </v-btn-toggle>
                    </div>
                  </div>

                  <!-- Right Speech Box -->
                  <div class="speech-box right-box">
                    <div v-for="word in meta.rightKeywords" :key="word">{{ word }}</div>
                    <div class="speech-point bottom-point"></div>
                  </div>
                </div>

                <!-- Slider Area -->
                <div class="slider-area-new wide-slider">
                  <v-btn
                    icon="mdi-chevron-left"
                    rounded="0"
                    density="comfortable"
                    color="#4a3b2a"
                    class="nav-arrow-btn"
                    @click="updateSliderValue(key, -0.1)"
                  ></v-btn>

                  <div class="slider-track-new">
                    <v-slider
                      :model-value="
                        scores[key].value !== undefined ? scores[key].value : scores[key]
                      "
                      @update:model-value="(val) => setSliderValue(key, val)"
                      :min="-1.0"
                      :max="1.0"
                      :step="0.1"
                      color="#4a3b2a"
                      track-color="#d0c0a0"
                      hide-details
                      class="new-custom-slider"
                      :style="{
                        '--thumb-text': `'${getDisplayValue(
                          scores[key].value !== undefined ? scores[key].value : scores[key],
                        )}'`,
                      }"
                    >
                    </v-slider>
                    <!-- Labels -->
                    <div class="track-labels-new">
                      <span>10</span>
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>

                  <v-btn
                    icon="mdi-chevron-right"
                    rounded="0"
                    density="comfortable"
                    color="#4a3b2a"
                    class="nav-arrow-btn"
                    @click="updateSliderValue(key, 0.1)"
                  ></v-btn>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Action Buttons Footer -->
      <div class="common-action-buttons footer-action-override">
        <v-btn
          @click="handleBack"
          class="common-action-btn back-btn"
          color="white"
          variant="flat"
          height="48"
          >戻る</v-btn
        >

        <template v-if="step === 'input'">
          <v-btn
            @click="analyze"
            class="common-action-btn analyze-btn"
            color="#4e3b30"
            variant="flat"
            height="48"
            :loading="isAnalyzing"
            :disabled="!reflection"
          >
            しあわせ分析
            <v-icon icon="mdi-creation" end class="ml-1 shimmer-icon"></v-icon>
          </v-btn>
        </template>
        <template v-if="step === 'result'">
          <v-btn
            @click="isLastPhase ? handleSubmit() : handleNext()"
            class="common-action-btn next-btn"
            color="#4a3b2a"
            theme="dark"
            variant="flat"
            height="48"
            :loading="isLastPhase && store.isSubmitting"
          >
            {{ isLastPhase ? '結果を見る' : '次へ' }}
          </v-btn>
        </template>
      </div>
      <div class="mobile-spacer"></div>
    </div>
    <!-- Help Modal -->
    <v-dialog v-model="helpDialog" max-width="800" class="help-dialog" z-index="2500">
      <div class="help-card">
        <v-btn
          icon="mdi-close"
          variant="text"
          class="close-btn"
          color="#8d6e63"
          @click="helpDialog = false"
        ></v-btn>
        <div class="help-content">
          <h3 class="help-title">
            <span>{{ currentHelpItem.label }}</span>
          </h3>
          <p class="help-text">
            {{ currentHelpItem.modalDescription || currentHelpItem.description }}
          </p>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<style scoped>
/* Progress Bar (Inner) */
.progress-bar-container-inner {
  display: flex;
  overflow-x: auto;
  gap: 2px;
  width: 100%;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #efebe9;
  scrollbar-width: thin;
  scrollbar-color: #d7ccc8 transparent;
}
.progress-bar-container-inner::-webkit-scrollbar {
  height: 6px;
}
.progress-bar-container-inner::-webkit-scrollbar-thumb {
  background-color: #d7ccc8;
  border-radius: 3px;
}
.progress-bar-container-inner::-webkit-scrollbar-track {
  background-color: transparent;
}

.phase-progress-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 0 calc(100% / 6);
  min-width: 60px;
  cursor: pointer;
}
.phase-progress-label {
  font-size: 0.75rem;
  color: #8c7b6a;
  font-weight: bold;
  margin-bottom: 4px;
  white-space: nowrap;
}
.phase-group {
  display: flex;
  gap: 2px;
  width: 98%;
  justify-content: center;
}
.progress-segment {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.3s;
}
.progress-segment.left {
  border-radius: 4px 0 0 4px;
}
.progress-segment.right {
  border-radius: 0 4px 4px 0;
}
.progress-segment.active {
  background-color: #4a3b2a;
}
.progress-segment.completed {
  background-color: #8d6e63;
}

@media (max-width: 600px) {
  .phase-progress-item {
    flex: 1 0 calc(100% / 3.5);
  }
}

/* Survey Card container tweaks */
.survey-card {
  padding: 2rem 3rem;
  align-items: center;
}

/* Phase Header */
.phase-header-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 2rem;
  width: 100%;
}
.phase-main-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #4a3b2a;
  line-height: 1.2;
}
.phase-subtitle {
  font-size: 1rem;
  color: #8d6e63;
  margin-top: 0.5rem;
}
.phase-underline {
  width: 60px;
  height: 3px;
  background-color: #d7ccc8;
  margin-top: 1rem;
  border-radius: 2px;
}

/* Instructions */
.instruction-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  margin-bottom: 2.5rem;
}
.instruction-block p {
  font-size: 0.95rem;
  line-height: 1.8;
  margin-bottom: 1rem;
  color: #4a3b2a;
  text-align: center;
  width: 100%;
  max-width: 800px;
}

@media (max-width: 600px) {
  .instruction-block p {
    font-size: 0.85rem; /* Smaller text for mobile */
    line-height: 1.8;
  }
}

/* Input */
.input-block {
  width: 100%;
  margin-bottom: 1rem;
}
.episode-textarea :deep(textarea) {
  font-family: inherit;
  line-height: 1.6;
  padding: 1rem;
}

/* Actions */
.footer-action-override {
  justify-content: space-between;
}
.back-btn {
  color: #4a3b2a !important;
  border: 1px solid #d4c4b0;
}
.analyze-btn {
  color: white !important;
  width: 180px;
  font-weight: bold;
  letter-spacing: 0.1em;
}
.next-btn {
  color: white !important;
  width: 180px;
  font-weight: bold;
  letter-spacing: 0.1em;
}

.shimmer-icon {
  animation: shimmer 2s infinite;
}
@keyframes shimmer {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

/* === NEW RESULT STYLES === */
.result-stack {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0;
}
.result-item {
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  border-bottom: 2px dashed #efebe9;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.result-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.result-title-row {
  text-align: center;
  margin-bottom: 0.5rem;
}
.result-en-title {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #4a3b2a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.result-ja-title {
  font-size: 0.9rem;
  color: #8d6e63;
  margin-top: 2px;
}
.result-description {
  text-align: center;
  font-size: 0.95rem;
  color: #4a3b2a;
  font-weight: 500;
  margin-bottom: 1.5rem;
  max-width: 80%;
}
.switch-row {
  margin-bottom: 1rem;
}

.result-visual-column {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.5rem;
}

.bubbles-row {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Align text and boxes vertically */
  width: 100%;
  padding: 0; /* Remove padding to align with outer buttons */
}

.center-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
  margin-top: -10px; /* Align visually with boxes */
}

.center-description-text {
  text-align: center;
  font-size: 0.95rem;
  color: #4a3b2a;
  font-weight: 500;
  white-space: pre-wrap; /* Allow line breaks */
  width: 100%;
}

.center-switch-container {
  margin-top: 0.8rem;
}

.help-icon {
  cursor: pointer;
  transition: opacity 0.2s;
}
.help-icon:hover {
  opacity: 0.7;
}

.mobile-spacer {
  display: none;
}
@media (max-width: 768px) {
  .mobile-spacer {
    display: block;
    width: 100%;
    height: 100px; /* Force vertical buffer */
    flex-shrink: 0;
  }
}

/* Speech Boxes */
.speech-box {
  width: 140px; /* Slightly wider */
  min-height: 80px;
  border: 1px solid #d7ccc8;
  background-color: white;
  border-radius: 4px;
  padding: 0.8rem 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 0.75rem;
  color: #8d6e63;
  line-height: 1.4;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.speech-point {
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  z-index: 1;
  border-bottom: 1px solid #d7ccc8;
  border-right: 1px solid #d7ccc8;
  transform: rotate(45deg);
  bottom: -6px;
}

/* Adjust tail position based on box side to point to the button */
.left-box .speech-point {
  left: 20px; /* Align with left button center (approx) */
}

.right-box .speech-point {
  right: 20px; /* Align with right button center (approx) */
}

/* Slider Area */
.slider-area-new {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%; /* Full width */
}

.nav-arrow-btn {
  border-radius: 4px !important;
  width: 40px !important; /* Slightly larger targets */
  height: 40px !important;
}
.slider-track-new {
  flex: 1;
  position: relative;
  padding-top: 10px;
}

/* Slider Thumb Override */
/* Slider Thumb Override */
.new-custom-slider :deep(.v-slider-thumb) {
  width: 36px !important;
  height: 36px !important;
  background-color: #4a3b2a !important;
  border-radius: 50% !important;
  opacity: 1 !important;
  /* Key fix: restore vertical centering */
  top: 50% !important;
  transform: translateY(-50%) !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
  /* Reset positioning issues if any */
  margin-top: 0 !important;
}

/* Hide ALL internal elements of the thumb to prevent artifacts */
.new-custom-slider :deep(.v-slider-thumb) > * {
  display: none !important;
}

/* Inject value via pseudo-element using CSS var passed from style */
.new-custom-slider :deep(.v-slider-thumb)::after {
  content: var(--thumb-text);
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  display: block;
}

/* Hide extra layers we don't need (redundant but safe) */
.new-custom-slider :deep(.v-slider-thumb__label),
.new-custom-slider :deep(.v-slider-thumb__surface),
.new-custom-slider :deep(.v-ripple__container) {
  display: none !important;
}

.new-custom-slider {
  margin: 0 !important;
}

/* .custom-thumb-circle is no longer used but kept if referenced elsewhere or cleanup later */
.custom-thumb-circle {
  display: none;
}

.track-labels-new {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: #4a3b2a;
  font-weight: bold;
  margin-top: 8px;
  padding: 0 2px;
}

@media (max-width: 600px) {
  .survey-card {
    padding: 1.5rem 1rem; /* Reduce padding significantly */
  }

  /* Bubbles Row Adjustments */
  .bubbles-row {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  /* Make description full width on top */
  .center-column {
    order: -1;
    width: 100%;
    order: -1; /* Move to top */
    width: 100%;
    flex: none; /* Disable flex-grow */
    margin-bottom: 0.5rem;
    padding: 0;
  }

  .speech-box {
    width: 48%; /* Share width 2 per row */
    max-width: unset;
    min-width: unset;
    font-size: 0.75rem;
    padding: 0.5rem;
    min-height: 70px;
  }

  /* Slider Area */
  .slider-area-new {
    width: 100%;
    gap: 0.2rem; /* Tighter gap */
    padding: 0 0.5rem;
  }

  .nav-arrow-btn {
    width: 36px !important;
    height: 36px !important;
  }

  .phase-header-block {
    margin-bottom: 1rem;
  }
  .phase-main-title {
    font-size: 1.4rem;
  }

  .help-title {
    font-size: 1.4rem;
  }

  .help-text {
    font-size: 0.95rem;
  }
}

/* Widen container for PC/Tablet */
.common-content-wrapper {
  max-width: 1200px !important;
}
/* Help Modal Styles */
.help-card {
  background-color: white;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.close-btn {
  position: absolute !important;
  top: 8px;
  right: 8px;
  z-index: 10;
}
.help-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}
.help-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4a3b2a;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}
.help-title span {
  display: inline-block;
  border-bottom: 3px solid #d7ccc8;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
}
.help-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #4a3b2a;
  white-space: pre-wrap;
  width: 100%;
}

@media (max-width: 600px) {
  .instruction-block p {
    font-size: 0.85rem;
    line-height: 1.8;
  }

  /* Result Screen Adjustments */
  .result-en-title {
    font-size: 1rem !important;
    margin-bottom: 0 !important;
  }
  .result-ja-title {
    font-size: 0.7rem !important;
    margin-bottom: 0.5rem !important;
  }

  /* Bubbles Layout Redesign for Mobile */
  .bubbles-row {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0;
    margin-bottom: -15px !important; /* Aggressively pull closer */
    position: relative;
    z-index: 5;
  }

  /* ... center-column styles omitted (unchanged) ... */
  .center-column {
    order: -1;
    width: 100%;
    flex: 0 0 100%;
    margin-bottom: 0.5rem;
    padding: 0;
  }

  .speech-box {
    width: 55px !important; /* Very small width */
    min-width: unset;
    height: auto;
    min-height: 30px !important; /* Very compact */
    padding: 0.15rem 0.1rem !important;
    font-size: 0.45rem !important; /* Tiny text */
    line-height: 1.1;
    border: 1px solid #d7ccc8;
    border-radius: 3px !important;
  }

  .speech-point {
    width: 5px;
    height: 5px;
    bottom: -3px;
    border-width: 1px;
  }

  .left-box .speech-point {
    left: 8px; /* Align with arrow button roughly */
  }
  .right-box .speech-point {
    right: 8px;
  }

  /* ... (center-description-text / speech-box / speech-point unchanged) ... */

  /* Slider adjustments */
  .slider-area-new {
    gap: 4px;
    padding-top: 0 !important;
    padding-left: 6px;
    padding-right: 6px;
    margin-top: -5px !important; /* Pull up further */
    position: relative;
    z-index: 10;
  }
  .nav-arrow-btn {
    width: 28px !important;
    height: 28px !important;
    font-size: 1rem !important;
  }

  /* Mobile Slider Thumb Resize */
  .new-custom-slider :deep(.v-slider-thumb) {
    width: 28px !important;
    height: 28px !important;
  }
  .new-custom-slider :deep(.v-slider-thumb)::after {
    font-size: 0.75rem !important;
  }

  /* Toggle Switch (Legacy/Bond) */
  .custom-switch-toggle {
    height: 26px !important;
  }
  .custom-switch-toggle .v-btn {
    height: 26px !important;
    min-width: auto !important;
    padding: 0 8px !important; /* Compact padding */
    font-size: 0.6rem !important;
    letter-spacing: 0 !important;
  }

  /* Force buttons to single line with equal width */
  .footer-action-override {
    flex-wrap: nowrap !important;
    gap: 6px; /* Tight gap */
    justify-content: space-between;
  }

  /* Both buttons share equal width */
  .back-btn,
  .analyze-btn,
  .next-btn {
    width: auto !important;
    flex: 1 1 0 !important; /* Equal width, allow shrink */
    min-width: 0 !important; /* Allow shrinking below content size if critical, though unlikely needed with small font */
    font-size: 0.7rem !important; /* Smaller font to fit "しあわせ分析" in half width */
    letter-spacing: 0em !important;
    padding: 0 4px !important;
    white-space: nowrap !important; /* Prevent wrapping */
  }

  .analyze-btn .v-icon {
    font-size: 0.85rem !important;
    margin-left: 2px !important;
    margin-right: -2px; /* Pull icon closer if needed */
  }
}
</style>
