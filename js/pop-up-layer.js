;(function(w, d, undefined) {
	var unique;

	var Layer = function(txt, config) {
		this.txt = txt;
		this.config = config;
		this.dragFlag = false;
		this.startX = 0;
		this.startY = 0;
	}

	Layer.prototype = {
		//初始化弹窗
		init: function() {
			var that = this;
			['wrap','fade','model','title','content','footer'].map(function(name){
				that[name] = d.createElement('DIV');
				that[name].className = 'POP-' + name;
			})

			that.wrap.className = 'POP-wrap POP-on';
			that.confirmBtn = d.createElement("BUTTON"),
			that.closeBtn = d.createElement("BUTTON");

			that.confirmBtn.className = 'POP-confirm';
			that.confirmBtn.innerHTML = '确认';
			that.closeBtn.className = 'POP-close';
			that.closeBtn.innerHTML = '取消';
			that.model.appendChild(that.title);
			that.model.appendChild(that.content);
			that.model.appendChild(that.footer);
			that.footer.appendChild(that.closeBtn);
			that.footer.appendChild(that.confirmBtn);
			that.wrap.appendChild(that.fade);
			that.wrap.appendChild(that.model);

			//窗口可拖拽
			that.title.addEventListener('mousedown', that.onDrag.bind(that));
			that.title.addEventListener('mouseup', that.onDrop.bind(that));
			that.wrap.addEventListener('mousemove', that.onMove.bind(that));
			d.addEventListener('mouseout', that.onMove.bind(that));

			//遮罩层绑定事件
			that.fade.addEventListener('click', that.onFade.bind(that));

			//键盘绑定事件
			w.addEventListener('keydown', that.onKeyboard.bind(that));
			d.getElementsByTagName('BODY')[0].appendChild(that.wrap);

			//移除POP-on类，出现效果
			setTimeout(function(){
				that.wrap.className = 'POP-wrap';
			},100)
		},
		//第二个参数设置
		option: function() {
			if(typeof this.config === 'string'){
				this.setTheme(this.config);
			}
			else if(typeof this.config === 'function'){
				this.setTheme();
				this.callback = this.config;
			}
			else if(typeof this.config === 'object'){
				var type = this.config.type ? this.config.type : 'default';
				this.setTheme(type);
				if(this.config.title){
					this.title.innerHTML = this.config.title;
				}
				this.callback = this.config.callback;
			}
			else {
				this.setTheme();
			}
		},
		//alert方法
		alert: function() {
			var that = this;
			this.init();
			this.option(this.config);
			this.content.innerHTML = this.txt;
			this.footer.removeChild(this.closeBtn);
			this.confirmBtn.addEventListener('click', that.onClose.bind(that));
		},
		//confirm方法
		confirm: function() {
			var that = this;
			this.init();
			this.option(this.config);
			this.content.innerHTML = this.txt;
			this.closeBtn.addEventListener('click', that.onClose.bind(that, false));
			this.confirmBtn.addEventListener('click', that.onClose.bind(that, true));
		},
		//prompt方法
		prompt: function() {
			var that = this;
			this.init();
			this.option(this.config);
			this.title.innerHTML = this.txt;
			this.input = d.createElement('INPUT');
			this.input.type = 'text';
			this.content.appendChild(this.input);
			this.closeBtn.addEventListener('click', that.onClose.bind(that, undefined, true));
			this.confirmBtn.addEventListener('click', that.onClose.bind(that, that.input.value));
		},
		//关闭弹窗 (msg为回调函数的参数, flag为是否不执行回调 )
		close: function(msg, flag) {
			var that = this;
			d.getElementsByTagName('BODY')[0].removeChild(that.wrap);

			//单例标识关闭
			unique = undefined;

			//清除绑定事件
			this.fade.removeEventListener("click", that.onFade, false);
			this.title.removeEventListener('mousedown', that.onDrag, false);
			this.title.removeEventListener('mouseup', that.onDrop, false);
			this.wrap.removeEventListener('mousemove', that.onMove, false);
			d.removeEventListener('mouseout', that.onMove, false);

			w.removeEventListener("keydown", that.onClose , false);
			this.closeBtn.removeEventListener("click", that.onClose, false);
			this.confirmBtn.removeEventListener("click", that.onClose, false);

			//是否执行回调
			if(that.callback && !flag){
				if(msg !== undefined){
					that.callback(msg);
				}
				else {
					that.callback();
				}
			}
		},
		//设置主题
		setTheme: function(type) {
			switch (type) {
				case "success":
					{
						this.model.setAttribute('class','POP-model POP-success');
						this.title.innerHTML = 'Success!';
						break;
					}
				case "error":
					{
						this.model.setAttribute('class','POP-model POP-error');
						this.title.innerHTML = 'Error!';
						break;
					}
				case "warning":
					{
						this.model.setAttribute('class','POP-model POP-warning');
						this.title.innerHTML = 'Warning!';
						break;
					}
				default:
					{
						this.title.innerHTML = '弹出框';
						break;
					}
			}
		},
		onClose: function(msg, flag){
			flag = typeof flag !== 'boolean' ? false : flag;
			this.close(msg, flag);
		},
		//设置拖拽开始状态
		onDrag: function(event){
			this.dragFlag = true;
			this.startX = event.pageX;
			this.startY = event.pageY;
			this.left = parseInt(w.getComputedStyle(this.model , null)['left']);
			this.top = parseInt(w.getComputedStyle(this.model , null)['top']);
		},
		//拖拽过程
		onMove: function(event) {
			if(this.dragFlag){
				this.model.style.left = (event.pageX - this.startX + this.left) + 'px';
				this.model.style.top = (event.pageY - this.startY + this.top) + 'px';
			}
		},
		//结束拖拽
		onDrop: function(event){
			this.dragFlag = false;
		},
		//遮罩层点击事件
		onFade: function(){
			this.close(undefined,true);
		},
		//键盘点击事件
		onKeyboard: function(event){
			var code = event.keyCode;
			if(code === 27){
				event.preventDefault();
				this.close(undefined,true);
			}
			else if(code === 13){
				event.preventDefault();
				var zzz = this.input ? this.input.value : true;
				this.close(zzz);
			}
		}
	}
	//  插件入口对象
	var POP = {
		alert: function(txt, config) {
			var layer = this.single(txt, config);
			if(layer){
				layer.alert();
			}
		},
		confirm: function(txt, config) {
			var layer = this.single(txt, config);
			if(layer){
				layer.confirm();
			}
		},
		prompt: function(txt, config) {
			var layer = this.single(txt, config);
			if(layer){
				layer.prompt();
			}
		},
		//单例模式
		single: function(txt, config) {
			if (unique === undefined) {
				unique = new Layer(txt, config);
				return unique;
			}
			else {
				return false;
			}
		}
	}

	window["POP"] = POP;
})(window, document)