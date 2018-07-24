<style lang="less">
@import "./specialtyInfoDetail.less";
</style>
<template>
    <div class="search" style="background-color:white" id="pop">
        <template>
          <Form ref="goodsForm" :model="goodsForm" :label-width="110" :rules="goodsFormValidate" >
             <Tabs type="card">
                <TabPane label="特产信息" style="border-left: 1px solid #dddee1;">
                  <div style="overflow:hidden;">
                    <div style="width: 700px;float:left">
                    <Form-item label="特产名字:" prop="goodsName" style="padding-top:16px;">
                      <Input type="text" v-model="goodsForm.goodsName" clearable placeholder="请输入商品名字" style="width: 500px"/>
                    </Form-item>
                    <Form-item label="特产编号:" prop="goodsSn">
                      <Input type="text" v-model="goodsForm.goodsSn" clearable style="width: 500px"/>
                    </Form-item>
                    <Form-item label="所属分类:" prop="catId">
                      <!-- <Input type="text" v-model="goodsForm.catId" clearable style="width: 500px"/> -->
                       <Select v-model="goodsForm.catId" placeholder="请选择" style="width: 500px">
                        <Option value="0">未审核通过</Option>
                        <Option value="-1">审核未通过</Option>
                        <Option value="1">审核通过</Option>
                      </Select>
                    </Form-item>
                    <Form-item label="库存数量:" prop="goodsNumber">
                      <Input type="number" v-model="goodsForm.goodsNumber" clearable style="width: 500px"/>
                    </Form-item>
                    <Form-item label="单件商品重量:" prop="goodsWeight">
                      <Input type="number" v-model="goodsForm.goodsWeight" clearable style="width: 500px"/>
                    </Form-item>
                    <Form-item label="市场售价:" prop="marketPrice">
                      <Input type="number" v-model="goodsForm.marketPrice" clearable style="width: 500px"/>
                    </Form-item>
                    <Form-item label="平台售价:" prop="shopPrice">
                      <Input type="number" v-model="goodsForm.shopPrice" clearable style="width: 500px"/>
                    </Form-item>
                    <Form-item label="商品报警数量:" prop="warnNumber">
                      <Input type="number" v-model="goodsForm.warnNumber" clearable style="width: 500px"/>
                    </Form-item>
                    </div>
                  <div style="width: 400px;float:left">
                     <FormItem label="是否开放销售" prop="isOnSale">
                      <RadioGroup v-model="goodsForm.isOnSale">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                      </RadioGroup>
                     </FormItem>
                     <FormItem label="是否单独销售" prop="isAloneSale">
                      <RadioGroup v-model="goodsForm.isAloneSale">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                      </RadioGroup>
                     </FormItem>
                     <FormItem label="是否开放销售" prop="isBest">
                      <RadioGroup v-model="goodsForm.isBest">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                      </RadioGroup>
                     </FormItem>
                     <FormItem label="是否是新品" prop="isNew">
                      <RadioGroup v-model="goodsForm.isNew">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                      </RadioGroup>
                     </FormItem>
                     <FormItem label="是否热销" prop="isHot">
                      <RadioGroup v-model="goodsForm.isHot">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                      </RadioGroup>
                     </FormItem>
                     <FormItem label="是否特价促销" prop="isPromote">
                      <RadioGroup v-model="goodsForm.isPromote">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                      </RadioGroup>
                     </FormItem>
                     <Form-item label="商品简述:" prop="goodsBrief">
                      <Input v-model="goodsForm.goodsBrief" clearable style="width: 500px"/>
                     </Form-item>
                     <Form-item label="商品详细描述:" prop="goodsDesc">
                      <textarea v-model="goodsForm.goodsDesc" style="width:400px;height:120px;resize:none;line-height:2.0;border:1px solid #dddee1;"/>
                     </Form-item>
                    </div>
                 </div>
                  <hr style="border-bottom:1px solid #dddee1; height:1px;">
                   <Form-item label="促销价格:" prop="promotePrice" style="padding-top:16px;">
                      <Input type="text" v-model="goodsForm.promotePrice" clearable placeholder="请输入促销价格" style="width: 400px"/>
                    </Form-item>
                    <Form-item label="促销开始时间:" prop="promoteStartDate">
                      <DatePicker type="datetime" v-model="goodsForm.promoteStartDate" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择促销开始时间" style="width: 200px" @on-change="goodsForm.promoteStartDate=$event" ></DatePicker>
                    </Form-item>
                    <Form-item label="促销结束时间:" prop="promoteEndDate">
                      <DatePicker type="datetime" v-model="goodsForm.promoteEndDate" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择促销结束时间" style="width: 200px" @on-change="goodsForm.promoteEndDate=$event" ></DatePicker>
                    </Form-item>
                </TabPane>
                <!-- <TabPane label="促销策略">
                  <template>
                    <Form-item label="促销价格:" prop="promotePrice" style="padding-top:16px;">
                      <Input type="text" v-model="goodsForm.promotePrice" clearable placeholder="请输入促销价格" style="width: 400px"/>
                    </Form-item>
                    <Form-item label="促销开始时间:" prop="promoteStartDate">
                      <DatePicker type="datetime" v-model="goodsForm.promoteStartDate" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择促销开始时间" style="width: 200px" @on-change="goodsForm.promoteStartDate=$event" ></DatePicker>
                    </Form-item>
                    <Form-item label="促销结束时间:" prop="promoteEndDate">
                      <DatePicker type="datetime" v-model="goodsForm.promoteEndDate" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择促销结束时间" style="width: 200px" @on-change="goodsForm.promoteEndDate=$event" ></DatePicker>
                    </Form-item>
                  </template>
                </TabPane> -->
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
                <TabPane label="注意事项">
                  <template>
                    <Form-item label="注意事项" prop="feeInclude" style="padding-top:16px;">
                      <textarea type="text" v-model="goodsForm.feeInclude" clearable placeholder="请输入注意事项" style="width:600px;height:200px;resize:none;line-height:2.0"/>
                    </Form-item>
                  </template>
                </TabPane>
                <!-- <TabPane label="报名字段">报名字段的内容</TabPane>
                <TabPane label="优化信息">优化信息的内容</TabPane>
                <TabPane label="扩展设置">扩展设置</TabPane> -->
            </Tabs>

            <hr style="border-bottom:1px solid #dddee1; height:1px;">
            <Form-item style="padding:16px 0px;">
              <Button type="info" style="width:100px;" @click="submitgoods">保存</Button>
            </Form-item>
          </Form>
         
      </template>
    </div>
