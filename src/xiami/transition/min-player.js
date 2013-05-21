/**
 * 迷你播放器，页面不用跳转
 * @example 
   KISSY.use('node,min-player',function(S,Node,MinPlayer){
			Node.all('#J_Test').on('click',function(){
				MinPlayer.render('http://m1.file.xiami.com/224/224/992/12345_95993_l.mp3');
			});
			Node.all('#J_Stop').on('click',function(){
				MinPlayer.stop();
			});
		})
 */
KISSY.add('min-player', function(S, Node) {
	var $ = Node.all;
	var re = {};
	var player;
	var musicInfo = {}
	S.mix(re, {
		render: function(src) {
			this.bringRest();
			musicInfo.src = src || TEST_URL;
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
			self.play();
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

			}
			return this;
		}
	});
	return re;

}, {
	requires: ['node']
});