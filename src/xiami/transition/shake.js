KISSY.add(function(S, Event){
	var max = Math.max,
        abs = Math.abs,
        floor = Math.floor;

   	var SHAKE_THRESHOLD = 10, 
        lastX = 0,
        lastY = 0,
        lastZ = 0,
        last_update = 0,
        count = 0,
        startTime = 0,
        endTime = 0,
        shaking = 0,
        timer = null,
        obj = null;

	function Shake(){
        obj = this;
	}

	function endTimer(){
		endTime = +new Date().getTime();
        console.log('count:'+floor(count/2)+' time:'+(endTime - startTime-1000));
        obj.fire('shakeend',{count:floor(count/2),time:(endTime - startTime - 1000)});
        shaking = 0;
        count = 0;
        clearTimeout(timer);
        timer = null;   
	}

	S.augment(Shake, Event.Target, {
		start: function(){
            if(window.DeviceMotionEvent){
                window.addEventListener('devicemotion', this._shakeHandler, false);
            } else {
                alert('not support mobile event');
            }
		},
		stop: function(){
            if(window.DeviceMotionEvent){
                window.removeEventListener('devicemotion', this._shakeHandler, false);
            }
		},
		_shakeHandler: function(e){
			var accelerationIncludingGravity = e.accelerationIncludingGravity,
                x = accelerationIncludingGravity.x,
                y = accelerationIncludingGravity.y,
                z = accelerationIncludingGravity.z,
                diff,
                curTime = +new Date().getTime(),
                diffTime,
                speed;
            if(lastX != 0){
                if((curTime - last_update) > 100) {//防止重复fire，用时间控制
                    diffTime = curTime - last_update;
                    last_update = curTime;
                    diff = max(abs(x - lastX), abs(y - lastY), abs(z - lastZ));

                    if(diff > SHAKE_THRESHOLD) {
                        count++;
                        if(shaking === 0){
                            startTime = curTime;//实际上是count==1时的时间
                            obj.fire('shakestart');
                        }
                        shaking = 1;
                        if(timer){
                            clearTimeout(timer);
                        }
                        timer = setTimeout(endTimer, 1000);
                        (count > 1 && count % 2 === 1) && obj.fire('shaking',{count:floor(count/2),time:(+new Date().getTime() - startTime)});
                    }
                }
            }else{
                last_update = curTime;
            }
            lastX = x;
            lastY = y;
            lastZ = z;


		}
		


	});

	return Shake;

},{
	requires:['event']
});