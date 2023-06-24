<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width:120px" @change="dateChange">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width:120px; margin-left: 10px;" @change="dateChange">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <template v-slot:dateCell="{date, data}">
        <div class="date-content">
          <span class="text" :class="data.isSelected ? 'is-selected': ''">{{ data.day | getDay }}</span>
          <span v-if="isWeekend(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: null,
      currentYear: null,
      currentDate: null,
      yearList: []
    }
  },
  created() {
    this.currentMonth = this.startDate.getMonth() + 1
    this.currentYear = this.startDate.getFullYear()
    this.yearList = Array.from(Array(11), (value, index) => this.currentYear + index - 5)
    this.dateChange()
  },

  methods: {
    dateChange() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-${this.startDate.getDate()}`)
    },

    isWeekend(value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-calendar-day {
    height:  auto;
}

::v-deep .el-calendar-table__row td,
::v-deep .el-calendar-table tr td:first-child,
::v-deep .el-calendar-table__row td.prev {
    border:none;
}

::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
}

::v-deep .el-calendar__header {
   display: none
}

.date-content {
    position: relative;
    height: 40px;
    line-height: 40px;
    text-align: center;
}

.date-content .rest {
    position: absolute;
    right: 3px;
    width: 20px;
    height: 20px;line-height: 20px;
    background: green;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
}

.date-content .is-selected {
    background:  inherit !important;
    color: #000 !important;
    border-radius: 0% !important;
}

::v-deep td.is-selected {
    background-color: inherit;
    .date-content{
    background-color: orange;
}
}

::v-deep .el-calendar-table .el-calendar-day{
    .date-content {
        border-radius: 50%;
    }
    &:hover {
        background:  inherit;
        cursor: pointer;
    }

}
</style>
