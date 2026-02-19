<script setup>
import { computed } from 'vue'
import { useLifeCycleStore } from '../stores/lifeCycle'
import { useRouter } from 'vue-router'
import { Radar, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
)

const store = useLifeCycleStore()
const router = useRouter()

const goToFinish = () => {
  router.push('/finish')
}

const handleBack = () => {
  router.back()
}

const result = computed(() => store.surveyResult?.calculation)

// Jewel Facet Plugin (Radar)
const jewelPlugin = {
  id: 'jewelPlugin',
  _pattern: null,
  _getNoisePattern(ctx) {
    if (this._pattern) return this._pattern
    const c = document.createElement('canvas')
    c.width = 80
    c.height = 80
    const g = c.getContext('2d', { alpha: true })
    const img = g.createImageData(c.width, c.height)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 210 + Math.floor(Math.random() * 40)
      img.data[i] = v
      img.data[i + 1] = v
      img.data[i + 2] = v
      img.data[i + 3] = 255
    }
    g.putImageData(img, 0, 0)
    this._pattern = ctx.createPattern(c, 'repeat')
    return this._pattern
  },
  beforeDraw(chart) {
    const {
      ctx,
      scales: { r },
    } = chart
    if (!r) return
    const cx = r.xCenter
    const cy = r.yCenter
    const radius = r.drawingArea || Math.min(chart.width, chart.height) / 2
    ctx.save()
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius)
    glow.addColorStop(0, 'rgba(255,255,255,0.35)')
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fill()
    const vignette = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius * 1.1)
    vignette.addColorStop(0, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, 'rgba(0,0,0,0.08)')
    ctx.fillStyle = vignette
    ctx.beginPath()
    ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  },
  beforeDatasetsDraw(chart) {
    const {
      ctx,
      scales: { r },
    } = chart
    if (!r) return
    const cx = r.xCenter
    const cy = r.yCenter
    const radius = r.drawingArea || Math.min(chart.width, chart.height) / 2
    const lx = -0.6
    const ly = -0.8
    const lLen = Math.hypot(lx, ly) || 1
    const Lx = lx / lLen
    const Ly = ly / lLen

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      if (meta.hidden) return
      const points = meta.data
      const baseColor = dataset.jewelBaseColor || '200, 200, 200'

      for (let i = 0; i < points.length; i++) {
        const point = points[i]
        const nextPoint = points[(i + 1) % points.length]
        const p1 = point.getProps(['x', 'y'], true)
        const p2 = nextPoint.getProps(['x', 'y'], true)
        const mx = (p1.x + p2.x) / 2
        const my = (p1.y + p2.y) / 2
        const nx = mx - cx
        const ny = my - cy
        const nLen = Math.hypot(nx, ny) || 1
        const ux = nx / nLen
        const uy = ny / nLen
        const facing = Math.max(0, ux * -Lx + uy * -Ly)

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.closePath()

        const grad = ctx.createLinearGradient(cx, cy, mx, my)
        // ① 中心ハイライト（宝石内部の強い白光）
        grad.addColorStop(0.0, `rgba(255,255,255,${0.55 + 0.25 * facing})`)
        // ② ソフトなガラス光（淡い透明層）
        grad.addColorStop(0.25, `rgba(${baseColor},${0.15 + 0.25 * facing})`)
        // ③ 色ガラスの濃い層（宝石内部の深い色）
        grad.addColorStop(0.55, `rgba(${baseColor},${0.35 + 0.45 * facing})`)
        // ④ エッジ付近に向けた明度上昇（屈折による反射強度）
        grad.addColorStop(0.78, `rgba(${baseColor},${0.55 + 0.35 * facing})`)
        // ⑤ エッジの輝き（宝石特有の光の縁）
        grad.addColorStop(1.0, `rgba(${baseColor},${0.85 + 0.15 * facing})`)
        ctx.fillStyle = grad
        ctx.shadowColor = `rgba(0,0,0,${0.18 * (1 - facing)})`
        ctx.shadowBlur = 6 + 10 * facing
        ctx.shadowOffsetX = 1.5
        ctx.shadowOffsetY = 2
        ctx.fill()
        ctx.restore()

        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        const edgeGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
        edgeGrad.addColorStop(0, `rgba(255,255,255,${0.18 + 0.25 * facing})`)
        edgeGrad.addColorStop(0.5, `rgba(255,255,255,${0.28 + 0.45 * facing})`)
        edgeGrad.addColorStop(1, `rgba(255,255,255,${0.18 + 0.25 * facing})`)
        ctx.strokeStyle = edgeGrad
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
        ctx.restore()

        if (facing > 0.65) {
          const gx = cx + (mx - cx) * 0.75
          const gy = cy + (my - cy) * 0.75
          const gr = Math.max(12, 28 * facing)
          ctx.save()
          ctx.globalCompositeOperation = 'screen'
          const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr)
          rg.addColorStop(0, `rgba(255,255,255,${0.28 + 0.22 * facing})`)
          rg.addColorStop(0.4, `rgba(255,255,255,${0.18 + 0.12 * facing})`)
          rg.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = rg
          ctx.beginPath()
          ctx.arc(gx, gy, gr, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      const polygonPath = () => {
        ctx.beginPath()
        for (let j = 0; j < points.length; j++) {
          const pj = points[j].getProps(['x', 'y'], true)
          if (j === 0) ctx.moveTo(pj.x, pj.y)
          else ctx.lineTo(pj.x, pj.y)
        }
        ctx.closePath()
      }

      ctx.save()
      polygonPath()
      ctx.globalCompositeOperation = 'screen'
      const diagGrad = ctx.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius)
      diagGrad.addColorStop(0, 'rgba(255,255,255,0.18)')
      diagGrad.addColorStop(1, 'rgba(255,255,255,0.04)')
      ctx.strokeStyle = diagGrad
      ctx.lineWidth = 1.6
      ctx.stroke()
      ctx.restore()

      ctx.save()
      polygonPath()
      ctx.clip()
      const pat = this._getNoisePattern(ctx)
      ctx.globalAlpha = 0.06
      ctx.fillStyle = pat
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      ctx.restore()
    })
  },
}

