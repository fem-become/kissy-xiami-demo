KISSY.add(function(S, Node, Transition, Event, header, DD, Constrain) {

    var $ = Node.all;
	var el;
	var myName = this.getName();
	var body = $("#body");



	// player内部变量
	var re = {};
	var BASE_URL = 'http://test.fem.taobao.net:3000/song/';
	var TEST_URL = 'http://m1.file.xiami.com/224/224/992/12345_95993_l.mp3';
	var PLAY_CLASS = 'music-play';
	var STOP_CLASS = 'music-pause';
	var player = null;
	var musicInfo = {};
	var isPlaying = false;
	var isStarted = false;
	var PLAYER_TEMPLATE = '<div class="music-info-temp">' +
		'	<h2 id="J_MusicTittle"></h2>' +
		'	<img id="J_MusicImg" />' +
		'	<p id="J_MusicLrc" ></p>' +
		'</div>' +
		'<p class="music-handle">' +
		'	<a href="javascript:void(0);" id="J_HandleMusic" class="music-pause">' +
		'		播放/停止' +
		'	</a>' +
		'</p>' +
		'<div class="music-time">' +
		'	<em id="J_Now" class="now">' +
		'		0:00' +
		'	</em>' +
		'	<em id="J_Total" class="total">' +
		'		0:00' +
		'	</em>' +
		'</div>' +
		'<div id="J_BarBack" class="bar-background">' +
		'	<div class="music-progress">' +
		'		<div class="bar-content" id="J_BarContent">' +
		'			<p id="J_ProgressBar" class="progress-bar"></p>' +
		'			<em id="J_Drag" class="drag" draggable="true" title="滚动条"></em>' +
		'		</div>' +
		'	</div>' +
		'</div>';



	S.mix(re, {

		init: function(config) {
			S.log("playing music: " + config.id);
			musicInfo = {
				id: config.id
			};
			this.render();
			if (!el) {
				el = $('<div class="mod-page"></div>').appendTo(body);
				el.html(PLAYER_TEMPLATE);
				S.log(myName + ' is new');
			} else {
				S.log(myName + ' is coming again');
			}

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
		render: function() {
			var self = this;
			// reset
			player = null;
			progress = null;
			this.getMusicInfo(musicInfo.id, function() {
				//接口暂时有问题
				console.log(musicInfo.location);
				self.createAudio(musicInfo.location);
				// self.createAudio(TEST_URL);
				$('#J_MusicTittle').html(musicInfo.title);
				$('#J_MusicImg').html(musicInfo.title);
				$('#J_MusicLrc').html(musicInfo.lrc);
				
					self.play(function() {
						isPlaying = true;
						isStarted = true;
						self.updateProgress();
						$('#J_HandleMusic').replaceClass(STOP_CLASS, PLAY_CLASS);
					});
			});

			return this;
		},
		/**
		 * 创建Audio
		 * @return {Object} player
		 */
		createAudio: function(src) {
			player = new Audio();
			player.src = src;
			var self = this;
			// 音乐资源加载完毕
			$(player).on('loadedmetadata', function() {
				self._changeProgress();
				self._switchMusic();
				self._endMusic();
				self._setProgress();
				self._dragProgress();
			});
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
			player.progress(0);
			return this;
		},
		/**
		 * 获取歌曲信息
		 * @param  {String}   id       歌曲id
		 * @param  {Function} callback 获取信息后的回调
		 * @return {Object} this
		 */
		getMusicInfo: function(id, callback) {
			S.io({
				type: "get",
				url: BASE_URL + musicInfo.id,
				dataType: "jsonp",
				success: function(data) {
					S.mix(musicInfo, data);
					//musicInfo = data;
					S.log('Music Info :');
					S.log(musicInfo);
					callback();
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
		_changeProgress: function() {
			var elBar = $('#J_ProgressBar'),
				elNow = $('#J_Now'),
				elTotal = $('#J_Total'),
				elDrag = $('#J_Drag');
			// 当前播放的时间 （值可set）
			var nowTime = this.progress(),
				// 歌曲的总时间
				totalTime = this.getTotalTime();
			var len = (nowTime / totalTime) * 210;
			elBar.css({
				width: len
			});
			elDrag.css({
				left: (len - 3)
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
			$('#J_HandleMusic').on('click', function() {
				elTarget = $(this);
				if (elTarget.hasClass('music-pause')) {
					self.play(function() {
						isPlaying = true;
						isStarted = true;
						self.updateProgress();
						elTarget.replaceClass(STOP_CLASS, PLAY_CLASS);
					});
				} else {
					self.stop(function() {
						isPlaying = false;
						progress.cancel();
						elTarget.replaceClass(PLAY_CLASS, STOP_CLASS);
					});
				}
			});
		},
		/**
		 * 结束播放
		 * @return {[type]} [description]
		 */
		_endMusic: function() {
			$(player).on('ended', function() {
				S.log('over');
				isPlaying = false;
				isStarted = false;
			});
		},
		/**
		 * 手动设置进度
		 */
		_setProgress: function() {
			var self = this;
			$('#J_BarContent').on('click', function(e) {
				//if (!isStarted) return;
				//player.currentTime = (e.offsetX / 210) * self.getTotalTime();
				self.progress((e.offsetX / 210) * self.getTotalTime());
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
				self.progress(((parseFloat(left, 10) + 3) / 210) * self.getTotalTime());
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
