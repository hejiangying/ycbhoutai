         <style lang="less">
@import "./supplierManage.less";
</style>
<template>
    <div class="search">
        <Row>
            <Col>
                <Card>
                    <Row>
                        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
                            <Form-item label="商户账户" prop="account">
                              <Input type="text" v-model="searchForm.account" clearable placeholder="请输入商户账户" style="width: 200px"/>
                            </Form-item>
                            <Form-item label="商户名称" prop="supplierName">
                              <Input type="text" v-model="searchForm.supplierName" clearable placeholder="请输入商户名称" style="width: 200px"/>
                            </Form-item>
                            <Form-item label="联系人" prop="linkMan">
                              <Input type="text" v-model="searchForm.linkMan" clearable placeholder="请输入昵称" style="width: 200px"/>
                            </Form-item>
                            <Form-item label="手机号码" prop="mobile">
                              <Input type="text" v-model="searchForm.mobile" clearable placeholder="请输入手机号码" style="width: 200px"/>
                            </Form-item>
                            <span v-if="drop">
                              <Form-item label="邮箱" prop="email">
                                <Input type="text" v-model="searchForm.email" clearable placeholder="请输入邮箱" style="width: 200px"/>
                              </Form-item>
                              <Form-item label="QQ号码" prop="qq">
                                <Input type="text" v-model="searchForm.qq" clearable placeholder="请输入QQ号码" style="width: 200px"/>
                              </Form-item>
                            </span>
                            <Form-item style="margin-left:-35px;">
                              <Button @click="handleSearch" type="primary" icon="search">搜索</Button>
                              <Button @click="handleReset" type="ghost" >重置</Button>
                              <a class="drop-down" @click="dropDown">{{dropDownContent}}
                                <Icon :type="dropDownIcon"></Icon>
                              </a>
                            </Form-item>
                            <!-- <div :v-model="province"></div> -->
                        </Form>
                    </Row>
                    <Row class="operation">
                        <Button @click="addSupplier" type="primary" icon="plus-round">添加商户</Button>
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
        <!-- 添加商户 -->
        <Modal :title="modalTitle" v-model="supplierModalVisible" :mask-closable='false' :width="900">
            <Form ref="supplierForm" :model="supplierForm" :label-width="90" :rules="supplierFormValidate" inline>
                <div>
                  <div style="width: 400px;float:left">
                    <FormItem label="商户账号" prop="account" style="width:300px">
                      <Input v-model="supplierForm.account"/>
                    </FormItem>
                    <FormItem label="商户密码" prop="password" style="width:300px" v-if="modalType===0" :error="errorPass">
                      <Input type="password" v-model="supplierForm.password"/>
                    </FormItem>
                    <FormItem label="商户名称" prop="supplierName" style="width:300px">
                      <Input v-model="supplierForm.supplierName"/>
                    </FormItem>
                    <FormItem label="商户类型" prop="supplierType" style="width:300px">
                      <!-- <Input v-model="supplierForm.kindid"/> -->
                      <Select v-model="supplierForm.supplierType" placeholder="请选择">
                        <Option :value="0">普通商户</Option>
                        <Option :value="1">达人商户</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="商户所在省/市" prop="supplierFormAddressArr" style="width:300px">
                      <!-- <al-cascader :render-format="label => label.join('/')" v-model="supplierForm.province" level="0" data-type="name" /> -->
                      <al-cascader ref="uiii" v-model="supplierForm.supplierFormAddressArr" level="1" />
                      <!-- <al-selector v-model="supplierFormAddressArr" level="1" /> -->
                    </FormItem>
                    <FormItem label="详细地址" prop="address" style="width:300px">
                      <Input v-model="supplierForm.address"/>
                    </FormItem>
                  </div>
                  <div style="width: 400px;float:right">
                    <FormItem label="联系人" prop="linkMan" style="width:300px">
                      <Input v-model="supplierForm.linkMan"/>
                    </FormItem>
                    <FormItem label="手机号" prop="mobile" style="width:300px">
                        <Input v-model="supplierForm.mobile" :maxlength="11"/>
                    </FormItem>
                    <FormItem label="联系电话" prop="telephone" style="width:300px">
                        <Input v-model="supplierForm.telephone" :maxlength="11"/>
                    </FormItem>
                    <FormItem label="邮箱" prop="email" style="width:300px">
                        <Input v-model="supplierForm.email"/>
                    </FormItem>
                    <FormItem label="QQ号" prop="qq" style="width:300px">
                        <Input v-model="supplierForm.qq"/>
                    </FormItem>
                  </div>
                  <div>
                    <FormItem label="商户介绍" prop="content">
                      <textarea v-model="supplierForm.content" style="width:680px;height:80px;resize:none;line-height:2.0;border:1px solid #dddee1;"/>
                    </FormItem>   
                  </div>
                </div>      
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelsupplier">取消</Button>
                <Button type="primary" :loading="submitLoading" @click="submitsupplier">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

