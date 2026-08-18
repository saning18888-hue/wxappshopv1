
    const BASE='/admin';
    const token=()=>localStorage.getItem('admin_token')||'';

    function escapeHtml(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
    function getRadioValue(name){const el=document.querySelector(`input[name="${name}"]:checked`);return el?el.value:'';}
    function setRadioValue(name,value){document.querySelectorAll(`input[name="${name}"]`).forEach(el=>el.checked=(el.value===value));}

    /* 菜单配置 */
    const ICONS={
      overview:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
      shop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 10h6"/><path d="M9 14h6"/></svg>',
      goods:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2.13-1.23"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>',
      orders:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"/><path d="M9 14h6"/><path d="M9 18h6"/></svg>',
      data:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
      content:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M9 7h6"/><path d="M9 11h6"/></svg>',
      system:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12.22 2h-.44a2 2 0 0 0-2 1.72l-.28 2.1a9.99 9.99 0 0 0-1.93.56l-1.8-1.4a2 2 0 0 0-2.5 0L2.55 5.73a2 2 0 0 0 0 2.5l1.4 1.8a10 10 0 0 0-.56 1.93l-2.1.28A2 2 0 0 0 0 13.78v.44a2 2 0 0 0 1.72 2l2.1.28c.14.66.33 1.3.56 1.93l-1.4 1.8a2 2 0 0 0 0 2.5l1.01 1.01a2 2 0 0 0 2.5 0l1.8-1.4a10 10 0 0 0 1.93.56l.28 2.1a2 2 0 0 0 2 1.72h.44a2 2 0 0 0 2-1.72l.28-2.1a10 10 0 0 0 1.93-.56l1.8 1.4a2 2 0 0 0 2.5 0l1.01-1.01a2 2 0 0 0 0-2.5l-1.4-1.8a10 10 0 0 0 .56-1.93l2.1-.28A2 2 0 0 0 24 14.22v-.44a2 2 0 0 0-1.72-2l-2.1-.28a10 10 0 0 0-.56-1.93l1.4-1.8a2 2 0 0 0 0-2.5l-1.01-1.01a2 2 0 0 0-2.5 0l-1.8 1.4a10 10 0 0 0-1.93-.56l-.28-2.1A2 2 0 0 0 12.22 2Z"/><circle cx="12" cy="12" r="3"/></svg>',
      plugins:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      layout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
      layoutRows:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>',
      store:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 10h6"/><path d="M9 14h6"/></svg>',
      settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 4.6V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
      truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>',
      mapPin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
      tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r="1"/></svg>',
      package:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2.13-1.23"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>',
      layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
      ruler:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5h18"/><path d="M3 19h18"/><path d="M5 3v16"/><path d="M19 5v14"/><path d="M9 3v5"/><path d="M15 3v5"/><path d="M9 16v5"/><path d="M15 16v5"/></svg>',
      listCheck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>',
      clipboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 12h6"/><path d="M9 16h6"/><rect x="4" y="4" width="16" height="18" rx="2"/></svg>',
      rotateCcw:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
      creditCard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
      message:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      checkCircle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
      pieChart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
      trendingUp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>',
      box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2.13-1.23"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>',
      globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      barChart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
      home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
      fileText:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>',
      image:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
      grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
      menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="2" width="20" height="16" rx="2"/><path d="M2 18h20"/></svg>',
      images:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/><path d="M18 3v18"/></svg>',
      link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
      externalLink:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>',
      shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
      clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      paperclip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
      share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51 15.42 17.49"/><path d="M15.41 6.51 8.59 10.49"/></svg>',
      megaphone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6c0-1.3.8-2.4 2-2.8"/><path d="M16 8.5v6.8"/></svg>',
      users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      briefcase:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      tool:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
      userCheck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></svg>',
      chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18 6-6-6-6"/></svg>'
    };

    const MENU=[
      {key:'overview',label:'概况',icon:ICONS.overview,children:[
        {key:'dashboard',label:'运营概览',icon:ICONS.pieChart,panel:'overviewPanel',default:true}
      ]},
      {key:'shop',label:'店铺',icon:ICONS.shop,children:[
        {key:'templates',label:'我的模板',icon:ICONS.layout,children:[
          {key:'banner',label:'轮播设置',icon:ICONS.image,panel:'sectionPanel',default:true},
          {key:'nav',label:'魔方导航',icon:ICONS.grid,panel:'sectionPanel'},
          {key:'goods',label:'精选推荐',icon:ICONS.package,panel:'sectionPanel'},
          {key:'cat',label:'分类导航',icon:ICONS.layers,panel:'sectionPanel'},
          {key:'layout',label:'首页布局',icon:ICONS.layoutRows,panel:'layoutPanel'},
          {key:'bottomNav',label:'底部导航',icon:ICONS.menu,panel:'bottomNavPanel'}
        ]},
        {key:'base',label:'基础设置',icon:ICONS.settings,panel:'basePanel'},
        {key:'info',label:'店铺设置',icon:ICONS.store,panel:'shopPanel'},
        {key:'delivery',label:'配送设置',icon:ICONS.truck,panel:'deliveryPanel'}
      ]},
      {key:'member',label:'会员',icon:ICONS.users,children:[
        {key:'list',label:'会员列表',icon:ICONS.users,panel:'memberPanel',default:true},
        {key:'group',label:'会员分组',icon:ICONS.userCheck}
      ]},
      {key:'goods',label:'商品',icon:ICONS.goods,children:[
        {key:'list',label:'商品列表',icon:ICONS.package,panel:'goodsPanel',default:true},
        {key:'category',label:'商品分类',icon:ICONS.layers,panel:'categoryPanel'},
        {key:'sku',label:'商品规格',icon:ICONS.ruler},
        {key:'attr',label:'商品属性',icon:ICONS.listCheck}
      ]},
      {key:'orders',label:'订单',icon:ICONS.orders,children:[
        {key:'list',label:'订单列表',icon:ICONS.clipboard,panel:'ordersPanel',default:true},
        {key:'refund',label:'订单售后',icon:ICONS.rotateCcw},
        {key:'cards',label:'电子卡券',icon:ICONS.creditCard},
        {key:'review',label:'评论管理',icon:ICONS.message},
        {key:'verify',label:'核销管理',icon:ICONS.checkCircle}
      ]},
      {key:'data',label:'数据',icon:ICONS.data,children:[
        {key:'overview',label:'商城概况',icon:ICONS.pieChart,default:true},
        {key:'trade',label:'交易分析',icon:ICONS.trendingUp},
        {key:'goods',label:'商品分析',icon:ICONS.box},
        {key:'web',label:'网站分析',icon:ICONS.globe},
        {key:'summary',label:'汇总分析',icon:ICONS.barChart}
      ]},
      {key:'content',label:'内容',icon:ICONS.content,children:[
        {key:'article',label:'文章管理',icon:ICONS.fileText,default:true},
        {key:'banner',label:'banner管理',icon:ICONS.image},
        {key:'cube',label:'魔方导航',icon:ICONS.grid},
        {key:'album',label:'相册管理',icon:ICONS.images},
        {key:'iframe',label:'内嵌网页',icon:ICONS.link},
        {key:'miniapp',label:'跳转小程序',icon:ICONS.externalLink}
      ]},
      {key:'system',label:'系统',icon:ICONS.system,children:[
        {key:'site',label:'站点设置',icon:ICONS.settings,default:true},
        {key:'log',label:'操作日志',icon:ICONS.clock},
        {key:'attach',label:'附件设置',icon:ICONS.paperclip},
        {key:'sms',label:'短信管理',icon:ICONS.message},
        {key:'permission',label:'权限管理',icon:ICONS.shield,children:[
          {key:'group',label:'用户组'},
          {key:'user',label:'用户列表'},
          {key:'staff',label:'员工管理'},
          {key:'dept',label:'部门管理'}
        ]}
      ]},
      {key:'plugins',label:'插件',icon:ICONS.plugins,children:[
        {key:'all',label:'全部',icon:ICONS.grid,default:true},
        {key:'channel',label:'渠道',icon:ICONS.share},
        {key:'marketing',label:'营销',icon:ICONS.megaphone},
        {key:'member',label:'会员',icon:ICONS.users},
        {key:'industry',label:'行业',icon:ICONS.briefcase},
        {key:'tool',label:'工具',icon:ICONS.tool},
        {key:'super',label:'超管',icon:ICONS.userCheck}
      ]}
    ];

    let state={first:'overview',second:'dashboard',section:'banner',navEditIdx:-1};
    let expanded=new Set();

    function findChild(parent,key){
      for(const c of parent.children){
        if(c.key===key) return c;
        if(c.children){ for(const s of c.children){ if(s.key===key) return s; } }
      }
      return parent.children[0];
    }

    function renderSidebar(){
      const l1=document.getElementById('l1Nav');
      l1.innerHTML=MENU.map(m=>{
        const active=m.key===state.first?'active':'';
        return `<div class="l1-item ${active}" onclick="switchMenu('${m.key}')">${m.icon}<span>${m.label}</span></div>`;
      }).join('');

      const parent=MENU.find(m=>m.key===state.first)||MENU[0];
      document.getElementById('l2Title').textContent=parent.label;
      const l2=document.getElementById('l2Nav');
      l2.innerHTML=parent.children.map(c=>{
        const hasChildren=c.children && c.children.length;
        const isActive=c.key===state.second || (hasChildren && c.children.some(s=>s.key===state.second));
        const activeClass=isActive?'active':'';
        const expandClass=hasChildren && expanded.has(c.key)?'expanded':'';
        const isLeaf=!hasChildren;
        const tag=isLeaf && !c.panel?'<span class="tag">待上线</span>':'';
        const arrow=hasChildren?`<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18 6-6-6-6"/></svg>`:'';
        const click=`switchMenu('${parent.key}','${c.key}')`;
        let html=`<div class="l2-item ${activeClass} ${expandClass}" onclick="${click}">${c.icon||''}<span class="txt">${c.label}</span>${tag}${arrow}</div>`;
        if(hasChildren){
          const openClass=expanded.has(c.key)||isActive?'open':'';
          html+=`<div class="l2-sub ${openClass}">${c.children.map(s=>{
            const subActive=s.key===state.second?'active':'';
            return `<div class="l2-sub-item ${subActive}" onclick="switchMenu('${parent.key}','${s.key}')">${s.label}</div>`;
          }).join('')}</div>`;
        }
        return html;
      }).join('');
    }

    function toggleExpand(key){
      if(expanded.has(key)) expanded.delete(key); else expanded.add(key);
      renderSidebar();
    }

    function switchMenu(first,second){
      const parent=MENU.find(m=>m.key===first)||MENU[0];
      if(!second){
        const def=parent.children.find(c=>c.default)||parent.children[0];
        second=def.key;
      }
      let node=findChild(parent,second);
      const path=[];
      while(node.children && node.children.length){
        path.push(node.key);
        node=node.children.find(c=>c.panel)||node.children[0];
      }
      path.forEach(k=>expanded.add(k));
      state={first,second:node.key};
      if(node.panel==='sectionPanel') state.section=node.key;
      renderSidebar();
      document.getElementById('pageTitle').textContent=node.label;

      document.querySelectorAll('.panel').forEach(p=>p.classList.add('hidden'));
      const panelId=node.panel||'placeholderPanel';
      const panel=document.getElementById(panelId);
      if(panel) panel.classList.remove('hidden');

      if(panelId==='goodsPanel') loadGoods();
      if(panelId==='categoryPanel') loadCategoriesAdmin();
      if(panelId==='ordersPanel') loadOrders();
      if(panelId==='sectionPanel') loadSection();
      if(panelId==='layoutPanel') loadLayout();
      if(panelId==='bottomNavPanel') loadBottomNav();
      if(panelId==='basePanel') loadSettings();
      if(panelId==='shopPanel') loadShopSettings();
      if(panelId==='deliveryPanel') loadDeliverySettings();
      if(panelId==='overviewPanel') loadOverviewStats();
      if(panelId==='memberPanel') loadMembers();
      window.scrollTo(0,0);
    }

    /* ===== 会员管理 ===== */
    let memberTab='all',memberPage=1,memberSize=20,memberTotal=0;
    let memberChecked=new Set();
    let memberOpId=0;
    let memberOpMode='';
    let memberGroupsCache=[],memberStaffCache=[],memberDistributorCache=[];

    function switchMemberTab(tab){
      memberTab=tab;
      document.querySelectorAll('.member-tabs .mtab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
      const isAgreement=(tab==='agreement');
      document.getElementById('memberListBox').style.display=isAgreement?'none':'';
      document.getElementById('memberAgreementBox').style.display=isAgreement?'':'none';
      document.getElementById('memberBulkBar').style.display='none';
      memberChecked.clear();
      if(isAgreement){loadMemberAgreement();}
      else{memberPage=1;loadMembers();}
    }

    async function loadMembers(){
      const kw=document.getElementById('memberKeyword').value.trim();
      const q=`?tab=${memberTab}&keyword=${encodeURIComponent(kw)}&page=${memberPage}&page_size=${memberSize}`;
      const d=await fetchA(`${BASE}/members${q}`);
      if(d.code!==0){toast(d.msg||'加载失败');return;}
      const list=d.data.list||[];
      memberTotal=d.data.total||0;
      const tbody=document.getElementById('memberTbody');
      if(list.length===0){tbody.innerHTML=`<tr><td colspan="16" class="empty-row">暂无会员数据</td></tr>`;}
      else{tbody.innerHTML=list.map(m=>renderMemberRow(m)).join('');}
      renderMemberPager();
      list.forEach(m=>{if(memberChecked.has(m.id)){const cb=document.getElementById('mchk_'+m.id);if(cb)cb.checked=true;}});
      updateMemberBulkBar();
    }

    function renderMemberRow(m){
      const ops=renderMemberOps(m);
      const avatar=m.avatar?`<img src="${m.avatar}" onerror="this.style.display='none'">`:'';
      const oid=(m.openid||'').slice(0,12);
      return `<tr>
        <td><input type="checkbox" id="mchk_${m.id}" ${memberChecked.has(m.id)?'checked':''} onchange="onMemberCheck(${m.id},this.checked)"></td>
        <td><div class="member-cell">${avatar}<div><span class="nick">${escapeHtml(m.nickname||'')}</span><span class="oid">${oid||''}</span></div></div></td>
        <td>${m.id}</td>
        <td>${escapeHtml(m.group_name||'未分组')}</td>
        <td>${escapeHtml(m.phone||'-')}</td>
        <td>${m.gender_text||'未知'}</td>
        <td>${escapeHtml(m.source||'-')}</td>
        <td>V${m.level||0}</td>
        <td>${m.growth||0}</td>
        <td>${m.points||0}</td>
        <td>¥${(m.balance_yuan!=null?m.balance_yuan:0)}</td>
        <td>${escapeHtml(m.staff_name||'-')}</td>
        <td>${escapeHtml(m.distributor_name||'-')}</td>
        <td>${escapeHtml(m.tags||'-')}</td>
        <td>${escapeHtml((m.created_at||'').slice(0,10))}</td>
        <td><div class="member-ops">${ops}</div></td>
      </tr>`;
    }

    function renderMemberOps(m){
      if(memberTab==='logout'){
        return `<button class="btn sm outline" onclick="openMemberInfo(${m.id})">用户信息</button>
                <button class="btn sm" onclick="handleLogout(${m.id},'pass')">通过</button>
                <button class="btn sm gray" onclick="handleLogout(${m.id},'reject')">拒绝</button>`;
      }
      return `<button class="btn sm outline" onclick="openMemberInfo(${m.id})">用户信息</button>
              <button class="btn sm" onclick="openMemberEdit(${m.id})">修改</button>
              <button class="btn sm" onclick="openMemberStaff(${m.id})">分配员工</button>
              <button class="btn sm" onclick="openMemberDistributor(${m.id})">分配分销商</button>
              <button class="btn sm gray" onclick="deleteMember(${m.id})">删除</button>`;
    }

    function onMemberCheck(id,checked){if(checked)memberChecked.add(id);else memberChecked.delete(id);updateMemberBulkBar();}
    function toggleMemberCheckAll(v){
      document.querySelectorAll('#memberTbody input[type=checkbox]').forEach(b=>{
        const id=parseInt(b.id.replace('mchk_',''),10);
        if(v)memberChecked.add(id);else memberChecked.delete(id);
        b.checked=v;
      });
      updateMemberBulkBar();
    }
    function updateMemberBulkBar(){
      document.getElementById('memberCheckedCount').textContent=memberChecked.size;
      document.getElementById('memberBulkBar').style.display=memberChecked.size>0?'flex':'none';
    }
    function clearMemberCheck(){memberChecked.clear();toggleMemberCheckAll(false);}

    function renderMemberPager(){
      const pages=Math.max(1,Math.ceil(memberTotal/memberSize));
      document.getElementById('memberPager').innerHTML=`<button ${memberPage<=1?'disabled':''} onclick="memberPage--;loadMembers()">上一页</button>
        <span style="font-size:12px;color:#888">第 ${memberPage} / ${pages} 页（共 ${memberTotal} 条）</span>
        <button ${memberPage>=pages?'disabled':''} onclick="memberPage++;loadMembers()">下一页</button>`;
    }

    async function openMemberInfo(id){
      const d=await fetchA(`${BASE}/members/${id}`);
      if(d.code!==0){toast(d.msg||'加载失败');return;}
      const m=d.data;
      document.getElementById('memberInfoBody').innerHTML=`
        <img class="member-info-avatar" src="${m.avatar||''}" onerror="this.style.display='none'">
        <div class="member-info-row"><span class="k">昵称</span><span class="v">${escapeHtml(m.nickname||'')}</span></div>
        <div class="member-info-row"><span class="k">ID</span><span class="v">${m.id}</span></div>
        <div class="member-info-row"><span class="k">手机号</span><span class="v">${escapeHtml(m.phone||'-')}</span></div>
        <div class="member-info-row"><span class="k">性别</span><span class="v">${m.gender==1?'男':(m.gender==2?'女':'未知')}</span></div>
        <div class="member-info-row"><span class="k">会员分组</span><span class="v">${escapeHtml(m.group_name||'未分组')}</span></div>
        <div class="member-info-row"><span class="k">会员等级</span><span class="v">V${m.level||0}</span></div>
        <div class="member-info-row"><span class="k">成长值</span><span class="v">${m.growth||0}</span></div>
        <div class="member-info-row"><span class="k">积分</span><span class="v">${m.points||0}</span></div>
        <div class="member-info-row"><span class="k">储值余额</span><span class="v">¥${(m.balance_yuan!=null?m.balance_yuan:0)}</span></div>
        <div class="member-info-row"><span class="k">所在员工</span><span class="v">${escapeHtml(m.staff_name||'-')}</span></div>
        <div class="member-info-row"><span class="k">所在分销商</span><span class="v">${escapeHtml(m.distributor_name||'-')}</span></div>
        <div class="member-info-row"><span class="k">授权状态</span><span class="v">${m.auth_status==1?'已授权':'未授权'}</span></div>
        <div class="member-info-row"><span class="k">注册时间</span><span class="v">${escapeHtml(m.created_at||'')}</span></div>
        ${m.delete_status==1?`<div class="member-info-row"><span class="k">注销申请</span><span class="v">${escapeHtml(m.delete_reason||'')}（${escapeHtml(m.delete_apply_time||'')}）</span></div>`:''}
      `;
      document.getElementById('memberInfoModal').classList.add('open');
    }
    function closeMemberInfo(){document.getElementById('memberInfoModal').classList.remove('open');}

    async function openMemberEdit(id){
      const d=await fetchA(`${BASE}/members/${id}`);
      if(d.code!==0){toast(d.msg||'加载失败');return;}
      const m=d.data;
      const g=await fetchA(`${BASE}/member_groups`);
      memberGroupsCache=g.data||[];
      document.getElementById('mEditId').value=m.id;
      document.getElementById('mEditNickname').value=m.nickname||'';
      document.getElementById('mEditPhone').value=m.phone||'';
      setRadioValue('mEditGender',String(m.gender||0));
      document.getElementById('mEditLevel').value=m.level||0;
      document.getElementById('mEditGrowth').value=m.growth||0;
      document.getElementById('mEditPoints').value=m.points||0;
      document.getElementById('mEditBalance').value=(m.balance_yuan!=null?m.balance_yuan:0);
      document.getElementById('mEditTags').value=m.tags||'';
      const sel=document.getElementById('mEditGroup');
      sel.innerHTML=memberGroupsCache.map(x=>`<option value="${x.id}" ${x.id==m.group_id?'selected':''}>${escapeHtml(x.name)}</option>`).join('');
      document.getElementById('memberEditModal').classList.add('open');
    }
    function closeMemberEdit(){document.getElementById('memberEditModal').classList.remove('open');}
    async function saveMemberEdit(){
      const id=document.getElementById('mEditId').value;
      const data={
        nickname:document.getElementById('mEditNickname').value.trim(),
        phone:document.getElementById('mEditPhone').value.trim(),
        gender:parseInt(getRadioValue('mEditGender')||'0',10),
        level:parseInt(document.getElementById('mEditLevel').value||0,10),
        growth:parseInt(document.getElementById('mEditGrowth').value||0,10),
        points:parseInt(document.getElementById('mEditPoints').value||0,10),
        balance_yuan:parseFloat(document.getElementById('mEditBalance').value||0),
        group_id:parseInt(document.getElementById('mEditGroup').value||0,10),
        tags:document.getElementById('mEditTags').value.trim()
      };
      const d=await fetchA(`${BASE}/members/${id}/save`,{method:'POST',body:data});
      if(d.code!==0){toast(d.msg||'保存失败');return;}
      toast('已保存');closeMemberEdit();loadMembers();
    }

    async function openMemberStaff(id){
      memberOpId=id;memberOpMode='staff';
      const d=await fetchA(`${BASE}/member_staff`);
      memberStaffCache=d.data||[];
      document.getElementById('memberStaffTitle').textContent=id?'分配员工':'批量分配员工';
      renderStaffList();
      document.getElementById('memberStaffModal').classList.add('open');
    }
    async function openBatchStaff(){
      if(memberChecked.size===0){toast('请先勾选会员');return;}
      memberOpId=0;memberOpMode='batchStaff';
      const d=await fetchA(`${BASE}/member_staff`);
      memberStaffCache=d.data||[];
      document.getElementById('memberStaffTitle').textContent='批量分配员工';
      renderStaffList();
      document.getElementById('memberStaffModal').classList.add('open');
    }
    function renderStaffList(){
      const wrap=document.getElementById('memberStaffList');
      if(memberStaffCache.length===0){wrap.innerHTML='<div style="padding:20px;text-align:center;color:#999">暂无员工，请先在员工管理中添加</div>';return;}
      wrap.innerHTML=memberStaffCache.map(s=>`<div class="sel-item" onclick="confirmAssignStaff(${s.id})">
        <div><div class="sel-name">${escapeHtml(s.name)}</div><div class="sel-sub">${escapeHtml(s.phone||'')}</div></div>
        <span class="sel-badge">选择</span></div>`).join('');
    }
    async function confirmAssignStaff(staffId){
      const ids=memberOpMode==='batchStaff'?[...memberChecked]:[memberOpId];
      for(const id of ids){await fetchA(`${BASE}/members/${id}/assign_staff`,{method:'POST',body:{staff_id:staffId}});}
      toast('分配成功');closeMemberStaff();clearMemberCheck();loadMembers();
    }
    function closeMemberStaff(){document.getElementById('memberStaffModal').classList.remove('open');}

    async function openMemberDistributor(id){
      memberOpId=id;memberOpMode='distributor';
      const d=await fetchA(`${BASE}/member_distributors`);
      memberDistributorCache=d.data||[];
      document.getElementById('memberDistributorTitle').textContent=id?'分配分销商':'批量分配分销商';
      renderDistributorList();
      document.getElementById('memberDistributorModal').classList.add('open');
    }
    async function openBatchDistributor(){
      if(memberChecked.size===0){toast('请先勾选会员');return;}
      memberOpId=0;memberOpMode='batchDistributor';
      const d=await fetchA(`${BASE}/member_distributors`);
      memberDistributorCache=d.data||[];
      document.getElementById('memberDistributorTitle').textContent='批量分配分销商';
      renderDistributorList();
      document.getElementById('memberDistributorModal').classList.add('open');
    }
    function renderDistributorList(){
      const wrap=document.getElementById('memberDistributorList');
      if(memberDistributorCache.length===0){wrap.innerHTML='<div style="padding:20px;text-align:center;color:#999">暂无分销商</div>';return;}
      wrap.innerHTML=memberDistributorCache.map(s=>`<div class="sel-item" onclick="confirmAssignDistributor(${s.id})">
        <div><div class="sel-name">${escapeHtml(s.name)}</div><div class="sel-sub">${escapeHtml(s.phone||'')}</div></div>
        <span class="sel-badge">选择</span></div>`).join('');
    }
    async function confirmAssignDistributor(distId){
      const ids=memberOpMode==='batchDistributor'?[...memberChecked]:[memberOpId];
      for(const id of ids){await fetchA(`${BASE}/members/${id}/assign_distributor`,{method:'POST',body:{distributor_id:distId}});}
      toast('分配成功');closeMemberDistributor();clearMemberCheck();loadMembers();
    }
    function closeMemberDistributor(){document.getElementById('memberDistributorModal').classList.remove('open');}

    async function openMemberGroup(id){
      let title='修改分组';
      if(!id){if(memberChecked.size===0){toast('请先勾选会员');return;}memberOpMode='batchGroup';title='批量修改分组';}
      else{memberOpId=id;memberOpMode='group';}
      document.getElementById('memberGroupTitle').textContent=title;
      const d=await fetchA(`${BASE}/member_groups`);
      memberGroupsCache=d.data||[];
      document.getElementById('mGroupSelect').innerHTML=memberGroupsCache.map(g=>`<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('');
      document.getElementById('memberGroupModal').classList.add('open');
    }
    function closeMemberGroup(){document.getElementById('memberGroupModal').classList.remove('open');}
    async function submitMemberGroup(){
      const gid=parseInt(document.getElementById('mGroupSelect').value||0,10);
      const ids=memberOpMode==='batchGroup'?[...memberChecked]:[memberOpId];
      for(const id of ids){await fetchA(`${BASE}/members/${id}/save`,{method:'POST',body:{group_id:gid}});}
      toast('已更新分组');closeMemberGroup();clearMemberCheck();loadMembers();
    }

    async function exportMembers(){
      const d=await fetchA(`${BASE}/members?tab=${memberTab}&keyword=${encodeURIComponent(document.getElementById('memberKeyword').value.trim())}&page=1&page_size=100000`);
      const list=(d.data&&d.data.list)||[];
      if(list.length===0){toast('暂无可导出数据');return;}
      const headers=['ID','昵称','手机号','性别','会员分组','等级','成长值','积分','储值余额','所在员工','所在分销商','注册时间'];
      const rows=list.map(m=>[m.id,m.nickname,m.phone,m.gender_text,m.group_name,'V'+(m.level||0),m.growth,m.points,m.balance_yuan,m.staff_name,m.distributor_name,(m.created_at||'').slice(0,10)]);
      const csv=[headers.join(',')].concat(rows.map(r=>r.map(c=>`"${String(c==null?'':c).replace(/"/g,'""')}"`).join(','))).join('\n');
      const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='会员列表.csv';a.click();
      toast('已导出');
    }
    function importMembers(input){
      if(!input.files||!input.files.length){return;}
      toast('导入功能即将开放，当前可手动维护');
      input.value='';
    }

    async function deleteMember(id){
      if(!confirm('确定删除该会员？删除后将从列表中隐藏。'))return;
      const d=await fetchA(`${BASE}/members/${id}/logout`,{method:'POST',body:{action:'pass'}});
      if(d.code!==0){toast(d.msg||'操作失败');return;}
      toast('已删除');loadMembers();
    }
    async function handleLogout(id,action){
      const d=await fetchA(`${BASE}/members/${id}/logout`,{method:'POST',body:{action}});
      if(d.code!==0){toast(d.msg||'操作失败');return;}
      toast(action==='pass'?'已通过注销申请':'已拒绝注销申请');loadMembers();
    }

    async function loadMemberAgreement(){
      const d=await fetchA(`${BASE}/member_agreement`);
      document.getElementById('memberAgreementContent').value=(d.data&&d.data.content)||'';
    }
    async function saveMemberAgreement(){
      const content=document.getElementById('memberAgreementContent').value;
      const d=await fetchA(`${BASE}/member_agreement`,{method:'POST',body:{content}});
      if(d.code!==0){toast(d.msg||'保存失败');return;}
      toast('协议已保存');
    }

    function loadOverviewStats(){
      // 先用静态模拟，后续可对接 /admin/stats
      document.getElementById('ovOrder').textContent='128';
      document.getElementById('ovSale').textContent='¥3,420';
      document.getElementById('ovPending').textContent='23';
      document.getElementById('ovGoods').textContent='86';
    }

    /* Auth */
    async function fetchA(url,opts={}){
      opts.headers=opts.headers||{};
      opts.headers['X-Admin-Token']=token();
      if(opts.body && typeof opts.body==='object'){
        opts.headers['Content-Type']='application/json';
        opts.body=JSON.stringify(opts.body);
      }
      const r=await fetch(url,opts);
      if(r.status===401){logout();throw new Error('未授权');}
      return r.json();
    }
    function toast(msg){
      const t=document.getElementById('toast');
      t.textContent=msg;t.classList.add('show');
      setTimeout(()=>t.classList.remove('show'),2000);
    }
    async function login(){
      const username=document.getElementById('user').value;
      const password=document.getElementById('pass').value;
      const r=await fetch(`${BASE}/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
      const d=await r.json();
      if(d.code===0){
        localStorage.setItem('admin_token',d.data.token);
        localStorage.setItem('admin_user',d.data.username||username);
        document.getElementById('loginWrap').classList.add('hidden');
        document.getElementById('mainView').classList.remove('hidden');
        document.getElementById('who').textContent=d.data.username||username;
        renderSidebar();
        switchMenu('overview','dashboard');
      }else{toast(d.msg||'登录失败');}
    }
    function logout(){
      localStorage.removeItem('admin_token');
      document.getElementById('mainView').classList.add('hidden');
      document.getElementById('loginWrap').classList.remove('hidden');
    }

    /* Upload helper */
    async function uploadToServer(file,type='image'){
      const fd=new FormData();
      fd.append('file',file);
      const endpoint=type==='video'?'upload/video':'upload/image';
      const r=await fetch(`${BASE}/${endpoint}`,{method:'POST',headers:{'X-Admin-Token':token()},body:fd});
      const d=await r.json();
      if(d.code===0)return d.data.url;
      toast(d.msg||'上传失败');return '';
    }

    /* Goods */
    let goodsPage=1;
    let gState={images:[],videoCover:'',shareCover:'',specs:[],skus:[],attrs:[],editingAttrIdx:null,avValues:[]};

    async function loadCategories(){
      const d=await fetchA(`${BASE}/categories`);
      if(d.code!==0) return;
      const opts=d.data.list.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
      document.getElementById('goodsCat').innerHTML='<option value="0">全部分类</option>'+opts;
      document.getElementById('gCat').innerHTML=opts;
    }
    function fmtMoney(n){return '¥'+(n/100).toFixed(2);}
    function statusBadge(s){return s==1?'<span class="badge green">上架</span>':'<span class="badge gray">下架</span>';}
    async function loadGoods(){
      const cat=document.getElementById('goodsCat').value;
      const kw=document.getElementById('goodsKw').value;
      const q=`?category_id=${cat}&keyword=${encodeURIComponent(kw)}&page=${goodsPage}&page_size=10`;
      const d=await fetchA(`${BASE}/goods${q}`);
      if(d.code!==0){toast(d.msg);return;}
      const tb=document.getElementById('goodsBody');
      tb.innerHTML=d.data.list.map(g=>`<tr>
        <td>${g.id}</td>
        <td><img class="thumb" src="${g.cover||''}" onerror="this.style.display='none'"></td>
        <td><div style="font-weight:600">${g.title}</div><div class="muted">${g.subtitle||''}</div></td>
        <td>${g.category_name||'-'}</td>
        <td>${fmtMoney(g.price)}</td>
        <td>${g.stock}</td>
        <td>${statusBadge(g.status)}</td>
        <td>
          <button class="btn sm outline" onclick="editGoods(${g.id})">编辑</button>
          <button class="btn sm gray" onclick="removeGoods(${g.id})">删除</button>
        </td>
      </tr>`).join('');
      const p=d.data.pagination||{};
      document.getElementById('goodsPager').innerHTML=`
        <button ${goodsPage<=1?'disabled':''} onclick="goodsPage--;loadGoods()">上一页</button>
        <span style="font-size:12px;color:#888">第 ${p.page||goodsPage} / ${p.last_page||1} 页</span>
        <button ${goodsPage>=(p.last_page||1)?'disabled':''} onclick="goodsPage++;loadGoods()">下一页</button>`;
    }

    function switchGoodsTab(tab){
      document.querySelectorAll('.goods-tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));
      document.querySelectorAll('.goods-panel').forEach(p=>p.classList.toggle('active',p.id==='tab-'+tab));
    }

    function openGoodsModal(){
      document.getElementById('goodsModal').classList.add('show');
      document.getElementById('goodsModalTitle').textContent='添加商品';
      clearGoodsForm();
    }
    function closeGoodsModal(){document.getElementById('goodsModal').classList.remove('show');}

    function clearGoodsForm(){
      gState={images:[],videoCover:'',shareCover:'',specs:[],skus:[],attrs:[],editingSpecIdx:-1,editingAttrIdx:-1,svValues:[],avValues:[]};
      ['gId','gTitle','gCode','gBarcode','gPromo','gUnit','gPrice','gMarket','gCost','gStock','gVirtualSales','gSort','gVideoUrl','gNotice','gRemark','gWeight','gMinBuy','gLimitLifetimeNum','gLimitPeriodDay','gLimitPeriodNum','gMessage','gShareTitle'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
      setRadio('gType','physical');setRadio('gVideoType','mp4');setRadio('gAutoPlay','0');
      setRadio('gShowStock','1');setRadio('gStatus','1');setRadio('gLimitType','none');setRadio('gAgreement','0');
      document.getElementById('gShipSelf').checked=false;document.getElementById('gShipSame').checked=false;
      document.getElementById('gDetail').innerHTML='';
      renderImages();renderVideoCover();renderShareCover();renderSelectedSpecs();renderSelectedAttrs();renderSkus();toggleLimit();toggleVideoType();calcProfit();
      switchGoodsTab('base');
    }
    function setRadio(name,val){document.querySelectorAll(`input[name="${name}"]`).forEach(r=>{r.checked=r.value===val;updateRadioStyle(r);});}
    function getRadio(name){const r=document.querySelector(`input[name="${name}"]:checked`);return r?r.value:null;}
    function updateRadioStyle(r){
      const item=r.closest('.radio-item');
      if(item){item.classList.toggle('active',r.checked);return;}
      const legacy=r.closest('.radio');
      if(legacy) legacy.classList.toggle('checked',r.checked);
    }
    document.querySelectorAll('.radio-item input[type=radio], .radio input[type=radio]').forEach(r=>r.addEventListener('change',()=>{document.querySelectorAll(`input[name="${r.name}"]`).forEach(x=>updateRadioStyle(x));}));

    function calcProfit(){
      const price=parseFloat(document.getElementById('gPrice').value)||0;
      const cost=parseFloat(document.getElementById('gCost').value)||0;
      const el=document.getElementById('gProfit');
      if(el) el.value=(price-cost).toFixed(2);
    }
    function toggleVideoType(){
      const type=getRadio('gVideoType');
      document.getElementById('gVideoRow').classList.toggle('hidden',type!=='mp4');
    }
    function toggleLimit(){
      const type=getRadio('gLimitType');
      document.getElementById('gLimitLifetime').classList.toggle('hidden',type!=='lifetime');
      document.getElementById('gLimitPeriod').classList.toggle('hidden',type!=='period');
    }

    async function uploadGoodsImages(input){
      if(!input.files.length)return;
      for(const file of input.files){
        const url=await uploadToServer(file,'image');
        if(url)gState.images.push(url);
      }
      input.value='';renderImages();
    }
    function removeGoodsImage(idx){gState.images.splice(idx,1);renderImages();}
    function renderImages(){
      const wrap=document.getElementById('gImagesWrap');
      const add=`<div class="upload-box-ref" onclick="document.getElementById('gImagesFile').click()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><input type="file" id="gImagesFile" accept="image/*" multiple onchange="uploadGoodsImages(this)" style="display:none"></div>`;
      wrap.innerHTML=gState.images.map((u,i)=>`<div class="upload-box-ref"><img src="${u}"><span class="del" onclick="removeGoodsImage(${i})">&times;</span></div>`).join('')+add;
    }

    async function uploadGoodsVideo(input){
      if(!input.files[0])return;
      const url=await uploadToServer(input.files[0],'video');
      if(url)document.getElementById('gVideoUrl').value=url;
      input.value='';
    }
    async function uploadGoodsVideoCover(input){
      if(!input.files[0])return;
      const url=await uploadToServer(input.files[0],'image');
      if(url)gState.videoCover=url;
      input.value='';renderVideoCover();
    }
    function renderVideoCover(){
      const wrap=document.getElementById('gVideoCoverWrap');
      const add=`<div class="upload-box-ref" id="gVideoCoverAdd" onclick="document.getElementById('gVideoCoverFile').click()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><input type="file" id="gVideoCoverFile" accept="image/*" style="display:none" onchange="uploadGoodsVideoCover(this)"></div>`;
      if(gState.videoCover){wrap.innerHTML=`<div class="upload-box-ref"><img src="${gState.videoCover}"><span class="del" onclick="gState.videoCover='';renderVideoCover()">&times;</span></div>`;}
      else{wrap.innerHTML=add;}
    }

    async function uploadShareCover(input){
      if(!input.files[0])return;
      const url=await uploadToServer(input.files[0],'image');
      if(url)gState.shareCover=url;
      input.value='';renderShareCover();
    }
    function renderShareCover(){
      const wrap=document.getElementById('gShareCoverWrap');
      const add=`<div class="upload-box-ref" id="gShareCoverAdd" onclick="document.getElementById('gShareCoverFile').click()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><input type="file" id="gShareCoverFile" accept="image/*" style="display:none" onchange="uploadShareCover(this)"></div>`;
      if(gState.shareCover){wrap.innerHTML=`<div class="upload-box-ref"><img src="${gState.shareCover}"><span class="del" onclick="gState.shareCover='';renderShareCover()">&times;</span></div>`;}
      else{wrap.innerHTML=add;}
    }

    /* Spec / SKU */
    function openSpecMgmtModal(){document.getElementById('specMgmtModal').classList.add('show');renderSpecMgmtTable();}
    function closeSpecMgmtModal(){document.getElementById('specMgmtModal').classList.remove('show');renderSelectedSpecs();renderSkus();}
    function renderSpecMgmtTable(){
      const tb=document.getElementById('specMgmtTable');
      const empty=document.getElementById('specMgmtEmpty');
      if(!gState.specs.length){tb.innerHTML='';empty.style.display='block';return;}
      empty.style.display='none';
      tb.innerHTML=gState.specs.map((s,i)=>`
        <tr>
          <td>${escapeHtml(s.name||'-')}</td>
          <td>${(s.values||[]).map(v=>escapeHtml(v.value)).join(', ')}</td>
          <td><input type="checkbox" ${s.selected!==false?'checked':''} onchange="toggleSpecSelected(${i})"></td>
          <td><span class="op"><a onclick="moveSpecMgmtRow(${i},-1)">↑</a><a onclick="moveSpecMgmtRow(${i},1)">↓</a></span></td>
          <td><span class="op"><a onclick="openSpecValueModal(${i})">编辑</a><a class="danger" onclick="deleteSpecMgmtRow(${i})">删除</a></span></td>
        </tr>`).join('');
    }
    function toggleSpecSelected(idx){gState.specs[idx].selected=!gState.specs[idx].selected;renderSpecMgmtTable();syncSkus();}
    function moveSpecMgmtRow(idx,dir){const n=idx+dir;if(n<0||n>=gState.specs.length)return;[gState.specs[idx],gState.specs[n]]=[gState.specs[n],gState.specs[idx]];renderSpecMgmtTable();syncSkus();}
    function deleteSpecMgmtRow(idx){if(!confirm('确定删除该规格？'))return;gState.specs.splice(idx,1);renderSpecMgmtTable();syncSkus();}

    function openSpecValueModal(idx){
      gState.editingSpecIdx=(typeof idx==='number')?idx:-1;
      const s=gState.editingSpecIdx>=0?gState.specs[gState.editingSpecIdx]:null;
      document.getElementById('specValueModalTitle').textContent=s?'编辑规格':'添加规格';
      document.getElementById('svName').value=s?s.name:'';
      gState.svValues=s?[...s.values]:[];
      document.getElementById('svValueInput').value='';
      renderSpecValueChips();
      document.getElementById('specValueModal').classList.add('show');
    }
    function closeSpecValueModal(){document.getElementById('specValueModal').classList.remove('show');}
    function renderSpecValueChips(){
      const wrap=document.getElementById('svValueList');
      wrap.innerHTML=gState.svValues.map((v,i)=>`<span class="spec-tag">${escapeHtml(v.value)}<span class="remove" onclick="removeSpecValueChip(${i})">&times;</span></span>`).join('');
    }
    function addSpecValueChip(){
      const input=document.getElementById('svValueInput');
      const val=input.value.trim();if(!val)return;
      gState.svValues.push({id:'sv_'+Date.now()+Math.random(),value:val});
      input.value='';renderSpecValueChips();
    }
    function removeSpecValueChip(i){gState.svValues.splice(i,1);renderSpecValueChips();}
    function saveSpecValueModal(){
      const name=document.getElementById('svName').value.trim();
      if(!name){toast('请输入规格名称');return;}
      const item={id:'sp_'+Date.now(),name:name,values:[...gState.svValues],selected:true};
      if(gState.editingSpecIdx>=0){item.id=gState.specs[gState.editingSpecIdx].id;item.selected=gState.specs[gState.editingSpecIdx].selected!==false;gState.specs[gState.editingSpecIdx]=item;}
      else{gState.specs.push(item);}
      closeSpecValueModal();renderSpecMgmtTable();syncSkus();
    }

    function renderSelectedSpecs(){
      const wrap=document.getElementById('selectedSpecPreview');
      const selected=gState.specs.filter(s=>s.selected!==false&&s.name&&s.values.length);
      if(!selected.length){wrap.innerHTML='';return;}
      wrap.innerHTML=selected.map(s=>`<div style="margin-bottom:8px"><span style="color:#606266;font-size:13px">${escapeHtml(s.name)}：</span>${s.values.map(v=>`<span class="spec-tag">${escapeHtml(v.value)}</span>`).join('')}</div>`).join('');
    }

    function syncSkus(){
      const specs=gState.specs.filter(s=>s.selected!==false&&s.name&&s.values.length);
      if(!specs.length){gState.skus=[];renderSkus();return;}
      const combos=cartesian(specs.map(s=>s.values.map(v=>({specId:s.id,specName:s.name,specValueId:v.id,specValue:v.value}))));
      const oldMap=new Map(gState.skus.map(s=>[s.spec_value_ids.join(','),s]));
      gState.skus=combos.map(c=>{
        const ids=c.map(x=>x.specValueId);
        const key=ids.join(',');
        const old=oldMap.get(key)||{price:0,market_price:0,stock:0,image:''};
        return{spec_value_ids:ids,specNames:c.map(x=>x.specName).join('·'),specValues:c.map(x=>x.specValue).join('/'),price:old.price,market_price:old.market_price,stock:old.stock,image:old.image};
      });
      renderSkus();
    }
    function cartesian(arr){return arr.reduce((a,b)=>a.flatMap(d=>b.map(e=>[...d,e])),[[]]);}
    function updateSku(idx,key,val){gState.skus[idx][key]=val;}
    async function uploadSkuImage(idx,input){
      if(!input.files[0])return;
      const url=await uploadToServer(input.files[0],'image');
      if(url){gState.skus[idx].image=url;renderSkus();}
      input.value='';
    }
    function renderSkus(){
      const wrap=document.getElementById('skuTableWrap');
      if(!gState.skus.length){wrap.innerHTML='';return;}
      wrap.innerHTML=`<table class="sku-table"><thead><tr><th>规格组合</th><th>销售价</th><th>市场价</th><th>库存</th><th>图片</th></tr></thead><tbody>
        ${gState.skus.map((s,i)=>`<tr>
          <td>${s.specValues}</td>
          <td><input type="number" placeholder="销售价" value="${s.price||''}" oninput="updateSku(${i},'price',this.value)"></td>
          <td><input type="number" placeholder="市场价" value="${s.market_price||''}" oninput="updateSku(${i},'market_price',this.value)"></td>
          <td><input type="number" placeholder="库存" value="${s.stock||''}" oninput="updateSku(${i},'stock',this.value)"></td>
          <td><div style="display:flex;align-items:center;gap:6px">${s.image?`<img src="${s.image}" style="width:36px;height:36px;object-fit:cover;border-radius:4px">`:''}<button class="btn sm outline" onclick="document.getElementById('skuImg_${i}').click()">上传</button><input type="file" id="skuImg_${i}" accept="image/*" style="display:none" onchange="uploadSkuImage(${i},this)"></div></td>
        </tr>`).join('')}
      </tbody></table>`;
    }

    /* Attrs */
    function openAttrMgmtModal(){document.getElementById('attrMgmtModal').classList.add('show');renderAttrMgmtTable();}
    function closeAttrMgmtModal(){document.getElementById('attrMgmtModal').classList.remove('show');renderSelectedAttrs();}
    function renderAttrMgmtTable(){
      const tb=document.getElementById('attrMgmtTable');
      const empty=document.getElementById('attrMgmtEmpty');
      if(!gState.attrs.length){tb.innerHTML='';empty.style.display='block';return;}
      empty.style.display='none';
      tb.innerHTML=gState.attrs.map((a,i)=>`
        <tr>
          <td>${escapeHtml(a.name||'-')}</td>
          <td>${(a.values||[]).map(v=>escapeHtml(v)).join(', ')}</td>
          <td><input type="checkbox" ${a.selected!==false?'checked':''} onchange="toggleAttrSelected(${i})"></td>
          <td><span class="op"><a onclick="moveAttrMgmtRow(${i},-1)">↑</a><a onclick="moveAttrMgmtRow(${i},1)">↓</a></span></td>
          <td><span class="op"><a onclick="openAttrValueModal(${i})">编辑</a><a class="danger" onclick="deleteAttrMgmtRow(${i})">删除</a></span></td>
        </tr>`).join('');
    }
    function toggleAttrSelected(idx){gState.attrs[idx].selected=!gState.attrs[idx].selected;renderAttrMgmtTable();}
    function moveAttrMgmtRow(idx,dir){const n=idx+dir;if(n<0||n>=gState.attrs.length)return;[gState.attrs[idx],gState.attrs[n]]=[gState.attrs[n],gState.attrs[idx]];renderAttrMgmtTable();}
    function deleteAttrMgmtRow(idx){if(!confirm('确定删除该属性？'))return;gState.attrs.splice(idx,1);renderAttrMgmtTable();}

    function openAttrValueModal(idx){
      gState.editingAttrIdx=(typeof idx==='number')?idx:-1;
      const a=gState.editingAttrIdx>=0?gState.attrs[gState.editingAttrIdx]:null;
      document.getElementById('attrValueModalTitle').textContent=a?'编辑属性':'添加属性';
      document.getElementById('avName').value=a?a.name:'';
      gState.avValues=a?[...(a.values||[])]:[];
      document.getElementById('avValueInput').value='';
      renderAttrValueChips();
      document.getElementById('attrValueModal').classList.add('show');
    }
    function closeAttrValueModal(){document.getElementById('attrValueModal').classList.remove('show');}
    function renderAttrValueChips(){
      const wrap=document.getElementById('avValueList');
      wrap.innerHTML=gState.avValues.map((v,i)=>`<span class="spec-tag">${escapeHtml(v)}<span class="remove" onclick="removeAttrValueChip(${i})">&times;</span></span>`).join('');
    }
    function addAttrValueChip(){
      const input=document.getElementById('avValueInput');
      const val=input.value.trim();if(!val)return;
      gState.avValues.push(val);
      input.value='';renderAttrValueChips();
    }
    function removeAttrValueChip(i){gState.avValues.splice(i,1);renderAttrValueChips();}
    function saveAttrValueModal(){
      const name=document.getElementById('avName').value.trim();
      if(!name){toast('请输入属性名称');return;}
      const item={id:'at_'+Date.now(),name:name,values:[...gState.avValues],selected:true};
      if(gState.editingAttrIdx>=0){item.id=gState.attrs[gState.editingAttrIdx].id;item.selected=gState.attrs[gState.editingAttrIdx].selected!==false;gState.attrs[gState.editingAttrIdx]=item;}
      else{gState.attrs.push(item);}
      closeAttrValueModal();renderAttrMgmtTable();
    }
    function renderSelectedAttrs(){
      const wrap=document.getElementById('selectedAttrPreview');
      const selected=gState.attrs.filter(a=>a.selected!==false&&a.name);
      if(!selected.length){wrap.innerHTML='';return;}
      wrap.innerHTML=selected.map(a=>`<div style="margin-bottom:8px"><span style="color:#606266;font-size:13px">${escapeHtml(a.name)}：</span><span style="color:#303133;font-size:13px">${(a.values||[]).map(v=>escapeHtml(v)).join(', ')}</span></div>`).join('');
    }

    /* Rich text editor（保存选区，工具栏/插入资源时不会丢失光标） */
    let gDetailRange=null;
    const gDetailEl=document.getElementById('gDetail');
    const gDetailSource=document.getElementById('gDetailSource');
    const rteWrap=gDetailEl.closest('.rte-wrap');
    document.addEventListener('selectionchange',()=>{
      const s=window.getSelection();
      if(s&&s.rangeCount&&gDetailEl.contains(s.anchorNode)){gDetailRange=s.getRangeAt(0).cloneRange();}
    });
    function restoreDetailRange(){
      if(!gDetailRange)return;
      gDetailEl.focus();
      const s=window.getSelection();s.removeAllRanges();s.addRange(gDetailRange);
    }
    function rteExec(cmd,val=null){
      restoreDetailRange();
      if(cmd==='hiliteColor'||cmd==='backColor')try{document.execCommand('styleWithCSS',false,true);}catch(e){}
      document.execCommand(cmd,false,val);
      rteUpdateActive();
    }
    function rteFormatBlock(tag){
      if(!tag)return;
      restoreDetailRange();
      if(tag==='blockquote'){
        const s=window.getSelection();
        if(s.rangeCount){const r=s.getRangeAt(0);const q=document.createElement('blockquote');r.surroundContents(q);}
      }else{
        document.execCommand('formatBlock',false,tag);
      }
      rteUpdateActive();
    }
    function rteInsertLink(){
      restoreDetailRange();
      const url=prompt('请输入链接地址：','https://');
      if(url)rteExec('createLink',url);
    }
    function rteInsertTable(){
      const cols=parseInt(prompt('列数',3),10)||3;
      const rows=parseInt(prompt('行数',3),10)||3;
      let html='<table><tbody>';
      for(let i=0;i<rows;i++){html+='<tr>';for(let j=0;j<cols;j++){html+='<td> </td>';}html+='</tr>';}
      html+='</tbody></table><p><br></p>';
      restoreDetailRange();document.execCommand('insertHTML',false,html);
    }
    function rteInsertHr(){restoreDetailRange();document.execCommand('insertHTML',false,'<hr>');}
    function rteWrapCode(){
      restoreDetailRange();
      const s=window.getSelection();
      if(s.rangeCount){const r=s.getRangeAt(0);const pre=document.createElement('pre');const code=document.createElement('code');pre.appendChild(code);r.surroundContents(pre);}
    }
    function rteForeColor(color){restoreDetailRange();rteExec('foreColor',color);}
    function rteInsertEmoji(btn){const picker=document.getElementById('rteEmojiPicker');const rect=btn.getBoundingClientRect();picker.style.left=Math.min(rect.left-4,document.documentElement.clientWidth-196)+'px';picker.style.top=(rect.bottom+4)+'px';picker.classList.toggle('show');}
    function rtePickEmoji(emoji){restoreDetailRange();document.execCommand('insertText',false,emoji);document.getElementById('rteEmojiPicker').classList.remove('show');}
    document.addEventListener('click',e=>{if(!e.target.closest('#rteEmojiPicker')&&!e.target.closest('[title="表情"]'))document.getElementById('rteEmojiPicker').classList.remove('show');});
    function rteToggleSource(){
      const isSrc=rteWrap.classList.toggle('source-mode');
      if(isSrc){gDetailSource.value=gDetailEl.innerHTML;}else{gDetailEl.innerHTML=gDetailSource.value;}
      document.getElementById('rteSourceBtn').classList.toggle('active',isSrc);
    }
    gDetailSource.addEventListener('input',()=>{if(rteWrap.classList.contains('source-mode'))gDetailEl.innerHTML=gDetailSource.value;});
    function rteToggleFullscreen(){rteWrap.classList.toggle('fullscreen');}
    function rteUpdateActive(){
      document.querySelectorAll('#rteToolbar button[data-cmd]').forEach(b=>{
        const cmd=b.dataset.cmd;if(!cmd)return;
        try{b.classList.toggle('active',document.queryCommandState(cmd));}catch(e){}
      });
    }
    document.querySelectorAll('#rteToolbar button[data-cmd]').forEach(b=>b.addEventListener('click',()=>{
      const cmd=b.dataset.cmd;rteExec(cmd);
    }));
    gDetailEl.addEventListener('keyup',rteUpdateActive);
    gDetailEl.addEventListener('mouseup',rteUpdateActive);
    gDetailEl.addEventListener('keydown',e=>{
      if(e.ctrlKey&&(e.key==='b'||e.key==='i'||e.key==='u')){e.preventDefault();const cmd=e.key==='b'?'bold':e.key==='i'?'italic':'underline';rteExec(cmd);}
    });
    async function insertDetailImage(){
      const input=document.createElement('input');input.type='file';input.accept='image/*';
      input.onchange=async()=>{if(input.files[0]){const url=await uploadToServer(input.files[0],'image');if(url){restoreDetailRange();document.execCommand('insertImage',false,url);}}};
      input.click();
    }
    async function insertDetailVideo(){
      const input=document.createElement('input');input.type='file';input.accept='video/*';
      input.onchange=async()=>{if(input.files[0]){const url=await uploadToServer(input.files[0],'video');if(url){restoreDetailRange();document.execCommand('insertHTML',false,`<video src="${url}" controls style="max-width:100%"></video>`);}}};
      input.click();
    }
    function addMessageField(){const name=prompt('留言字段名称');if(name)document.getElementById('gMessage').value=name;}

    async function editGoods(id){
      const d=await fetchA(`${BASE}/goods/${id}`);
      if(d.code!==0){toast(d.msg);return;}
      const g=d.data;
      clearGoodsForm();
      document.getElementById('goodsModalTitle').textContent='编辑商品';
      document.getElementById('gId').value=g.id;
      document.getElementById('gTitle').value=g.title||'';
      document.getElementById('gCat').value=g.category_id||'';
      document.getElementById('gPrice').value=g.price?g.price.toFixed(2):'';
      document.getElementById('gMarket').value=g.market_price?g.market_price.toFixed(2):'';
      document.getElementById('gStock').value=g.stock||'';
      document.getElementById('gDetail').innerHTML=g.detail_html||'';
      gState.images=g.images||[];renderImages();

      const ext=g.ext_json||{};
      document.getElementById('gCode').value=ext.code||'';
      document.getElementById('gBarcode').value=ext.barcode||'';
      setRadio('gType',ext.goods_type||'physical');
      document.getElementById('gPromo').value=ext.promo||'';
      document.getElementById('gUnit').value=ext.unit||'';
      document.getElementById('gCost').value=ext.cost_price?ext.cost_price.toFixed(2):'';
      document.getElementById('gVirtualSales').value=ext.virtual_sales||'';
      document.getElementById('gSort').value=ext.sort||'';
      document.getElementById('gNotice').value=ext.notice||'';
      document.getElementById('gRemark').value=ext.remark||'';
      setRadio('gVideoType',ext.video_type||'mp4');
      document.getElementById('gVideoUrl').value=(typeof g.video==='object'?g.video.url:g.video)||'';
      gState.videoCover=ext.video_cover||'';renderVideoCover();
      setRadio('gAutoPlay',ext.auto_play?'1':'0');
      document.getElementById('gWeight').value=ext.weight||'';
      document.getElementById('gMinBuy').value=ext.min_buy||'';
      setRadio('gShowStock',ext.show_stock===0?'0':'1');
      setRadio('gStatus',g.status==1?'1':'0');
      setRadio('gLimitType',ext.limit_type||'none');
      document.getElementById('gLimitLifetimeNum').value=ext.limit_lifetime_num||'';
      document.getElementById('gLimitPeriodDay').value=ext.limit_period_day||'';
      document.getElementById('gLimitPeriodNum').value=ext.limit_period_num||'';
      document.getElementById('gShipSelf').checked=(ext.ship_ways||[]).includes('self');
      document.getElementById('gShipSame').checked=(ext.ship_ways||[]).includes('same');
      setRadio('gAgreement',ext.agreement?'1':'0');
      document.getElementById('gMessage').value=ext.message||'';
      document.getElementById('gShareTitle').value=ext.share_title||'';
      gState.shareCover=ext.share_cover||'';renderShareCover();

      gState.specs=(g.spec_groups||[]).map(s=>({id:'sp_'+s.id,name:s.name,values:s.values.map(v=>({id:String(v.id),value:v.value})),selected:true}));
      gState.skus=(g.skus||[]).map(s=>({spec_value_ids:(s.spec_value_ids||'').split(','),price:s.price,market_price:s.market_price,stock:s.stock,image:s.image}));
      syncSkus();
      gState.attrs=(g.attrs||[]).map(a=>({...a,values:a.values||[],selected:a.used!==0}));
      renderSelectedSpecs();renderSelectedAttrs();calcProfit();toggleLimit();toggleVideoType();
      document.getElementById('goodsModal').classList.add('show');
    }

    async function saveGoods(){
      const id=document.getElementById('gId').value;
      const price=parseFloat(document.getElementById('gPrice').value)||0;
      const market=parseFloat(document.getElementById('gMarket').value)||0;
      const stock=parseInt(document.getElementById('gStock').value)||0;
      const safeCheck=function(id){const el=document.getElementById(id);return el&&el.checked?1:0;};
      const safeInt=function(id,def){const el=document.getElementById(id);return el?parseInt(el.value)||def:def;};
      const safeFloat=function(id,def){const el=document.getElementById(id);return el?parseFloat(el.value)||def:def;};
      const ext={
        code:document.getElementById('gCode').value,
        barcode:document.getElementById('gBarcode').value,
        goods_type:getRadio('gType'),
        promo:document.getElementById('gPromo').value,
        unit:document.getElementById('gUnit').value,
        cost_price:safeFloat('gCost',0),
        virtual_sales:safeInt('gVirtualSales',0),
        sort:safeInt('gSort',0),
        notice:document.getElementById('gNotice').value,
        remark:document.getElementById('gRemark').value,
        video_type:getRadio('gVideoType'),
        video_cover:gState.videoCover,
        auto_play:getRadio('gAutoPlay')==='1',
        weight:safeInt('gWeight',0),
        min_buy:safeInt('gMinBuy',1),
        show_stock:getRadio('gShowStock')==='1'?1:0,
        limit_type:getRadio('gLimitType'),
        limit_lifetime_num:safeInt('gLimitLifetimeNum',0),
        limit_period_day:safeInt('gLimitPeriodDay',1),
        limit_period_num:safeInt('gLimitPeriodNum',0),
        ship_ways:[...(document.getElementById('gShipSelf').checked?['self']:[]),...(document.getElementById('gShipSame').checked?['same']:[])],
        agreement:getRadio('gAgreement')==='1'?1:0,
        message:document.getElementById('gMessage').value,
        share_title:document.getElementById('gShareTitle').value,
        share_cover:gState.shareCover,
        require_name:0,require_phone:0,require_address:0,delivery_mode:1
      };
      const videoUrl=document.getElementById('gVideoUrl').value;
      const video=getRadio('gVideoType')==='mp4'?{type:'mp4',url:videoUrl}:videoUrl;
      const specs=gState.specs.filter(s=>s.selected!==false&&s.name&&s.values.length).map(s=>({name:s.name,values:s.values.map(v=>({id:v.id,value:v.value}))}));
      const skus=gState.skus.map(s=>({spec_value_ids:s.spec_value_ids,price:parseFloat(s.price)||0,market_price:parseFloat(s.market_price)||0,stock:parseInt(s.stock)||0,image:s.image}));
      const body={
        id:id||0,
        title:document.getElementById('gTitle').value,
        subtitle:'',
        category_id:document.getElementById('gCat').value,
        price:price,
        market_price:market,
        stock:stock,
        status:getRadio('gStatus'),
        detail_html:document.getElementById('gDetail').innerHTML,
        images:gState.images,
        video:video,
        ext_json:ext,
        specs:specs,
        skus:skus,
        attrs:gState.attrs.filter(a=>a.selected!==false&&a.name).map((a,i)=>({name:a.name,values:a.values||[],used:1,sort:i}))
      };
      const url=id?`${BASE}/goods/${id}`:`${BASE}/goods`;
      const method=id?'PUT':'POST';
      const d=await fetchA(url,{method,body});
      if(d.code===0){toast('保存成功');closeGoodsModal();loadGoods();}else{toast(d.msg);}
    }
    async function removeGoods(id){
      if(!confirm('确认删除该商品？'))return;
      const d=await fetchA(`${BASE}/goods/${id}`,{method:'DELETE'});
      if(d.code===0){toast('删除成功');loadGoods();}else{toast(d.msg);}
    }

    /* Category */
    let categoryPage=1,categoryPageSize=10;
    let categoryTreeCache=[];
    let catExpanded={};
    async function loadCategoriesAdmin(){
      const kw=document.getElementById('catKw').value;
      const q=`?keyword=${encodeURIComponent(kw)}&page=${categoryPage}&page_size=${categoryPageSize}`;
      const d=await fetchA(`${BASE}/categories${q}`);
      if(d.code!==0){toast(d.msg);return;}
      // 默认展开所有节点
      d.data.list.forEach(c=>{ if(c.has_children && !(c.id in catExpanded)) catExpanded[c.id]=true; });
      const tb=document.getElementById('categoryBody');
      let hideLevel=-1;
      tb.innerHTML=d.data.list.map(c=>{
        if(c.level<=hideLevel) hideLevel=-1;
        if(c.has_children && !catExpanded[c.id]) hideLevel=c.level;
        if(hideLevel!==-1) return '';
        const level=c.level||0;
        const expanded=!!catExpanded[c.id];
        const icon=c.has_children
          ? `<span class="cat-toggle ${expanded?'open':''}" onclick="event.stopPropagation();toggleCategoryRow(${c.id})">▶</span>`
          : '<span class="cat-leaf"></span>';
        return `<tr>
          <td><div class="cat-row cat-level-${level}">${icon}<span class="cat-name" onclick="editCategory(${c.id})">${c.name}</span></div></td>
          <td>${c.id}</td>
          <td>${c.created_at||'-'}</td>
          <td><input type="checkbox" class="toggle" ${c.is_show==1?'checked':''} onchange="toggleCategoryShow(${c.id},this.checked)"></td>
          <td>
            ${level<2?`<span class="link" onclick="openCategoryDialog(${c.id},0)">添加子分类</span>`:''}
            <span class="link" onclick="editCategory(${c.id})">编辑</span>
            <span class="link danger" onclick="removeCategory(${c.id})">删除</span>
          </td>
        </tr>`;
      }).join('');
      renderCategoryPager(d.data.pagination||{});
    }
    function toggleCategoryRow(id){
      catExpanded[id]=!catExpanded[id];
      loadCategoriesAdmin();
    }
    function renderCategoryPager(p){
      const total=p.total||0,pages=p.last_page||1,cur=p.page||1,size=p.page_size||categoryPageSize;
      const wrap=document.getElementById('categoryPager');wrap.innerHTML='';
      // 左侧：共 X 条 + 每页条数
      const info=document.createElement('div');info.className='pager-info';
      info.innerHTML=`<span>共 ${total} 条</span>
        <select onchange="changeCategoryPageSize(this.value)">
          <option value="10" ${size==10?'selected':''}>10条/页</option>
          <option value="20" ${size==20?'selected':''}>20条/页</option>
          <option value="50" ${size==50?'selected':''}>50条/页</option>
          <option value="100" ${size==100?'selected':''}>100条/页</option>
        </select>`;
      wrap.appendChild(info);
      // 中部页码
      const pagesWrap=document.createElement('div');pagesWrap.className='pager-pages';
      const prev=document.createElement('button');prev.innerHTML='&lt;';prev.title='上一页';prev.disabled=cur<=1;prev.onclick=()=>{categoryPage=cur-1;loadCategoriesAdmin();};pagesWrap.appendChild(prev);
      const maxVisible=5;
      let start=Math.max(1,cur-Math.floor(maxVisible/2)),end=Math.min(pages,start+maxVisible-1);
      if(end-start+1<maxVisible) start=Math.max(1,end-maxVisible+1);
      if(start>1){const b=document.createElement('button');b.textContent='1';b.onclick=()=>{categoryPage=1;loadCategoriesAdmin();};pagesWrap.appendChild(b);if(start>2){const d=document.createElement('span');d.textContent='...';d.className='pager-ellipsis';pagesWrap.appendChild(d);}}
      for(let i=start;i<=end;i++){const b=document.createElement('button');b.textContent=i;b.className=i===cur?'active':'';b.onclick=()=>{categoryPage=i;loadCategoriesAdmin();};pagesWrap.appendChild(b);}
      if(end<pages){if(end<pages-1){const d=document.createElement('span');d.textContent='...';d.className='pager-ellipsis';pagesWrap.appendChild(d);}const b=document.createElement('button');b.textContent=pages;b.onclick=()=>{categoryPage=pages;loadCategoriesAdmin();};pagesWrap.appendChild(b);}
      const next=document.createElement('button');next.innerHTML='&gt;';next.title='下一页';next.disabled=cur>=pages;next.onclick=()=>{categoryPage=cur+1;loadCategoriesAdmin();};pagesWrap.appendChild(next);
      wrap.appendChild(pagesWrap);
      // 右侧：前往 X 页
      const goto=document.createElement('div');goto.className='pager-goto';
      const input=document.createElement('input');input.type='number';input.min=1;input.max=pages;input.value=cur;input.onkeydown=(e)=>{if(e.key==='Enter')categoryGotoPage(input.value,pages);};
      const btn=document.createElement('button');btn.textContent='确定';btn.onclick=()=>categoryGotoPage(input.value,pages);
      goto.appendChild(document.createTextNode('前往'));
      goto.appendChild(input);
      goto.appendChild(document.createTextNode('页'));
      goto.appendChild(btn);
      wrap.appendChild(goto);
    }
    function changeCategoryPageSize(size){categoryPageSize=parseInt(size,10)||10;categoryPage=1;loadCategoriesAdmin();}
    function categoryGotoPage(val,pages){
      const page=parseInt(val,10);
      if(!page||page<1||page>pages)return;
      categoryPage=page;loadCategoriesAdmin();
    }
    async function loadCategoryTree(editId=0){
      const d=await fetchA(`${BASE}/categories/tree`);
      if(d.code!==0) return;
      let tree=d.data||[];
      if(editId) tree=excludeSelfAndDescendants(tree,editId);
      categoryTreeCache=tree;
      // 最多三级：新建/编辑时只能选择 顶级(level=-1) 或 一级(level=0) 作为上级
      const opts=flattenTree(tree,0).filter(o=>o.level<=0);
      document.getElementById('cParent').innerHTML=opts.map(o=>`<option value="${o.id}">${'　'.repeat(Math.max(o.level+1,0))}${o.name}</option>`).join('');
    }
    function flattenTree(nodes,level){
      let arr=[];
      for(const n of nodes){
        arr.push({id:n.id,name:n.name,level});
        if(n.children && n.children.length) arr=arr.concat(flattenTree(n.children,level+1));
      }
      return arr;
    }
    function excludeSelfAndDescendants(nodes,id){
      let arr=[];
      for(const n of nodes){
        if(n.id==id) continue;
        if(n.children && n.children.length){
          n.children=excludeSelfAndDescendants(n.children,id);
        }
        arr.push(n);
      }
      return arr;
    }
    function openCategoryDialog(parentId=0,id=0){
      document.getElementById('cId').value=id||'';
      document.getElementById('cName').value='';
      document.getElementById('cKeywords').value='';
      document.getElementById('cSort').value='0';
      document.getElementById('cIcon').value='';
      document.getElementById('cIconFile').value='';
      document.getElementById('cIconPreview').innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>';
      document.getElementById('categoryModalTitle').textContent=id?'编辑商品分类':'添加商品分类';
      loadCategoryTree(id).then(()=>{
        document.getElementById('cParent').value=parentId||0;
        if(id) editCategoryFill(id);
      });
      document.getElementById('categoryModal').classList.add('show');
    }
    async function editCategoryFill(id){
      const d=await fetchA(`${BASE}/categories?keyword=&page=1&page_size=1000`);
      if(d.code!==0) return;
      const c=d.data.list.find(x=>x.id==id);
      if(!c) return;
      document.getElementById('cName').value=c.name||'';
      document.getElementById('cKeywords').value=c.keywords||'';
      document.getElementById('cSort').value=c.sort||0;
      document.getElementById('cParent').value=c.parent_id||0;
      document.getElementById('cIcon').value=c.icon||'';
      if(c.icon){
        document.getElementById('cIconPreview').innerHTML=`<img src="${c.icon}" onerror="this.style.display='none'">`;
      }
    }
    async function editCategory(id){openCategoryDialog(0,id);}
    function closeCategoryDialog(){document.getElementById('categoryModal').classList.remove('show');}
    async function saveCategory(){
      const id=document.getElementById('cId').value;
      const body={
        id:id||0,
        name:document.getElementById('cName').value,
        parent_id:document.getElementById('cParent').value,
        keywords:document.getElementById('cKeywords').value,
        sort:document.getElementById('cSort').value,
        icon:document.getElementById('cIcon').value,
        is_show:1
      };
      const url=id?`${BASE}/categories/${id}`:`${BASE}/categories`;
      const method=id?'PUT':'POST';
      const d=await fetchA(url,{method,body});
      if(d.code===0){toast('保存成功');closeCategoryDialog();loadCategoriesAdmin();loadCategories();}else{toast(d.msg);}
    }
    async function removeCategory(id){
      if(!confirm('确认删除该分类？'))return;
      const d=await fetchA(`${BASE}/categories/${id}`,{method:'DELETE'});
      if(d.code===0){toast('删除成功');loadCategoriesAdmin();loadCategories();}else{toast(d.msg);}
    }
    async function toggleCategoryShow(id,checked){
      const d=await fetchA(`${BASE}/categories/${id}/status`,{method:'PUT',body:{is_show:checked?1:0}});
      if(d.code!==0){toast(d.msg);}
    }
    async function uploadCategoryIcon(input){
      const file=input.files[0];
      if(!file) return;
      const fd=new FormData();
      fd.append('file',file);
      const r=await fetch(`${BASE}/upload/image`,{method:'POST',headers:{'X-Admin-Token':token()},body:fd});
      const d=await r.json();
      if(d.code===0){
        document.getElementById('cIcon').value=d.data.url;
        document.getElementById('cIconPreview').innerHTML=`<img src="${d.data.url}" onerror="this.style.display='none'">`;
      }else{
        toast(d.msg||'上传失败');
      }
    }

    /* Orders */
    let ordersPage=1;
    const ORDER_STATUS={0:'待付款',1:'待发货',2:'待收货',3:'已完成','-2':'已取消'};
    function statusBadgeO(s){
      const map={'0':'badge orange','1':'badge orange','2':'badge green','3':'badge gray','-2':'badge red'};
      return `<span class="badge ${map[s]||'badge gray'}">${ORDER_STATUS[s]||s}</span>`;
    }
    async function loadOrders(){
      const status=document.getElementById('orderStatus').value;
      const q=`?status=${status}&page=${ordersPage}&page_size=10`;
      const d=await fetchA(`${BASE}/orders${q}`);
      if(d.code!==0){toast(d.msg);return;}
      const tb=document.getElementById('ordersBody');
      tb.innerHTML=d.data.list.map(o=>`<tr>
        <td><b>${o.order_no}</b></td>
        <td>${o.user_name||o.user_id||'-'}</td>
        <td>${fmtMoney(o.total_amount)}</td>
        <td>${statusBadgeO(o.status)}</td>
        <td>${o.created_at||'-'}</td>
        <td><button class="btn sm outline" onclick="viewOrder(${o.id})">详情</button></td>
      </tr>`).join('');
      const p=d.data.pagination||{};
      document.getElementById('ordersPager').innerHTML=`
        <button ${ordersPage<=1?'disabled':''} onclick="ordersPage--;loadOrders()">上一页</button>
        <span style="font-size:12px;color:#888">第 ${p.page||ordersPage} / ${p.last_page||1} 页</span>
        <button ${ordersPage>=(p.last_page||1)?'disabled':''} onclick="ordersPage++;loadOrders()">下一页</button>`;
    }
    async function viewOrder(id){
      const d=await fetchA(`${BASE}/orders/${id}`);
      if(d.code!==0){toast(d.msg);return;}
      const o=d.data;
      const items=(o.items||[]).map(i=>`<div style="display:flex;gap:10px;margin:8px 0;padding:8px;background:#fafafa;border-radius:6px">
        <img src="${i.cover||''}" style="width:50px;height:50px;object-fit:cover;border-radius:4px" onerror="this.style.display='none'">
        <div><div style="font-weight:600">${i.title}</div><div class="muted">${i.sku_desc||''} x${i.quantity} · ${fmtMoney(i.price)}</div></div>
      </div>`).join('');
      document.getElementById('orderDetail').innerHTML=`
        <p><b>订单号：</b>${o.order_no}</p>
        <p><b>状态：</b>${statusBadgeO(o.status)}</p>
        <p><b>金额：</b>${fmtMoney(o.total_amount)}（运费 ${fmtMoney(o.freight_amount||0)}）</p>
        <p><b>收货人：</b>${o.receiver_name||'-'} ${o.receiver_mobile||''}</p>
        <p><b>地址：</b>${o.receiver_address||'-'}</p>
        <p><b>下单时间：</b>${o.created_at||'-'}</p>
        <h4 style="margin:14px 0 8px">商品明细</h4>${items||'<p class="muted">无明细</p>'}`;
      const footer=document.getElementById('orderFooter');
      footer.innerHTML='';
      const statusBtns=[];
      if(o.status==0) statusBtns.push(['标记取消','-2']);
      if(o.status==1) statusBtns.push(['标记发货',2]);
      statusBtns.forEach(([label,val])=>{
        const b=document.createElement('button');b.className='btn sm';b.textContent=label;b.onclick=()=>changeStatus(id,val);footer.appendChild(b);
      });
      footer.appendChild(Object.assign(document.createElement('button'),{className:'btn gray sm',textContent:'关闭',onclick:closeOrderModal}));
      document.getElementById('orderModal').classList.add('show');
    }
    function closeOrderModal(){document.getElementById('orderModal').classList.remove('show');}
    async function changeStatus(id,status){
      const d=await fetchA(`${BASE}/orders/${id}/status`,{method:'POST',body:{status}});
      if(d.code===0){toast('状态更新成功');closeOrderModal();loadOrders();}else{toast(d.msg);}
    }

    /* 首页装修：按模块分设设置 */
    let designConfig={page:'home',components:[]};
    let catOptionsCache=[];

    const SECTION_TYPE={banner:'banner',nav:'nav_grid',goods:'goods_group',cat:'category_nav'};
    const SECTION_TITLE={banner:'轮播设置',nav:'魔方导航',goods:'精选推荐',cat:'分类导航'};
    function defaultRecommendModules(){
      const arr=[];
      for(let i=1;i<=4;i++){
        arr.push({id:i,name:'推荐模块 '+i,title:'推荐模块 '+i,goods:[]});
      }
      return arr;
    }
    const SECTION_DEFS={
      banner:{type:'banner',props:{interval:4,items:[
        {type:'image',image:'https://placehold.co/750x320/5e6ad2/fff?text=Banner1',video:'',link:{type:'goods',id:1}},
        {type:'image',image:'https://placehold.co/750x320/00B86B/fff?text=Banner2',video:'',link:{type:'goods',id:2}}
      ]}},
      nav:{type:'nav_grid',props:{columns:5,items:[
        {icon:'https://placehold.co/96x96/5e6ad2/fff?text=分',text:'分类',link:{type:'category',id:1}},
        {icon:'https://placehold.co/96x96/00B86B/fff?text=秒',text:'秒杀',link:{type:'activity',id:2}},
        {icon:'https://placehold.co/96x96/3867FF/fff?text=拼',text:'拼团',link:{type:'activity',id:3}}
      ]}},
      goods:{type:'goods_group',props:{title:'精选推荐',columns:2,modules:[{id:1,name:'精选推荐',title:'精选推荐',goods:[]}]}},
      cat:{type:'category_nav',props:{title:'商品分类',columns:4,source:'all',category_ids:[]}}
    };

    function getSection(sec){return designConfig.components.find(c=>c.type===SECTION_TYPE[sec])||null;}
    function upsertSection(sec){
      let c=getSection(sec);
      if(!c){c=JSON.parse(JSON.stringify(SECTION_DEFS[sec]));designConfig.components.push(c);}
      return c;
    }
    // 归一化：把含多个子模块的 goods_group 拆成多个独立的一级组件，使每个推荐模块可在首页任意排序
    function normalizeHomeComponents(){
      const arr=designConfig.components; const out=[];
      arr.forEach(c=>{
        if(c&&c.type==='goods_group'&&c.props&&Array.isArray(c.props.modules)&&c.props.modules.length>1){
          c.props.modules.forEach(m=>{
            out.push({type:'goods_group',props:{title:(m.title||m.name||'精选推荐'),columns:(c.props.columns||2),hidden:!!m.hidden,modules:[m]}});
          });
        } else out.push(c);
      });
      designConfig.components=out;
    }
    async function ensureCats(){
      if(catOptionsCache.length) return;
      try{const r=await fetchA(`${BASE}/categories?page=1&page_size=200`);if(r.code===0)catOptionsCache=r.data.list||[];}catch(e){}
    }
    async function loadDesign(){
      const d=await fetchA(`${BASE}/design/home`);
      if(d.code!==0){toast(d.msg);return false;}
      designConfig=JSON.parse(JSON.stringify(d.data.published_config||{page:'home',components:[]}));
      normalizeHomeComponents();
      await ensureCats();
      return true;
    }
    async function loadSection(){
      if(!(await loadDesign()))return;
      renderSectionForm();
    }
    async function loadLayout(){
      if(!(await loadDesign()))return;
      renderLayout();
    }
    function ensureHomeSections(){
      ['banner','nav','goods','cat'].forEach(sec=>{
        if(!getSection(sec)){
          designConfig.components.push(JSON.parse(JSON.stringify(SECTION_DEFS[sec])));
        }
      });
    }
    const SECTION_ICON={banner:ICONS.image,nav:ICONS.grid,goods:ICONS.package,cat:ICONS.layers};
    function renderLayout(){
      ensureHomeSections();
      const wrap=document.getElementById('layoutList'); if(!wrap)return;
      const types=Object.values(SECTION_TYPE);
      const rows=designConfig.components.filter(c=>types.indexOf(c.type)>=0);
      wrap.innerHTML=rows.map((c)=>{
        const sec=Object.keys(SECTION_TYPE).find(k=>SECTION_TYPE[k]===c.type);
        const ai=designConfig.components.indexOf(c);
        const hidden=c.props&&c.props.hidden;
        let sub='';
        if(sec==='goods'){
          const m=(c.props.modules||[])[0]||{};
          sub=(m.goods||[]).length+' 件商品';
        }
        const name=sec==='goods'?(c.props.title||'精选推荐'):SECTION_TITLE[sec];
        return `<div class="lay-row" draggable="true" data-idx="${ai}" ondragstart="layDragStart(event,${ai})" ondragover="layDragOver(event,this)" ondrop="layDrop(event,${ai})">
          <div class="lay-grip">⋮⋮</div>
          <div class="lay-icon">${SECTION_ICON[sec]}</div>
          <div class="lay-main">
            <div class="lay-name">${name}</div>
            <div class="lay-sub">${sub}</div>
          </div>
          <div class="lay-actions">
            ${sec==='goods'?`<button class="btn sm outline" onclick="openModEditor(${ai})">编辑</button>`:''}
            <span class="lay-status ${hidden?'off':''}">${hidden?'已下架':'在首页'}</span>
            <label class="switch"><input type="checkbox" ${hidden?'':'checked'} onchange="toggleHomeComp(${ai},this.checked)"><span class="slider"></span></label>
          </div>
        </div>`;
      }).join('');
    }
    let layDragIdx=null;
    function layDragStart(e,i){layDragIdx=i;e.dataTransfer.effectAllowed='move';}
    function layDragOver(e,el){e.preventDefault();el.classList.add('drag-over');}
    function layDrop(e,i){
      e.preventDefault();
      const rows=document.querySelectorAll('#layoutList .lay-row');
      rows.forEach(r=>r.classList.remove('drag-over'));
      if(layDragIdx===null||layDragIdx===i)return;
      const arr=designConfig.components;
      const dragComp=arr[layDragIdx]; if(!dragComp)return;
      arr.splice(layDragIdx,1); arr.splice(i,0,dragComp);
      layDragIdx=null; renderLayout();
    }
    function toggleHomeComp(idx,on){const c=designConfig.components[idx];if(c)c.props.hidden=!on;renderLayout();}
    async function saveLayout(){
      ensureHomeSections();
      const cfg=JSON.parse(JSON.stringify(designConfig));
      cfg.page='home';
      cfg.components=cfg.components.map(c=>({type:c.type,props:c.props}));
      const d=await fetchA(`${BASE}/design/home/save`,{method:'POST',body:{config:cfg,remark:'首页布局调整'}});
      toast(d.code===0?'草稿保存成功':(d.msg||'保存失败'));
    }
    async function publishLayout(){
      ensureHomeSections();
      const cfg=JSON.parse(JSON.stringify(designConfig));
      cfg.page='home';
      cfg.components=cfg.components.map(c=>({type:c.type,props:c.props}));
      const r=await fetchA(`${BASE}/design/home/save`,{method:'POST',body:{config:cfg,remark:'首页布局调整'}});
      if(r.code!==0){toast(r.msg||'保存失败');return;}
      const p=await fetchA(`${BASE}/design/home/publish`,{method:'POST',body:{}});
      toast(p.code===0?'发布成功':(p.msg||'发布失败'));
    }
    function renderSectionForm(){
      const sec=state.section;
      const comp=getSection(sec);
      document.getElementById('secTitle').textContent=SECTION_TITLE[sec]+' · 首页模块';
      const form=document.getElementById('secForm');
      const hint=document.getElementById('secHint');
      hint.textContent=comp
        ? '直接编辑后点「保存草稿」保存为草稿，点「发布上线」即时生效到小程序首页。'
        : '该模块尚未添加：编辑下方内容并点「保存草稿」即可创建并生效。';
      if(sec==='banner') form.innerHTML=renderBannerForm();
      else if(sec==='nav') form.innerHTML=renderNavForm();
      else if(sec==='goods'){ form.innerHTML=renderGoodsForm(); renderGoodsMods(); }
      else if(sec==='cat') form.innerHTML=renderCatForm();
    }
    function linkOpts(link){
      link=link||{type:'goods',id:0};
      return ['goods','category','activity'].map(t=>`<option value="${t}" ${link.type===t?'selected':''}>${t==='goods'?'商品':t==='category'?'分类':'活动'}</option>`).join('');
    }
    function setItemLink(sec,i,field,val){
      const c=upsertSection(sec);
      if(!c.props.items[i].link)c.props.items[i].link={type:'goods',id:0};
      c.props.items[i].link[field]=field==='id'?(parseInt(val)||0):val;
    }
    function delItem(sec,i){upsertSection(sec).props.items.splice(i,1);renderSectionForm();}
    function addItem(sec){
      const c=upsertSection(sec);
      c.props.items.push(sec==='banner'
        ? {type:'image',image:'https://placehold.co/750x320/5e6ad2/fff?text=Banner',video:'',link:{type:'goods',id:1}}
        : {icon:'https://placehold.co/96x96/5e6ad2/fff?text=图标',text:'名称',link:{type:'category',id:1}});
      renderSectionForm();
    }
    function renderBannerForm(){
      const c=upsertSection('banner');
      const items=c.props.items||(c.props.items=[]);
      let h=`<div style="display:flex;align-items:center;gap:28px;flex-wrap:wrap;margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:10px">
          <label class="cfg-label" style="margin-bottom:0">切换间隔</label>
          <div class="stepper">
            <button type="button" class="step-btn" onclick="stepInterval(-1)">−</button>
            <input class="step-input" type="number" value="${c.props.interval||4}" oninput="upsertSection('banner').props.interval=parseInt(this.value)||1">
            <button type="button" class="step-btn" onclick="stepInterval(1)">+</button>
          </div>
          <span class="cfg-unit">秒</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <label class="cfg-label" style="margin-bottom:0">轮播数量</label>
          <span class="cfg-count">${items.length}</span>
          <span class="cfg-unit">张</span>
        </div>
        <button class="lin-btn lin-btn-ghost" onclick="addItem('banner')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>添加轮播图</button>
      </div>`;
      h+=`<p class="muted" style="margin:0 0 16px">每张幻灯片可设为「图片」或「视频」，支持本地上传，也可直接填写图片/视频地址。</p>`;
      h+=`<div class="banner-grid">`;
      items.forEach((it,i)=>{
        it.link=it.link||{type:'goods',id:0};
        const isVid=(it.type==='video');
        const previewUrl = isVid ? (it.video||'') : (it.image||'');
        const preview = previewUrl
          ? (isVid ? `<video src="${previewUrl}"></video>` : `<img src="${previewUrl}" onerror="this.style.display='none'">`)
          : `<div class="placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></svg><span>${isVid?'视频':'图片'}</span></div>`;
        h+=`<div class="lin-card">
          <div class="lin-card-head">
            <div class="lin-card-title">
              <span class="lin-badge">${i+1}</span>
              <span class="lin-type-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>${isVid?'视频':'图片'}</span>
            </div>
            <button class="lin-del" title="删除" onclick="delItem('banner',${i})"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          </div>
          <div class="lin-card-body">
            <div class="lin-media-preview">${preview}
              <label class="lin-upload-overlay"><input type="file" accept="${isVid?'video/*':'image/*'}" onchange="uploadItemMedia(this,'banner',${i},'${isVid?'video':'image'}')"></label>
            </div>
            <div class="lin-card-main">
              <label class="lin-label">媒体类型</label>
              <div class="seg" style="margin-bottom:10px">
                <button type="button" class="seg-item ${!isVid?'active':''}" onclick="setBannerMediaType(${i},'image')">图片</button>
                <button type="button" class="seg-item ${isVid?'active':''}" onclick="setBannerMediaType(${i},'video')">视频</button>
              </div>
              <label class="lin-label">${isVid?'视频':'图片'}地址</label>
              <input class="lin-input" value="${previewUrl}" placeholder="https://..." oninput="upsertSection('banner').props.items[${i}].${isVid?'video':'image'}=this.value">
              <div class="lin-form-row" style="margin-top:12px">
                <div class="field"><label class="lin-label">跳转类型</label><select class="lin-select" onchange="setItemLink('banner',${i},'type',this.value)">${linkOpts(it.link)}</select></div>
                <div class="field"><label class="lin-label">跳转ID</label><input class="lin-input" type="number" value="${(it.link&&it.link.id)||''}" oninput="setItemLink('banner',${i},'id',this.value)"></div>
              </div>
            </div>
          </div>
        </div>`;
      });
      h+=`</div>`;
      return h;
    }
    function setBannerMediaType(i,type){
      const c=upsertSection('banner');
      const it=c.props.items[i];
      it.type=type;
      if(it.image===undefined)it.image='';
      if(it.video===undefined)it.video='';
      renderSectionForm();
    }
    function stepInterval(delta){
      const c=upsertSection('banner');
      c.props.interval=Math.max(1,(parseInt(c.props.interval,10)||4)+delta);
      renderSectionForm();
    }
    async function uploadItemMedia(el,sec,i,field){
      const file=el.files&&el.files[0];
      if(!file){return;}
      const url=field==='video'?`${BASE}/upload/video`:`${BASE}/upload/banner_image`;
      const fd=new FormData();fd.append('file',file);
      const btn=el.closest('.btn');
      if(btn){btn.style.opacity='0.6';}
      try{
        const r=await fetch(url,{method:'POST',headers:{'X-Admin-Token':token()},body:fd});
        const d=await r.json();
        if(d.code===0&&d.data&&d.data.url){
          upsertSection(sec).props.items[i][field]=d.data.url;
        }else{
          alert((d&&d.msg)||'上传失败');
        }
      }catch(e){alert('上传出错：'+e);}
      renderSectionForm();
    }
    function renderNavForm(){
      const c=upsertSection('nav');
      const items=c.props.items||[];
      const cols = c.props.columns||5;
      let h=`<div style="display:flex;align-items:center;gap:28px;flex-wrap:wrap;margin-bottom:18px">
        <div style="display:flex;align-items:center;gap:10px">
          <label class="cfg-label" style="margin-bottom:0">每行列数</label>
          <div class="seg">
            <button type="button" class="seg-item ${cols==3?'active':''}" onclick="upsertSection('nav').props.columns=3;renderSectionForm()">3</button>
            <button type="button" class="seg-item ${cols==4?'active':''}" onclick="upsertSection('nav').props.columns=4;renderSectionForm()">4</button>
            <button type="button" class="seg-item ${cols==5?'active':''}" onclick="upsertSection('nav').props.columns=5;renderSectionForm()">5</button>
            <button type="button" class="seg-item ${cols==6?'active':''}" onclick="upsertSection('nav').props.columns=6;renderSectionForm()">6</button>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <label class="cfg-label" style="margin-bottom:0">入口数量</label>
          <span class="cfg-count">${items.length}</span>
          <span class="cfg-unit">个</span>
        </div>
      </div>`;
      h+=`<div class="nav-grid-box">
        <div class="nav-grid-head"><h4>图标预览（点击图标配置）</h4><span class="muted" style="font-size:13px">每行 ${cols} 个</span></div>
        <div class="nav-grid-preview" style="grid-template-columns:repeat(${cols}, minmax(0, 1fr))">`;
      items.forEach((it,i)=>{
        const icon = it.icon
          ? `<img src="${it.icon}" onerror="this.style.display='none'">`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></svg>`;
        h+=`<div class="nav-item-preview" onclick="openNavConfig(${i})">
          <span class="del" onclick="event.stopPropagation();delItem('nav',${i})" title="删除">×</span>
          <div class="icon-wrap">${icon}</div>
          <div class="txt">${it.text||'入口'+(i+1)}</div>
        </div>`;
      });
      h+=`<div class="nav-item-preview add" onclick="addItem('nav')">
        <div class="icon-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"></path></svg></div>
        <div class="txt">添加</div>
      </div>`;
      h+=`</div></div>`;
      return h;
    }

    function openNavConfig(i){
      const items = upsertSection('nav').props.items;
      const it = items[i];
      if(!it) return;
      state.navEditIdx = i;
      const m = document.getElementById('navModal');
      m.classList.add('show');
      m.dataset.idx = i;
      renderNavModal(it);
    }
    function closeNavConfig(){
      document.getElementById('navModal').classList.remove('show');
      state.navEditIdx = -1;
    }
    function renderNavModal(it){
      const icon = it.icon
        ? `<img src="${it.icon}" onerror="this.style.display='none'">`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="M21 15l-5-5L5 21"></path></svg>`;
      document.getElementById('navModalBody').innerHTML = `
        <div class="entry-modal-body">
          <div class="entry-icon-col">
            <label class="entry-icon-box">${icon}<input type="file" accept="image/*" onchange="uploadItemMedia(this,'nav',${state.navEditIdx},'icon')"></label>
            <div class="entry-icon-tip">点击上传图标<br>支持 jpg/png</div>
          </div>
          <div class="entry-form-col">
            <div style="margin-bottom:14px"><label class="lin-label">入口名称</label><input class="lin-input" value="${it.text||''}" oninput="upsertSection('nav').props.items[${state.navEditIdx}].text=this.value;document.getElementById('navModalTitle').textContent='配置入口：'+(this.value||'未命名')" placeholder="如：新品"></div>
            <div style="margin-bottom:14px"><label class="lin-label">图标地址</label><input class="lin-input" value="${it.icon||''}" placeholder="https://..." oninput="upsertSection('nav').props.items[${state.navEditIdx}].icon=this.value;renderNavModal(upsertSection('nav').props.items[${state.navEditIdx}])"></div>
            <div class="lin-form-row">
              <div class="field"><label class="lin-label">跳转类型</label><select class="lin-select" onchange="setItemLink('nav',${state.navEditIdx},'type',this.value);renderNavModal(upsertSection('nav').props.items[${state.navEditIdx}]);">${linkOpts(it.link)}</select></div>
              <div class="field"><label class="lin-label">跳转ID</label><input class="lin-input" type="number" value="${(it.link&&it.link.id)||''}" oninput="setItemLink('nav',${state.navEditIdx},'id',this.value)"></div>
            </div>
          </div>
        </div>`;
      document.getElementById('navModalTitle').textContent = '配置入口：' + (it.text || '未命名');
    }
    function saveNavConfig(){
      closeNavConfig();
      renderSectionForm();
    }
    function renderGoodsForm(){
      let h=`<p class="muted" style="margin:2px 0 14px">「精选推荐」下的每个模块都是首页上的独立区块，可在此添加 / 删除 / 拖拽排序，点「编辑」单独设置名称与商品；要调整它们在整个首页中的上下位置，请前往「首页布局」。</p>`;
      h+=`<div id="goodsMods" class="mod-list"></div>`;
      h+=`<button class="btn outline sm" style="margin-top:12px" onclick="addRecommendMod()">+ 添加模块</button>`;
      return h;
    }
    let modDragIdx=null;
    function renderGoodsMods(){
      const wrap=document.getElementById('goodsMods'); if(!wrap)return;
      const comps=designConfig.components.map((c,i)=>({c,i})).filter(o=>o.c.type==='goods_group');
      if(!comps.length){ wrap.innerHTML='<p class="muted" style="padding:14px 0;text-align:center">暂无推荐模块，点击下方「+ 添加模块」</p>'; return; }
      wrap.innerHTML=comps.map((o,k)=>{
        const c=o.c; const idx=o.i; const m=(c.props.modules||[])[0]||{};
        return `<div class="mod-row" draggable="true" data-idx="${idx}"
          ondragstart="modDragStart(event,${idx})" ondragover="modDragOver(event)" ondrop="modDrop(event,${idx})">
          <div class="mod-grip">⋮⋮</div>
          <div class="mod-num">${k+1}</div>
          <div class="mod-main" onclick="openModEditor(${idx})">
            <div class="mod-name">${c.props.title||('模块'+(k+1))}</div>
            <div class="mod-sub">${m.title?('展示标题：'+m.title+' · '):''}${(m.goods||[]).length} 件商品</div>
          </div>
          <div class="mod-actions">
            <button class="btn sm outline" onclick="event.stopPropagation();openModEditor(${idx})">编辑</button>
            <button class="btn sm danger" onclick="event.stopPropagation();delRecommendMod(${idx})">删除</button>
          </div>
        </div>`;
      }).join('');
    }
    function addRecommendMod(){
      const idxs=designConfig.components.map((c,i)=>c.type==='goods_group'?i:-1).filter(i=>i>=0);
      const lastIdx=idxs.length?idxs[idxs.length-1]:-1;
      const allIds=designConfig.components.filter(c=>c.type==='goods_group')
        .reduce((s,c)=>s.concat((c.props.modules||[]).map(m=>m.id||0)),[]);
      const newId=(allIds.length?Math.max(...allIds):0)+1;
      const comp={type:'goods_group',props:{title:'推荐模块 '+newId,columns:2,hidden:false,modules:[{id:newId,name:'推荐模块 '+newId,title:'推荐模块 '+newId,goods:[]}]}};
      if(lastIdx>=0) designConfig.components.splice(lastIdx+1,0,comp);
      else designConfig.components.push(comp);
      renderGoodsMods();
      const lp=document.getElementById('layoutPanel'); if(lp && !lp.classList.contains('hidden')) renderLayout();
    }
    function delRecommendMod(idx){
      const c=designConfig.components[idx];
      if(!c||c.type!=='goods_group')return;
      if(!confirm('确定删除「'+(c.props.title||'精选推荐')+'」吗？'))return;
      designConfig.components.splice(idx,1);
      renderGoodsMods();
      const lp=document.getElementById('layoutPanel'); if(lp && !lp.classList.contains('hidden')) renderLayout();
    }
    function modDragStart(e,i){ modDragIdx=i; e.dataTransfer.effectAllowed='move'; }
    function modDragOver(e){ e.preventDefault(); e.dataTransfer.dropEffect='move'; }
    function modDrop(e,to){
      e.preventDefault();
      if(modDragIdx===null||modDragIdx===to)return;
      const arr=designConfig.components;
      const t=arr[modDragIdx]; if(!t)return;
      arr.splice(modDragIdx,1); arr.splice(to,0,t); modDragIdx=null;
      renderGoodsMods();
    }

    let modEditingIdx=0;
    function openModEditor(idx){
      modEditingIdx=idx;
      const c=designConfig.components[idx];
      const m=(c&&c.props&&c.props.modules&&c.props.modules[0])||{name:'',title:'',goods:[]};
      document.getElementById('modEditName').value=c?c.props.title||'':'';
      document.getElementById('modEditTitle').value=m.title||'';
      document.getElementById('modEditModal').classList.add('show');
      renderModGoods();
    }
    function curMod(){const c=designConfig.components[modEditingIdx];return c&&c.props&&c.props.modules&&c.props.modules[0];}
    function closeModEditor(){ document.getElementById('modEditModal').classList.remove('show'); }
    function renderModGoods(){
      const m=curMod()||{goods:[]};
      const wrap=document.getElementById('modEditGoods');
      const goods=m.goods||[];
      if(!goods.length){ wrap.innerHTML='<p class="muted" style="padding:14px 0;text-align:center">尚未选择商品，点击下方「添加商品」</p>'; return; }
      wrap.innerHTML=`<div class="mod-goods-grid">`+goods.map((g,i)=>`
        <div class="mod-good">
          <img src="${g.cover||''}" onerror="this.style.display='none'" alt="">
          <span class="mg-del" onclick="delModGood(${i})" title="移除">&times;</span>
          <div class="mg-title">${g.title||'未命名'}</div>
          <div class="mg-price">${fmtMoney(g.price||0)}</div>
        </div>`).join('')+`</div>`;
    }
    function delModGood(i){
      const m=curMod();
      if(!m)return;
      m.goods.splice(i,1);
      renderModGoods(); renderGoodsMods();
    }
    function saveModEdit(){
      const c=designConfig.components[modEditingIdx];
      const m=curMod();
      if(!m)return;
      m.name=document.getElementById('modEditName').value;
      m.title=document.getElementById('modEditTitle').value;
      if(c) c.props.title=m.name;
      renderGoodsMods();
      const lp=document.getElementById('layoutPanel');
      if(lp && !lp.classList.contains('hidden')) renderLayout();
    }
    function addModGoods(){ openGoodsPicker(); }

    /* 商品多选弹窗 */
    let gsPickerPage=1, gsPickerKw='', gsPickerCat=0, pickBuffer=[];
    function openGoodsPicker(){
      pickBuffer=[];
      document.getElementById('goodsPickerModal').classList.add('show');
      document.getElementById('goodsPickerKw').value='';
      const catSel=document.getElementById('goodsPickerCat');
      catSel.innerHTML='<option value="0">全部分类</option>'+catOptionsCache.map(o=>`<option value="${o.id}">${o.name}</option>`).join('');
      catSel.value='0';
      gsPickerPage=1; gsPickerKw=''; gsPickerCat=0;
      loadGoodsPicker();
    }
    function closeGoodsPicker(){ document.getElementById('goodsPickerModal').classList.remove('show'); }
    function loadGoodsPicker(){
      const q=`?category_id=${gsPickerCat}&keyword=${encodeURIComponent(gsPickerKw)}&page=${gsPickerPage}&page_size=8`;
      fetchA(`${BASE}/goods${q}`).then(d=>{
        if(d.code!==0){toast(d.msg);return;}
        const list=d.data.list||[];
        const wrap=document.getElementById('goodsPickerList');
        if(!list.length){wrap.innerHTML='<p class="muted" style="padding:20px 0;text-align:center">暂无商品</p>';}
        else{
          wrap.innerHTML=`<div class="goods-picker-grid">`+list.map(g=>`
            <div class="goods-picker-card ${(pickBuffer.find(x=>x.id===g.id)?'picked':'')}" onclick="togglePickGoods(${g.id},'${(g.title||'').replace(/'/g,'\\\'')}','${(g.cover||'').replace(/'/g,'\\\'')}',${g.price||0})">
              <div class="gpc-img"><img src="${g.cover||''}" onerror="this.style.display='none'" alt=""></div>
              <div class="gpc-title">${g.title||'未命名'}</div>
              <div class="gpc-price">${fmtMoney(g.price||0)}</div>
            </div>`).join('')+`</div>`;
        }
        const p=d.data.pagination||{};
        document.getElementById('goodsPickerPager').innerHTML=`
          <button class="btn sm" ${gsPickerPage<=1?'disabled':''} onclick="gsPickerPage--;loadGoodsPicker()">上一页</button>
          <span style="font-size:12px;color:#888">第 ${p.page||gsPickerPage} / ${p.last_page||1} 页 · 已选 ${pickBuffer.length}</span>
          <button class="btn sm" ${gsPickerPage>=(p.last_page||1)?'disabled':''} onclick="gsPickerPage++;loadGoodsPicker()">下一页</button>`;
        const pc=document.getElementById('pickCount'); if(pc)pc.textContent=pickBuffer.length;
      });
    }
    function togglePickGoods(id,title,cover,price){
      const i=pickBuffer.findIndex(x=>x.id===id);
      if(i>=0)pickBuffer.splice(i,1); else pickBuffer.push({id,title,cover,price});
      loadGoodsPicker();
    }
    function onGoodsPickerSearch(){
      gsPickerKw=document.getElementById('goodsPickerKw').value.trim();
      gsPickerPage=1; loadGoodsPicker();
    }
    function onGoodsPickerCat(){
      gsPickerCat=document.getElementById('goodsPickerCat').value;
      gsPickerPage=1; loadGoodsPicker();
    }
    function confirmGoodsPicker(){
      const m=curMod();
      if(m){
        const exist=new Set((m.goods||[]).map(g=>g.id));
        pickBuffer.forEach(g=>{ if(!exist.has(g.id)){ m.goods=m.goods||[]; m.goods.push(g); } });
      }
      renderModGoods(); renderGoodsMods(); closeGoodsPicker();
    }
    function renderCatForm(){
      const c=upsertSection('cat');
      const catOpts=catOptionsCache.map(o=>`<option value="${o.id}" ${(c.props.category_ids||[]).indexOf(o.id)>=0?'selected':''}>${o.name}</option>`).join('');
      const src=c.props.source||'all';
      let h=`<div class="lin-form-row cat-form-row">
        <div class="field"><label class="lin-label">标题</label><input class="lin-input" value="${c.props.title||''}" oninput="upsertSection('cat').props.title=this.value" placeholder="商品分类"></div>
        <div class="field"><label class="lin-label">每行列数</label><input class="lin-input" type="number" min="1" max="8" value="${c.props.columns||4}" oninput="upsertSection('cat').props.columns=parseInt(this.value)||4"></div>
        <div class="field cat-source-field">
          <label class="lin-label">来源</label>
          <div class="seg">
            <button type="button" class="seg-item ${src==='all'?'active':''}" onclick="updCatSource('all')">全部分类</button>
            <button type="button" class="seg-item ${src==='ids'?'active':''}" onclick="updCatSource('ids')">指定分类</button>
          </div>
        </div>
      </div>`;
      if(src==='ids'){
        h+=`<div class="cat-ids-field">
          <label class="lin-label">选择分类（可多选，Ctrl / ⌘ 多选）</label>
          <select class="lin-multi-select" multiple onchange="updCatIds(this)">${catOpts}</select>
        </div>`;
      }
      return h;
    }
    function updCatSource(v){upsertSection('cat').props.source=v;renderSectionForm();}
    function updCatIds(sel){upsertSection('cat').props.category_ids=Array.from(sel.selectedOptions).map(o=>parseInt(o.value));}
    async function saveSection(){
      upsertSection(state.section);
      const cfg=JSON.parse(JSON.stringify(designConfig));
      cfg.page='home';
      cfg.components=cfg.components.map(c=>({type:c.type,props:c.props}));
      const d=await fetchA(`${BASE}/design/home/save`,{method:'POST',body:{config:cfg,remark:SECTION_TITLE[state.section]+' 设置'}});
      toast(d.code===0?'草稿保存成功':(d.msg||'保存失败'));
    }
    async function publishSection(){
      upsertSection(state.section);
      const cfg=JSON.parse(JSON.stringify(designConfig));
      cfg.page='home';
      cfg.components=cfg.components.map(c=>({type:c.type,props:c.props}));
      const r=await fetchA(`${BASE}/design/home/save`,{method:'POST',body:{config:cfg,remark:SECTION_TITLE[state.section]+' 设置'}});
      if(r.code!==0){toast(r.msg||'保存失败');return;}
      const p=await fetchA(`${BASE}/design/home/publish`,{method:'POST',body:{}});
      toast(p.code===0?'发布成功':(p.msg||'发布失败'));
    }

    /* 底部导航 */
    let bottomNavConfig={page:'bottom_nav',components:[]};
    let bottomNavEditItems=[];
    let bnSelectedIdx=-1;
    let bnDragIdx=null;

    function ensureBottomNavComponent(){
      let comp=bottomNavConfig.components.find(c=>c.type==='bottom_nav');
      if(!comp){
        comp={type:'bottom_nav',sort:1,props:{items:[]}};
        bottomNavConfig.components.push(comp);
      }
      return comp;
    }
    function getBottomNavItems(){return ensureBottomNavComponent().props.items||[];}
    function setBottomNavItems(items){ensureBottomNavComponent().props.items=items;}

    async function loadBottomNav(){
      const d=await fetchA(`${BASE}/design/bottom_nav`);
      if(d.code!==0){toast(d.msg||'加载失败');return;}
      bottomNavConfig=JSON.parse(JSON.stringify(d.data.published_config||{page:'bottom_nav',components:[]}));
      if(!getBottomNavItems().length){
        setBottomNavItems([
          {name:'首页',icon:'https://placehold.co/96x96/8a8f98/fff?text=首页',active_icon:'https://placehold.co/96x96/5e6ad2/fff?text=首页',link:{type:'page',id:'home'}},
          {name:'分类',icon:'https://placehold.co/96x96/8a8f98/fff?text=分类',active_icon:'https://placehold.co/96x96/5e6ad2/fff?text=分类',link:{type:'page',id:'category'}},
          {name:'购物车',icon:'https://placehold.co/96x96/8a8f98/fff?text=车',active_icon:'https://placehold.co/96x96/5e6ad2/fff?text=车',link:{type:'page',id:'cart'}},
          {name:'我的',icon:'https://placehold.co/96x96/8a8f98/fff?text=我',active_icon:'https://placehold.co/96x96/5e6ad2/fff?text=我',link:{type:'page',id:'user'}}
        ]);
      }
      switchBottomNavTab('common');
      renderBottomNavList();
    }

    /* ===== 基础设置 ===== */
    const settingsDefaults={
      /* 基础设置 */
      site_status:'open',platform_account:'open',url_unified:'open',page_title_align:'left',
      customer_service_button:'unified',customer_service_type:'business_phone',
      force_auth_member_info:true,force_auth_mobile:true,
      collect_tip:'open',order_message:'close',scroll_order:'open',home_button:'show',
      prevent_screenshot:'close',forbid_pc_miniprogram:'close',cart_icon:'cart3',
      share_goods_detail:true,share_group_detail:true,share_bargain_detail:true,share_seckill_detail:true,
      /* 商品设置 */
      show_goods_sales:true,show_goods_promotion:false,show_goods_detail:true,show_goods_attr:false,show_goods_comment:false,
      zoom_banner:false,zoom_spec:false,zoom_detail:false,
      text_goods_detail:'商品详情',text_goods_attr:'商品属性',text_goods_comment:'商品评论',
      goods_image_zoom:'close',goods_sort_field:'recommend',goods_sort_order:'desc',
      /* 交易设置 */
      online_buy:'open',buy_permission:'all',quick_buy:'open',
      pay_online:true,pay_balance:true,pay_cod:false,
      default_delivery:'same_city',transfer_method:'v2',
      ios_pay_card:true,ios_pay_balance:true,ios_pay_knowledge:true,
      order_timeout_minutes:120,auto_receive_days:0,
      normal_order:'close',e_card_order:'close',cross_store_verify:'close',
      agreement_show:'close',agreement_name:'订单协议',
      /* 安全设置 */
      withdraw_mobile_verify:false,
      pay_methods:['wechat']
    };
    let settingsData={};
    async function loadSettings(){
      const d=await fetchA(`${BASE}/settings`);
      if(d.code!==0){toast(d.msg||'加载失败');return;}
      settingsData=Object.assign({},settingsDefaults,d.data||{});
      bindSettingsForm();
    }
    function syncSeg(radio){
      const name=radio.name;
      document.querySelectorAll(`#basePanel input[name="${name}"]`).forEach(r=>{
        const item=r.closest('.seg-item');
        if(item) item.classList.toggle('active',r.checked);
      });
    }
    function bindSettingsForm(){
      const form=document.getElementById('basePanel');
      if(!form)return;
      form.querySelectorAll('[data-setting]').forEach(el=>{
        const k=el.dataset.setting; const v=settingsData[k];
        if(el.type==='checkbox'){ if(v!==undefined&&v!==null) el.checked=!!v; }
        else if(el.type==='radio') el.checked=(el.value===String(v));
        else el.value=(v===undefined||v===null)?'':v;
      });
      form.querySelectorAll('input[type=radio]').forEach(r=>{ if(r.checked) syncSeg(r); });
      const pm=settingsData.pay_methods||['wechat'];
      const payWechat=document.getElementById('payWechat');
      const payAlipay=document.getElementById('payAlipay');
      if(payWechat) payWechat.checked=pm.indexOf('wechat')>=0;
      if(payAlipay) payAlipay.checked=pm.indexOf('alipay')>=0;
      switchBaseTab('basic');
    }
    async function saveSettings(){
      const payload={};
      const form=document.getElementById('basePanel');
      form.querySelectorAll('[data-setting]').forEach(el=>{
        const k=el.dataset.setting; let v;
        if(el.type==='checkbox') v=el.checked;
        else if(el.type==='radio'){ if(el.checked) v=el.value; else return; }
        else v=el.value;
        if(el.dataset.type==='number') v=(v===''?'':Number(v));
        payload[k]=v;
      });
      const pm=[];
      if(document.getElementById('payWechat').checked) pm.push('wechat');
      if(document.getElementById('payAlipay').checked) pm.push('alipay');
      payload.pay_methods=pm;
      const d=await fetchA(`${BASE}/settings`,{method:'POST',body:JSON.stringify({config:payload})});
      if(d.code!==0){toast(d.msg||'保存失败');return;}
      settingsData=d.data||settingsData;
      toast('已保存');
    }
    function switchBaseTab(tab){
      document.querySelectorAll('.bs-tab').forEach(el=>el.classList.toggle('active',el.dataset.tab===tab));
      document.querySelectorAll('.bs-pane').forEach(el=>el.classList.toggle('hidden',el.dataset.pane!==tab));
    }

    /* ===== 店铺设置 ===== */
    const shopDefaults={
      company_name:'',company_name_en:'',contact_phone:'',contact_qq:'',
      company_address:'',business_hours:'',currency_symbol:'¥',original_currency_symbol:'¥',
      shop_logo:'',merchant_content:'',map_location:'',share_title:'',share_desc:'',share_cover:'',
      logistics_type:'kdniao',logistics_cache_minutes:20
    };
    let shopData={};
    async function loadShopSettings(){
      const d=await fetchA(`${BASE}/settings`);
      if(d.code!==0){toast(d.msg||'加载失败');return;}
      shopData=Object.assign({},shopDefaults,d.data||{});
      bindShopSettingsForm();
      switchShopTab('merchant');
    }
    function bindShopSettingsForm(){
      const form=document.getElementById('shopPanel');
      if(!form)return;
      form.querySelectorAll('[data-setting]').forEach(el=>{
        const k=el.dataset.setting; const v=shopData[k];
        if(el.type==='radio'){ if(String(v)===el.value) el.checked=true; }
        else if(el.type==='checkbox'){ if(v!==undefined&&v!==null) el.checked=!!v; }
        else if(v!==undefined&&v!==null) el.value=v;
      });
      updateShopPreview('shopLogoPreview','shopLogoInput','shop_logo');
      updateShopPreview('shareCoverPreview','shareCoverInput','share_cover');
    }
    async function saveShopSettings(){
      const payload={};
      const form=document.getElementById('shopPanel');
      form.querySelectorAll('[data-setting]').forEach(el=>{
        const k=el.dataset.setting; let v;
        if(el.type==='checkbox') v=el.checked;
        else if(el.type==='radio'){ if(el.checked) v=el.value; else return; }
        else v=el.value;
        if(el.dataset.type==='number') v=(v===''?'':Number(v));
        payload[k]=v;
      });
      const d=await fetchA(`${BASE}/settings`,{method:'POST',body:JSON.stringify({config:payload})});
      if(d.code!==0){toast(d.msg||'保存失败');return;}
      shopData=d.data||shopData;
      toast('已保存');
    }
    function switchShopTab(tab){
      document.querySelectorAll('.shop-tab').forEach(el=>el.classList.toggle('active',el.dataset.tab===tab));
      document.querySelectorAll('.shop-pane').forEach(el=>el.classList.toggle('hidden',el.dataset.pane!==tab));
    }
    function updateShopPreview(previewId,inputId,key){
      const imgUrl=shopData[key];
      const box=document.getElementById(previewId);
      if(!box)return;
      if(imgUrl) box.innerHTML=`<img src="${imgUrl}" alt="">`;
      else box.innerHTML='<span class="plus">+</span>';
      const input=document.getElementById(inputId);
      if(input) input.value=imgUrl||'';
    }
    function triggerUpload(key){
      let input=document.getElementById('_shopUpload_'+key);
      if(!input){
        input=document.createElement('input');
        input.type='file';
        input.id='_shopUpload_'+key;
        input.accept='image/*';
        input.style.display='none';
        input.onchange=e=>{
          const file=e.target.files[0];
          if(!file)return;
          const reader=new FileReader();
          reader.onload=evt=>{
            shopData[key]=evt.target.result;
            if(key==='shop_logo') updateShopPreview('shopLogoPreview','shopLogoInput','shop_logo');
            if(key==='share_cover') updateShopPreview('shareCoverPreview','shareCoverInput','share_cover');
          };
          reader.readAsDataURL(file);
        };
        document.body.appendChild(input);
      }
      input.click();
    }

    /* ===== 地图位置选择器（腾讯地图）===== */
    let mapPickerMap=null,mapPickerMarker=null;
    function getTencentMapKey(){
      const k=(typeof shopData==='object'&&shopData&&shopData.map_key)||'';
      if(k)return k;
      const inp=document.querySelector('[data-setting="map_key"]');
      return inp?inp.value.trim():'';
    }
    function loadTencentMap(key){
      return new Promise((resolve,reject)=>{
        if(window.TMap)return resolve();
        const s=document.createElement('script');
        s.src=`https://map.qq.com/api/js?v=2.exp&key=${encodeURIComponent(key)}&libraries=service`;
        s.onload=()=>resolve();
        s.onerror=()=>reject(new Error('加载失败'));
        document.head.appendChild(s);
      });
    }
    function openMapPicker(callback,initialValue){
      const modal=document.getElementById('mapPickerModal');
      mapPickerCallback=callback||function(v){
        const input=document.querySelector('#shopPanel [data-setting="map_location"]');
        if(input) input.value=v;
      };
      mapPickerInitialValue=initialValue||'';
      modal.classList.add('show');
      setTimeout(async ()=>{
        const val=mapPickerInitialValue;
        const m=val.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
        let lat=39.9042,lng=116.4074;
        if(m){lng=parseFloat(m[1]);lat=parseFloat(m[2]);}
        document.getElementById('mapAddress').value=val||'';
        document.getElementById('mapCityInput').value='';
        const key=getTencentMapKey();
        if(!key){
          document.getElementById('mapPickerContainer').innerHTML='<div class="map-empty">未配置腾讯地图密钥<br>请先在「基础设置」填写地图密钥 key，之后即可使用地图选点；<br>当前也可直接手动填写经度、纬度与地址。</div>';
          return;
        }
        try{
          await loadTencentMap(key);
        }catch(e){
          document.getElementById('mapPickerContainer').innerHTML='<div class="map-empty">腾讯地图加载失败，请检查密钥或网络后重试</div>';
          return;
        }
        if(!mapPickerMap){
          document.getElementById('mapPickerContainer').innerHTML='';
          mapPickerMap=new TMap.Map(document.getElementById('mapPickerContainer'),{center:new TMap.LatLng(lat,lng),zoom:13});
          mapPickerMap.on('click',evt=>{
            const ll=evt.latLng;
            setMapPickerMarker(ll.getLat(),ll.getLng());
          });
        }else{
          mapPickerMap.setCenter(new TMap.LatLng(lat,lng));
        }
        setTimeout(()=>{if(mapPickerMap&&mapPickerMap.resize)mapPickerMap.resize();},120);
        setMapPickerMarker(lat,lng);
      },50);
    }
    function setMapPickerMarker(lat,lng){
      document.getElementById('mapLat').value=Number(lat).toFixed(6);
      document.getElementById('mapLng').value=Number(lng).toFixed(6);
      if(!mapPickerMap)return;
      if(mapPickerMarker)mapPickerMarker.setMap(null);
      mapPickerMarker=new TMap.MultiMarker({
        map:mapPickerMap,
        geometries:[{id:'picker',position:new TMap.LatLng(lat,lng)}]
      });
      mapPickerMap.setCenter(new TMap.LatLng(lat,lng));
    }
    function closeMapPicker(){document.getElementById('mapPickerModal').classList.remove('show');mapPickerCallback=null;mapPickerInitialValue='';}
    function confirmMapLocation(){
      const lat=document.getElementById('mapLat').value.trim();
      const lng=document.getElementById('mapLng').value.trim();
      const address=document.getElementById('mapAddress').value.trim();
      let result=address||'';
      if(lat&&lng){
        if(result) result+=` (${lng},${lat})`;
        else result=`${lng},${lat}`;
      }
      if(mapPickerCallback) mapPickerCallback(result);
      closeMapPicker();
    }
    async function searchMapLocation(){
      const city=document.getElementById('mapCityInput').value.trim();
      const q=document.getElementById('mapSearchInput').value.trim();
      if(!q){toast('请输入搜索地址');return;}
      if(!window.TMap||!TMap.service){toast('地图未加载，无法搜索');return;}
      const keyword=city?(city+q):q;
      try{
        const search=new TMap.service.Search({});
        const res=await search.search({keyword:keyword});
        const list=(res&&res.data)||[];
        if(!list.length){toast('未找到该地址');return;}
        const item=list[0];
        const loc=item.location||{};
        setMapPickerMarker(loc.lat,loc.lng);
        const title=(item.title||item.address||'')+'';
        document.getElementById('mapAddress').value=title;
        if(item.ad_info&&item.ad_info.city){document.getElementById('mapCityInput').value=item.ad_info.city;}
      }catch(e){toast('搜索失败，请直接在地图上点击选择');}
    }

    /* ===== 配送设置 ===== */
    const REGION_DATA={"provinces":[{"name":"北京市","cities":["北京市"]},{"name":"天津市","cities":["天津市"]},{"name":"河北省","cities":["石家庄市","唐山市","秦皇岛市","邯郸市","邢台市","保定市","张家口市","承德市","沧州市","廊坊市","衡水市"]},{"name":"山西省","cities":["太原市","大同市","阳泉市","长治市","晋城市","朔州市","晋中市","运城市","忻州市","临汾市","吕梁市"]},{"name":"内蒙古自治区","cities":["呼和浩特市","包头市","乌海市","赤峰市","通辽市","鄂尔多斯市","呼伦贝尔市","巴彦淖尔市","乌兰察布市","兴安盟","锡林郭勒盟","阿拉善盟"]},{"name":"辽宁省","cities":["沈阳市","大连市","鞍山市","抚顺市","本溪市","丹东市","锦州市","营口市","阜新市","辽阳市","盘锦市","铁岭市","朝阳市","葫芦岛市"]},{"name":"吉林省","cities":["长春市","吉林市","四平市","辽源市","通化市","白山市","松原市","白城市","延边朝鲜族自治州"]},{"name":"黑龙江省","cities":["哈尔滨市","齐齐哈尔市","鸡西市","鹤岗市","双鸭山市","大庆市","伊春市","佳木斯市","七台河市","牡丹江市","黑河市","绥化市","大兴安岭地区"]},{"name":"上海市","cities":["上海市"]},{"name":"江苏省","cities":["南京市","无锡市","徐州市","常州市","苏州市","南通市","连云港市","淮安市","盐城市","扬州市","镇江市","泰州市","宿迁市"]},{"name":"浙江省","cities":["杭州市","宁波市","温州市","嘉兴市","湖州市","绍兴市","金华市","衢州市","舟山市","台州市","丽水市"]},{"name":"安徽省","cities":["合肥市","芜湖市","蚌埠市","淮南市","马鞍山市","淮北市","铜陵市","安庆市","黄山市","滁州市","阜阳市","宿州市","六安市","亳州市","池州市","宣城市"]},{"name":"福建省","cities":["福州市","厦门市","莆田市","三明市","泉州市","漳州市","南平市","龙岩市","宁德市"]},{"name":"江西省","cities":["南昌市","景德镇市","萍乡市","九江市","新余市","鹰潭市","赣州市","吉安市","宜春市","抚州市","上饶市"]},{"name":"山东省","cities":["济南市","青岛市","淄博市","枣庄市","东营市","烟台市","潍坊市","济宁市","泰安市","威海市","日照市","临沂市","德州市","聊城市","滨州市","菏泽市"]},{"name":"河南省","cities":["郑州市","开封市","洛阳市","平顶山市","安阳市","鹤壁市","新乡市","焦作市","濮阳市","许昌市","漯河市","三门峡市","南阳市","商丘市","信阳市","周口市","驻马店市","济源市"]},{"name":"湖北省","cities":["武汉市","黄石市","十堰市","宜昌市","襄阳市","鄂州市","荆门市","孝感市","荆州市","黄冈市","咸宁市","随州市","恩施土家族苗族自治州","仙桃市","潜江市","天门市","神农架林区"]},{"name":"湖南省","cities":["长沙市","株洲市","湘潭市","衡阳市","邵阳市","岳阳市","常德市","张家界市","益阳市","郴州市","永州市","怀化市","娄底市","湘西土家族苗族自治州"]},{"name":"广东省","cities":["广州市","韶关市","深圳市","珠海市","汕头市","佛山市","江门市","湛江市","茂名市","肇庆市","惠州市","梅州市","汕尾市","河源市","阳江市","清远市","东莞市","中山市","潮州市","揭阳市","云浮市"]},{"name":"广西壮族自治区","cities":["南宁市","柳州市","桂林市","梧州市","北海市","防城港市","钦州市","贵港市","玉林市","百色市","贺州市","河池市","来宾市","崇左市"]},{"name":"海南省","cities":["海口市","三亚市","三沙市","儋州市","五指山市","琼海市","文昌市","万宁市","东方市","定安县","屯昌县","澄迈县","临高县","白沙黎族自治县","昌江黎族自治县","乐东黎族自治县","陵水黎族自治县","保亭黎族苗族自治县","琼中黎族苗族自治县"]},{"name":"重庆市","cities":["重庆市"]},{"name":"四川省","cities":["成都市","自贡市","攀枝花市","泸州市","德阳市","绵阳市","广元市","遂宁市","内江市","乐山市","南充市","眉山市","宜宾市","广安市","达州市","雅安市","巴中市","资阳市","阿坝藏族羌族自治州","甘孜藏族自治州","凉山彝族自治州"]},{"name":"贵州省","cities":["贵阳市","六盘水市","遵义市","安顺市","毕节市","铜仁市","黔西南布依族苗族自治州","黔东南苗族侗族自治州","黔南布依族苗族自治州"]},{"name":"云南省","cities":["昆明市","曲靖市","玉溪市","保山市","昭通市","丽江市","普洱市","临沧市","楚雄彝族自治州","红河哈尼族彝族自治州","文山壮族苗族自治州","西双版纳傣族自治州","大理白族自治州","德宏傣族景颇族自治州","怒江傈僳族自治州","迪庆藏族自治州"]},{"name":"西藏自治区","cities":["拉萨市","日喀则市","昌都市","林芝市","山南市","那曲市","阿里地区"]},{"name":"陕西省","cities":["西安市","铜川市","宝鸡市","咸阳市","渭南市","延安市","汉中市","榆林市","安康市","商洛市"]},{"name":"甘肃省","cities":["兰州市","嘉峪关市","金昌市","白银市","天水市","武威市","张掖市","平凉市","酒泉市","庆阳市","定西市","陇南市","临夏回族自治州","甘南藏族自治州"]},{"name":"青海省","cities":["西宁市","海东市","海北藏族自治州","黄南藏族自治州","海南藏族自治州","果洛藏族自治州","玉树藏族自治州","海西蒙古族藏族自治州"]},{"name":"宁夏回族自治区","cities":["银川市","石嘴山市","吴忠市","固原市","中卫市"]},{"name":"新疆维吾尔自治区","cities":["乌鲁木齐市","克拉玛依市","吐鲁番市","哈密市","昌吉回族自治州","博尔塔拉蒙古自治州","巴音郭楞蒙古自治州","阿克苏地区","克孜勒苏柯尔克孜自治州","喀什地区","和田地区","伊犁哈萨克自治州","塔城地区","阿勒泰地区","石河子市","阿拉尔市","图木舒克市","五家渠市","北屯市","铁门关市","双河市","可克达拉市","昆玉市","胡杨河市","新星市","白杨市"]},{"name":"台湾省","cities":["台北市","高雄市","台中市","台南市","新北市","桃园市","基隆市","新竹市","嘉义市","新竹县","苗栗县","彰化县","南投县","云林县","嘉义县","屏东县","宜兰县","花莲县","台东县","澎湖县"]},{"name":"香港特别行政区","cities":["香港特别行政区"]},{"name":"澳门特别行政区","cities":["澳门特别行政区"]}],"regions":{"华北":[0,1,2,3,4],"东北":[5,6,7],"华东":[8,9,10,11,12,13,14],"华中":[15,16,17],"华南":[18,19,20],"西南":[21,22,23,24,25],"西北":[26,27,28,29,30],"港澳台":[31,32,33]}};
    let deliveryData={express:{enabled:false,templates:[]},pickup:{enabled:false,points:[]},local:{enabled:false,rules:[]}};
    let pickupPointEditingIndex=-1,mapPickerCallback=null,mapPickerInitialValue='';
    let tmEditingIndex=-1,tmRegionEditingIndex=-1;
    let localRuleEditingIndex=-1,localTimeEditingRuleIndex=-1;

    function switchDeliveryTab(tab){
      document.querySelectorAll('.delivery-tab').forEach(el=>el.classList.toggle('active',el.dataset.tab===tab));
      document.querySelectorAll('.delivery-pane').forEach(el=>el.classList.toggle('active',el.dataset.pane===tab));
      if(tab==='pickup')renderPickupPoints();
      if(tab==='local')renderLocalRules();
    }
    async function loadDeliverySettings(){
      const d=await fetchA(`${BASE}/settings`);
      if(d.code!==0){toast(d.msg||'加载失败');return;}
      const s=d.data||{};
      let pickupPoints=[];
      if(Array.isArray(s.delivery_pickup_points)) pickupPoints=JSON.parse(JSON.stringify(s.delivery_pickup_points));
      else if(s.delivery_pickup_points) try{pickupPoints=JSON.parse(s.delivery_pickup_points);}catch(e){pickupPoints=[];}
      if(!pickupPoints.length&&(s.delivery_pickup_name||s.delivery_pickup_address||s.delivery_pickup_phone)){
        pickupPoints=[{id:Date.now(),name:s.delivery_pickup_name||'',address:s.delivery_pickup_address||'',phone:s.delivery_pickup_phone||'',hours:s.delivery_pickup_hours||'',location:'',enabled:true}];
      }
      let localRules=[];
      if(Array.isArray(s.delivery_local_rules)) localRules=JSON.parse(JSON.stringify(s.delivery_local_rules));
      else if(s.delivery_local_rules) try{localRules=JSON.parse(s.delivery_local_rules);}catch(e){localRules=[];}
      if(!localRules.length&&(s.delivery_local_min_amount||s.delivery_local_fee||s.delivery_local_radius)){
        localRules=[{id:Date.now(),name:'默认规则',address:'',distance:'straight',radius:Number(s.delivery_local_radius||0),min_amount:Number(s.delivery_local_min_amount||0),base_fee:Number(s.delivery_local_fee||0),free_amount:0,timed:true,time:{weekdays:[1,2,3,4,5,6,0],split:true,interval:60,selected:[],open:'08:00',close:'18:00',special:false,special_dates:'',book:'none',book_day:1,book_hour:1,book_minute:1,max_book:'same',max_book_days:1},ladder:false,ladder_base_radius:0,ladder_base_fee:0,ladder_step_radius:0,ladder_step_fee:0,ladder_base_weight:0,ladder_weight_fee:0,ladder_step_weight:0,ladder_step_weight_fee:0,by_piece:false,enabled:true,is_default:true}];
      }
      deliveryData={
        express:{enabled:!!s.delivery_express_enabled,templates:Array.isArray(s.delivery_express_templates)?JSON.parse(JSON.stringify(s.delivery_express_templates)):[]},
        pickup:{enabled:!!s.delivery_pickup_enabled,points:pickupPoints},
        local:{enabled:!!s.delivery_local_enabled,rules:localRules}
      };
      document.getElementById('expressEnabled').checked=deliveryData.express.enabled;
      document.getElementById('expressContent').style.display=deliveryData.express.enabled?'block':'none';
      document.getElementById('pickupEnabled').checked=deliveryData.pickup.enabled;
      document.getElementById('pickupContent').style.display=deliveryData.pickup.enabled?'block':'none';
      document.getElementById('localEnabled').checked=deliveryData.local.enabled;
      document.getElementById('localContent').style.display=deliveryData.local.enabled?'block':'none';
      renderDeliveryTemplates();
      switchDeliveryTab('express');
    }
    function toggleDeliveryExpress(v){deliveryData.express.enabled=v;document.getElementById('expressContent').style.display=v?'block':'none';saveDeliveryExpress();}
    function toggleDeliveryPickup(v){deliveryData.pickup.enabled=v;document.getElementById('pickupContent').style.display=v?'block':'none';if(v)renderPickupPoints();saveDeliveryPickup();}
    function toggleDeliveryLocal(v){deliveryData.local.enabled=v;document.getElementById('localContent').style.display=v?'block':'none';if(v)renderLocalRules();saveDeliveryLocal();}
    async function saveDeliveryExpress(){await saveDeliveryBatch({delivery_express_enabled:deliveryData.express.enabled?1:0,delivery_express_templates:JSON.stringify(deliveryData.express.templates)});}
    async function saveDeliveryPickup(){await saveDeliveryBatch({delivery_pickup_enabled:deliveryData.pickup.enabled?1:0,delivery_pickup_points:JSON.stringify(deliveryData.pickup.points)});}
    async function saveDeliveryLocal(){await saveDeliveryBatch({delivery_local_enabled:deliveryData.local.enabled?1:0,delivery_local_rules:JSON.stringify(deliveryData.local.rules)});}

    /* 自提点管理 */
    function renderPickupPoints(){
      const kw=(document.getElementById('pickupSearchInput')||{}).value||'';
      const kwt=kw.trim().toLowerCase();
      const list=deliveryData.pickup.points.filter(p=>(p.name||'').toLowerCase().includes(kwt)||(p.address||'').toLowerCase().includes(kwt));
      const mode=(document.getElementById('pickupViewMode')||{}).value||'list';
      const table=document.getElementById('pickupTable');
      const cardView=document.getElementById('pickupCardView');
      if(mode==='card'){
        table.style.display='none';cardView.style.display='grid';
        if(!list.length){cardView.innerHTML='<div class="empty-row">暂无数据</div>';return;}
        cardView.innerHTML=list.map((p,i)=>`<div class="pickup-card">
          <div class="pc-check"><input type="checkbox" class="pp-check" data-idx="${i}"></div>
          <div class="pc-title">${escapeHtml(p.name||'未命名')}</div>
          <div class="pc-row">地址：${escapeHtml(p.address||'')} ${p.location?`<span style="color:var(--text-muted)">(${p.location})</span>`:''}</div>
          <div class="pc-row">电话：${escapeHtml(p.phone||'')}</div>
          <div class="pc-op">
            <button class="btn-link" onclick="openPickupPointModal(${i})">编辑</button>
            <button class="btn-link danger" onclick="deletePickupPoint(${i})">删除</button>
          </div>
        </div>`).join('');
        return;
      }
      table.style.display='';cardView.style.display='none';
      const tb=document.getElementById('pickupPointTbody');
      if(!list.length){tb.innerHTML='<tr><td colspan="6" class="empty-row">暂无数据</td></tr>';return;}
      tb.innerHTML=list.map((p,i)=>`<tr>
        <td class="col-check"><input type="checkbox" class="pp-check" data-idx="${i}"></td>
        <td>${escapeHtml(p.name||'未命名')}</td>
        <td>${escapeHtml(p.address||'')} ${p.location?`<span style="color:var(--text-muted)">(${p.location})</span>`:''}</td>
        <td>${escapeHtml(p.phone||'')}</td>
        <td class="col-enable"><label class="switch"><input type="checkbox" ${p.enabled?'checked':''} onchange="togglePickupPointEnabled(${i},this.checked)"><span class="slider"></span></label></td>
        <td class="col-op"><div class="op-btns">
          <button class="btn-link" onclick="openPickupPointModal(${i})">编辑</button>
          <button class="btn-link danger" onclick="deletePickupPoint(${i})">删除</button>
        </div></td>
      </tr>`).join('');
    }
    function togglePickupCheckAll(cb){document.querySelectorAll('.pp-check').forEach(c=>c.checked=cb.checked);}
    function togglePickupPointEnabled(idx,v){deliveryData.pickup.points[idx].enabled=v;saveDeliveryPickup();renderPickupPoints();}
    function deletePickupPoint(idx){
      if(!confirm('确定删除该自提点吗？'))return;
      deliveryData.pickup.points.splice(idx,1);saveDeliveryPickup();renderPickupPoints();
    }
    function batchDeletePickupPoints(){
      const idxs=Array.from(document.querySelectorAll('.pp-check:checked')).map(c=>Number(c.dataset.idx)).sort((a,b)=>b-a);
      if(!idxs.length){toast('请先勾选要删除的自提点');return;}
      if(!confirm(`确定删除选中的 ${idxs.length} 个自提点吗？`))return;
      idxs.forEach(i=>deliveryData.pickup.points.splice(i,1));
      saveDeliveryPickup();renderPickupPoints();document.getElementById('pickupCheckAll').checked=false;
    }
    function openPickupPointModal(idx){
      pickupPointEditingIndex=(typeof idx==='number')?idx:-1;
      document.getElementById('pickupPointModalTitle').textContent=pickupPointEditingIndex>=0?'编辑':'添加';
      const p=pickupPointEditingIndex>=0?deliveryData.pickup.points[pickupPointEditingIndex]:{name:'',address:'',phone:'',hours:'',location:'',enabled:true};
      document.getElementById('pickupPointIdx').value=pickupPointEditingIndex;
      document.getElementById('pickupPointName').value=p.name||'';
      document.getElementById('pickupPointPhone').value=p.phone||'';
      document.getElementById('pickupPointHours').value=p.hours||'';
      document.getElementById('pickupPointLocation').value=p.location||'';
      document.getElementById('pickupPointModal').classList.add('show');
    }
    function closePickupPointModal(){document.getElementById('pickupPointModal').classList.remove('show');pickupPointEditingIndex=-1;}
    function openPickupMapPicker(){
      const current=document.getElementById('pickupPointLocation').value||'';
      openMapPicker((val)=>{document.getElementById('pickupPointLocation').value=val;},current);
    }
    function savePickupPoint(){
      const name=document.getElementById('pickupPointName').value.trim();
      if(!name){toast('请输入自提点名称');return;}
      const loc=document.getElementById('pickupPointLocation').value.trim();
      const addr=loc?(loc.split(' (')[0]||name):name;
      const point={
        name,
        location:loc,
        address:addr,
        phone:document.getElementById('pickupPointPhone').value.trim(),
        hours:document.getElementById('pickupPointHours').value.trim(),
        enabled:true
      };
      if(pickupPointEditingIndex>=0){
        Object.assign(deliveryData.pickup.points[pickupPointEditingIndex],point);
      }else{
        point.id=Date.now();
        deliveryData.pickup.points.push(point);
      }
      saveDeliveryPickup();renderPickupPoints();closePickupPointModal();
    }
    async function saveDeliveryBatch(payload){
      const d=await fetchA(`${BASE}/settings`,{method:'POST',body:JSON.stringify(payload)});
      if(d.code!==0){toast(d.msg||'保存失败');return false;}
      toast('已保存');return true;
    }
    function renderDeliveryTemplates(){
      const kw=document.getElementById('deliverySearchInput').value.trim().toLowerCase();
      const list=deliveryData.express.templates.filter(t=>(t.name||'').toLowerCase().includes(kw));
      const tb=document.getElementById('deliveryTemplateTbody');
      if(!list.length){tb.innerHTML='<tr><td colspan="5" class="empty-row">暂无数据</td></tr>';return;}
      tb.innerHTML=list.map((t,i)=>{
        const realIndex=deliveryData.express.templates.indexOf(t);
        return `<tr>
          <td class="col-check"><input type="checkbox" class="dt-check" data-idx="${realIndex}"></td>
          <td>${escapeHtml(t.name||'未命名')}</td>
          <td class="col-enable"><label class="switch"><input type="checkbox" ${t.enabled?'checked':''} onchange="toggleTemplateEnabled(${realIndex},this.checked)"><span class="slider"></span></label></td>
          <td class="col-default">${t.is_default?'<span class="tag-default">默认</span>':''}</td>
          <td class="col-op"><div class="op-btns">
            <button class="btn-link" onclick="editDeliveryTemplate(${realIndex})">编辑</button>
            <button class="btn-link" onclick="setDefaultTemplate(${realIndex})">默认</button>
            <button class="btn-link danger" onclick="deleteDeliveryTemplate(${realIndex})">删除</button>
          </div></td>
        </tr>`;
      }).join('');
    }
    function toggleDeliveryCheckAll(cb){document.querySelectorAll('.dt-check').forEach(c=>c.checked=cb.checked);}
    function toggleTemplateEnabled(idx,v){deliveryData.express.templates[idx].enabled=v;saveDeliveryExpress();}
    function setDefaultTemplate(idx){
      deliveryData.express.templates.forEach((t,i)=>t.is_default=(i===idx));
      saveDeliveryExpress();renderDeliveryTemplates();
    }
    function deleteDeliveryTemplate(idx){
      if(!confirm('确定删除该模板吗？'))return;
      deliveryData.express.templates.splice(idx,1);
      saveDeliveryExpress();renderDeliveryTemplates();
    }
    function batchDeleteDeliveryTemplates(){
      const idxs=Array.from(document.querySelectorAll('.dt-check:checked')).map(c=>Number(c.dataset.idx)).sort((a,b)=>b-a);
      if(!idxs.length){toast('请先勾选要删除的模板');return;}
      if(!confirm(`确定删除选中的 ${idxs.length} 个模板吗？`))return;
      idxs.forEach(i=>deliveryData.express.templates.splice(i,1));
      saveDeliveryExpress();renderDeliveryTemplates();
    }
    function editDeliveryTemplate(idx){openDeliveryTemplateModal(idx);}

    /* 运费模板弹窗 */
    function openDeliveryTemplateModal(idx){
      tmEditingIndex=(typeof idx==='number')?idx:-1;
      document.getElementById('deliveryTemplateTitle').textContent=tmEditingIndex>=0?'编辑模板':'添加模板';
      const t=tmEditingIndex>=0?deliveryData.express.templates[tmEditingIndex]:{name:'',tip:'',type:'piece',base:0,base_fee:0,extra:0,extra_fee:0,free_enabled:false,free_amount:0,regions:[]};
      document.getElementById('tmName').value=t.name||'';
      document.getElementById('tmTip').value=t.tip||'';
      setRadioValue('tmType',t.type||'piece');
      document.getElementById('tmDefaultBase').value=t.base||0;
      document.getElementById('tmDefaultBaseFee').value=t.base_fee||0;
      document.getElementById('tmDefaultExtra').value=t.extra||0;
      document.getElementById('tmDefaultExtraFee').value=t.extra_fee||0;
      document.getElementById('tmFreeEnabled').checked=!!t.free_enabled;
      document.getElementById('tmFreeAmount').value=t.free_amount||0;
      document.getElementById('tmFreeWrap').style.display=t.free_enabled?'flex':'none';
      updateTmUnits();
      renderTmRegionTable();
      document.getElementById('deliveryTemplateModal').classList.add('show');
    }
    function closeDeliveryTemplateModal(){document.getElementById('deliveryTemplateModal').classList.remove('show');tmEditingIndex=-1;tmRegionEditingIndex=-1;}
    function toggleTmFree(v){document.getElementById('tmFreeWrap').style.display=v?'flex':'none';}
    function updateTmUnits(){
      const type=getRadioValue('tmType');
      const unit=type==='weight'?'kg':'件';
      document.getElementById('tmUnit1').textContent=unit;
      document.getElementById('tmUnit2').textContent=unit;
      document.getElementById('thUnitBase').textContent=unit;
      document.getElementById('thUnitExtra').textContent=unit;
    }
    function renderTmRegionTable(){
      updateTmUnits();
      const t=tmEditingIndex>=0?deliveryData.express.templates[tmEditingIndex]:null;
      const regions=(t&&t.regions)?t.regions:[];
      const tb=document.getElementById('tmRegionTbody');
      if(!regions.length){tb.innerHTML='<tr><td colspan="6" class="empty-row">暂无数据</td></tr>';return;}
      tb.innerHTML=regions.map((r,i)=>`<tr>
        <td class="region-names" title="${escapeHtml(r.names.join('、'))}">${escapeHtml(r.names.join('、'))}</td>
        <td>${r.base}</td>
        <td>${r.base_fee}</td>
        <td>${r.extra}</td>
        <td>${r.extra_fee}</td>
        <td><button class="btn-link" onclick="editTmRegion(${i})">编辑</button> <button class="btn-link danger" onclick="deleteTmRegion(${i})">删除</button></td>
      </tr>`).join('');
    }
    function saveDeliveryTemplate(){
      const name=document.getElementById('tmName').value.trim();
      if(!name){toast('请输入模板名称');return;}
      const type=getRadioValue('tmType');
      const payload={
        name,tip:document.getElementById('tmTip').value.trim(),type,
        base:Number(document.getElementById('tmDefaultBase').value)||0,
        base_fee:Number(document.getElementById('tmDefaultBaseFee').value)||0,
        extra:Number(document.getElementById('tmDefaultExtra').value)||0,
        extra_fee:Number(document.getElementById('tmDefaultExtraFee').value)||0,
        free_enabled:document.getElementById('tmFreeEnabled').checked,
        free_amount:Number(document.getElementById('tmFreeAmount').value)||0,
        enabled:true,is_default:false,
        regions:(tmEditingIndex>=0&&deliveryData.express.templates[tmEditingIndex].regions)?deliveryData.express.templates[tmEditingIndex].regions:[]
      };
      if(tmEditingIndex>=0){
        payload.enabled=deliveryData.express.templates[tmEditingIndex].enabled;
        payload.is_default=deliveryData.express.templates[tmEditingIndex].is_default;
        deliveryData.express.templates[tmEditingIndex]=payload;
      }else{
        if(!deliveryData.express.templates.length)payload.is_default=true;
        deliveryData.express.templates.push(payload);
      }
      saveDeliveryExpress();
      renderDeliveryTemplates();
      closeDeliveryTemplateModal();
    }
    /* 同城配送规则 */
    function renderLocalRules(){
      const kw=(document.getElementById('localSearchInput')||{}).value||'';
      const kwt=kw.trim().toLowerCase();
      const list=deliveryData.local.rules.filter(r=>(r.name||'').toLowerCase().includes(kwt));
      const mode=(document.getElementById('localViewMode')||{}).value||'list';
      const table=document.getElementById('localTable');
      const cardView=document.getElementById('localCardView');
      if(mode==='card'){
        table.style.display='none';cardView.style.display='grid';
        if(!list.length){cardView.innerHTML='<div class="empty-row">暂无数据</div>';return;}
        cardView.innerHTML=list.map((r,i)=>`<div class="pickup-card">
          <div class="pc-check"><input type="checkbox" class="lr-check" data-idx="${i}"></div>
          <div class="pc-title">${escapeHtml(r.name||'未命名')}</div>
          <div class="pc-row">半径：${r.radius||0} km · 基础费：${r.base_fee||0} 元</div>
          <div class="pc-op">
            <button class="btn-link" onclick="openLocalRuleModal(${i})">编辑</button>
            <button class="btn-link" onclick="setDefaultLocalRule(${i})">默认</button>
            <button class="btn-link danger" onclick="deleteLocalRule(${i})">删除</button>
          </div>
        </div>`).join('');
        return;
      }
      table.style.display='';cardView.style.display='none';
      const tb=document.getElementById('localRuleTbody');
      if(!list.length){tb.innerHTML='<tr><td colspan="5" class="empty-row">暂无数据</td></tr>';return;}
      tb.innerHTML=list.map((r,i)=>`<tr>
        <td class="col-check"><input type="checkbox" class="lr-check" data-idx="${i}"></td>
        <td>${escapeHtml(r.name||'未命名')}</td>
        <td class="col-enable"><label class="switch"><input type="checkbox" ${r.enabled?'checked':''} onchange="toggleLocalRuleEnabled(${i},this.checked)"><span class="slider"></span></label></td>
        <td class="col-default">${r.is_default?'<span class="tag-default">默认</span>':''}</td>
        <td class="col-op"><div class="op-btns">
          <button class="btn-link" onclick="openLocalRuleModal(${i})">编辑</button>
          <button class="btn-link" onclick="setDefaultLocalRule(${i})">默认</button>
          <button class="btn-link danger" onclick="deleteLocalRule(${i})">删除</button>
        </div></td>
      </tr>`).join('');
    }
    function toggleLocalCheckAll(cb){document.querySelectorAll('.lr-check').forEach(c=>c.checked=cb.checked);}
    function toggleLocalRuleEnabled(idx,v){deliveryData.local.rules[idx].enabled=v;saveDeliveryLocal();renderLocalRules();}
    function setDefaultLocalRule(idx){
      deliveryData.local.rules.forEach((r,i)=>r.is_default=(i===idx));
      saveDeliveryLocal();renderLocalRules();
    }
    function deleteLocalRule(idx){
      if(!confirm('确定删除该同城配送规则吗？'))return;
      deliveryData.local.rules.splice(idx,1);saveDeliveryLocal();renderLocalRules();
    }
    function batchDeleteLocalRules(){
      const idxs=Array.from(document.querySelectorAll('.lr-check:checked')).map(c=>Number(c.dataset.idx)).sort((a,b)=>b-a);
      if(!idxs.length){toast('请先勾选要删除的规则');return;}
      if(!confirm(`确定删除选中的 ${idxs.length} 个规则吗？`))return;
      idxs.forEach(i=>deliveryData.local.rules.splice(i,1));
      saveDeliveryLocal();renderLocalRules();document.getElementById('localCheckAll').checked=false;
    }
    function getDefaultLocalRule(){
      return {id:Date.now(),name:'',address:'',distance:'route',radius:2,min_amount:0,base_fee:0,free_amount:0,timed:true,time:{weekdays:[1,2,3,4,5,6,0],split:true,interval:60,selected:generateTimeSlots(60),open:'08:00',close:'18:00',special:false,special_dates:'',book:'none',book_day:1,book_hour:1,book_minute:1,max_book:'same',max_book_days:1},ladder:false,ladder_base_radius:0,ladder_base_fee:0,ladder_step_radius:0,ladder_step_fee:0,ladder_base_weight:0,ladder_weight_fee:0,ladder_step_weight:0,ladder_step_weight_fee:0,by_piece:false,enabled:true,is_default:false};
    }
    function generateTimeSlots(interval){
      const list=[];for(let h=0;h<24;h++){for(let m=0;m<60;m+=interval){list.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);}}
      return list;
    }
    function openLocalRuleModal(idx){
      localRuleEditingIndex=(typeof idx==='number')?idx:-1;
      document.getElementById('localRuleModalTitle').textContent=localRuleEditingIndex>=0?'编辑':'添加';
      const r=localRuleEditingIndex>=0?deliveryData.local.rules[localRuleEditingIndex]:getDefaultLocalRule();
      document.getElementById('localRuleIdx').value=localRuleEditingIndex;
      document.getElementById('localRuleName').value=r.name||'';
      document.getElementById('localRuleAddress').value=r.address||'';
      setRadioValue('localRuleDistance',r.distance||'route');
      document.getElementById('localRuleRadius').value=r.radius||0;
      document.getElementById('localRuleMinAmount').value=r.min_amount||0;
      document.getElementById('localRuleBaseFee').value=r.base_fee||0;
      document.getElementById('localRuleFreeAmount').value=r.free_amount||0;
      setRadioValue('localRuleTimed',r.timed?'1':'0');
      setRadioValue('localRuleLadder',r.ladder?'1':'0');
      document.getElementById('localLadderWrap').style.display=r.ladder?'block':'none';
      document.getElementById('localRuleLadderBaseRadius').value=r.ladder_base_radius||0;
      document.getElementById('localRuleLadderBaseFee').value=r.ladder_base_fee||0;
      document.getElementById('localRuleLadderStepRadius').value=r.ladder_step_radius||0;
      document.getElementById('localRuleLadderStepFee').value=r.ladder_step_fee||0;
      document.getElementById('localRuleLadderBaseWeight').value=r.ladder_base_weight||0;
      document.getElementById('localRuleLadderWeightFee').value=r.ladder_weight_fee||0;
      document.getElementById('localRuleLadderStepWeight').value=r.ladder_step_weight||0;
      document.getElementById('localRuleLadderStepWeightFee').value=r.ladder_step_weight_fee||0;
      setRadioValue('localRuleByPiece',r.by_piece?'1':'0');
      renderLocalMap(r.address||'');
      document.getElementById('localRuleModal').classList.add('show');
    }
    function closeLocalRuleModal(){document.getElementById('localRuleModal').classList.remove('show');localRuleEditingIndex=-1;}
    function toggleLocalLadder(v){document.getElementById('localLadderWrap').style.display=v?'block':'none';}
    function openLocalMapPicker(){
      const current=document.getElementById('localRuleAddress').value||'';
      openMapPicker((val)=>{document.getElementById('localRuleAddress').value=val;renderLocalMap(val);},current);
    }
    function renderLocalMap(val){
      const container=document.getElementById('localMapWrap');
      const m=val.match(/(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
      if(!m){container.innerHTML='<div class="address-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>点击「设置地址」在地图中选择取货点</div>';return;}
      const lng=parseFloat(m[1]),lat=parseFloat(m[2]);
      if(!window.TMap){container.innerHTML='<div class="address-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>地图未加载，请配置腾讯地图密钥</div>';return;}
      container.innerHTML='';
      const map=new TMap.Map(container,{center:new TMap.LatLng(lat,lng),zoom:13});
      new TMap.MultiMarker({map:map,geometries:[{id:'local',position:new TMap.LatLng(lat,lng)}]});
      try{
        new TMap.Circle({map:map,center:new TMap.LatLng(lat,lng),radius:Number(document.getElementById('localRuleRadius').value||0)*1000,strokeColor:'#5e6ad2',fillColor:'rgba(94,106,210,0.15)',strokeWeight:2});
      }catch(e){}
      setTimeout(()=>map.resize&&map.resize(),120);
    }
    function saveLocalRule(){
      const name=document.getElementById('localRuleName').value.trim();
      if(!name){toast('请输入规则名称');return;}
      const r={
        name,
        address:document.getElementById('localRuleAddress').value.trim(),
        distance:getRadioValue('localRuleDistance')||'route',
        radius:Number(document.getElementById('localRuleRadius').value)||0,
        min_amount:Number(document.getElementById('localRuleMinAmount').value)||0,
        base_fee:Number(document.getElementById('localRuleBaseFee').value)||0,
        free_amount:Number(document.getElementById('localRuleFreeAmount').value)||0,
        timed:getRadioValue('localRuleTimed')==='1',
        ladder:getRadioValue('localRuleLadder')==='1',
        ladder_base_radius:Number(document.getElementById('localRuleLadderBaseRadius').value)||0,
        ladder_base_fee:Number(document.getElementById('localRuleLadderBaseFee').value)||0,
        ladder_step_radius:Number(document.getElementById('localRuleLadderStepRadius').value)||0,
        ladder_step_fee:Number(document.getElementById('localRuleLadderStepFee').value)||0,
        ladder_base_weight:Number(document.getElementById('localRuleLadderBaseWeight').value)||0,
        ladder_weight_fee:Number(document.getElementById('localRuleLadderWeightFee').value)||0,
        ladder_step_weight:Number(document.getElementById('localRuleLadderStepWeight').value)||0,
        ladder_step_weight_fee:Number(document.getElementById('localRuleLadderStepWeightFee').value)||0,
        by_piece:getRadioValue('localRuleByPiece')==='1',
        enabled:true
      };
      r.time=localRuleEditingIndex>=0?(deliveryData.local.rules[localRuleEditingIndex].time||getDefaultLocalRule().time):getDefaultLocalRule().time;
      if(localRuleEditingIndex>=0){
        Object.assign(deliveryData.local.rules[localRuleEditingIndex],r);
      }else{
        r.id=Date.now();
        if(!deliveryData.local.rules.length) r.is_default=true;
        deliveryData.local.rules.push(r);
      }
      saveDeliveryLocal();renderLocalRules();closeLocalRuleModal();
    }

    /* 同城配送时间设置 */
    function openLocalTimeModal(idx){
      const r=localRuleEditingIndex>=0?deliveryData.local.rules[localRuleEditingIndex]:null;
      if(!r){toast('请先打开配送规则');return;}
      localTimeEditingRuleIndex=localRuleEditingIndex;
      const t=r.time||getDefaultLocalRule().time;
      document.getElementById('localTimeOwnerIdx').value=localTimeEditingRuleIndex;
      document.querySelectorAll('.lt-weekday').forEach(cb=>cb.checked=(t.weekdays||[]).includes(parseInt(cb.value)));
      setRadioValue('localTimeSplit',t.split?'1':'0');
      toggleLocalTimeSplit(!!t.split);
      document.getElementById('localTimeOpen').value=t.open||'08:00';
      document.getElementById('localTimeClose').value=t.close||'18:00';
      document.getElementById('localTimeInterval').value=t.interval||60;
      setLocalSplit(t.interval||60,(t.selected||[]));
      setRadioValue('localTimeSpecial',t.special?'1':'0');
      toggleLocalTimeSpecial(!!t.special);
      document.getElementById('localTimeSpecialDates').value=t.special_dates||'';
      setRadioValue('localTimeBook',t.book||'none');
      toggleLocalBook(t.book||'none');
      document.getElementById('localTimeBookDay').value=t.book_day||1;
      document.getElementById('localTimeBookHour').value=t.book_hour||1;
      document.getElementById('localTimeBookMinute').value=t.book_minute||1;
      setRadioValue('localTimeMaxBook',t.max_book||'same');
      toggleLocalMaxBook(t.max_book||'same');
      document.getElementById('localTimeMaxBookDays').value=t.max_book_days||1;
      document.getElementById('localTimeModal').classList.add('show');
    }
    function closeLocalTimeModal(){document.getElementById('localTimeModal').classList.remove('show');localTimeEditingRuleIndex=-1;}
    function toggleLocalTimeSplit(v){
      document.getElementById('localTimeSplitWrap').style.display=v?'block':'none';
      document.getElementById('localTimeRangeWrap').style.display=v?'none':'block';
    }
    function toggleLocalTimeSpecial(v){document.getElementById('localTimeSpecialWrap').style.display=v?'block':'none';}
    function toggleLocalBook(mode){
      document.getElementById('localTimeBookDay').disabled=(mode!=='advance');
      document.getElementById('localTimeBookHour').disabled=(mode!=='hour');
      document.getElementById('localTimeBookMinute').disabled=(mode!=='minute');
    }
    function toggleLocalMaxBook(mode){document.getElementById('localTimeMaxBookDays').disabled=(mode!=='range');}
    function setLocalSplit(interval,selected){
      document.querySelectorAll('.split-btns .btn').forEach(b=>b.classList.toggle('active',Number(b.dataset.split)===interval));
      const slots=generateTimeSlots(interval);
      const sel=new Set(selected||generateTimeSlots(interval));
      const grid=document.getElementById('localTimeGrid');
      grid.innerHTML=slots.map(s=>`<div class="tg-cell ${sel.has(s)?'active':''}" data-time="${s}" onclick="toggleLocalTimeCell(this)">${s}</div>`).join('');
    }
    function toggleLocalTimeCell(el){el.classList.toggle('active');}
    function saveLocalTime(){
      const idx=localTimeEditingRuleIndex;
      if(idx<0||!deliveryData.local.rules[idx]){toast('规则不存在');return;}
      const weekdays=Array.from(document.querySelectorAll('.lt-weekday:checked')).map(cb=>parseInt(cb.value));
      const split=getRadioValue('localTimeSplit')==='1';
      const interval=split?Number(document.querySelector('.split-btns .btn.active')?.dataset.split||60):Number(document.getElementById('localTimeInterval').value||60);
      const selected=Array.from(document.querySelectorAll('#localTimeGrid .tg-cell.active')).map(c=>c.dataset.time);
      deliveryData.local.rules[idx].time={
        weekdays,
        split,
        interval,
        selected,
        open:document.getElementById('localTimeOpen').value||'08:00',
        close:document.getElementById('localTimeClose').value||'18:00',
        special:getRadioValue('localTimeSpecial')==='1',
        special_dates:document.getElementById('localTimeSpecialDates').value||'',
        book:getRadioValue('localTimeBook')||'none',
        book_day:Number(document.getElementById('localTimeBookDay').value)||1,
        book_hour:Number(document.getElementById('localTimeBookHour').value)||1,
        book_minute:Number(document.getElementById('localTimeBookMinute').value)||1,
        max_book:getRadioValue('localTimeMaxBook')||'same',
        max_book_days:Number(document.getElementById('localTimeMaxBookDays').value)||1
      };
      closeLocalTimeModal();
    }

    /* 区域选择 */
    function openRegionPickerForNew(){tmRegionEditingIndex=-1;openRegionPicker([],onRegionPicked);}
    function editTmRegion(i){
      tmRegionEditingIndex=i;
      const t=deliveryData.express.templates[tmEditingIndex];
      const selected=(t.regions[i]&&t.regions[i].codes)?t.regions[i].codes:[];
      openRegionPicker(selected,onRegionPicked);
    }
    function deleteTmRegion(i){
      const t=deliveryData.express.templates[tmEditingIndex];
      t.regions.splice(i,1);renderTmRegionTable();
    }
    function onRegionPicked(codes){
      const names=codes.map(code=>{
        const [pIdx,cIdx]=code.split('-').map(Number);
        if(isNaN(cIdx))return REGION_DATA.provinces[pIdx].name;
        return REGION_DATA.provinces[pIdx].cities[cIdx];
      });
      const region={codes,names,base:1,base_fee:0,extra:1,extra_fee:0};
      const t=deliveryData.express.templates[tmEditingIndex];
      if(!t.regions)t.regions=[];
      if(tmRegionEditingIndex>=0)t.regions[tmRegionEditingIndex]=region;else t.regions.push(region);
      renderTmRegionTable();
    }
    let regionPickerCallback=null,regionSelectedCodes=[];
    function openRegionPicker(initialCodes,cb){
      regionPickerCallback=cb;regionSelectedCodes=Array.isArray(initialCodes)?initialCodes.slice():[];
      renderRegionList();
      updateRegionCheckAll();
      updateRegionSelectedCount();
      document.getElementById('regionPickerModal').classList.add('show');
    }
    function closeRegionPicker(){document.getElementById('regionPickerModal').classList.remove('show');regionPickerCallback=null;}
    function confirmRegionPicker(){if(regionPickerCallback)regionPickerCallback(regionSelectedCodes.slice());closeRegionPicker();}
    function renderRegionList(){
      const box=document.getElementById('regionList');
      box.innerHTML=REGION_DATA.provinces.map((p,pIdx)=>{
        const code=`${pIdx}`;
        const checked=regionSelectedCodes.includes(code)?'checked':'';
        return `<div class="region-group"><input type="checkbox" id="rg-${pIdx}" value="${code}" ${checked} onchange="toggleRegionCode('${code}',this.checked)"><label class="rg-label" for="rg-${pIdx}">${escapeHtml(p.name)}<span class="city-count">(${p.cities.length})</span></label></div>`;
      }).join('');
    }
    function toggleRegionCode(code,checked){
      const set=new Set(regionSelectedCodes);
      if(checked)set.add(code);else set.delete(code);
      regionSelectedCodes=Array.from(set);
      updateRegionCheckAll();updateRegionSelectedCount();
    }
    function toggleRegionCheckAll(cb){
      if(cb.checked)regionSelectedCodes=REGION_DATA.provinces.map((_,i)=>`${i}`);
      else regionSelectedCodes=[];
      renderRegionList();updateRegionSelectedCount();
    }
    function updateRegionCheckAll(){
      const cb=document.getElementById('regionCheckAll');
      if(!cb)return;
      cb.checked=regionSelectedCodes.length===REGION_DATA.provinces.length;
    }
    function updateRegionSelectedCount(){
      const el=document.getElementById('regionSelectedCount');
      if(el)el.textContent=`已选 ${regionSelectedCodes.length} 个`;
    }

    function switchBottomNavTab(tab){
      document.querySelectorAll('.bn-tab').forEach(el=>{
        el.classList.toggle('active',el.dataset.tab===tab);
      });
      document.getElementById('bottomNavCommon').classList.toggle('hidden',tab!=='common');
      document.getElementById('bottomNavStyle').classList.toggle('hidden',tab!=='style');
    }

    function renderBottomNavList(){
      const items=getBottomNavItems();
      const list=document.getElementById('bottomNavList');
      const maxed=items.length>=5;
      const addBtn=document.getElementById('bnAddBtn');
      addBtn.disabled=maxed;
      addBtn.style.opacity=maxed?0.5:1;
      if(!items.length){
        list.innerHTML='<div class="bn-empty">暂无菜单项，点击上方按钮添加。</div>';
        return;
      }
      const plusSvg='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';
      list.innerHTML=items.map((it,i)=>`
        <div class="bn-item" draggable="true" data-idx="${i}" ondragstart="bnListDragStart(event,${i})" ondragover="bnListDragOver(event)" ondrop="bnListDrop(event,${i})">
          <div class="bn-drag"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg></div>
          <div class="bn-icons"><img src="${it.icon||''}" alt=""><img src="${it.active_icon||it.icon||''}" alt=""></div>
          <div class="bn-name">${it.name||'未命名'}</div>
          <div class="actions">
            <button class="btn outline sm" onclick="openBottomNavModal(${i})">编辑</button>
            <button class="btn red sm" onclick="removeBottomNavItem(${i})" ${items.length<=2?'disabled':''}>删除</button>
          </div>
        </div>
      `).join('');
      addBtn.innerHTML=plusSvg+' 添加菜单项';
    }

    function bnListDragStart(e,i){bnDragIdx=i;e.dataTransfer.effectAllowed='move';e.target.classList.add('dragging');}
    function bnListDragOver(e){e.preventDefault();}
    function bnListDrop(e,to){
      e.preventDefault();
      const from=bnDragIdx;
      bnDragIdx=null;
      document.querySelectorAll('.bn-item.dragging').forEach(el=>el.classList.remove('dragging'));
      if(from===null||from===to)return;
      const items=getBottomNavItems();
      const [moved]=items.splice(from,1);
      items.splice(to,0,moved);
      setBottomNavItems(items);
      renderBottomNavList();
    }

    function addBottomNavItem(){
      const items=getBottomNavItems();
      if(items.length>=5){toast('最多只能添加 5 个菜单');return;}
      items.push({name:'新菜单',icon:'https://placehold.co/96x96/8a8f98/fff?text=新',active_icon:'https://placehold.co/96x96/5e6ad2/fff?text=新',link:{type:'page',id:'home'}});
      setBottomNavItems(items);
      renderBottomNavList();
      openBottomNavModal(items.length-1);
    }
    function removeBottomNavItem(idx){
      const items=getBottomNavItems();
      if(items.length<=2){toast('至少需要保留 2 个菜单');return;}
      items.splice(idx,1);
      setBottomNavItems(items);
      renderBottomNavList();
    }

    function openBottomNavModal(startIdx){
      bottomNavEditItems=JSON.parse(JSON.stringify(getBottomNavItems()));
      bnSelectedIdx=(startIdx>=0&&startIdx<bottomNavEditItems.length)?startIdx:0;
      if(!bottomNavEditItems.length){
        bottomNavEditItems.push({name:'新菜单',icon:'https://placehold.co/96x96/8a8f98/fff?text=新',active_icon:'https://placehold.co/96x96/5e6ad2/fff?text=新',link:{type:'page',id:'home'}});
        bnSelectedIdx=0;
      }
      renderBottomNavCards();
      fillBottomNavForm(bnSelectedIdx);
      document.getElementById('bottomNavModal').classList.add('show');
    }
    function closeBottomNavModal(){
      document.getElementById('bottomNavModal').classList.remove('show');
    }

    function renderBottomNavCards(){
      const cards=document.getElementById('bnModalCards');
      const maxed=bottomNavEditItems.length>=5;
      const addBtn=document.getElementById('bnModalAddBtn');
      addBtn.disabled=maxed;
      addBtn.style.opacity=maxed?0.5:1;
      cards.innerHTML=bottomNavEditItems.map((it,i)=>`
        <div class="bn-card ${i===bnSelectedIdx?'active':''}" draggable="true" data-idx="${i}" onclick="selectBottomNavCard(${i})" ondragstart="bnCardDragStart(event,${i})" ondragover="bnCardDragOver(event)" ondrop="bnCardDrop(event,${i})">
          <div class="num">${i+1}</div>
          <div class="icons"><img src="${it.icon||''}" alt=""><img src="${it.active_icon||it.icon||''}" alt=""></div>
          <div style="margin-top:8px;font-size:12px;color:var(--text);">${it.name||'未命名'}</div>
        </div>
      `).join('');
    }
    function bnCardDragStart(e,i){bnDragIdx=i;e.dataTransfer.effectAllowed='move';e.target.classList.add('dragging');}
    function bnCardDragOver(e){e.preventDefault();}
    function bnCardDrop(e,to){
      e.preventDefault();
      saveBottomNavFormToItem();
      const from=bnDragIdx;
      bnDragIdx=null;
      document.querySelectorAll('.bn-card.dragging').forEach(el=>el.classList.remove('dragging'));
      if(from===null||from===to)return;
      const [moved]=bottomNavEditItems.splice(from,1);
      bottomNavEditItems.splice(to,0,moved);
      bnSelectedIdx=to;
      renderBottomNavCards();
      fillBottomNavForm(bnSelectedIdx);
    }

    function selectBottomNavCard(idx){
      saveBottomNavFormToItem();
      bnSelectedIdx=idx;
      renderBottomNavCards();
      fillBottomNavForm(idx);
    }
    function addBottomNavCard(){
      if(bottomNavEditItems.length>=5){toast('最多只能添加 5 个菜单');return;}
      saveBottomNavFormToItem();
      bottomNavEditItems.push({name:'新菜单',icon:'https://placehold.co/96x96/8a8f98/fff?text=新',active_icon:'https://placehold.co/96x96/5e6ad2/fff?text=新',link:{type:'page',id:'home'}});
      bnSelectedIdx=bottomNavEditItems.length-1;
      renderBottomNavCards();
      fillBottomNavForm(bnSelectedIdx);
    }

    function fillBottomNavForm(idx){
      const it=bottomNavEditItems[idx];
      if(!it)return;
      document.getElementById('bnEditIdx').value=idx;
      document.getElementById('bnEditTitle').textContent='编辑：'+(it.name||'未命名');
      document.getElementById('bnName').value=it.name||'';
      document.getElementById('bnIcon').value=it.icon||'';
      document.getElementById('bnActiveIcon').value=it.active_icon||'';
      renderBottomNavIconPreview('bnIconPreview',it.icon);
      renderBottomNavIconPreview('bnActiveIconPreview',it.active_icon);
      const link=it.link||{};
      document.getElementById('bnLinkType').value=link.type||'';
      document.getElementById('bnLinkId').value=link.id!==undefined?link.id:'';
      document.getElementById('bnLinkText').value=link.type?`${link.type}/${link.id!==undefined?link.id:''}`:'';
    }
    function renderBottomNavIconPreview(elId,url){
      const el=document.getElementById(elId);
      if(url){el.innerHTML='<img src="'+url+'" alt="">';}
      else{el.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>';}
    }
    function saveBottomNavFormToItem(){
      const idx=parseInt(document.getElementById('bnEditIdx').value,10);
      if(idx<0||idx>=bottomNavEditItems.length)return;
      const it=bottomNavEditItems[idx];
      it.name=document.getElementById('bnName').value.trim()||'未命名';
      it.icon=document.getElementById('bnIcon').value.trim();
      it.active_icon=document.getElementById('bnActiveIcon').value.trim();
      const type=document.getElementById('bnLinkType').value.trim();
      const idRaw=document.getElementById('bnLinkId').value;
      it.link=type?{type:type,id:type==='page'?idRaw:(parseInt(idRaw,10)||0)}:{};
    }

    async function uploadBottomNavIcon(input,isActive){
      const file=input.files[0];
      if(!file)return;
      const url=await uploadToServer(file,'image');
      if(!url){toast('上传失败');return;}
      input.value='';
      const idx=parseInt(document.getElementById('bnEditIdx').value,10);
      if(idx<0||idx>=bottomNavEditItems.length)return;
      const it=bottomNavEditItems[idx];
      if(isActive){it.active_icon=url;}else{it.icon=url;}
      renderBottomNavCards();
      fillBottomNavForm(idx);
    }

    function pickBottomNavLink(){
      const type=prompt('链接类型：page / goods / category / activity','page');
      if(!type)return;
      const id=prompt('链接目标 ID：','home');
      if(id===null)return;
      document.getElementById('bnLinkType').value=type;
      document.getElementById('bnLinkId').value=id;
      document.getElementById('bnLinkText').value=type+'/'+id;
    }

    function confirmBottomNavModal(){
      saveBottomNavFormToItem();
      if(bottomNavEditItems.length<2){toast('至少需要 2 个菜单');return;}
      if(bottomNavEditItems.length>5){toast('最多只能 5 个菜单');return;}
      setBottomNavItems(bottomNavEditItems);
      renderBottomNavList();
      closeBottomNavModal();
    }

    function validateBottomNav(){
      const items=getBottomNavItems();
      if(items.length<2){toast('底部导航至少需要 2 个菜单');return false;}
      if(items.length>5){toast('底部导航最多只能 5 个菜单');return false;}
      for(const it of items){
        if(!it.name||!it.icon){toast('请完善每个菜单的名称和图标');return false;}
      }
      return true;
    }

    async function saveBottomNav(){
      if(!validateBottomNav())return;
      const cfg=JSON.parse(JSON.stringify(bottomNavConfig));
      cfg.page='bottom_nav';
      cfg.components=cfg.components.map(c=>({type:c.type,props:c.props}));
      const d=await fetchA(`${BASE}/design/bottom_nav/save`,{method:'POST',body:{config:cfg,remark:'底部导航设置'}});
      toast(d.code===0?'草稿保存成功':(d.msg||'保存失败'));
    }
    async function publishBottomNav(){
      if(!validateBottomNav())return;
      const cfg=JSON.parse(JSON.stringify(bottomNavConfig));
      cfg.page='bottom_nav';
      cfg.components=cfg.components.map(c=>({type:c.type,props:c.props}));
      const r=await fetchA(`${BASE}/design/bottom_nav/save`,{method:'POST',body:{config:cfg,remark:'底部导航设置'}});
      if(r.code!==0){toast(r.msg||'保存失败');return;}
      const p=await fetchA(`${BASE}/design/bottom_nav/publish`,{method:'POST',body:{}});
      toast(p.code===0?'发布成功':(p.msg||'发布失败'));
    }

    /* Init */
    (async()=>{
      if(localStorage.getItem('admin_token')){
        try{
          await fetchA(`${BASE}/goods?page=1&page_size=1`);
          document.getElementById('loginWrap').classList.add('hidden');
          document.getElementById('mainView').classList.remove('hidden');
          document.getElementById('who').textContent=localStorage.getItem('admin_user')||'admin';
          await loadCategories();
          renderSidebar();
          switchMenu('overview','dashboard');
        }catch(e){logout();}
      }
    })();
  