// Data
const labels = ['じぶん', 'ギフト', 'つながり', 'みらい', 'けんこう', ['あなたの', 'まわりの世界']]

const lifeCourseRadarData = computed(() => {
  const avg = result.value?.life_course_average
  if (!avg) return null

  return {
    labels: labels,
    datasets: [
      {
        label: 'Life Course',
        data: [avg.identity, avg.legacy, avg.bond, avg.future, avg.health, avg.environment],
        borderColor: '#29b6f6',
        borderWidth: 1.5,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#29b6f6',
        pointBorderWidth: 1,
        pointRadius: 2,
        jewelBaseColor: '3, 169, 244',
        fill: false,
      },
    ],
  }
})

const nowRadarData = computed(() => {
  const now = result.value?.now_profile
  if (!now) return null

  return {
    labels: labels,
    datasets: [
      {
        label: 'Current',
        data: [now.identity, now.legacy, now.bond, now.future, now.health, now.environment],
        borderColor: '#ff4dc4',
        borderWidth: 1.5,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#ff4dc4',
        pointBorderWidth: 1,
        pointRadius: 2,
        jewelBaseColor: '255, 77, 196',
        fill: false,
      },
    ],
  }
})

// Bar Chart Data
const barChartData = computed(() => {
  const contributions = result.value?.phase_contributions || []

  const formattedLabels = contributions.map((c) => {
    if (c.phaseRange === 'NOW') return '現在'
    let range = c.phaseRange.replace(/-/g, '〜').replace(/–/g, '〜')
    if (!range.includes('歳')) range += '歳'
    return range
  })

  const values = contributions.map((c) => c.contribution)

  return {
    labels: formattedLabels,
    datasets: [
      {
        label: 'Happiness',
        data: values.map((v) => [-42, v]),
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart
          if (!chartArea) return '#b39ddb'
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
          gradient.addColorStop(0, '#7e57c2')
          gradient.addColorStop(1, '#d1c4e9')
          return gradient
        },
        borderColor: '#5e35b1',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  }
})

// Radar Options
const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      min: -1.0,
      max: 1.0,
      ticks: {
        display: false,
        stepSize: 0.5,
      },
      grid: {
        color: 'rgba(200, 200, 200, 0.3)',
        circular: true,
      },
      angleLines: {
        color: 'rgba(200, 200, 200, 0.3)',
      },
      pointLabels: {
        font: {
          size: 11,
          family: "'Hiragino Mincho ProN', 'Yu Mincho', serif",
          weight: 'bold',
        },
        color: '#5d4037',
        display: true,
        padding: 5,
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  layout: {
    padding: 0,
  },
}

// Bar Options
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: -42,
      max: 42,
      ticks: {
        stepSize: 12,
        color: '#6a5b4a',
        font: {
          size: 10,
        },
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
      },
      border: { display: true },
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: '#4a3b2a',
        font: {
          family: "'Hiragino Mincho ProN', 'Yu Mincho', serif",
          weight: 'bold',
          size: 11,
        },
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (context) => {
          const raw = context.raw
          return `${context.dataset.label}: ${raw[1]}`
        },
      },
    },
  },
}
</script>

