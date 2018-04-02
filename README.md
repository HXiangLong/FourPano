第四代全景
编程语法 es6以上
技术路线 React + webpack + express + mysql
分别为单机版和联网版都能对应编辑版、PC版、手机版、触摸屏版
区别在于数据来源json文件或数据库
编辑版本包含 添加楼层、楼层点、添加/删除/移动箭头、添加/删除热点标注、添加视频标注等
PC版包含所有展示功能。

Pano
│  main.js
│  package.json
│  README.md
│  webpack.config.dev.js
│  webpack.config.js
│
├─src
│  │  index.html
│  │
│  ├─css
│  │  │  editor.css
│  │  │  pc.css
│  │  │  phone.css
│  │  │  touchScreen.css
│  │  │
│  │  ├─commons
│  │  │      common.css
│  │  │
│  │  └─lib
│  ├─img
│  │  ├─exhlist
│  │  └─help
│  ├─libs//外部插件
│  │      Detector.js
│  │      Stats.js
│  │      tween.min.js
│  │
│  ├─scripts
│  │  │  SWPano.js
│  │  │
│  │  ├─data//服务器来的数据对象
│  │  │      ArrowInfo.js
│  │  │      ExhibitsInfo.js
│  │  │      FacadeByPanoIDInfo.js
│  │  │      FloorsInfo.js
│  │  │      FloorsMarkerInfo.js
│  │  │      MarkerInfo.js
│  │  │      MultiDataByParentIDInfo.js
│  │  │      StationInfo.js
│  │  │      ThumbnailsInfo.js
│  │  │
│  │  ├─json//配置文件  
│  │  │      config.json
│  │  │
│  │  ├─modules
│  │  ├─page
│  │  │      editor.js
│  │  │      pc.js
│  │  │      phone.js
│  │  │      touchScreen.js
│  │  │
│  │  ├─server
│  │  │      ServerData.js
│  │  │
│  │  └─tools
│  │          Constants.js
│  │          ExternalConst.js
│  │          HashTable.js
│  │          SWViewGesture.js
│  │          Tool.js
│  │
│  ├─server//客户端链接服务器
│  └─views //页面
│          editor.html
│          pc.html
│          phone.html
│          touchScreen.html
│
└─webpack-config //配置文件夹
        devServer.config.js
        entry.config.js
        module.config.js
        module.product.config.js
        output.config.js
        path.config.js
        plugins.config.js
        plugins.product.config.js
        resolve.config.js