         <style lang="less">
@import "./memberManage.less";
</style>
<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row>
                        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
                            <Form-item label="会员名称" prop="memberName">
                              <Input type="text" v-model="searchForm.memberName" clearable placeholder="请输入会员名称" style="width: 200px"/>
                            </Form-item>
                            <Form-item label="昵称" prop="alias">
                              <Input type="text" v-model="searchForm.alias" clearable placeholder="请输入昵称" style="width: 200px"/>
                            </Form-item>
                            <Form-item label="手机号码" prop="mobilePhone">
                              <Input type="text" v-model="searchForm.mobilePhone" clearable placeholder="请输入手机号码" style="width: 200px"/>
                            </Form-item>
                            <span v-if="drop">
                              <Form-item label="邮箱" prop="email">
                                <Input type="text" v-model="searchForm.email" clearable placeholder="请输入邮箱" style="width: 200px"/>
                              </Form-item>
                              <Form-item label="QQ号码" prop="qq">
                                <Input type="text" v-model="searchForm.qq" clearable placeholder="请输入QQ号码" style="width: 200px"/>
                              </Form-item>
                              <Form-item label="性别" prop="sex">
                                <Select v-model="searchForm.sex" placeholder="请选择" clearable style="width: 200px">
                                  <Option value="0">女</Option>
                                  <Option value="1">男</Option>
                                </Select>
                              </Form-item>
                              <Form-item label="出生日期" prop="birthday">
                                <!-- <Input type="text" v-model="searchForm.birthday" clearable placeholder="请输入出生日期" style="width: 200px"/> -->
                                <DatePicker type="daterange" format="yyyy-MM-dd" placement="bottom-end" clearable @on-change="selectBirthdayDateRange" placeholder="请输入出生日期" style="width: 200px"></DatePicker>
                              </Form-item>
                              <!-- <Form-item label="创建时间" prop="status"> -->
                              <Form-item label="创建时间" prop="createTime">
                                <DatePicker type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
                              </Form-item>
                            </span>
                            <Form-item style="margin-left:-35px;">
                              <Button @click="handleSearch" type="primary" icon="search">搜索</Button>
                              <Button @click="handleReset" type="ghost" >重置</Button>
                              <a class="drop-down" @click="dropDown">{{dropDownContent}}
                                <Icon :type="dropDownIcon"></Icon>
                              </a>
                            </Form-item>
                        </Form>
                    </Row>
                    <Row class="operation">
                        <Button @click="addMember" type="primary" icon="plus-round">添加会员</Button>
                        <Button @click="delAll" type="ghost" icon="trash-a">批量删除</Button>
                        <Dropdown @on-click="handleDropdown">
                          <Button type="ghost">
                              更多操作
                              <Icon type="arrow-down-b"></Icon>
                          </Button>
                          <DropdownMenu slot="list">
                              <DropdownItem name="refresh">刷新</DropdownItem>
                              <DropdownItem name="exportData">导出所选数据</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                    </Row>
                    <Row>
                        <Alert show-icon>
                            已选择 <span class="select-count">{{selectCount}}</span> 项
                            <a class="select-clear" @click="clearSelectAll">清空</a>
                        </Alert>
                    </Row>
                    <Row class="margin-top-10 searchable-table-con1">
                        <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
                        <Table :columns="columns" :data="exportData" ref="exportTable" style="display:none"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="code-row-bg page">
                        <Page :current="this.searchForm.pageNumber" :total="total" :page-size="this.searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal :title="modalTitle" v-model="memberModalVisible" :mask-closable='false' :width="500">
            <Form ref="memberForm" :model="memberForm" :label-width="70" :rules="memberFormValidate">
                <FormItem label="会员名称" prop="memberName">
                    <Input v-model="memberForm.memberName"/>
                </FormItem>
                <FormItem label="昵称" prop="alias">
                    <Input v-model="memberForm.alias"/>
                </FormItem>
                <FormItem label="密码" prop="password" v-if="modalType===0" :error="errorPass">
                    <Input type="password" v-model="memberForm.password"/>
                </FormItem>
                <FormItem label="手机号码" prop="mobilePhone">
                    <Input v-model="memberForm.mobilePhone" :maxlength="11"/>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                    <Input v-model="memberForm.email"/>
                </FormItem>
                <FormItem label="QQ号码" prop="qq">
                    <Input v-model="memberForm.qq"/>
                </FormItem>
                <FormItem label="性别" prop="sex">
                  <RadioGroup v-model="memberForm.sex">
                    <Radio :label="1">男</Radio>
                    <Radio :label="0">女</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="出生日期" prop="birthday">
                    <!-- <DatePicker v-model="memberForm.birthday" type="date" @on-change="memberForm.birthday=$event" placeholder="" style="width: 200px"></DatePicker> -->
                    <DatePicker v-model="memberForm.birthday" type="date" placeholder="" style="width: 200px"></DatePicker>
                </FormItem>        
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelMember">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitMember">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