<template>
  <div class="results-view paper-sheet">
    <div class="common-content-wrapper result-layout">
      <!-- Header (Outside Container) -->
      <div class="result-header">
        <h1 class="main-title">総合結果</h1>
      </div>

      <!-- Card Container for Charts -->
      <div class="common-info-card result-card">
        <p class="subtitle">
          おつかれさまでした。<br />
          あなたの「しあわせのかたち」を見てみましょう。
        </p>

        <!-- Radars Section -->
        <div class="radars-container">
          <!-- NOW Radar -->
          <div class="radar-block">
            <h2 class="block-title">
              <span>現在のかたち</span>
            </h2>
            <div class="chart-box">
              <Radar
                v-if="nowRadarData"
                :data="nowRadarData"
                :options="radarOptions"
                :plugins="[jewelPlugin]"
              />
            </div>
          </div>

          <!-- Life Course Radar -->
          <div class="radar-block">
            <h2 class="block-title">
              <span>これまでの人生のかたち</span>
            </h2>
            <div class="chart-box">
              <Radar
                v-if="lifeCourseRadarData"
                :data="lifeCourseRadarData"
                :options="radarOptions"
                :plugins="[jewelPlugin]"
              />
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="section-divider"></div>

        <!-- Bar Chart Section -->
        <div class="bar-section">
          <h2 class="block-title">
            <span>年代別</span>
          </h2>
          <div class="bar-wrapper">
            <Bar v-if="barChartData" :data="barChartData" :options="barChartOptions" />
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="common-action-buttons result-footer-btns">
        <v-btn
          @click="handleBack"
          class="common-action-btn back-btn"
          color="white"
          variant="flat"
          height="48"
        >
          戻る
        </v-btn>

        <v-btn
          @click="goToFinish"
          class="common-action-btn next-btn"
          color="#4e3b30"
          theme="dark"
          variant="flat"
          height="48"
        >
          次へ
        </v-btn>
      </div>
      <div class="mobile-spacer"></div>
    </div>
  </div>
</template>

<style scoped>
/* Footer Buttons Layout */
.result-footer-btns {
  width: 100%;
  max-width: 900px;
  display: flex !important;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
}

.result-footer-btns .common-action-btn {
  width: 140px;
  font-weight: bold;
}

.back-btn {
  color: #8d6e63 !important;
  border: 1px solid #8d6e63 !important;
}

@media (max-width: 600px) {
  .result-footer-btns {
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    gap: 0.8rem !important;
    margin-bottom: 5rem !important;
  }
  .result-footer-btns .common-action-btn {
    flex: 1 !important;
    width: auto !important;
    min-width: 0 !important;
    max-width: 48% !important;
    height: 36px !important;
    font-size: 0.8rem !important;
    padding: 0 !important;
    letter-spacing: 0 !important;
  }

  .common-content-wrapper.result-layout {
    padding-bottom: 8rem !important;
  }
}

.results-view {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.common-content-wrapper.result-layout {
  max-width: 1000px !important;
  width: 95%;
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

/* Header Styles */
.result-header {
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
}

.main-title {
  font-family: 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  font-size: 2.2rem;
  color: #4e3b30;
  margin-bottom: 0.5rem;
  letter-spacing: 0.15em;
}

.title-underline {
  width: 60px;
  height: 3px;
  background-color: #d7ccc8;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1rem;
  color: #6a5b4a;
  line-height: 1.8;
  letter-spacing: 0.05em;
  text-align: center;
  margin-bottom: 3rem;
}

/* Card Styles */
.result-card {
  width: 100%;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.radars-container {
  display: flex;
  justify-content: center;
  gap: 3rem;
  width: 100%;
  flex-wrap: wrap;
}

.radar-block {
  flex: 1;
  min-width: 300px;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (max-width: 600px) {
  .main-title {
    font-size: 1.7rem;
  }

  .subtitle {
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }

  .radars-container {
    gap: 0.5rem !important;
  }

  .block-title {
    font-size: 0.95rem !important;
    margin-bottom: 0.2rem !important;
    white-space: nowrap;
  }

  .radar-block {
    min-width: 100%;
    margin-bottom: -1rem !important;
  }
  .chart-box {
    height: 200px !important;
    margin-top: -10px;
  }
}

.block-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #4e3b30;
  margin-bottom: 1.5rem;
  text-align: center;
}

.block-title span {
  display: inline-block;
  border-bottom: 2px solid #d7ccc8;
  padding-bottom: 8px;
}

.chart-box {
  width: 100%;
  height: 420px;
}

/* Bar Section */
.bar-section {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-wrapper {
  width: 100%;
  height: 350px;
}

.section-divider {
  width: 90%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 0 0 1rem 0;
}

@media (max-width: 900px) {
  .radars-container {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem !important;
  }
  .radar-block {
    width: 100%;
    min-width: unset;
    max-width: 600px;
    margin-bottom: 0 !important;
  }
}

.mobile-spacer {
  display: none;
}
@media (max-width: 768px) {
  .mobile-spacer {
    display: block;
    width: 100%;
    height: 100px;
    flex-shrink: 0;
  }
}
</style>
