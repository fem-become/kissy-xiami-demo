KISSY.add(function(S, Node, Transition, Event, header, DD, Constrain, ScrollView, ScrollbarPlugin) {

	var $ = Node.all,
		el,
		myName = this.getName(),
		body = $("#body");



	// player内部变量
	var re = {},
		BASE_URL = 'http://test.fem.taobao.net:3000/song/',
		TEST_URL = 'http://m1.file.xiami.com/224/224/992/12345_95993_l.mp3',
		PLAY_CLASS = 'pl-play',//代表当前状态是play
		STOP_CLASS = 'pl-pause';

	var player = null;// Audio实例

	var progress = null;

	var musicInfo = {};// 当前播放歌曲的信息 {'id':'','title':'','location':'','albumCover':''}
	var isPlaying = false;// 是否正在播放
	var isStarted = false;

	var numInit = 0,
		eventBinded = false,
		scrollview = null,
		currentIdx = 0;// 当前播放歌曲的位置
	var	musicList = localStorage.getItem('MUSIC_LIST') ? S.JSON.parse(localStorage.getItem('MUSIC_LIST')): [];// 播放列表，以此为准，并同步到本地存储中




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
		'				<img class="pl-img" id="J_PlImg" src="http://img04.taobaocdn.com/tps/i4/T1mAOLXtXgXXbTIWs3-128-128.gif" alt="img">' +
		'			</div>	' +
		'		</div>' +
		'		<div class="pl-list-tab" id="J_PlListTab" style="display:none">' +
		'			<div class="ks-scrollview-content ks-content">' + 
		'			<ul class="pl-music-list" id="J_PlMusicList">' +
		'			</ul>' +
		'			</div>' +
		'		</div>' +
		'	</div>' +
		'</div>';



	S.Player = new S.Base();



	S.mix(re, {

		init: function(config) {

			header.setTitle("播放器");

			numInit = 0;
			
			if (!el) {
				el = $('<div class="mod-page"></div>').appendTo(body);
				el.html(TAB_CONTENT_TEMP + HANDLE_TEMPLATE);
				S.log(myName + ' is new');
			} else {
				S.log(myName + ' is coming again');
			}

			var HEADER_HEIGHT = 45,
				PLAY_INFO_HEIGHT = $('#J_PlayInfo').height(),
				MAXHEIGHT = 185,
				PADDING = 8,
				tabHeight = $(window).height() - PLAY_INFO_HEIGHT - HEADER_HEIGHT,
				winWidth = $(window).width();
			console.log($(window).height()+' '+PLAY_INFO_HEIGHT);
			//$('#J_PlTabContent').css('height', height);
			$('#J_PlayerTab').height(tabHeight);
			$('#J_PlImg').css({'margin-top':(tabHeight - MAXHEIGHT - 2 * PADDING)/2 + 'px'});

			if(!player){//第一次进入页面
				player = new Audio();
			}

			this.updateMusicControl();//可能没有player?
			this.updateMusicInfoTab();
			this.updateMusicListTab();

			if(!eventBinded){
				this._bindEvent();//难道每次都绑定？
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
		_bindEvent: function() {
			var self = this;

			//this.playNext();
			//this.playPrev();
			self._bindTabSwitch();
			self._bindControl();
			self._bindProgressAnyPosition();
			self._bindPlayNext();
			self._bindPlayPrev();

			// S.Player.on('go-back', function() {
			// 	self.bringRest();
			// })

		},
		/**
		 * 渲染
		 * @return {Object} this
		 */
		render: function(isSwitch) {

			var self = this;

			if(player) player.pause();
			
			//alert(1)
			this.getMusicInfo(musicInfo.id, function() {

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
			player = new Audio();
			player.src = src;
			player.load();


			self._switchMusic();
			//alert(self.isIOS() && !numInit)
			if (self.isIOS()) {
				$('#J_TotalTime').html('4:02');
			} else {
				$('#J_TotalTime').html('loading');
				var initProg = S.later(function() {
					if (re.getTotalTime()) {
						re._changeProgress();
						re._setProgress();
						initProg.cancel();
					}
				}, 200, true);
			}
			if(isSwitch){
				self.play();
			}
			numInit++;


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
			player && player.pause();
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
			return player && player.duration;
		},
		/**
		 * 归零
		 * @return {Object} this
		 */
		bringRest: function() {
			if (player) {
				player.pause();
				if (player.currentTime) player.currentTime = 0;
				if(progress)progress.cancel();
				$('#J_CurrentTime').html('0:00');
				$('#J_PlayProgress').css('width',0);
				$('#J_PlayBarIcon').css('left',0);
				$('#J_PlaySwitch').replaceClass(PLAY_CLASS, STOP_CLASS);
				player = null;
			}
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
				elDrag = $('#J_PlayBarIcon'),
				elList = $('#J_MusicItem' + musicInfo.id);

			// 当前播放的时间 （值可set）
			var nowTime = this.progress(),
				// 歌曲的总时间
				totalTime = this.getTotalTime();
			var len = (nowTime / totalTime) * this.getWindowWidth();
			elBar.css({
				width: len
			});

			//更新播放列表页的bar
			if(elList.length !== 0){
				elList.children('.J_PlListBar').css({
					width: len
				});
			}
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
			var self = this;
			var nextNode;
			elTarget.on('click', function() {
				self.bringRest();
				nextNode = $('.is-playing').next('.J_MusicItem');
				nextNode && nextNode.fire(Event.Gesture.doubleTap);
				if(self.isIOS()){
					$('#J_PlaySwitch').removeClass(PLAY_CLASS).addClass(STOP_CLASS);
					return;
				}
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
			var self = this;
			var prevNode;
			elTarget.on('click', function() {
				self.bringRest();
				prevNode = $('.is-playing').prev('.J_MusicItem');
				prevNode && prevNode.fire(Event.Gesture.doubleTap);
				if(self.isIOS()){
					$('#J_PlaySwitch').removeClass(PLAY_CLASS).addClass(STOP_CLASS);
					return;
				}
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
		_bindProgressAnyPosition: function() {
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
				musicInfo.id = elTarget.attr('data-id');
				elTarget.addClass('is-playing').siblings('.J_MusicItem').removeClass('is-playing');
				self.bringRest();
				progress && progress.cancel();
				self.render(true);
				$('#J_PlaySwitch').replaceClass(STOP_CLASS, PLAY_CLASS);
			});

		},
		isIOS: function() {
			var device = navigator["userAgent"]["toLowerCase"]();
			if (device["indexOf"]("iphone") > 0 || device["indexOf"]("ipod") > 0 || device["indexOf"]("ipad") > 0 || device["indexOf"]("symbianos") > 0 || device["indexOf"]("ios") > 0) {
				return true;
			}
		},
				/**
		 * 填充列表
		 * @return {Object} this
		 */
		fillList: function() {
			var localArr = localStorage.getItem('MUSIC_LIST') ? localStorage.getItem('MUSIC_LIST').split(',') : [];
			localArr.unshift(musicInfo.id);
			var listArr = S.unique(localArr);
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
							scrollview.sync();
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
			$('.J_PlayTabIcon').on('click',function(e) {
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
				if (index === currentIdx) {
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
		 * 将歌曲加到播放列表
		 */
		addToList: function(songs){

		    if(!S.isArray(songs)){
		        songs = [songs];
		    } 
		    var listLength = musicList.length,
		      	m, i;
		    for(m = 0; m < songs.length; m++){
		      	for(i = 0; i < listLength; i++){
		      		if(musicList[i]['id'] === songs[m]['id']){
		      			break;
		      		}
		      	}
		      	if(i === listLength){//未找到
		      		if(songs[m]['location']){
		      			musicList.push(songs[m]);
		      		}else{//请求完整信息
		      			var songId = songs[m]['id'];
						S.io({
							type: "get",
							url: BASE_URL + songId,
							dataType: "jsonp",
							success: function(data) {
								musicList.push({'id':songId,'title':data['title'],'albumCover':data['albumCover'],'location':data['location']});
								localStorage.setItem('MUSIC_LIST', S.JSON.stringify(musicList));
							},
							error: function() {
								alert('error')
							}
						});
		      		}
		      	}

		    }

	        localStorage.setItem('MUSIC_LIST', S.JSON.stringify(musicList));//同步到localStorage
		},
		/**
		 * 添加并播放歌曲
		 * @type {Array}
		 */
		playSongNow: function(info){
			var self = this;
			for(var i = 0; i < musicList.length; i++){
				if(musicList[i]['id'] === info.id){
					break;
				}
			}
			if(i === musicList.length){
				if(info['location']){
					musicInfo = info;
					musicList.push(musicInfo);
					localStorage.setItem('MUSIC_LIST', S.JSON.stringify(musicList));//同步到localStorage
					currentIdx = musicList.length - 1;
					self.playSong();
				}else{
					musicInfo['id'] = info.id;
					self.getMusicInfo(info.id,function(){
						musicList.push({'id':musicInfo['id'],'title':musicInfo['title'],'albumCover':musicInfo['albumCover'],'location':musicInfo['location']});// 加入播放列表
						localStorage.setItem('MUSIC_LIST', S.JSON.stringify(musicList));//同步到localStorage
						currentIdx = musicList.length - 1;
						self.playSong();
					});
				}
				
			}else{
				musicInfo = musicList[i];
				currentIdx = i;
				self.playSong();
			}
		},
		/**
		 * 播放歌曲，看情况是否更新页面
		 */
		playSong: function(){
			var self = this;
			if(!player){
				window.player = player = new Audio();
				player.addEventListener('ended',function(e){  
			        //归零，下一首播放，更新各种状态
			        self._bringRest();
					self.playSongNow(musicList[(currentIdx + 1)%musicList.length]);
					self.updateMusicControl();
					self.updateMusicInfoTab();
					self.updateCurrentInMusicList();

			    });  
			}
			player.src = musicInfo['location'];
			player.load();
			player.play();//已经播放了
			
		},
		/**
		 * 更新播放器控制
		 */
		updateMusicControl: function(){
			var self = this;
			if(!player.paused){//播放状态
				//播放/暂停状态
				$('#J_PlaySwitch').removeClass(STOP_CLASS).addClass(PLAY_CLASS);
				//当前音乐进度和音乐总时间
				self._changeProgress();
				self.updateProgress();
			}else{//暂停状态还是停止状态？
				//播放/暂停状态
				$('#J_PlaySwitch').removeClass(PLAY_CLASS).addClass(STOP_CLASS);
				//当前音乐进度和音乐总时间
				self._changeProgress();
			}
		},
		/**
		 * 更新音乐信息tab
		 */
		updateMusicInfoTab: function(){
			$('#J_PlImg').attr('src', musicInfo.albumCover);
		},
		/**
		 * 更新播放列表tab
		 */
		updateMusicListTab: function(){
			var self = this,
				htmlArray = [];
			for(var i = 0; i < musicList.length; i++){
				htmlArray.push(S.substitute(LIST_TEMP_HTML, musicList[i]));
			}
			$('#J_PlMusicList').html(htmlArray.join(''));
			//S.later(function(){
				// 滚动条
				if(!scrollview){
					scrollview = new ScrollView({
						srcNode: '#J_PlListTab',
						plugins: [new ScrollbarPlugin({})]
					}).render();
				}
				scrollview.sync();
			//}, 3000);
			self._changeColor();			
		},
		/**
		 * 绑定播放/暂停事件
		 */
		_bindControl: function(){
			$('#J_PlaySwitch').detach('click').on('click',function(e){
				var switcher = $('#J_PlaySwitch');
				if(switcher.hasClass(PLAY_CLASS) && player && !player.paused){
					switcher.removeClass(PLAY_CLASS).addClass(STOP_CLASS);
					player.pause();
				}else if(switcher.hasClass(STOP_CLASS) && player && player.paused){
					switcher.removeClass(STOP_CLASS).addClass(PLAY_CLASS);
					player.play();
				}
			});
		},
		/**
		 * 绑定点击下一首
		 */
		_bindPlayNext: function(){
			var self = this;
			$('#J_PlayNext').on('click', function() {
				self._bringRest();
				self.playSongNow(musicList[(currentIdx + 1)%musicList.length]);
				self.updateMusicControl();
				self.updateMusicInfoTab();
				self.updateCurrentInMusicList();
			});
			return this;			
		},
		/**
		 * 绑定点击上一首
		 */
		_bindPlayPrev: function(){
			var self = this;
			$('#J_PlayLast').on('click', function() {
				self._bringRest();
				self.playSongNow(musicList[(currentIdx + musicList.length - 1)%musicList.length]);
				self.updateMusicControl();
				self.updateMusicInfoTab();
				self.updateCurrentInMusicList();
			});
			return this;			
		},
		/**
		 * 归零
		 * @return {Object} this
		 */
		_bringRest: function() {
			if (player) {
				player.pause();
				if (player.currentTime) player.currentTime = 0;
				//if(progress)progress.cancel();
				$('#J_CurrentTime').html('0:00');
				$('#J_PlayProgress').css('width',0);
				$('#J_PlayBarIcon').css('left',0);
				$('#J_PlaySwitch').removeClass(PLAY_CLASS).addClass(STOP_CLASS);
			}
			return this;
		},
		/**
		 * 更新播放列表页的当前播放曲目
		 */
		updateCurrentInMusicList: function(){
			$('#J_MusicItem' + musicInfo.id).addClass('.is-playing').siblings().removeClass('.is-playing');
		}



	});
	return re;

}, {
	requires: ["node", "./index", "event", "../header", 'dd', 'dd/plugin/constrain', 'scrollview/drag', 'scrollview/plugin/scrollbar','./player.css']
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