import dateFormatUtil from "@/utils/dateFormatUtil";
export default {
  name: "supplier-manage",
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
    const validatesupplierNameNoBlank = (rule, value, callback) => {
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
        account: "",
        supplierName: "",
        linkMan: "",
        mobilePhone: "",
        email: "",
        qq: "",
        status: "",
        pageNumber: 1,
        pageSize: 10,
        sort: "createTime",
        order: "desc",
        startDate: "",
        endDate: "",
        province: "",
        city: "",
        area: "",
        street: ""
      },
      // supplierFormAddressArr: ['云南省', '大理白族自治州', '大理市', '下关镇'], 
      // supplierFormAddressArr: ['530000', '532900', '532901', '532901101000'],
      // supplierFormAddressArr: [], 
      modalType: 0,
      supplierModalVisible: false,
      modalTitle: "",
      supplierForm: {
        supplierType: 0,
        supplierFormAddressArr: [], 
        province: "",
        city: "",
        area: "",
        street: ""
      },
      province: "",
      city:"",
        // supplierFormAddressArr:[ this.supplierForm.province, this.supplierForm.city, this.supplierForm.area, this.supplierForm.street],
      userRoles: [],
      roleList: [],
      errorPass: "",
      supplierFormValidate: {
        account: [
          { required: true, message: "商户账号不能为空", trigger: "blur" },
          { max: 64, message: '商户账号太长'}
          // ,{ validator: validatesupplierNameNoBlank, validObj:{regexp:/\s+/g,msg:"商户账号不允许包含空格"} ,trigger: "blur"}
        ],
        supplierName: [
          { required: true, message: "商户名称不能为空", trigger: "blur" },
          { max: 64, message: '商户名称太长'},
          { validator: validatesupplierNameNoBlank, validObj:{regexp:/\s+/g,msg:"商户名称不允许包含空格"} ,trigger: "blur"}
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符'}
        ]
        // ,
        // linkMan: [
        //   { required: true, message: "联系人不能为空", trigger: "blur" },
        //   { max: 64, message: '联系人名称太长'}
        // ],
        // mobilePhone: [
        //   { required: true, message: "手机号不能为空", trigger: "blur" },
        //   { validator: validateMobile, trigger: "blur" }
        // ],
        // email: [
        //   { required: true, message: "请输入邮箱地址" },
        //   { type: "email", message: "邮箱格式不正确" }
        // ],
        // qq: [
        //   { max: 20, message: 'QQ号码太长（不超20个字符）'}
        // ]
      },
      submitLoading: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "商户名称",
          key: "supplierName",
          width: 120,
          sortable: true
        },
        {
          title: "联系人",
          key: "linkMan",
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
          title:"商户所在省/市",
          key:"province",
          width:130,
          sortable: true,
          align: "center",
          render: (h, params) => {
            if (params.row) {
              return h("span", 
                JSON.parse(params.row.province).name
              );
            }
          }
        },
        {
          title:"商户所在市",
          key:"city",
          width:120,
          sortable: true,
          align: "center",
          render: (h, params) => {
            if (params.row) {
              return h("span", 
                JSON.parse(params.row.city).name
              );
            }
          }
        },
        {
          title: "联系电话",
          key: "telephone",
          width: 120,
          sortable: true
        },
        {
          title: "手机",
          key: "mobile",
          width: 120,
          sortable: true
        },
         {
          title:"详细地址",
          key:"address",
          width:120,
          sortable: true
        },
        {
          title:"商户分类",
          key:"supplierType",
          width:120,
          sortable: true,
          render: (h, params) => {
            if (params.row) {
              if (params.row.supplierType === 0){
                return h("span", 
                  "普通商户"
                );
              }else{
                return h("span", 
                  "达人商户"
                );
              }
            }
          }
        },
        {
          title:"商户介绍",
          key:"content",
          width:120,
          sortable: true
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
  watch: {
    // searchFormAddrArr: function (addr) {
    //   var reg1 = /[\u4e00-\u9fa5]/g
    //   if(addr.length > 0){
    //     this.searchForm.province = JSON.stringify(addr[0]).match(reg1).join("");
    //     this.searchForm.city = JSON.stringify(addr[1]).match(reg1).join("");
    //     this.searchForm.area = JSON.stringify(addr[2]).match(reg1).join("");
    //     this.searchForm.street = JSON.stringify(addr[3]).match(reg1).join("");
    //   }else{
    //     this.searchForm.province = "";
    //     this.searchForm.city = "";
    //     this.searchForm.area = "";
    //     this.searchForm.street = "";
    //   }
    //   console.log("=============watchChange===============");
    //   console.log(this.searchForm.street);
    // },
    supplierFormAddressArr: function (addr) {
      if(addr.length > 0){
        this.supplierForm.province = JSON.stringify(addr[0]);
        this.supplierForm.city = JSON.stringify(addr[1]);
        this.supplierForm.area = JSON.stringify(addr[2]);
        this.supplierForm.street = JSON.stringify(addr[3]);
      }else{
        this.supplierForm.province = "";
        this.supplierForm.city = "";
        this.supplierForm.area = "";
        this.supplierForm.street = "";
      }
    }
  },
 
  methods: {
   
    init() {
      this.getsupplierList();
      this.cleanSelectCount();
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getsupplierList();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getsupplierList();
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
    
    getsupplierList() {
      this.loading = true;  
      this.getRequest("/supplier/list", this.searchForm).then(res => {  
        this.loading = false;
        if (res.success === true) {
          console.log("listres:",res)
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    handleSearch() {
      // console.log(this.resArr); 
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
        this.getsupplierList();
      }
    },
    selectRoles(v) {},
    cancelsupplier() {
      this.supplierModalVisible = false;
    },
    submitsupplier() {
      this.$refs.supplierForm.validate(valid => {
        if (valid) {
          let url = "";
          if(this.supplierForm.birthday){
            this.supplierForm.birthday = dateFormatUtil.format(new Date(this.supplierForm.birthday),"yyyy-MM-dd");
          }
          if (this.modalType === 1) {
            // 编辑用户
            url = "/supplier/update/"+12121;
            this.submitLoading = true;
            this.putRequest(url, this.supplierForm).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("更新操作成功");
                console.log("更新操作：",res)
                this.init();
                this.supplierModalVisible = false;
              }
            });
          }else{
            url = "/supplier/create";
            this.submitLoading = true;
            var createsupplier = this.supplierForm;
            delete createsupplier.id;
            if(createsupplier.payPoints) delete createsupplier.payPoints;
            if(createsupplier.rankPoints) delete createsupplier.rankPoints;
            this.postRequest(url, createsupplier).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.init();
                this.supplierModalVisible = false;
              }
            });
          }
       
        }
      });
    },
    addSupplier(v) {
      this.modalType = 0;
      this.modalTitle = "添加商户";
      this.$refs.supplierForm.resetFields();
      for (let attr in this.supplierForm) {
        if (this.supplierForm[attr] == null) {
          this.supplierForm[attr] = "";
        }
      }
      this.supplierForm['password'] = "";
      console.log(this.supplierForm.supplierFormAddressArr);
      this.supplierForm.supplierFormAddressArr = ['530000', '532900'];
      this.supplierForm.province = '{"code":"530000","name":"云南省"}';
      this.supplierForm.city = '{"code":"532900","name":"大理白族自治州"}';
      // this.supplierForm['supplierFormAddressArr'] = ['530000', '532900'];
      this.supplierModalVisible = true;
    },
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑商户";
      console.log(v);
      this.$refs.supplierForm.resetFields();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = "";
        }
      }

      // this.supplierForm.supplierFormAddressArr = [];
      // let str = JSON.stringify(v);
      // let supplierInfo = JSON.parse(str);
      // this.supplierForm = supplierInfo;
      var _this = this;
      _this.loading = true;  
      this.postRequest("/supplier/query/" + v.id ).then(res =>{
        _this.loading = false; 
        let editSupplier = res.result;
        _this.supplierForm = editSupplier;
        // 地址数据组装
        let editSupplierProvCode = JSON.parse(editSupplier.province).code;
        let editSupplierCityCode = JSON.parse(editSupplier.city).code;
        _this.supplierForm.supplierFormAddressArr = [editSupplierProvCode, editSupplierCityCode], 
        console.log( _this.supplierForm.supplierFormAddressArr);        
        _this.supplierModalVisible = true;
      })

    },
    enable(v) {
      this.$Modal.confirm({
        title: "确认启用",
        content: "您确认要启用商户 " + v.supplierName + " ?",
        onOk: () => {
          console.log("id",v.id)
          this.postRequest("/supplier/enable/" + v.id).then(res => {
            console.log("res:",res)
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
        content: "您确认要禁用商户 " + v.supplierName + " ?",
        onOk: () => {
          this.postRequest("/supplier/disable/" + v.id).then(res => {
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
        content: "您确认要删除商户 " + v.supplierName + " ?",
        onOk: () => {
          this.deleteRequest("/supplier/delete/" + v.id).then(res => {
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
          this.deleteRequest("/supplier/delete/" + ids).then(res => {
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