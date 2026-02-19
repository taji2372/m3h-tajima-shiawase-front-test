import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLifeCycleStore = defineStore(
  'lifeCycle',
  () => {
    // State
    const nickname = ref('')
    const age = ref(0)
    // Keyed by phase ID: { 0: { reflection: '', scores: {...} }, 1: ... }
    const answers = ref({})
    const surveyResult = ref(null) // SubmitSurvey API response
    const isSubmitting = ref(false) // Submission status
    const hasViewedDescription = ref(false) // Description carousel status
    const consent = ref(null) // User consent status

    // Constants
    const allPhases = [
      { id: 0, label: 'Phase 0', range: 'NOW', duration: '-', description: '現在の瞬間（非時間）' },
      {
        id: 1,
        label: 'Phase 1',
        range: '0–6',
        start: 0,
        end: 6,
        duration: '7年',
        description: '幼少期・基礎形成',
      },
      {
        id: 2,
        label: 'Phase 2',
        range: '7–9',
        start: 7,
        end: 9,
        duration: '3年',
        description: '初期学童期',
      },
      {
        id: 3,
        label: 'Phase 3',
        range: '10–12',
        start: 10,
        end: 12,
        duration: '3年',
        description: '前思春期',
      },
      {
        id: 4,
        label: 'Phase 4',
        range: '13歳',
        start: 13,
        end: 13,
        duration: '1年',
        description: '中学一年生',
      },
      {
        id: 5,
        label: 'Phase 5',
        range: '14歳',
        start: 14,
        end: 14,
        duration: '1年',
        description: '中学二年生',
      },
      {
        id: 6,
        label: 'Phase 6',
        range: '15歳',
        start: 15,
        end: 15,
        duration: '1年',
        description: '中学三年生',
      },
      {
        id: 7,
        label: 'Phase 7',
        range: '16歳',
        start: 16,
        end: 16,
        duration: '1年',
        description: '高校一年生',
      },
      {
        id: 8,
        label: 'Phase 8',
        range: '17歳',
        start: 17,
        end: 17,
        duration: '1年',
        description: '高校二年生',
      },
      {
        id: 9,
        label: 'Phase 9',
        range: '18歳',
        start: 18,
        end: 18,
        duration: '1年',
        description: '高校三年生',
      },
      {
        id: 10,
        label: 'Phase 10',
        range: '19–22',
        start: 19,
        end: 22,
        duration: '4年',
        description: '大学・移行期',
      },
      {
        id: 11,
        label: 'Phase 11',
        range: '23–25',
        start: 23,
        end: 25,
        duration: '3年',
        description: '社会人初期',
      },
      {
        id: 12,
        label: 'Phase 12',
        range: '26–29',
        start: 26,
        end: 29,
        duration: '4年',
        description: '定着・役割増加',
      },
      {
        id: 13,
        label: 'Phase 13',
        range: '30–34',
        start: 30,
        end: 34,
        duration: '5年',
        description: '中期成人前半',
      },
      {
        id: 14,
        label: 'Phase 14',
        range: '35–39',
        start: 35,
        end: 39,
        duration: '5年',
        description: '中期成人',
      },
      {
        id: 15,
        label: 'Phase 15',
        range: '40–44',
        start: 40,
        end: 44,
        duration: '5年',
        description: '中期成人',
      },
      {
        id: 16,
        label: 'Phase 16',
        range: '45–49',
        start: 45,
        end: 49,
        duration: '5年',
        description: '中期成人',
      },
      {
        id: 17,
        label: 'Phase 17',
        range: '50–54',
        start: 50,
        end: 54,
        duration: '5年',
        description: '中期成人',
      },
      {
        id: 18,
        label: 'Phase 18',
        range: '55–59',
        start: 55,
        end: 59,
        duration: '5年',
        description: '中期成人',
      },
      {
        id: 19,
        label: 'Phase 19',
        range: '60–64',
        start: 60,
        end: 64,
        duration: '5年',
        description: '中期成人',
      },
      {
        id: 20,
        label: 'Phase 20',
        range: '65–69',
        start: 65,
        end: 69,
        duration: '5年',
        description: '中期成人',
      },
    ]

    // Actions
    const setUserInfo = (name, userAge) => {
      nickname.value = name
      age.value = parseInt(userAge)
    }

    const setConsent = (status) => {
      consent.value = status
    }

    // Getters
    const relevantPhases = computed(() => {
      const userAge = age.value
      // Logic change: Include Phase 0 (id 0) and any phase that started in the past (start <= userAge)
      // Note: Phase 0 is "NOW" so it's always relevant? Or only if age >= 0? (Always true).

      const past = allPhases.filter((p) => {
        // Example condition: Includes Phase 0 + any phase that starts at or before current age
        return p.id === 0 || p.start <= userAge
      })

      // Include Phase 0? The request implies chronological order.
      // "Repeating until own age phase".

      // Let's sort by ID.
      return past
    })

    const saveAnswer = (phaseId, data) => {
      answers.value[phaseId] = {
        ...answers.value[phaseId],
        ...data,
      }
    }

    const getAnswer = (phaseId) => {
      return (
        answers.value[phaseId] || {
          reflection: '',
          summary: { text: '' },
          scores: {
            self: { value: 0, comment: '' },
            legacy: { value: 0, comment: '' },
            bond: { value: 0, comment: '' },
            future: { value: 0, comment: '' },
            health: { value: 0, comment: '' },
            environment: { value: 0, comment: '' },
          },
        }
      )
    }

    // Helper function to convert switch value to delta
    const getSwitchDelta = (switchValue) => {
      if (switchValue === 'ON') return 1
      if (switchValue === 'QUIET') return 0.2
      return 0 // OFF
    }

    const submitSurvey = async () => {
      isSubmitting.value = true
      try {
        // Build payload
        const payload = {
          userProfile: {
            age: age.value,
            name: nickname.value,
            consent: consent.value,
          },
          timestamp: new Date().toISOString(),
          data: relevantPhases.value.map((phase) => {
            const answer = getAnswer(phase.id)
            const scores = answer.scores

            return {
              phaseId: phase.id,
              phaseName: phase.description,
              phaseRange: phase.range,
              scores: {
                identity: scores.self?.value || 0,
                legacy: scores.legacy?.value || 0,
                legacy_delta: getSwitchDelta(scores.legacy?.switch || 'OFF'),
                bond: scores.bond?.value || 0,
                bond_delta: getSwitchDelta(scores.bond?.switch || 'OFF'),
                future: scores.future?.value || 0,
                health: scores.health?.value || 0,
                environment: scores.environment?.value || 0,
              },
            }
          }),
        }

        console.log('Submitting survey:', payload)

        const response = await fetch(
          'https://shiawasepj-container.azurewebsites.net/SubmitSurvey',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          },
        )

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const result = await response.json()
        surveyResult.value = result
        console.log('Survey result:', result)

        return result
      } catch (error) {
        console.error('Submit survey error:', error)
        throw error
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      nickname,
      age,
      allPhases,
      relevantPhases,
      answers,
      surveyResult,
      isSubmitting,
      hasViewedDescription,
      consent,
      setUserInfo,
      setConsent,
      saveAnswer,
      getAnswer,
      submitSurvey,
    }
  },
  {
    persist: false,
  },
)
