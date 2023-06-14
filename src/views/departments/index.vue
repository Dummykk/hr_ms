<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card>
        <tree-tools :tree-node="company" :is-root="true" @addDept="addDept" />
        <el-tree
          :data="departs"
          :props="defaultProps"
          default-expand-all="true"
          :expand-on-click-node="false"
        >
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDept="getDepartments" @addDept="addDept" @editDept="editDept" />
        </el-tree>
        <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" :dialog-title="dialogTitle" @addDept="getDepartments" />
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTree } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name'
      },
      showDialog: false,
      node: null,
      loading: false,
      dialogTitle: ''
    }
  },

  created() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      this.loading = true
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTree(res.depts, '')
      this.loading = false
    },

    addDept(node) {
      this.dialogTitle = '添加子部门'
      this.showDialog = true
      this.node = node
    },

    editDept(node) {
      this.dialogTitle = '编辑部门'
      this.showDialog = true
      this.node = node
      this.$refs.addDept.getDepartDetail(this.node.id)
    }
  }
}
</script>

<style>
</style>
