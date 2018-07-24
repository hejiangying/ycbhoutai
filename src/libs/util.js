import axios from 'axios';
import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';
import lazyLoading from './lazyLoading.js';
import router from '@/router/index';
import Cookies from "js-cookie";

let util = {

};
util.title = function (title) {
    title = title || '云彩帮后台管理系统';
    window.document.title = title;
};

const ajaxUrl = env === 'development'
    ? 'http://127.0.0.1:8888'
    : env === 'production'
        ? 'https://www.url.com'
        : 'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
};

util.initRouter = function (vm) {
    const constRoutes = [];
    const otherRoutes = [];

    // 404路由需要和动态路由一起注入
    const otherRouter = [{
        path: '/*',
        name: 'error-404',
        meta: {
            title: '404-页面不存在'
        },
        component: 'error-page/404'
    }];

    // 判断用户是否登录
    let userInfo = Cookies.get('userInfo')
    if (userInfo === null || userInfo === "" || userInfo === undefined) {
        // 未登录
        return;
    }
    let userId = JSON.parse(Cookies.get("userInfo")).id;

    // 加载菜单
    axios.get("/xboot/permission/getMenuList/" + userId).then(res => {

        let returnMenuData = [
            {
                checked:false,
                children: [
                    {checked:false,children:null,component:"sys/user-manage/userManage",expand:true,icon:"android-person",id:"5129710648430593",
                        level:2,name:"user-manage",parentId:"5129710648430592",path:"user-manage",selected:false,sortOrder:1.1,status:0,title:"管理员管理"}, 
                    // {checked:false,children:null,omponent:"sys/role-manage/roleManage",expand:true,icon:"android-contacts",id:"5129710648430594",
                    //     level:2,name:"role-manage",parentId:"5129710648430592",path:"role-manage",selected:false,sortOrder:1.2,status:0,title:"角色管理"}, 
                    {checked:false,children:null,component:"sys/member-manage/memberManage",expand:true,icon:"android-person",id:"5129710648430595",
                        level:2,name:"member-manage",parentId:"5129710648430592",path:"member-manage",selected:false,sortOrder:1.3,status:0,title:"会员管理"}, 
                    {checked:false,children:null,component:"sys/log-manage/logManage",expand:true,icon:"android-list",id:"5129710648430596",
                        level:2,name:"log-manage",parentId:"5129710648430592",path:"log-manage",selected:false,sortOrder:1.4,status:0,title:"登录日志管理"}
                ],
                component:"Main",expand:true,icon:"ios-gear",id:"5129710648430592",
                level:1,name:"sys",parentId:"",path:"/form",selected:false,sortOrder:1,status:0,title:"系统管理"
            },
            {
                checked:false,
                children: [
                    {checked:false,children:null,component:"main-module/supplier/supplierManage",expand:true,icon:"android-person",id:"4129710648430593",
                        level:2,name:"supplier-manage",parentId:"4129710648430592",path:"supplier-manage",selected:false,sortOrder:1.1,status:0,title:"商户管理"}, 
                    {checked:false,children:null,component:"main-module/line-activity/lineActivityManage",expand:true,icon:"android-contacts",id:"4129710648430594",
                        level:2,name:"line-activity-manage",parentId:"4129710648430592",path:"line-activity-manage",selected:false,sortOrder:1.2,status:0,title:"线路活动管理"},
                    {checked:false,children:null,component:"sys/user-manage/userManage",expand:true,icon:"android-person",id:"4129710648430595",
                        level:2,name:"inn-manage",parentId:"4129710648430592",path:"inn-manage",selected:false,sortOrder:1.3,status:0,title:"客栈管理"}, 
                    {checked:false,children:null,component:"main-module/specialty-info/specialtyInfoManage",expand:true,icon:"android-list",id:"4129710648430596",
                        level:2,name:"specialty-info-manage",parentId:"4129710648430592",path:"specialty-info-manage",selected:false,sortOrder:1.4,status:0,title:"特产管理"}
                ],
                component:"Main",expand:true,icon:"ios-list",id:"4129710648430592",
                level:1,name:"main-module",parentId:"",path:"/form",selected:false,sortOrder:1,status:0,title:"平台业务"
            },
            {
                checked:false,
                children:[
                    {checked:false,children:null,component:"access/access",expand:true,icon:"locked",id:"16392767785668608",
                        level:2,name:"access_index",parentId:"16392452747300864",path:"index",selected:false,sortOrder:2.1,status:0,title:"权限按钮测试页"}
                ],
                component:"Main",expand:true,icon:"locked",id:"16392452747300864",
                level:1,name:"access",parentId:"",path:"/access",selected:false,sortOrder:2,status:0,title:"权限按钮测试页"
            }
        ];
        let menuData = returnMenuData;
        // let menuData = res.result;
        if (menuData === null || menuData === "" || menuData === undefined) {
            return;
        }
        util.initRouterNode(constRoutes, menuData);
        util.initRouterNode(otherRoutes, otherRouter);
        // 添加主界面路由
        vm.$store.commit('updateAppRouter', constRoutes.filter(item => item.children.length > 0));
        // 添加全局路由
        vm.$store.commit('updateDefaultRouter', otherRoutes);
        // 刷新界面菜单
        vm.$store.commit('updateMenulist', constRoutes.filter(item => item.children.length > 0));

        let tagsList = [];
        vm.$store.state.app.routers.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        vm.$store.commit('setTagsList', tagsList);
    });
};

// 生成路由节点
util.initRouterNode = function (routers, data) {
    for (var item of data) {
        let menu = Object.assign({}, item);
        // menu.component = import(`@/views/${menu.component}.vue`);
        menu.component = lazyLoading(menu.component);

        if (item.children && item.children.length > 0) {
            menu.children = [];
            util.initRouterNode(menu.children, item.children);
        }

        let meta = {};
        // 给页面添加按钮权限和标题
        meta.buttonTypes = menu.buttonTypes ? menu.buttonTypes : null;
        meta.title = menu.title ? menu.title + " - 云彩帮后台管理系统" : null;
        menu.meta = meta;

        routers.push(menu);
    }
};

export default util;
