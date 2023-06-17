<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="showDialog=true;dialogTitle='新增角色信息'"
              >新增角色</el-button>
            </el-row>
            <el-table :data="roleList" border="" height="218">
              <el-table-column label="序号" width="120" align="center" type="index" />
              <el-table-column label="角色名称" width="240" align="center" prop="name" />
              <el-table-column label="描述" align="center" prop="description" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                  <el-button type="success" size="small" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button type="primary" size="small" @click="editRole(row.id)">编辑</el-button>
                  <el-button type="danger" size="small" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <el-pagination
                layout="prev, pager, next"
                :current-page="pageInfo.page"
                :page-size="pageInfo.pagesize"
                :total="pageInfo.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="warning"
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px;">
              <el-form-item label="公司名称">
                <el-input v-model="companyInfo.name" disabled style="width: 400px;" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyInfo.companyAddress" disabled style="width: 400px;" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyInfo.mailbox" disabled style="width: 400px;" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width: 400px;" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog :title="dialogTitle" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" style="width: 80%;" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" style="width: 80%;" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-row>
    </el-dialog>
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        default-expand-all="true"
        node-key="id"
        show-checkbox
        check-strictly="true"
        :default-checked-keys="selectPerms"
      />
      <el-row type="flex" justify="center">
        <el-button type="primary" @click="btnPermOK()">确定</el-button>
        <el-button @click="btnPermCancel">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getCompanyInfo, getRoleList, deleteRole, getRoleDetail, editRole, addRole } from '@/api/setting'
import { getPermissionList, assignPermission } from '@/api/permission'
import { tranListToTree } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      roleList: [],
      pageInfo: {
        page: 1,
        pagesize: 3,
        total: 0
      },
      companyInfo: {},
      showDialog: false,
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      dialogTitle: '',
      showPermDialog: false,
      permData: [],
      defaultProps: { label: 'name' },
      selectPerms: [],
      roleId: null
    }
  },

  computed: {
    ...mapGetters(['companyId'])
  },

  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },

  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.pageInfo)
      this.pageInfo.total = total
      this.roleList = rows
    },

    changePage(newPage) {
      this.pageInfo.page = newPage
      this.getRoleList()
    },

    async getCompanyInfo() {
      const res = await getCompanyInfo(this.companyId)
      this.companyInfo = res[0]
    },

    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteRole(id)
        if (this.pageInfo.total % this.pageInfo.pagesize === 1 && this.pageInfo.page === Math.ceil(this.pageInfo.total / this.pageInfo.pagesize)) {
          this.pageInfo.page--
        }
        this.getRoleList()
        this.$message.success('删除成功！')
      } catch (error) {
        console.log(error)
      }
    },

    async editRole(id) {
      this.dialogTitle = '编辑角色信息'
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },

    btnOK() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (this.roleForm.id) {
            await editRole(this.roleForm)
          } else {
            await addRole(this.roleForm)
            await this.getRoleList()
            this.pageInfo.page = Math.ceil(this.pageInfo.total / this.pageInfo.pagesize)
          }
          this.getRoleList()
          this.$message.success('操作成功！')
          this.showDialog = false
        }
      })
    },

    btnCancel() {
      this.roleForm = {}
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },

    async assignPerm(id) {
      this.permData = tranListToTree(await getPermissionList(), '0')
      this.roleId = id
      const { permIds } = await getRoleDetail(id)
      this.selectPerms = permIds
      this.showPermDialog = true
    },

    async btnPermOK() {
      await assignPermission({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('权限分配成功！')
      this.showPermDialog = false
    },

    btnPermCancel() {
      this.showPermDialog = false
      this.selectPerms = []
    }
  }
}
</script>

<style>
</style>
