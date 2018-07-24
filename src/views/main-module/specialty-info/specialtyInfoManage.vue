         <style lang="less">
@import "./specialtyInfoManage.less";
</style>
<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row>
                        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
                            <Form-item label="商品名称" prop="goodsName" >
                              <Input type="text" v-model="searchForm.goodsName" clearable placeholder="请输入商品名称" style="width: 200px;" />
                            </Form-item>
                            <Form-item label="商品编号" prop="goodsSn" >
                              <Input type="text" v-model="searchForm.goodsSn" clearable placeholder="请输入商品编号" style="width: 200px;"/>
                            </Form-item>
                            <!-- <span v-if="drop">
                              <Form-item label="状态" prop="status">
                                <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
                                  <Option value="0">未审核通过</Option>
                                   <Option value="-1">审核未通过</Option>
                                  <Option value="1">审核通过</Option>
                                </Select>
                              </Form-item>
                            </span> -->
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
                        <Button @click="addgoods" type="primary" icon="plus-round">添加特产</Button>
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
                        <Page :current="this.goodsForm.pageNumber" :total="total" :page-size="this.goodsForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal :title="modalTitle" v-model="goodsModalVisible" :mask-closable='false' :width="500">
            <Form ref="goodsForm" :model="goodsForm" :label-width="70" >
                <FormItem label="商品名称" prop="goodsName">
                    <Input v-model="goodsForm.goodsName"/>
                </FormItem>
                <FormItem label="商品编号" prop="goodsSn">
                    <Input v-model="goodsForm.goodsSn"/>
                </FormItem>
                <FormItem label="市场价" prop="marketPrice" >
                    <Input v-model="goodsForm.marketPrice"/>
                </FormItem>
                <FormItem label="平台售价" prop="shopPrice">
                    <Input v-model="goodsForm.shopPrice" :maxlength="11"/>
                </FormItem>
                <FormItem label="促销价" prop="promotePrice">
                    <Input v-model="goodsForm.promotePrice"/>
                </FormItem>
                 <Form-item label="促销开始时间:" prop="promoteStartDate">
                  <DatePicker type="datetime" v-model="goodsForm.promoteStartDate" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择促销开始时间" style="width: 200px" @on-change="goodsForm.promoteStartDate=$event" ></DatePicker>
                </Form-item>
                <Form-item label="促销结束时间:" prop="promoteEndDate">
                  <DatePicker type="datetime" v-model="goodsForm.promoteEndDate" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择促销结束时间" style="width: 200px" @on-change="goodsForm.promoteEndDate=$event" ></DatePicker>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelgoods">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitgoods">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

import dateFormatUtil from "@/utils/dateFormatUtil";

