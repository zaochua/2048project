var game={
	data:[],//单元格中的所有数字
	score:0,//分数
	state:1,//状态
	GAME_OVER:0,//游戏结束
	RUNNING:1,//可操作
	PLAYING:2,//动画正在播放中
	/*启动游戏*/
	start:function(){
		this.data=[
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0],
		];
		this.score=0;
		this.state=this.RUNNING;
		// 失败弹窗
		var div=document.getElementById("gameOver");
		// 隐藏弹窗
		div.style.display="none";
		//在两个随机位置生成2或4
		this.randomNum();
		this.randomNum();
		this.updateView();
	},
	/*判断数组是否已满*/
	isFull:function(){
	  /*遍历data数组，
			只要发现==0，就返回false
		如果退出循环，就返回true*/
		for(var row=0;row<4;row++){//this.data.length=4
			for(var col=0;col<4;col++){//this.data[row].length=4
				if(this.data[row][col]==0){
					return false;
				}	
			}
		}
		return true;	
	},
	/*在随机位置生成2或4*/
	randomNum:function(){
		if(this.isFull()){return;}//如果满了就不用生成
	  /*循环条件：true
		随机在0到3行中生成一个行下标row
		随机在0到3列中生成一个列下标col
		如果该位置==0，随机选择2或4:如果Math.random()<0.5,选2，否则选4；放入该位置退出循环*/
		while(true){
			var row=Math.floor(Math.random()*(3-0+1)+0);
			var col=Math.floor(Math.random()*(3-0+1)+0);
			if(this.data[row][col]==0){
				/*this.data[row][col]=Math.random()*(1-0+1)+0;
				if(Math.random()<0.5){
					this.data[row][col]=2;	
				}else{
					this.data[row][col]=4;
				}*/
				this.data[row][col]=Math.random()<0.5?2:4;
				break;
			}			
		}
	},
	/*判断能否左移*/
	canLeft:function(){
		/*遍历每个元素（最左侧列除外），只要发现任意元素左侧数==0或者当前值==左侧值return true  如果循环正常结束，  return false*/
		for(var row=0;row<4;row++){
			for(var col=1;col<4;col++){
				if(this.data[row][col]!=0){
					if(this.data[row][col-1]==0||this.data[row][col]==this.data[row][col-1]){
						return true;
					}
				}
			}
		}
		return false;
	},
	/*实现左移所有行*/
	moveLeft:function(){
		if(this.canLeft()){//先判断能否左移
			for(var row=0;row<4;row++){
				this.moveLeftInRow(row);//左移一行
			}
			this.state=this.PLAYING;//更新状态
			animation.start();
			setTimeout(function(){
				game.state=game.RUNNING;
				game.randomNum();//生产数字
			    game.updateView();//更新数据到页面
			
			},animation.times*animation.interval);
		}
	},
	/* 左移一行*/
	moveLeftInRow:function(row){
	  /*从0位置开始到2结束遍历row行中的每个元素  获得一个下一个不为0的元素的nextCol下标
		如果nextCol==-1，break；
		否则，判断合并
			如果自己==0，用下一个元素的值替换自己，将下一个元素的值设为0，让col留在原地：col--
			如果自己==下一个元素 将自己*2； 将下一个元素设为0*/
		for(var col=0;col<=2;col++){
			var nextCol=this.getNextRight(row,col);//从左到右获取第一个不为0的值
			if(nextCol==-1){
				break;
			}else{
				if(this.data[row][col]==0){//获取第一个为零的位置
					this.data[row][col]=this.data[row][nextCol];
					this.data[row][nextCol]=0;//交换第一个为零与第一个不为零的位置
					animation.addTask(""+row+nextCol,""+row+col);//开始动画
					col--;//获取前一个有值的位置
				}
				//如果两个值相等
				else if(this.data[row][col]==this.data[row][nextCol]){
					//两个值合并
					this.data[row][col]*=2;
					//分数更新
					this.score+=this.data[row][col];
					//将合并的位置后一位置位0
					this.data[row][nextCol]=0;
					// 调用动画
					animation.addTask(""+row+nextCol,""+row+col);
				}
			}
		}
	},
	/*获取距离col最近的不等于零的值*/
	getNextRight:function(row,col){
	  /*遍历当前位置右侧每个元素	只要发现！=0的，就返回其位置下标nextCol 退出循环，返回-1*/
		for(var i=col+1;i<4;i++){
			if(this.data[row][i]!=0){
				return i;	
			}	
		}		
		return -1;	
	},
	/*判断能否右移*/
	canRight:function(){
		for(var row=0;row<4;row++){
			for(var col=2;col>=0;col--){
				if(this.data[row][col]!=0){
					if(this.data[row][col+1]==0||this.data[row][col]==this.data[row][col+1]){
						return true;
					}
				}
			}
		}
		return false;
	},
	/*右移当前行*/
	moveRightInRow:function(row){
		/*从右向左遍历检查，（最左边元素除外）*/
		for(var col=3;col>0;col--){
			var nextCol=this.getNextLeft(row,col);
			if(nextCol==-1){
				break;
			}else{
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[row][nextCol];
					this.data[row][nextCol]=0;
					animation.addTask(""+row+nextCol,""+row+col);
					col++;
				}else if(this.data[row][col]==this.data[row][nextCol]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[row][nextCol]=0;
					animation.addTask(""+row+nextCol,""+row+col);
				}
			}
		}
	},
	/* 向右移动所有行 */
	moveRight:function(){
		if(this.canRight()){
			for(var row=0;row<4;row++){
				this.moveRightInRow(row);
			}
			this.state=this.PLAYING;
			animation.start();
			setTimeout(function(){
				game.state=game.RUNNING;
				game.randomNum();
			    game.updateView();	
			
			},animation.times*animation.interval);
		}
	},
	/*从当前位置向左，找下一个不为0的数*/
	getNextLeft:function(row,col){
		for(var i=col-1;i>=0;i--){
			if(this.data[row][i]!=0){
				return i;	
			}	
		}		
		return -1;	
	},
	/*判断能否上移*/
	canUp:function(){
		for(var row=1;row<4;row++){
			for(var col=0;col<4;col++){
				if(this.data[row][col]!=0){
					if(this.data[row-1][col]==0||this.data[row][col]==this.data[row-1][col]){
						return true;
					}
				}
			}
		}
		return false;
	},
	/*上移所有行*/
	moveUp:function(){
		if(this.canUp()){//先判断能否左移
		for(var col=0;col<4;col++){
				this.moveUpInCol(col);
			}
			this.state=this.PLAYING;
			animation.start();
			setTimeout(function(){
				game.state=game.RUNNING;
				game.randomNum();
			    game.updateView();	
			
			},animation.times*animation.interval);
		}
	},
	/*上移当前行*/
	moveUpInCol:function(col){
		for(var row=0;row<3;row++){
			var nextRow=this.getNextDown(row,col);
			if(nextRow==-1){
				break;
			}else{
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[nextRow][col];
					this.data[nextRow][col]=0;
					animation.addTask(""+nextRow+col,""+row+col);
					row--;
				}else if(this.data[row][col]==this.data[nextRow][col]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[nextRow][col]=0;
					animation.addTask(""+nextRow+col,""+row+col);
				}
			}
		}
	},
	/*从当前位置向下，找下一个不为0的数*/
	getNextDown:function(row,col){
		for(var i=row+1;i<4;i++){
			if(this.data[i][col]!=0){
					return i;
			}
		}
		return -1;
	},
	/*判断能否下移*/
	canDown:function(){
		for(var row=0;row<3;row++){
			for(var col=0;col<4;col++){
				if(this.data[row][col]!=0){
					if(this.data[row+1][col]==0||this.data[row][col]==this.data[row+1][col]){
						return true;
					}
				}
			}
		}
		return false;
	},
	/* 向下右移动所有行 */
	moveDown:function(){
		if(this.canDown()){
			for(var col=0;col<4;col++){
				this.moveDownInCol(col);
			}
			this.state=this.PLAYING;
			animation.start();
			setTimeout(function(){
				game.state=game.RUNNING;
				game.randomNum();
			    game.updateView();	
			
			},animation.times*animation.interval);
		}
	},
	/*下移当前行*/
	moveDownInCol:function(col){
		for(var row=3;row>0;row--){
			var nextRow=this.getNextUp(row,col);
			if(nextRow==-1){
				break;
			}else{
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[nextRow][col];
					this.data[nextRow][col]=0;
					animation.addTask(""+nextRow+col,""+row+col);
					row++;
				}else if(this.data[row][col]==this.data[nextRow][col]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[nextRow][col]=0;
					animation.addTask(""+nextRow+col,""+row+col);
				}
			}
		}
	},
	/*从当前位置向上，找下一个不为0的数*/
	getNextUp:function(row,col){
		for(var i=row-1;i>=0;i--){
			if(this.data[i][col]!=0){
				return i;	
			}	
		}		
		return -1;	
	},
	/*将游戏数据整体更新到页面上*/
	updateView:function(){
		for(var row=0;row<4;row++){
			for(var col=0;col<4;col++){
				var div=document.getElementById("c"+row+col);
				div.innerHTML=this.data[row][col]==0?"":this.data[row][col];
				div.className=this.data[row][col]==0?"cell":"cell n"+this.data[row][col];
			}
		}
		/*将分数放入span*/
		var span=document.getElementById("score");
		span.innerHTML=this.score;
		/*判断游戏结束
		如果游戏结束，this.state=GAME_OVER
		显示游戏结束div
		找到gameOverdiv
		修改div的style.display*/
		if(this.isGameOver()){
			this.state=this.GAME_OVER;
			var div=document.getElementById("gameOver");
			var finalSocre=document.getElementById("finalScore");
			finalSocre.innerHTML=this.score;
			div.style.display="block";
		}
	},
	/*判断游戏是否结束*/
	isGameOver:function(){
		/*如果数组没有满，游戏就没有结束*/
		if(!this.isFull()){return false;}
		for(var row=0;row<4;row++){
			for(var col=0;col<4;col++){
				/*检查右侧相邻*/
				if(col<3){
					if(this.data[row][col]==this.data[row][col+1]){
						return false;
					}
				}
				/*检查下方相邻*/
				if(row<3){
					if(this.data[row][col]==this.data[row+1][col]){
						return false;
					}
				}
			}
		}
		return true;
	}
}
	/*页面加载事件*/
