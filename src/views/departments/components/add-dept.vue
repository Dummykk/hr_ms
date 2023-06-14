<template>
  <el-dialog :title="dialogTitle" :visible="showDialog" @close="btnCancel">
    <el-form ref="formData" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="1-50个字符"
          style="width: 80%"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="1-50个字符"
          style="width: 80%"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          placeholder="请选择"
          style="width: 80%"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in managers"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          type="textarea"
          placeholder="1-300个字符"
          style="width: 80%"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      <el-button size="small" @click="btnCancel">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, editDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    },
    dialogTitle: {
      type: String,
      required: true
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isReapet = false
      if (this.formData.id) {
        isReapet = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        isReapet = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value)
      }
      isReapet ? callback(new Error(`该级别下已经存在${value}`)) : callback()
    }

    const checkCodeReapet = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isReapet = false
      if (this.formData.id) {
        isReapet = depts.some(item => item.id !== this.treeNode.id && item.code === value && value)
      } else {
        isReapet = depts.some((item) => item.code === value && value)
      }
      isReapet ? callback(new Error(`组织架构中编码${value}已被使用`))
        : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          { validator: checkCodeReapet, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      },
      managers: []
    }
  },

  methods: {
    async getEmployeeSimple() {
      this.managers = await getEmployeeSimple()
    },

    btnOK() {
      this.$refs.formData.validate(async valid => {
        if (valid) {
          if (this.formData.id) {
            await editDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDept')
          this.$emit('update:showDialog', false)
        }
      })
    },

    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.formData.resetFields()
      this.$emit('update:showDialog', false)
    },

    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style>
</style>