import dateFormatUtil from "@/utils/dateFormatUtil";

export default {
  name: "member-manage",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    const validateMemberNameNoBlank = (rule, value, callback) => {
      var validObj = rule.validObj;
      // var reg = /\s+/g;  //注意：正则规则不带引号 所以对象中传入也不能带引号 
      // var reg = new RegExp(/\s+/g); //不使用new RegExp 时灵时不灵
      var reg = new RegExp(validObj.regexp);
      if (reg.test(value)) {
        callback(new Error(validObj.msg));
      } else {
        callback();
      }
    };
    return {
      loading: true,
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "chevron-down",
      selectCount: 0,
      selectList: [],
      searchForm: {
        memberName: "",
        alias: "",
        mobilePhone: "",
        email: "",
        qq: "",
        sex: "",
        startBirthday: "",
        endBirthday: "",
        status: "",
        pageNumber: 1,
        pageSize: 10,
        sort: "createTime",
        order: "desc",
        startDate: "",
        endDate: ""
      },
      modalType: 0,
      memberModalVisible: false,
      modalTitle: "",
      memberForm: {
        sex: 1,
        type: 0
      },
      userRoles: [],
      roleList: [],
      errorPass: "",
      memberFormValidate: {
        memberName: [
          { required: true, message: "会员名称不能为空", trigger: "blur" },
          { max: 64, message: '会员名称太长'},
          // { validator: 'regexp', pattern: /\s+/g, message: '会员名称不允许包含空格',trigger: "change,blur"}
          { validator: validateMemberNameNoBlank, validObj:{regexp:/\s+/g,msg:"会员名称不允许包含空格"} ,trigger: "blur"}
        ],
        alias: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
          { max: 64, message: '昵称太长'}
          // { validator: validateMemberNameNoBlank, validObj:{regexp:/\s+/g,msg:"昵称不允许包含空格"} ,trigger: "blur"}
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符'}
        ],
        mobilePhone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址" },
          { type: "email", message: "邮箱格式不正确" }
        ],
        qq: [
          { max: 20, message: 'QQ号码太长（不超20个字符）'}
        ]
      },
      submitLoading: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "会员名称",
          key: "memberName",
          width: 120,
          sortable: true
        },
        {
          title: "昵称",
          key: "alias",
          width: 120,
          sortable: true
        },
        {
          title: "手机",
          key: "mobilePhone",
          width: 120,
          sortable: true
        },
        {
          title: "邮箱",
          key: "email",
          width: 160,
          sortable: true
        },
        {
          title: "QQ",
          key: "qq",
          width: 120,
          sortable: true
        },
        {
          title: "性别",
          key: "sex",
          width: 70,
          align: "center",
          render: (h, params) => {
            let re = "";
            if (params.row.sex === 1) {
              re = "男";
            } else if (params.row.sex === 0) {
              re = "女";
            }
            return h("div", re);
          }
        },
        {
          title: "出生日期",
          key: "birthday",
          width: 150,
          sortable: true
        },
        {
          title: "等级积分",
          key: "rankPoints",
          align: "center",
          width: 100
        },
        {
          title: "消费积分",
          key: "payPoints",
          align: "center",
          width: 100
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          width: 150,
          render: (h, params) => {
            let re = "";
            if (params.row.status === 0) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "green"
                    }
                  },
                  "正常启用"
                )
              ]);
            } else if (params.row.status === -1) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "red"
                    }
                  },
                  "禁用"
                )
              ]);
            }
          },
          filters: [
            {
              label: "正常启用",
              value: 0
            },
            {
              label: "禁用",
              value: -1
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 0) {
              return row.status === 0;
            } else if (value === -1) {
              return row.status === -1;
            }
          }
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: true,
          sortType: "desc",
          width: 150
        },
        {
          title: "操作",
          key: "action",
          width: 240,
          align: "center",
          render: (h, params) => {
            if (params.row.status === 0) {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "ghost",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.disable(params.row);
                      }
                    }
                  },
                  "禁用"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.remove(params.row);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            } else {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.enable(params.row);
                      }
                    }
                  },
                  "启用"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.remove(params.row);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          }
        }
      ],
      data: [],
      exportData: [],
      total: 0
    };
  },
  methods: {
    init() {
      this.getMemberList();
      this.cleanSelectCount();
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getMemberList();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getMemberList();
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    selectBirthdayDateRange(v) {
      if (v) {
        this.searchForm.startBirthday = v[0];
        this.searchForm.endBirthday = v[1];
      }
    },
    getMemberList() {
      this.loading = true;      
      this.getRequest("/member/list", this.searchForm).then(res => {  
        this.loading = false;
        if (res.success === true) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.init();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      // 重新加载数据
      this.init();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.init();
    },
    getRoleList() {
      this.getRequest("/role/getAllList").then(res => {
        if (res.success === true) {
          this.roleList = res.result;
        }
      });
    },
    handleDropdown(name) {
      if (name === "exportData") {
        if (this.selectCount <= 0) {
          this.$Message.warning("您还未选择要导出的数据");
          return;
        }
        this.$Modal.confirm({
          title: "确认导出",
          content: "您确认要导出所选 " + this.selectCount + " 条数据?",
          onOk: () => {
            this.$refs.exportTable.exportCsv({
              filename: "用户数据"
            });
          }
        });
      } else if (name === "refresh") {
        this.getMemberList();
      }
    },
    selectRoles(v) {},
    cancelMember() {
      this.memberModalVisible = false;
    },
    submitMember() {
      this.$refs.memberForm.validate(valid => {
        if (valid) {
          let url = "";
          if(this.memberForm.birthday){
            this.memberForm.birthday = dateFormatUtil.format(new Date(this.memberForm.birthday),"yyyy-MM-dd");
          }
          if (this.modalType === 1) {
                // var supplierId = this.
            // 编辑用户
            url = "/member/updateAll";
            this.submitLoading = true;
            this.putRequest(url, this.memberForm).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("更新操作成功");
                this.init();
                this.memberModalVisible = false;
              }
            });
          }else{
            url = "/member/create";
            this.submitLoading = true;
            var createMember = this.memberForm;
            delete createMember.id;
            if(createMember.payPoints) delete createMember.payPoints;
            if(createMember.rankPoints) delete createMember.rankPoints;
            this.postRequest(url, createMember).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.init();
                this.memberModalVisible = false;
              }
            });
          }

        }
      });
    },
    addMember(v) {
      this.modalType = 0;
      this.modalTitle = "添加会员";
      this.$refs.memberForm.resetFields();
      for (let attr in this.memberForm) {
        if (this.memberForm[attr] == null) {
          this.memberForm[attr] = "";
        }
      }
      this.memberModalVisible = true;
    },
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑会员";
      this.$refs.memberForm.resetFields();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let userInfo = JSON.parse(str);
      this.memberForm = userInfo;
      // let selectRolesId = [];
      // this.memberForm.roles.forEach(function(e) {
      //   selectRolesId.push(e.id);
      // });
      // this.memberForm.roles = selectRolesId;
      this.memberModalVisible = true;
    },
    enable(v) {
      this.$Modal.confirm({
        title: "确认启用",
        content: "您确认要启用用户 " + v.memberName + " ?",
        onOk: () => {
          this.postRequest("/member/enable/" + v.id).then(res => {
            if (res.success === true) {
              this.$Message.success("操作成功");
              this.init();
            }
          });
        }
      });
    },
    disable(v) {
      this.$Modal.confirm({
        title: "确认禁用",
        content: "您确认要禁用用户 " + v.memberName + " ?",
        onOk: () => {
          this.postRequest("/member/disable/" + v.id).then(res => {
            if (res.success === true) {
              this.$Message.success("操作成功");
              this.init();
            }
          });
        }
      });
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除用户 " + v.memberName + " ?",
        onOk: () => {
          this.deleteRequest("/member/delete/" + v.id).then(res => {
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.init();
            }
          });
        }
      });
    },
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "chevron-down";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "chevron-up";
      }
      this.drop = !this.drop;
    },
    showSelect(e) {
      this.exportData = e;
      this.selectList = e;
      this.selectCount = e.length;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
      this.cleanSelectCount();
    },
    cleanSelectCount(){
      this.selectCount = 0;
    },
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          this.deleteRequest("/member/delete/" + ids).then(res => {
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.init();
            }
          });
        }
      });
    }
  },
  mounted() {
    this.init();
    // this.getRoleList();
  }
};
</script>