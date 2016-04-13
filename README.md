# POP.js
基于原生JS的弹出窗插件(Based on the native JS plug-in Pop-up Layer)

[DEMO](http://121.42.196.46/task/task-37/)

###HTML
```html
  <link rel="stylesheet" href="POP.css">
  ...
  
  <script src="POP.js"></script>
```

###Method
* POP.alert( content [,option] )
* POP.confirm( content [,option] )
* POP.prompt( content [,option] )

###Param
content 【string】
弹窗的主要内容

####option (可选三种类型)
string  【弹窗主题】
```
* "success"  -> 成功主题green
* "warning"  -> 警告主题yellow
* "error"    -> 失败主题red
* other      -> 默认主题grey
```

function  【回调函数】
```
function(data) {}
* 当使用confirm( )方法时, data为 true/false;
* 当使用prompt( )方法时, data为 输入的值;
```

object  【多种设置】
```
* type : "success" -> 设置主题
* callback : fn  -> 回调函数
* title: "DIY Title" -> 自定义标题
```

### Tips
键盘ESC = 点击灰色幕布 = 关闭弹窗 = 不执行回调<br>
键盘Enter = 点击确认按钮
