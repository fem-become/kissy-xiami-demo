KISSY.add(function(S, Node, Transition, Event, header, DD, Constrain) {

	var $ = Node.all;
	var el;
	var myName = this.getName();
	var body = $("#body");



	// player内部变量
	var re = {};
	var BASE_URL = 'http://test.fem.taobao.net:3000/song/';
	var TEST_URL = 'http://m1.file.xiami.com/224/224/992/12345_95993_l.mp3';
	var PLAY_CLASS = 'pl-play';
	var STOP_CLASS = 'pl-pause';
	var player = null;
	var musicInfo = {};
	var isPlaying = false;
	var isStarted = false;


	/**

S.getScript('http://lab.cubiq.org/iscroll/src/iscroll.js', function() {
		var myScroll;

		function loaded() {
			myScroll = new iScroll('J_PlTabContent');
		}

		document.addEventListener('touchmove', function(e) {
			e.preventDefault();
		}, false);


		document.addEventListener('DOMContentLoaded', function() {
			setTimeout(loaded, 200);
		}, false);
	})


 */

	var elTabContent = [];


	var LIST_TEMP_HTML = '<li class="J_MusicItem" id="J_MusicItem{id}" data-id="{id}">' +
		'<p class="bar J_PlListBar" class="J_ItemBar"></p>' +
		'<p class="pl-name">' +
		'	<strong class="tt" title="{title}">' +
		'		{title}' +
		'	</strong>' +
		'	<em>正在播放</em>' +
		'</p>' +
	//'<i class="J_TriggerMove"></i>'+
	'</li>';
	var HANDLE_TEMPLATE = '<div id="J_PlayInfo" class="pl-play-info">' +
		'	<ul class="pl-tab-icon" id="J_TabHandle">' +
		'		<li id="J_TabImg" data-index="0" class="J_PlayTabIcon pl-hover">' +
		'		</li>' +
		'		<li id="J_TabList" data-index="1" class="J_PlayTabIcon">' +
		'		</li>' +
		'	</ul>' +
		'	<p id="J_PlayTime" class="pl-play-time">' +
		'		<em id="J_CurrentTime" class="pl-current">' +
		'			00:00' +
		'		</em>' +
		'		<em id="J_TotalTime" class="pl-total">' +
		'			00:00' +
		'		</em>' +
		'	</p>' +
		'	<div id="J_PlayBar" class="pl-play-bar">' +
		'		<p id="J_PlayProgress" class="pl-progress"></p>' +
		'		<em id="J_PlayBarIcon" class="pl-bar-icon"></em>' +
		'	</div>' +
		'	<div class="pl-player-handle">' +
		'		<span id="J_PlayLast" class="pl-last">' +
		'			<em>last</em>' +
		'		</span>' +
		'		<span id="J_PlaySwitch" class="pl-switch pl-pause">' +
		'			<em>play/pause</em>' +
		'		</span>' +
		'		<span id="J_PlayNext" class="pl-next">' +
		'			<em>next</em>' +
		'		</span>' +
		'	</div>' +
		'</div>';


	var TAB_CONTENT_TEMP = '<div id="J_PlTabContent" class="pl-tab-content">' +
		'	<div id="J_PlayerTab" class="pl-player-tab">' +
		'		<div class="pl-img-tab" id="J_PlImgTab">' +
		'			<div class="pl-img-content">' +
		'				<img class="pl-img" id="J_PlImg" src="" alt="img">' +
		'			</div>	' +
		'		</div>' +
		'		<div class="pl-list-tab" id="J_PlListTab" style="display:none">' +
		'			<ul class="pl-music-list" id="J_PlMusicList">' +
		'			</ul>' +
		'		</div>' +
		'	</div>' +
		'</div>';

	var numInit = 0;

	//播放列表
	var test = [12345, 11024, 11020, 11026, 12024];
	localStorage.setItem('MUSIC_LIST', test.toString());
	var listArr = localStorage.getItem('MUSIC_LIST') && localStorage.getItem('MUSIC_LIST').split(',');
	S.mix(re, {

		init: function(config) {
			header.setTitle("播放器");
			numInit = 0;
			if (!config || !config.id) {
				musicInfo.id = listArr[0];
			} else {
				musicInfo.id = config.id;
			}
			if (!el) {
				el = $('<div class="mod-page"></div>').appendTo(body);
				el.html(TAB_CONTENT_TEMP + HANDLE_TEMPLATE);
				S.log(myName + ' is new');
			} else {
				S.log(myName + ' is coming again');
			}
			this.render();
			this.fillList();
			this._bindEvent();


			var headerEl = header.getHeader(myName);
			if (!headerEl.contents().length) {
				headerEl.append(myName);
			}


		},
		getEl: function() {
			return el;
		},
		/**
		 * 渲染
		 * @return {Object} this
		 */
		_bindEvent: function() {
			//this._pointMusic();
			this.playNext();
			this.playPrev();
			this._bindTabSwitch();
			var self = this;

		},
		/**
		 * 填充列表
		 * @return {Object} this
		 */
		fillList: function() {
			// var test = [12345, 11024, 11020, 11026, 12024];
			// localStorage.setItem('MUSIC_LIST', test.toString());
			var listA = [];
			//var listArr = localStorage.getItem('MUSIC_LIST').split(',');
			//alert(listArr)
			S.each(listArr, function(value, key) {
				var self = this;
				var shopInfo = {
					id: value
				};
				S.io({
					type: "get",
					url: BASE_URL + value,
					dataType: "jsonp",
					success: function(data) {
						shopInfo = S.mix(shopInfo, data);
						listA.push(S.substitute(LIST_TEMP_HTML, shopInfo));
						if (key === listArr.length - 1) {
							//S.log(listA);
							//alert(listA)
							$('#J_PlMusicList').html(listA.join(''));
							re._changeColor();
							re._pointMusic();
						}
					},
					error: function() {
						S.log('error');
					}
				});
			});
			return this;
		},
		_bindTabSwitch: function() {
			$('#J_PlListTab').css('left', $(window).width());
			var self = this;
			Event.delegate(document, 'click', '.J_PlayTabIcon', function(e) {
				var elTarget = $(e.target);
				var index = parseInt(elTarget.attr('data-index'), 10);
				self.switchTab(index);
			});
			$('#J_PlImgTab').on('swipe', function(e) {
				if (e.direction === 'left') {
					self.switchTab(1);
				}
			});
			$('#J_PlListTab').on('swipe', function(e) {
				if (e.direction === 'right') {
					self.switchTab(0);
				}
			});
		},
		_changeColor: function() {
			//alert($('.J_MusicItem').length);
			$('.J_MusicItem').each(function(v, index) {
				//alert(index)
				if (index === 0) {
					return v.addClass('is-playing');
				}
				if (index % 2 === 1) {
					v.addClass('odd');
				}
			})
		},
		/**
		 * tab 切换
		 * @param  {Number} index
		 * @return {Object}      this
		 */
		switchTab: function(index) {
			var width = $(window).width();
			var elTab = $('#J_PlayerTab');
			var elTabArr = [$('#J_PlImgTab'), $('#J_PlListTab')];
			var elTabIconArr = [$('#J_TabImg'), $('#J_TabList')];
			var lenArr = [0, width];

			elTabArr[index].show();
			elTabArr[0].animate({
				'left': '-' + lenArr[index]
			}, 0.5, undefined, function() {
				//elImg.hide();
			});
			elTabArr[1].animate({
				'left': lenArr[1 - index]
			}, 0.5, undefined, function() {
				//S.log(elTabIconArr);
				elTabArr[1 - index].hide();
				elTabIconArr[index].addClass('pl-hover');
				elTabIconArr[1 - index].removeClass('pl-hover');
			});
			return this;
		},
		/**
		 * 渲染
		 * @return {Object} this
		 */
		render: function(isSwitch) {
			var self = this;
			// reset
			player = null;
			progress = null;
			//alert(1)
			this.getMusicInfo(musicInfo.id, function() {
				//alert('aaaaaaaaa')
				//alert('get')
				//alert(1)
				//接口暂时有问题
				//console.log(musicInfo)
				self.createAudio(musicInfo.location, isSwitch);

				//self.createAudio(TEST_URL, isSwitch);

				//$('#J_MusicTittle').html(musicInfo.title);
				$('#J_PlImg').attr('src', musicInfo.albumCover);
				//$('#J_MusicLrc').html(musicInfo.lrc);
			});

			return this;
		},
		/**
		 * 创建Audio
		 * @return {Object} player
		 */
		createAudio: function(src, isSwitch) {
			var self = this;
			// player = document.createElement('audio');
			// player.src=src;
			// document.body.appendChild(player);
			// player.load();
			// this._switchMusic();
			player = new Audio();
			player.src = src;
			player.load();
			

			//alert('create')
			//alert('creat');
			//alert(1)
			self._switchMusic();
			if (isSwitch) {
				self.play();
			}
			if (self.isIOS() && !numInit) {
				$('#J_TotalTime').html('4:02');
			} else {
				var initProg = S.later(function() {
					//alert('ca');
					//alert(player.duration)
					if (re.getTotalTime()) {
						re._changeProgress();
						re._setProgress();
						initProg.cancel();
					}

					//alert(player.duration);

				}, 2000, true);
			}
			numInit++;



			//self._endMusic();
			//
			//self._dragProgress();

			//});
			return player;
		},
		/**
		 * 获取player
		 * @return {Object} player
		 */
		getAudio: function() {
			return player;
		},
		/**
		 * 停止
		 * @param {Function} callback 播放音乐的回调函数
		 * @return {Object} this
		 */
		stop: function(callback) {
			player.pause();
			if (callback) callback();
			return this;
		},
		/**
		 * 伯方
		 * @param {Function} callback 播放音乐的回调函数
		 * @return {Object} this
		 */
		play: function(callback) {
			player.play();
			if (callback) callback();
			return this;
		},
		/**
		 * 获取歌曲的总时间
		 * @return {String} 时间
		 */
		getTotalTime: function() {
			return player.duration;
		},
		/**
		 * 归零
		 * @return {Object} this
		 */
		bringRest: function() {
			player && player.pause();
			player.currentTime && (player.currentTime = 0);
			progress && progress.cancel();
			this.progress(0);
			return this;
		},
		/**
		 * 获取歌曲信息
		 * @param  {String}   id       歌曲id
		 * @param  {Function} callback 获取信息后的回调
		 * @return {Object} this
		 */
		getMusicInfo: function(id, callback) {
			//callback();					
			S.io({
				type: "get",
				url: BASE_URL + musicInfo.id,
				dataType: "jsonp",
				success: function(data) {
					//alert('success')
					S.mix(musicInfo, data);
					//musicInfo = data;
					//console.log('Music Info :');
					//console.log(musicInfo);
					callback();
				},
				error: function() {
					alert('error')
					callback && callback();
				}
			});
			return this;
		},
		/**
		 * 更新进度
		 * @param  {Number} rate 频率（单位毫秒）
		 * @return {Object}      this
		 */
		updateProgress: function(rate) {
			var realRate = rate || 200;
			var self = this;

			progress = S.later(function() {
				re._changeProgress();
			}, realRate, true);
			return this;
		},
		/**
		 * 获取窗口长度，考虑到用pc打开的时候，可能会调整窗口大小，所以这个值需要动态获取
		 * @return {[type]} [description]
		 */
		getWindowWidth: function() {
			return $(window).width();
		},
		_changeProgress: function() {
			var elBar = $('#J_PlayProgress'),
				elNow = $('#J_CurrentTime'),
				elTotal = $('#J_TotalTime'),
				elDrag = $('#J_PlayBarIcon');
			var elListBar = $('#J_MusicItem' + musicInfo.id).children('.J_PlListBar');
			// 当前播放的时间 （值可set）
			var nowTime = this.progress(),
				// 歌曲的总时间
				totalTime = this.getTotalTime();
			var len = (nowTime / totalTime) * this.getWindowWidth();
			elBar.css({
				width: len
			});
			elListBar.css({
				width: len
			});
			elDrag.css({
				left: (len > this.getWindowWidth() - 8) ? (this.getWindowWidth() - 8) : len
			});
			elNow.html(this.formatTime(nowTime));
			elTotal.html(this.formatTime(totalTime));
		},
		/**
		 * 转换时间
		 * @return {String} 返回时间
		 */
		formatTime: function(num) {
			var seconds = Math.floor(num % 60);
			if (seconds <= 9) {
				seconds = '0' + seconds;
			}
			return Math.floor(num / 60) + ':' + seconds;
		},

		/**
		 * 进度
		 * @param  {Number} control 进度的时间
		 * @return {Object | String}   this或者当前时间
		 */
		progress: function(control) {
			if (control) {
				player.currentTime = control;
				return this;
			} else {
				return player.currentTime;
			}
		},
		/**
		 * 开始暂停切换
		 */
		_switchMusic: function() {
			var self = this,
				elTarget;
			$('#J_PlaySwitch').detach('click').on('click', function() {
				//alert(1)
				elTarget = $(this);
				if (elTarget.hasClass(STOP_CLASS)) {
					self._startPlay();
				} else {
					self.stop(function() {
						isPlaying = false;
						progress && progress.cancel();
						elTarget.replaceClass(PLAY_CLASS, STOP_CLASS);
					});
				}
			});
		},
		/**
		 * 下一首
		 * @return {Object} this
		 */
		playNext: function() {
			var elTarget = $('#J_PlayNext');
			var nextNode;
			elTarget.on('click', function() {
				nextNode = $('.is-playing').next('.J_MusicItem');
				nextNode && nextNode.fire(Event.Gesture.doubleTap);
				$('#J_PlaySwitch').removeClass(STOP_CLASS).addClass(PLAY_CLASS);
			});
			return this;
		},
		/**
		 * 上一首
		 * @return {Object} this
		 */
		playPrev: function() {
			var elTarget = $('#J_PlayLast');
			var prevNode;
			elTarget.on('click', function() {
				prevNode = $('.is-playing').prev('.J_MusicItem');
				prevNode && prevNode.fire(Event.Gesture.doubleTap);
				$('#J_PlaySwitch').removeClass(STOP_CLASS).addClass(PLAY_CLASS);
			});
			return this;
		},
		/**
		 * 开始播放，用于调整进度条
		 */
		_startPlay: function() {
			var self = this;
			var elTarget = $('#J_PlaySwitch');
			self.play(function() {
				isPlaying = true;
				isStarted = true;
				self.updateProgress();
				elTarget.replaceClass(STOP_CLASS, PLAY_CLASS);
			});
		},
		/**
		 * 结束播放
		 */
		_endMusic: function() {
			var self = this;
			$(player).on('ended', function() {
				$('#J_PlayNext').fire('click');
			});
		},
		/**
		 * 手动设置进度
		 */
		_setProgress: function() {
			var self = this;
			$('#J_PlayBar').on('click', function(e) {
				//if (!isStarted) return;
				//player.currentTime = (e.offsetX / 210) * self.getTotalTime();
				self.progress((e.offsetX / self.getWindowWidth()) * self.getTotalTime());
				self._changeProgress();
			});
		},
		/**
		 * 拖动
		 */
		_dragProgress: function() {
			var self = this;
			var elDrag = $('#J_Drag');
			var drag = self._createDD(elDrag);
			drag.on('drag', function(e) {
				var left = elDrag.css('left');
				//if (left > 207) left = 207;
				elDrag.css('left', left);
				self.progress(((parseFloat(left, 10) + 3) / self.getWindowWidth()) * self.getTotalTime());
				self._changeProgress();
			});
		},
		/**
		 * 拖动对象初始化
		 * @param  {NOde} node 拖动目标
		 * @return {DD}      DD对象
		 */
		_createDD: function(node) {
			return new DD.Draggable({
				node: node,
				cursor: 'move',
				move: true,
				plugins: [new Constrain({
					constrain: '#J_BarBack' // 限制拖动区域为视窗区域
				})]
			});
		},
		_pointMusic: function() {
			var self = this;
			//alert(21)
			//alert(KISSY.Event.Gesture.doubleTap)
			//alert($('.J_MusicItem').length);
			$('.J_MusicItem').on(Event.Gesture.doubleTap, function(e) {
				//alert(1)
				var elTarget = $(e.target);
				//移动标签不用绑定事件
				if (elTarget.hasClass('J_TriggerMove')) return;
				
				musicInfo.id = elTarget.attr('data-id');
				elTarget.addClass('is-playing').siblings('.J_MusicItem').removeClass('is-playing');
				//console.log(musicInfo.id);
				self.bringRest();
				progress && progress.cancel();
				self.render(true);
				self._startPlay();
				$('#J_PlaySwitch').replaceClass(STOP_CLASS, PLAY_CLASS);
			});

		},
		isIOS: function() {
			var device = navigator["userAgent"]["toLowerCase"]();
			if (device["indexOf"]("iphone") > 0 || device["indexOf"]("ipod") > 0 || device["indexOf"]("ipad") > 0 || device["indexOf"]("symbianos") > 0 || device["indexOf"]("ios") > 0) {
				return true;
			}
		}
	});
	return re;

}, {
	requires: ["node", "./index", "event", "../header", 'dd', 'dd/plugin/constrain']
});

/**
 * jj && jj({
  "title": "大日子",
  "albumCover": "http://img.xiami.com/./images/album/img25/125/485_2.jpg",
  "location": "http://psp-music.appspot.com/xiami/5799",
  "albumsInfo": "所属专辑：\r\n                      拉阔演奏厅\r\n                    \r\n                    \r\n                      演唱者：\r\n                      陈慧琳                      \r\n                    \r\n                                        \r\n                      作词：\r\n                      林夕",
  "lrc": "",
  "comments": []
});
 */
