<style lang="less">
@import "./lineActivityDetail.less";
</style>
<template>
    <div class="search" style="background-color:white" id="pop">
        <template>
          <Form ref="activityForm" :model="activityForm" :label-width="110" :rules="activityFormValidate">
             <Tabs type="card">
                <TabPane label="基础信息" style="border-left: 1px solid #dddee1;">
                  <Form-item label="活动标题:" prop="title" style="padding-top:16px;">
                    <Input type="text" v-model="searchForm.title" clearable placeholder="请输入活动标题" style="width: 500px"/>
                  </Form-item>
                  <Form-item label="活动天数:">
                    <div>
                      <Input type="text" v-model="searchForm.lineDay" clearable style="width: 80px"/>
                      <span style="width:40px;display:inline-block;text-align: center;">天</span>
                      <Input type="text" v-model="searchForm.lineNight" clearable style="width: 80px"/>
                      <span style="width:40px;display:inline-block;text-align: center;">晚</span>
                    </div>
                  </Form-item>
                  <!-- <Form-item label="活动特色:" prop="title">
                    <Input type="text" v-model="searchForm.title" clearable placeholder="请输入昵称" style="width: 800px"/>
                  </Form-item> -->
                  <Form-item label="成形人数:" prop="totalNum">
                    <Input type="text" v-model="searchForm.totalNum" clearable style="width: 80px"/>
                  </Form-item>
                  <Form-item label="门市价:" prop="storePrice">
                    <Input type="number" v-model="searchForm.storePrice" clearable style="width: 80px"/>
                  </Form-item>
                  <Form-item label="最低价:" prop="price">
                    <Input type="number" v-model="searchForm.price" clearable style="width: 80px"/>
                  </Form-item>
                  <Form-item label="出团时间:" prop="lineDate">
                    <DatePicker type="date" v-model="searchForm.lineDate" format="yyyy-MM-dd" placeholder="请选择出团时间" style="width: 200px"></DatePicker>
                  </Form-item>
                  <!-- <Form-item label="集合地址:" prop="title">
                    <Input type="text" v-model="searchForm.title" clearable placeholder="请输入昵称" style="width: 800px"/>
                  </Form-item>
                  <Form-item label="集合标识:" prop="title">
                  </Form-item> -->
                  <Form-item label="提前预定:" prop="title">
                    <div>
                      <span style="width:60px;display:inline-block;text-align: center;">建议提前</span>
                      <Input type="text" v-model="searchForm.lineBefore" clearable style="width: 80px"/>
                      <span style="width:46px;display:inline-block;text-align: center;">天报名</span>
                      <Checkbox v-model="single">少于提前天数，则禁止预订</Checkbox>
                    </div>
                  </Form-item>
                  <!-- <div style="border:1px solid red;width:100%;"></div> -->
                  <hr style="border-bottom:1px solid #dddee1; height:1px;">
                  <Form-item label="出发城市:" prop="startCity" style="padding-top:16px;">
                    <!-- <Button type="default" icon="android-apps">选择</Button> -->
                    <div>
                      <al-selector v-model="startCityArr" level="1" style="width:300px;display:inline-block;"/>
                    </div>
                  </Form-item>
                  <Form-item label="目的城市:" prop="endCity">
                    <!-- <Button type="default" icon="android-apps">选择</Button> -->
                    <al-selector v-model="endCityArr" level="1" style="width:300px;display:inline-block;"/>
                    <!-- <al-selector v-model="endCityArr" level="1" /> -->
                  </Form-item>
                  <Form-item label="活动属性:" prop="title">
                    <Button icon="android-apps">选择</Button>
                  </Form-item>
                  <Form-item label="图标设置:" prop="tagWord">
                    <Button icon="android-apps">选择</Button>
                  </Form-item>
                  
                </TabPane>
                <TabPane label="促销策略">
                  <template>
                    <Form-item label="推荐次数:" prop="recommendNum" style="padding-top:16px;">
                      <Input type="text" v-model="searchForm.recommendNum" clearable placeholder="请输入活动推荐次数" style="width: 400px"/>
                    </Form-item>
                    <Form-item label="满意度:" prop="satisfyScore">
                      <Input type="text" v-model="searchForm.satisfyScore" clearable placeholder="请输入活动满意度" style="width: 400px"/>
                    </Form-item>
                    <Form-item label="销量:" prop="saleVolume">
                      <Input type="text" v-model="searchForm.saleVolume" clearable placeholder="请输入活动销量" style="width: 400px"/>
                    </Form-item>
                  </template>
                </TabPane>
                <TabPane label="活动行程">
                  <template>
                    <Form-item label="活动行程" prop="lineContent" style="padding-top:16px;">
                      <textarea type="text" v-model="searchForm.recommendNum" clearable placeholder="请输入活动行程" style="width:600px;height:200px;resize:none;line-height:2.0"/>
                    </Form-item>
                  </template>
                </TabPane>
                <TabPane label="图片">
                  <template>
                    <div>
                      <div style="padding-top:20px;padding-left:20px;">封面图片</div>
                      <div class="upload-container">
                        <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
                          <template v-if="item.status === 'finished'">
                              <img :src="item.url">
                              <div class="demo-upload-list-cover">
                                  <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                              </div>
                          </template>
                          <template v-else>
                              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                          </template>
                        </div>
                        <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :default-file-list="defaultList"
                            :on-success="handleSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            multiple
                            type="drag"
                            action="//jsonplaceholder.typicode.com/posts/"
                            style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="camera" size="20"></Icon>
                            </div>
                        </Upload>
                        <Modal title="View Image" v-model="visible">
                            <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
                        </Modal>
                      </div>

                      <hr style="border-bottom:1px solid #dddee1; height:1px;">

                      <div style="padding-top:20px;padding-left:20px;">详情列表图片</div>
                      <div class="upload-container">
                        <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
                          <template v-if="item.status === 'finished'">
                              <img :src="item.url">
                              <div class="demo-upload-list-cover">
                                  <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                              </div>
                          </template>
                          <template v-else>
                              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                          </template>
                        </div>
                        <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :default-file-list="defaultList"
                            :on-success="handleSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            multiple
                            type="drag"
                            action="//jsonplaceholder.typicode.com/posts/"
                            style="display: inline-block;width:58px;">
                            <div style="width: 58px;height:58px;line-height: 58px;">
                                <Icon type="camera" size="20"></Icon>
                            </div>
                        </Upload>
                        <Modal title="View Image" v-model="visible">
                            <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
                        </Modal>
                      </div>
                    </div>

                  </template>
                </TabPane>
                <TabPane label="报名须知">
                  <template>
                    <Form-item label="报名须知" prop="notice" style="padding-top:16px;">
                      <textarea type="text" v-model="searchForm.notice" clearable placeholder="请输入报名须知" style="width:600px;height:200px;resize:none;line-height:2.0"/>
                    </Form-item>
                  </template>
                </TabPane>
                <TabPane label="费用说明">
                  <template>
                    <Form-item label="费用说明" prop="feeInclude" style="padding-top:16px;">
                      <textarea type="text" v-model="searchForm.feeInclude" clearable placeholder="请输入费用说明" style="width:600px;height:200px;resize:none;line-height:2.0"/>
                    </Form-item>
                  </template>
                </TabPane>
                <TabPane label="注意事项">
                  <template>
                    <Form-item label="注意事项" prop="feeInclude" style="padding-top:16px;">
                      <textarea type="text" v-model="searchForm.feeInclude" clearable placeholder="请输入注意事项" style="width:600px;height:200px;resize:none;line-height:2.0"/>
                    </Form-item>
                  </template>
                </TabPane>
                <!-- <TabPane label="报名字段">报名字段的内容</TabPane>
                <TabPane label="优化信息">优化信息的内容</TabPane>
                <TabPane label="扩展设置">扩展设置</TabPane> -->
            </Tabs>

            <hr style="border-bottom:1px solid #dddee1; height:1px;">
            <Form-item style="padding:16px 0px;">
              <Button type="info" style="width:100px;">保存</Button>
            </Form-item>
          </Form>
         
      </template>
    </div>