export default {
  name: "goodsgoods-manage",
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
    const validategoodsNameNoBlank = (rule, value, callback) => {
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
        goodsName: "",
        goodsSn: "",
        catId: "",
        status: ""
      },
      modalType: 0,
      goodsModalVisible: false,
      modalTitle: "",
      goodsForm: {
        goodsName: "",
        goodsSn: "",
        catId: "",
        goodsName:"",
        goodsWeight:"",
        marketPrice:"",
        shopPrice:"",
        promotePrice:"",
        promoteStartDate:"",
        promoteEndDate:"",
        status:0
      },
      userRoles: [],
      roleList: [],
      errorPass: "",
      // goodsFormValidate: {
      //   goodsName: [
      //     { required: true, message: "会员名称不能为空", trigger: "blur" },
      //     { max: 64, message: '会员名称太长'},
      //     // { validator: 'regexp', pattern: /\s+/g, message: '会员名称不允许包含空格',trigger: "change,blur"}
      //     { validator: validategoodsNameNoBlank, validObj:{regexp:/\s+/g,msg:"会员名称不允许包含空格"} ,trigger: "blur"}
      //   ],
      //   alias: [
      //     { required: true, message: "昵称不能为空", trigger: "blur" },
      //     { max: 64, message: '昵称太长'}
      //     // { validator: validategoodsNameNoBlank, validObj:{regexp:/\s+/g,msg:"昵称不允许包含空格"} ,trigger: "blur"}
      //   ],
      //   password: [
      //     { required: true, message: "密码不能为空", trigger: "blur" },
      //     { min: 6, max: 30, message: '长度在 6 到 30 个字符'}
      //   ],
      //   mobilePhone: [
      //     { required: true, message: "手机号不能为空", trigger: "blur" },
      //     { validator: validateMobile, trigger: "blur" }
      //   ],
      //   email: [
      //     { required: true, message: "请输入邮箱地址" },
      //     { type: "email", message: "邮箱格式不正确" }
      //   ],
      //   qq: [
      //     { max: 20, message: 'QQ号码太长（不超20个字符）'}
      //   ]
      // },
      submitLoading: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "特产名字",
          key: "goodsName",
          width: 120,
          sortable: true
        },
        {
          title: "特产编号",
          key: "goodsSn",
          width: 120,
          sortable: true
        },
        {
          title: "市场价",
          key: "marketPrice",
          width: 120,
          sortable: true
        },
        {
          title: "平台售价",
          key: "shopPrice",
          width: 160,
          sortable: true
        },
         {
          title: "促销价",
          key: "promotePrice",
          width: 120,
          sortable: true
        },
        {
          title: "促销开始时间",
          key: "promoteStartDate",
          width: 120,
          sortable: true
        },
        {
          title: "促销结束时间",
          key: "promoteEndDate",
          width: 120,
          sortable: true
        },
        // {
        //   title: "产品状态",
        //   key: "sex",
        //   width: 160,
        //   align: "center",
        //   render: (h, params) => {
        //     let re = "";
        //     if (params.row.sex === 1) {
        //       re = "男";
        //     } else if (params.row.sex === 0) {
        //       re = "女";
        //     }
        //     return h("div", re);
        //   }
        // },
        {
          title: "审核状态",
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
                      color: "blue"
                    }
                  },
                  "未审核"
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
                  "审核未过"
                )
              ]);
            }else if (params.row.status === 1) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "green"
                    }
                  },
                  "审核通过"
                )
              ]);
            }
          },
          filters: [
            {
              label: "未审核",
              value: 0
            },
            {
              label: "审核未通过",
              value: -1
            },
            {
              label: "审核通过",
              value: 1
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 0) {
              return row.status === 0;
            } else if (value === -1) {
              return row.status === -1;
            }else if (value === 1) {
              return row.status === 1;
            }
          }
        },
        // {
        //   title: "是否开启预定",
        //   key: "status",
        //   align: "center",
        //   width: 150,
        //   render: (h, params) => {
        //     let re = "";
        //     if (params.row.status === 0) {
        //       return h("div", [
        //         h(
        //           "Tag",
        //           {
        //             props: {
        //               type: "dot",
        //               color: "green"
        //             }
        //           },
        //           "正常启用"
        //         )
        //       ]);
        //     } else if (params.row.status === -1) {
        //       return h("div", [
        //         h(
        //           "Tag",
        //           {
        //             props: {
        //               type: "dot",
        //               color: "red"
        //             }
        //           },
        //           "禁用"
        //         )
        //       ]);
        //     }
        //   },
        //   filters: [
        //     {
        //       label: "正常启用",
        //       value: 0
        //     },
        //     {
        //       label: "禁用",
        //       value: -1
        //     }
        //   ],
        //   filterMultiple: false,
        //   filterMethod(value, row) {
        //     if (value === 0) {
        //       return row.status === 0;
        //     } else if (value === -1) {
        //       return row.status === -1;
        //     }
        //   }
        // },
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
          width: 340,
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
                        this.audit(params.row);
                      }
                    }
                  },
                  "审核通过"
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
                        this.enable(params.row);
                      }
                    }
                  },
                  "审核不通过"
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
            } else if (params.row.status === 1){
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
                      type: "error",
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
                  "审核不通过"
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
            }else if(params.row.status === -1){
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
                        this.audit(params.row);
                      }
                    }
                  },
                  "审核通过"
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
      this.getgoodsList();
      this.cleanSelectCount();
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getgoodsList();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getgoodsList();
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
    getgoodsList() {
      this.loading = true;      
      this.getRequest("/goods/list", this.searchForm).then(res => {  
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
        this.getgoodsList();
      }
    },
    selectRoles(v) {},
    cancelgoods() {
      this.goodsModalVisible = false;
    },
    submitgoods() {
      this.$refs.goodsForm.validate(valid => {
        if (valid) {
          let url = "";
          if(this.goodsForm.birthday){
            this.goodsForm.birthday = dateFormatUtil.format(new Date(this.goodsForm.birthday),"yyyy-MM-dd");
          }
          if (this.modalType === 1) {
            // 编辑用户
            url = "/goods/update";
            this.submitLoading = true;
            this.putRequest(url, this.goodsForm).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("更新操作成功");
                this.init();
                this.goodsModalVisible = false;
                 this.getgoodsList();
              }
            });
          }else{
            url = "/goods/create";
            this.submitLoading = true;
            var creategoods = this.goodsForm;
            delete creategoods.id;
            if(creategoods.payPoints) delete creategoods.payPoints;
            if(creategoods.rankPoints) delete creategoods.rankPoints;
            this.postRequest(url, creategoods).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.init();
                this.goodsModalVisible = false;
                 this.getgoodsList();
              }
            });
          }

        }
      });
    },
    addgoods(v) {
      // this.modalType = 0;
      // this.modalTitle = "添加会员";
      // this.$refs.goodsForm.resetFields();
      // for (let attr in this.goodsForm) {
      //   if (this.goodsForm[attr] == null) {
      //     this.goodsForm[attr] = "";
      //   }
      // }
      // this.goodsModalVisible = true;
      this.$router.push({
        name: "specialty-detail"
      });
    },
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑特产";
      this.$refs.goodsForm.resetFields();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let userInfo = JSON.parse(str);
      this.goodsForm = userInfo;
      // let selectRolesId = [];
      // this.goodsForm.roles.forEach(function(e) {
      //   selectRolesId.push(e.id);
      // });
      // this.goodsForm.roles = selectRolesId;
      this.goodsModalVisible = true;
    },
    enable(v) {
      this.$Modal.confirm({
        title: "不通过",
        content: "您确认不通过 " + v.goodsName + " ?",
        onOk: () => {
          this.putRequest("/goods/auditNotPass/" + v.id).then(res => {
             console.log("不通过2:",res)
            if (res.success === true) {
              this.$Message.success("操作成功");
              this.init();
            }
          });
        }
      });
    },
    audit(v) {
      this.$Modal.confirm({
        title: "确认审核通过",
        content: "审核通过 " + v.goodsName + " ?",
        onOk: () => {
          this.putRequest("/goods/auditPass/" + v.id ).then(res => {
            console.log("1112:",res)
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
        content: "您确认要删除用户 " + v.title + " ?",
        onOk: () => {
          this.deleteRequest("/goods/delete/" + v.id).then(res => {
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
          this.deleteRequest("/goods/delete/" + ids).then(res => {
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