</template>

<script>

import dateFormatUtil from "@/utils/dateFormatUtil";
import tinymce from 'tinymce';

export default {
  name: "specialty-detail",
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
      single: false,
      startCityArr: [],
      endCityArr: [],
      loading: true,
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "chevron-down",
      selectCount: 0,
      selectList: [],
      goodsForm: {
        goodsName: "",
        goodsSn: "",
        goodsNumber: "",
        goodsWeight: "",
        marketPrice: "",
        shopPrice: "",
        promotePrice: "",
        promoteStartDate: "",
        promoteEndDate: "",
        warnNumber: "",
        goodsBrief: "",
        goodsDesc: "",
        goodsType: ""
      },
      modalType: 0,
      goodsModalVisible: false,
      modalTitle: "",
      goodsForm: {
        status: 1,
        type: 0
      },
      userRoles: [],
      roleList: [],
      errorPass: "",
      goodsFormValidate: {
        goodsName: [
          { required: true, message: "特产名称不能为空", trigger: "blur" },
          { max: 64, message: '特产名称太长'},
          // { validator: 'regexp', pattern: /\s+/g, message: '特产名称不允许包含空格',trigger: "change,blur"}
          { validator: validategoodsNameNoBlank, validObj:{regexp:/\s+/g,msg:"特产名称不允许包含空格"} ,trigger: "blur"}
        ],
        goodsSn: [
          { required: true, message: "特产编号不能为空", trigger: "blur" },
          { max: 64, message: '特产编号太长'}
          // { validator: validategoodsNameNoBlank, validObj:{regexp:/\s+/g,msg:"昵称不允许包含空格"} ,trigger: "blur"}
        ],
        catId:[
         { required: true, message: "特产类型不能为空", trigger: "blur" },
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
          key: "goodsName",
          width: 120,
          sortable: true
        },
        {
          title: "名称",
          key: "goodsName",
          width: 120,
          sortable: true
        },
        {
          title: "发起人",
          key: "goodsName",
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
                  "不通过"
                )
              ]);
            }else if (params.row.status === 1) {
              return h("div", [
                h(
                  "Tag",
                  {
                    props: {
                      type: "dot",
                      color: "yellow"
                    }
                  },
                  "通过"
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
              label: "不通过",
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
                        this.audit(params.row);
                      }
                    }
                  },
                  "未审核"
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
            } else if(params.row.status === -1){
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
                  "不通过"
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
            }else if(params.row.status === 1){
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
                  "通过"
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
      this.getgoodsList();
      this.cleanSelectCount();
    },
    changePage(v) {
      this.goodsForm.pageNumber = v;
      this.getgoodsList();
    },
    changePageSize(v) {
      this.goodsForm.pageSize = v;
      this.getgoodsList();
    },
    selectDateRange(v) {
      if (v) {
        this.goodsForm.startDate = v[0];
        this.goodsForm.endDate = v[1];
      }
    },
    selectBirthdayDateRange(v) {
      if (v) {
        this.goodsForm.startBirthday = v[0];
        this.goodsForm.endBirthday = v[1];
      }
    },
    getgoodsList() {
      this.loading = true;      
      this.getRequest("/goods/list", this.goodsForm).then(res => {  
        this.loading = false;
        if (res.success === true) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    handleSearch() {
      this.goodsForm.pageNumber = 1;
      this.goodsForm.pageSize = 10;
      this.init();
    },
    handleReset() {
      this.$refs.goodsForm.resetFields();
      this.goodsForm.pageNumber = 1;
      this.goodsForm.pageSize = 10;
      // 重新加载数据
      this.init();
    },
    changeSort(e) {
      this.goodsForm.sort = e.key;
      this.goodsForm.order = e.order;
      if (e.order === "normal") {
        this.goodsForm.order = "";
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
            // 编辑特产
            url = "/goods/update";
            this.submitLoading = true;
            this.putRequest(url, this.goodsForm).then(res => {
              this.submitLoading = false;
              if (res.success === true) {
                this.$Message.success("更新操作成功");
                this.init();
                this.goodsModalVisible = false;
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
              }
            });
          }

        }
      });
    },
    addgoods(v) {
      this.modalType = 0;
      this.modalTitle = "添加特产";
      this.$refs.goodsForm.resetFields();
      for (let attr in this.goodsForm) {
        if (this.goodsForm[attr] == null) {
          this.goodsForm[attr] = "";
        }
      }
      this.goodsModalVisible = true;
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
        title: "确认不通过",
        content: "您确认不通过 " + v.goodsName + " ?",
        onOk: () => {
          this.postRequest("/goods/auditNotPass/" + v.id).then(res => {
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
        title: "确认通过",
        content: "您确认通过 " + v.goodsName + " ?",
        onOk: () => {
          this.postRequest("/goods/auditPass/" + v.id).then(res => {
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
        content: "您确认要删除用户 " + v.goodsName + " ?",
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