window.onload=function(){
	game.start()
	document.onkeydown=function(event){
		if(game.state!=game.PLAYING){
			if(game.state==game.RUNNING){	
				if(event.keyCode==37){
					game.moveLeft();
				}else if(event.keyCode==39){
					game.moveRight();	
				}
				else if(event.keyCode==38){
					game.moveUp();	
				}
				else if(event.keyCode==40){
					game.moveDown();	
				}
			}else if(event.keyCode==13){
				game.start();
			}
		}
	}
}
/*animation*/
function Task(obj,topStep,leftStep){
	this.obj=obj;
	this.topStep=topStep;
	this.leftStep=leftStep;
}
/*当前元素对象移动一步*/
Task.prototype.moveStep=function(){
	var style=getComputedStyle(this.obj,null);//获取对象的属性值
	var top=parseInt(style.top);
	var left=parseInt(style.left);//获取对象的当前位置x、y值
	this.obj.style.top=top+this.topStep+"px";
	this.obj.style.left=left+this.leftStep+"px";//移动该元素
}
/*清楚元素的对象演示，返回原地*/
Task.prototype.clear=function(){
	this.obj.style.left="";
	this.obj.style.top="";
}
/*移动动画效果*/
var animation={
	times:10,//每个动画10步完成
	interval:10,//10毫秒迈一步	
	timer:null,//保存定时器id的属性
	tasks:[],//保存每次需要移动的任务
	//添加移动任务并添加至数组
	addTask:function(source,target){
		console.log(source+","+target);
		var sourceDiv=document.getElementById("c"+source);
		var targetDiv=document.getElementById("c"+target);
		var sourceStyle=getComputedStyle(sourceDiv);
		var targetStyle=getComputedStyle(targetDiv);
		var topStep=(parseInt(targetStyle.top)-parseInt(sourceStyle.top))/this.times;//需要移动的两个对象的y值差
		var leftStep=(parseInt(targetStyle.left)-parseInt(sourceStyle.left))/this.times;//需要移动的两个对象的x值差
		var task=new Task(sourceDiv,topStep,leftStep);
		this.tasks.push(task);
	},
	/*定义动画移动间隔时间*/
	start:function(){
		this.timer=setInterval(function(){
			for(var i=0;i<animation.tasks.length;i++){
				animation.tasks[i].moveStep();	
			}	
			animation.times--;
			if(animation.times==0){
				for(var i=0;i<animation.tasks.length;i++){
				animation.tasks[i].clear();	
				}
				clearInterval(animation.timer);
				animation.timer=null;
				animation.tasks=[];
				animation.times=10;	
			}
		},this.interval);
	}
}