;(function(w, d, undefined) {
	var unique,fadeFn,wFn,mFn,dragFn,drogFn,btn1Fn,btn2Fn;

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
			this.wrap = d.createElement('DIV'),
			this.fade = d.createElement('DIV'),
			this.model = d.createElement('DIV'),
			this.title = d.createElement('DIV'),
			this.content = d.createElement('DIV')
			this.footer = d.createElement('DIV'),
			this.confirmBtn = d.createElement("BUTTON"),
			this.closeBtn = d.createElement("BUTTON");

			this.wrap.className = 'POP-wrap POP-on';
			this.fade.className = 'POP-fade';
			this.model.className = 'POP-model';
			this.title.className = 'POP-title';
			this.footer.className = 'POP-footer';
			this.content.className = 'POP-content';
			this.confirmBtn.className = 'POP-confirm';
			this.confirmBtn.innerHTML = '确认';
			this.closeBtn.className = 'POP-close';
			this.closeBtn.innerHTML = '取消';
			this.model.appendChild(this.title);
			this.model.appendChild(this.content);
			this.model.appendChild(this.footer);
			this.footer.appendChild(this.closeBtn);
			this.footer.appendChild(this.confirmBtn);
			this.wrap.appendChild(this.fade);
			this.wrap.appendChild(this.model);

			//窗口可拖拽
			this.title.addEventListener('mousedown', dragFn = function(event){
				that.dragFlag = true;
				that.startX = event.pageX;
				that.startY = event.pageY;
				that.left = parseInt(w.getComputedStyle(that.model , null)['left']);
				that.top = parseInt(w.getComputedStyle(that.model , null)['top']);
			});
			this.title.addEventListener('mouseup', drogFn = function(){ that.dragFlag = false; });
			this.wrap.addEventListener('mousemove', mFn = function(event){ that.onDrag(event, that); })

			//遮罩层绑定事件
			this.fade.addEventListener('click', fadeFn = function(){that.close(that,undefined,true)});

			//键盘绑定事件
			w.addEventListener('keydown', wFn = function(event){
				var code = event.keyCode;
				if(code === 27){
					event.preventDefault();
					that.close(that,undefined,true);
				}
				else if(code === 13){
					event.preventDefault();
					var zzz = that.input ? that.input.value : true;
					that.close(that, zzz);
				}
			})
			d.getElementsByTagName('BODY')[0].appendChild(this.wrap);

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
			this.confirmBtn.addEventListener('click', btn2Fn = function(){that.close(that)});
		},
		//confirm方法
		confirm: function() {
			var that = this;
			this.init();
			this.option(this.config);
			this.content.innerHTML = this.txt;
			this.closeBtn.addEventListener('click', btn1Fn = function(){that.close(that,false)});
			this.confirmBtn.addEventListener('click', btn2Fn = function(){that.close(that,true)});
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
			this.closeBtn.addEventListener('click', btn1Fn = function(){that.close(that,undefined,true)});
			this.confirmBtn.addEventListener('click', btn2Fn = function(){that.close(that,that.input.value)});
		},
		//关闭弹窗 (that为原对象指针, msg为回调参数, flag为是否不执行回调 )
		close: function(that, msg, flag) {
			d.getElementsByTagName('BODY')[0].removeChild(that.wrap);

			//单例标识关闭
			unique = undefined;

			//清除绑定事件
			this.fade.removeEventListener("click", fadeFn, false);
			this.title.removeEventListener('mousedown', dragFn, false);
			this.title.removeEventListener('mouseup', drogFn, false);
			this.wrap.removeEventListener('mousemove', mFn, false);
			w.removeEventListener("keydown", wFn , false);
			this.closeBtn.removeEventListener("click", btn1Fn, false);
			this.confirmBtn.removeEventListener("click", btn2Fn, false);

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
		onDrag: function(event, that) {
			if(that.dragFlag){
				that.model.style.left = (event.pageX - that.startX + that.left) + 'px';
				that.model.style.top = (event.pageY - that.startY + that.top) + 'px';
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