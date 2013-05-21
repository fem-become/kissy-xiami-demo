/**
 * 迷你播放器，页面不用跳转
 * @example 
   KISSY.use('node,min-player',function(S,Node,MinPlayer){
		Node.all('#J_Test').on('click',function(){
			MinPlayer.render('http://m1.file.xiami.com/224/224/992/12345_95993_l.mp3');
		});
	})
 */
KISSY.add( function(S, Node) {
	var $ = Node.all;
	var re = {};
	var HANDLE_TEMPLATE = '<div id="J_PlayInfo" class="pl-play-info">' +

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
		'		<span id="J_PlaySwitch" class="pl-switch pl-pause">' +
		'			<em>play/pause</em>' +
		'		</span>' +
		'	</div>' +
		'</div>';
	var player;
	var musicInfo = {};
	var BASE_URL = 'http://test.fem.taobao.net:3000/song/';
	var TEST_URL = 'http://m1.file.xiami.com/224/224/992/12345_95993_l.mp3';
	var PLAY_CLASS = 'pl-play';
	var STOP_CLASS = 'pl-pause';
	var progress;

	S.mix(re, {
		render: function(src) {
			this.bringRest();
			if (!S.get('#J_PlayInfo')) {
				$('body').append(HANDLE_TEMPLATE);
			}
			musicInfo.src = src || TEST_URL;
			//alert(musicInfo.src)
			this.createAudio(src);
		},
		/**
		 * 创建Audio
		 * @return {Object} player
		 */
		createAudio: function(src) {
			var self = this;
			player = new Audio();
			player.src = src;
			player.load();
			self._switchMusic();
			$('#J_TotalTime').html('loading');
			var initProg = S.later(function() {
				//console.log(re.getTotalTime())
				if (re.getTotalTime()) {

					re._changeProgress();
					$('#J_PlaySwitch').fire('click');
					re._setProgress();
					initProg.cancel();
				}
			}, 200, true);
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
			if (player) {
				player.pause();
				player.currentTime = 0;
				progress && progress.cancel();
				this.progress(0);
			}
			$('#J_PlaySwitch').removeClass(PLAY_CLASS).addClass(STOP_CLASS)
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
		}
	});
	return re;

}, {
	requires: ['node']
})