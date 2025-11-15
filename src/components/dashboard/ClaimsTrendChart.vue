<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { ECharts, EChartsOption } from 'echarts'
import BaseCard from '@/components/base/BaseCard.vue'

// Register ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
])

interface TrendData {
  date: string
  total: number
  flagged: number
  highRisk: number
}

interface Props {
  data: TrendData[]
  title?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Claims Trend',
  loading: false
})

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ECharts | null = null

const chartData = computed(() => {
  return {
    dates: props.data.map(d => d.date),
    total: props.data.map(d => d.total),
    flagged: props.data.map(d => d.flagged),
    highRisk: props.data.map(d => d.highRisk)
  }
})

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Total Claims', 'Flagged Claims', 'High Risk'],
      bottom: 0,
      textStyle: {
        fontSize: 12,
        fontFamily: 'Inter, sans-serif'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.dates,
      axisLabel: {
        fontSize: 11,
        fontFamily: 'Inter, sans-serif'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 11,
        fontFamily: 'Inter, sans-serif'
      }
    },
    series: [
      {
        name: 'Total Claims',
        type: 'line',
        data: chartData.value.total,
        smooth: true,
        lineStyle: {
          color: '#0ea5e9', // primary-500
          width: 2
        },
        itemStyle: {
          color: '#0ea5e9'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(14, 165, 233, 0.3)' },
              { offset: 1, color: 'rgba(14, 165, 233, 0.05)' }
            ]
          }
        }
      },
      {
        name: 'Flagged Claims',
        type: 'line',
        data: chartData.value.flagged,
        smooth: true,
        lineStyle: {
          color: '#f59e0b', // amber-500
          width: 2
        },
        itemStyle: {
          color: '#f59e0b'
        }
      },
      {
        name: 'High Risk',
        type: 'line',
        data: chartData.value.highRisk,
        smooth: true,
        lineStyle: {
          color: '#ef4444', // red-500
          width: 2
        },
        itemStyle: {
          color: '#ef4444'
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

const updateChart = () => {
  if (!chartInstance) return

  chartInstance.setOption({
    xAxis: {
      data: chartData.value.dates
    },
    series: [
      { data: chartData.value.total },
      { data: chartData.value.flagged },
      { data: chartData.value.highRisk }
    ]
  })
}

const handleResize = () => {
  chartInstance?.resize()
}

// Watchers
watch(() => props.data, updateChart, { deep: true })

// Lifecycle
onMounted(() => {
  if (!props.loading) {
    initChart()
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

watch(() => props.loading, (isLoading) => {
  if (!isLoading && !chartInstance) {
    initChart()
  }
})
</script>

<template>
  <BaseCard>
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h3>

      <div v-if="loading" class="flex items-center justify-center h-80">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>

      <div
        v-else-if="data.length === 0"
        class="flex items-center justify-center h-80 text-gray-500"
      >
        <p class="text-sm">No trend data available</p>
      </div>

      <div v-else ref="chartRef" class="h-80"></div>
    </div>
  </BaseCard>
</template>
