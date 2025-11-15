<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import type { ECharts, EChartsOption } from 'echarts'
import BaseCard from '@/components/base/BaseCard.vue'

// Register ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
])

interface Props {
  data: {
    high: number
    medium: number
    low: number
  }
  title?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Risk Distribution',
  loading: false
})

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ECharts | null = null

const chartData = computed(() => [
  {
    value: props.data.high,
    name: 'High Risk',
    itemStyle: {
      color: '#ef4444' // red-500
    }
  },
  {
    value: props.data.medium,
    name: 'Medium Risk',
    itemStyle: {
      color: '#f59e0b' // amber-500
    }
  },
  {
    value: props.data.low,
    name: 'Low Risk',
    itemStyle: {
      color: '#3b82f6' // blue-500
    }
  }
])

const total = computed(() => props.data.high + props.data.medium + props.data.low)

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        fontSize: 12,
        fontFamily: 'Inter, sans-serif'
      }
    },
    series: [
      {
        name: 'Risk Level',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c} ({d}%)',
          fontSize: 12,
          fontFamily: 'Inter, sans-serif'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: chartData.value
      }
    ]
  }

  chartInstance.setOption(option)
}

const updateChart = () => {
  if (!chartInstance) return

  chartInstance.setOption({
    series: [
      {
        data: chartData.value
      }
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
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-500">
          Total: {{ total.toLocaleString() }} claims
        </p>
      </div>

      <div v-if="loading" class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>

      <div
        v-else-if="total === 0"
        class="flex items-center justify-center h-64 text-gray-500"
      >
        <p class="text-sm">No data available</p>
      </div>

      <div v-else ref="chartRef" class="h-64"></div>
    </div>
  </BaseCard>
</template>
