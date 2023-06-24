<template>
  <div ref="myChart" style="width: 600px; height: 400px;" />
</template>

<script>
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  RadarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])
export default {
  mounted() {
    const myChart = echarts.init(this.$refs.myChart)
    myChart.setOption({
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [79, 86, 97, 68, 70, 88]
            }
          ]
        }
      ]
    })
  }
}
</script>

<style>

</style>
