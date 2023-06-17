<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <el-card>
        <el-table
          border
          :data="permissionList"
          default-expand-all
          row-key="id"
        >
          <el-table-column
            prop="name"
            label="名称"
          />
          <el-table-column
            prop="code"
            align="center"
            label="标识"
          />
          <el-table-column
            prop="description"
            align="center"
            label="描述"
          />
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="{row}">
              <el-button v-if="row.type==1" type="text" @click="addPermission(2, row.id)">添加</el-button>
              <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
              <el-button type="text" @click="delPermission(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog :title="dialogTitle" :visible="showDialog" @close="btnCancle">
      <el-form ref="perForm" :rules="rules" :model="formData" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-button type="primary" @click="btnOK">确认</el-button>
        <el-button @click="btnCancle">取消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, getPermissionDetail, updatePermission, delPermission } from '@/api/permission'
import { tranListToTree } from '@/utils'
export default {
  data() {
    return {
      permissionList: [],
      showDialog: false,
      formData: {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: ''
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      dialogTitle: ''
    }
  },

  created() {
    this.getPermissionList()
  },

  methods: {
    async  getPermissionList() {
      this.permissionList = tranListToTree(await getPermissionList(), '0')
    },

    addPermission(type, pid) {
      this.formData.pid = type
      this.formData.pid = pid
      this.dialogTitle = '添加权限'
      this.showDialog = true
    },

    async editPermission(id) {
      this.dialogTitle = '编辑权限'
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },

    async btnOK() {
      try {
        await this.$refs.perForm.validate()
        if (this.formData.id) {
          await updatePermission(this.formData)
          this.$message.success('编辑成功！')
        } else {
          await addPermission(this.formData)
          this.$message.success('添加成功！')
        }
        this.getPermissionList()
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },

    btnCancle() {
      setTimeout(() => {
        this.formData = {
          name: '',
          code: '',
          description: '',
          type: '',
          pid: '',
          enVisible: ''
        }
        this.$refs.perForm.resetFields()
      }, 200)
      this.showDialog = false
    },

    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该权限吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delPermission(id)
        this.$message.success('删除成功！')
        this.getPermissionList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>