</template>

<script>

import dateFormatUtil from "@/utils/dateFormatUtil";
import tinymce from 'tinymce';

export default {
  name: "line-detail",
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
    const validateactivityNameNoBlank = (rule, value, callback) => {
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
      single: false,
      startCityArr: [],
      endCityArr: [],
      loading: true,
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "chevron-down",
      selectCount: 0,
      selectList: [],
      searchForm: {
        activityName: "",
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
      activityModalVisible: false,
      modalTitle: "",
      activityForm: {
        sex: 1,
        type: 0
      },
      userRoles: [],
      roleList: [],
      errorPass: "",
      activityFormValidate: {
        activityName: [
          { required: true, message: "会员名称不能为空", trigger: "blur" },
          { max: 64, message: '会员名称太长'},
          // { validator: 'regexp', pattern: /\s+/g, message: '会员名称不允许包含空格',trigger: "change,blur"}
          { validator: validateactivityNameNoBlank, validObj:{regexp:/\s+/g,msg:"会员名称不允许包含空格"} ,trigger: "blur"}
        ],
        alias: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
          { max: 64, message: '昵称太长'}
          // { validator: validateactivityNameNoBlank, validObj:{regexp:/\s+/g,msg:"昵称不允许包含空格"} ,trigger: "blur"}
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
          title: "编号",
          key: "activityName",
          width: 120,
          sortable: true
        },
        {
          title: "名称",
          key: "activityName",
          width: 120,
          sortable: true
        },
        {
          title: "发起人",
          key: "activityName",
          width: 120,
          sortable: true
        },
        {
          title: "报价",
          key: "mobilePhone",
          width: 120,
          sortable: true
        },
        {
          title: "有效期",
          key: "email",
          width: 160,
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



      //图片模块
      //pictrue-module data start
      ,
      defaultList: [
        {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
        },
        {
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
        }
    ],
    imgName: '',
    visible: false,
    uploadList: []
     //pictrue-module data end

    };
  },
  methods: {
    init() {
       tinymce.init({
    selector: '#mytextarea'
  });
      this.getactivityList();
      this.cleanSelectCount();
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getactivityList();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getactivityList();
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
    getactivityList() {
      this.loading = true;      
      this.getRequest("/activity/list", this.searchForm).then(res => {  
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
        this.getactivityList();
      }
    },
    selectRoles(v) {},
    cancelactivity() {
      this.activityModalVisible = false;
    },
    submitactivity() {
      this.$refs.activityForm.validate(valid => {
        if (valid) {
          let url = "";
          if(this.activityForm.birthday){
            this.activityForm.birthday = dateFormatUtil.format(new Date(this.activityForm.birthday),"yyyy-MM-dd");
          }
          if (this.modalType === 1) {
            // 编辑用户
            url = "/activity/updateAll";
            this.submitLoading = true;
            this.putRequest(url, this.activityForm).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("更新操作成功");
                this.init();
                this.activityModalVisible = false;
              }
            });
          }else{
            url = "/activity/create";
            this.submitLoading = true;
            var createactivity = this.activityForm;
            delete createactivity.id;
            if(createactivity.payPoints) delete createactivity.payPoints;
            if(createactivity.rankPoints) delete createactivity.rankPoints;
            this.postRequest(url, createactivity).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("操作成功");
                this.init();
                this.activityModalVisible = false;
              }
            });
          }

        }
      });
    },
    addactivity(v) {
      this.modalType = 0;
      this.modalTitle = "添加会员";
      this.$refs.activityForm.resetFields();
      for (let attr in this.activityForm) {
        if (this.activityForm[attr] == null) {
          this.activityForm[attr] = "";
        }
      }
      this.activityModalVisible = true;
    },
    edit(v) {
      this.modalType = 1;
      this.modalTitle = "编辑会员";
      this.$refs.activityForm.resetFields();
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = "";
        }
      }
      let str = JSON.stringify(v);
      let userInfo = JSON.parse(str);
      this.activityForm = userInfo;
      // let selectRolesId = [];
      // this.activityForm.roles.forEach(function(e) {
      //   selectRolesId.push(e.id);
      // });
      // this.activityForm.roles = selectRolesId;
      this.activityModalVisible = true;
    },
    enable(v) {
      this.$Modal.confirm({
        title: "确认启用",
        content: "您确认要启用用户 " + v.activityName + " ?",
        onOk: () => {
          this.postRequest("/activity/enable/" + v.id).then(res => {
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
        content: "您确认要禁用用户 " + v.activityName + " ?",
        onOk: () => {
          this.postRequest("/activity/disable/" + v.id).then(res => {
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
        content: "您确认要删除用户 " + v.activityName + " ?",
        onOk: () => {
          this.deleteRequest("/activity/delete/" + v.id).then(res => {
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
          this.deleteRequest("/activity/delete/" + ids).then(res => {
            if (res.success === true) {
              this.$Message.success("删除成功");
              this.init();
            }
          });
        }
      });
    }


    //picture methods start
    ,
    handleView (name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess (res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      file.name = '7eb99afb9d5f317c912f08b5212fd69a';
    },
    handleFormatError (file) {
      this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      });
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5;
      if (!check) {
          this.$Notice.warning({
              title: 'Up to five pictures can be uploaded.'
          });
      }
      return check;
    }
     //picture methods end


  },
  mounted() {
    this.init();
    // this.getRoleList();

    //picture mounted start
    this.uploadList = this.$refs.upload.fileList;
    //picture mounted end
  }
};
</script>