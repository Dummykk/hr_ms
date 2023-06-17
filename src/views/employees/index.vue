<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <template v-slot:before>
          <span slot="before">共{{ pageInfo.total }}条记录</span>
        </template>
        <template v-slot:after>
          <el-button size="small" type="primary" plain @click="$router.push('/import?type=user')">导入</el-button>
          <el-button size="small" type="success" plain @click="exportData">导出</el-button>
          <el-button :disabled="!checkPermission('POINT-ADD-EMPLOYEE')" size="small" type="warning" plain @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <el-card>
        <el-table v-loading="loading" border="" :data="employeeList" height="374">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            sortable=""
          />
          <el-table-column
            prop="username"
            label="姓名"
            align="center"
            sortable=""
          />
          <el-table-column
            prop="workNumber"
            label="工号"
            align="center"
            sortable=""
          />
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
            align="center"
            sortable=""
            :formatter="formatEmployment"
          />
          <el-table-column
            prop="departmentName"
            label="部门"
            align="center"
            sortable=""
          />
          <el-table-column
            prop="timeOfEntry"
            label="入职时间"
            align="center"
            sortable=""
          >
            <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="enableState"
            label="账户状态"
            align="center"
            sortable=""
          >
            <template slot-scope="{row}">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="290"
            align="center"
            fixed="right"
          >
            <template slot-scope="{row}">
              <el-button type="text" size="medium" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="medium">转正</el-button>
              <el-button type="text" size="medium">调岗</el-button>
              <el-button type="text" size="medium">离职</el-button>
              <el-button type="text" size="medium" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="medium" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" align="bottom" style="height: 60px">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pageInfo.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <add-employee :show-dialog.sync="showDialog" />
      <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import AssignRole from './components/assign-role.vue'
export default {
  components: {
    AddEmployee,
    AssignRole
  },

  data() {
    return {
      employeeList: [],
      pageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false,
      showRoleDialog: false,
      userId: null
    }
  },

  created() {
    this.getEmployeeList()
  },

  methods: {
    changePage(newPage) {
      this.pageInfo.page = newPage
      this.getEmployeeList()
    },

    async getEmployeeList() {
      this.loading = true
      const res = await getEmployeeList(this.pageInfo)
      this.employeeList = res.rows
      this.pageInfo.total = res.total
      this.loading = false
    },

    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === +cellValue)
      return obj ? obj.value : '未知'
    },

    async delEmployee(id) {
      try {
        await this.$confirm('确认删除该员工吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delEmployee(id)
        if (this.pageInfo.total % this.pageInfo.size === 1 && this.pageInfo.page === Math.ceil(this.pageInfo.total / this.pageInfo.size)) {
          this.pageInfo.page--
        }
        this.getEmployeeList()
        this.$message.success('删除成功！')
      } catch (error) {
        console.log(error)
      }
    },

    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      import ('@/vendor/Export2Excel').then(async excel => {
        const { rows } = await getEmployeeList({ page: 1, size: this.pageInfo.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          multiHeader,
          merges
        })
      })
    },

    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const en = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },

    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>
</style>
