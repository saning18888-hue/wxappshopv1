
    const BASE='/admin';
    const token=()=>localStorage.getItem('admin_token')||'';

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
        {key:'info',label:'店铺设置',icon:ICONS.store},
        {key:'delivery',label:'配送设置',icon:ICONS.truck}
      ]},
      {key:'member',label:'会员',icon:ICONS.users,children:[
        {key:'list',label:'会员列表',icon:ICONS.users,default:true},
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
      if(panelId==='overviewPanel') loadOverviewStats();
      window.scrollTo(0,0);
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
    function escapeHtml(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

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
  