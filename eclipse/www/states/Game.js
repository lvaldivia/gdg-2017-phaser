Game = function(){

}

Game.prototype = {
	create:function(){
		this.RUNNING_SPEED = 180;
    	this.JUMPING_SPEED = 550;
		this.initSystem();
		this.level_data = JSON.parse(this.game.cache.getText("level"));
		this.buildLevel();
		this.initObjects();
		this.prepareSounds();
	},
	prepareSounds:function(){
		this.background = this.game.add.audio('background');
		this.jumpSound = this.game.add.audio("jump");
		this.background.play();
		this.background.loop = true;
	},
	initObjects:function(){
		this.player = this.game.add.sprite(0,0,'player');
		this.player.x = this.level_data.playerStart.x;
		this.player.y = this.level_data.playerStart.y;
		this.player.customParams = {mustJump: false, isMovingLeft:false, isMovingRight: false};
		this.player.anchor.setTo(0.5);
		this.player.animations.add("walking",[0, 1, 2, 1], 6, true);
		this.game.physics.arcade.enable(this.player);
		this.player.body.collideWorldBounds = true;
		this.keys = this.game.input.keyboard.createCursorKeys();
		this.elapsed = 0;
		this.barrils = this.game.add.group();
		this.generationTime = this.level_data.barrelFrequency * 1000;
		this.goal = this.game.add.sprite(0,0,'goal');
		this.game.physics.arcade.enable(this.goal);
		this.createOnscreenControls();
	},
	initSystem:function(){
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 1000;
		this.game.world.setBounds(0,0, 360, 700);
	},
	buildLevel:function(){
		this.platforms = this.game.add.group();
		this.fires = this.game.add.group();
		this.platforms.enableBody = true;
		this.level_data.platformData.forEach(function(data){
			this.platforms.create(data.x,data.y,'platform');
		},this);
		this.platforms.setAll("body.allowGravity",false);
		this.platforms.setAll("body.immovable",true);
		this.floor = this.game.add.sprite(0,0,'ground');
		this.game.physics.arcade.enable(this.floor);
		this.floor.body.allowGravity = false;
		this.floor.body.immovable = true;
		this.floor.y = this.game.height - this.floor.height;
		this.level_data.fireData.forEach(function(data){
			var fire = this.game.add.sprite(data.x,data.y,'fire');
			fire.animations.add('fire', [0, 1], 4, true);
			fire.animations.play("fire");
			this.fires.add(fire);
		},this);
	},
	update:function(){
		this.elapsed += this.game.time.elapsed;
		if(this.elapsed>=this.generationTime){
			this.elapsed = 0;
			this.createBarrils();
		}
		this.game.physics.arcade.collide(this.player,this.floor);
		this.game.physics.arcade.collide(this.player,this.platforms);
		this.game.physics.arcade.collide(this.goal,this.platforms);
		this.game.physics.arcade.collide(this.platforms,this.barrils);
		if((this.keys.up.isDown || this.player.customParams.mustJump )  && this.player.body.touching.down){
			this.jumpSound.play();
			this.player.body.velocity.y = -this.JUMPING_SPEED;
		}
		this.player.body.velocity.x = 0;
		if(this.keys.left.isDown || this.player.customParams.isMovingLeft){
			this.player.body.velocity.x = -this.RUNNING_SPEED ;
			this.player.scale.setTo(1,1);
			this.player.animations.play("walking");
		}
		else if(this.keys.right.isDown || this.player.customParams.isMovingRight){
			this.player.body.velocity.x = this.RUNNING_SPEED ;
			this.player.scale.setTo(-1,1);
			this.player.animations.play("walking");
		}else{
			this.player.frame = 3;
		}

		this.barrils.forEach(function(element){
	      if(element.x < 10 && element.y > 600) {
	        element.kill();
	      }
	    }, this);
	},
	createBarrils:function(){
		var barril = this.game.add.sprite(0,0,'barrel');
		this.barrils.add(barril);
		this.game.physics.arcade.enable(barril);
		barril.body.collideWorldBounds = true;
		barril.body.velocity.x = 100;
		barril.body.bounce.set(1,0);
	},
	createOnscreenControls: function(){
	    this.leftArrow = this.add.button(20, 650, 'arrowButton');
	    this.rightArrow = this.add.button(110, 650, 'arrowButton');
	    this.actionButton = this.add.button(280, 650, 'actionButton');

	    this.leftArrow.alpha = 0.5;
	    this.rightArrow.alpha = 0.5;
	    this.actionButton.alpha = 0.5;

	    this.actionButton.events.onInputDown.add(function(){
	      this.player.customParams.mustJump = true;
	    }, this);

	    this.actionButton.events.onInputUp.add(function(){
	      this.player.customParams.mustJump = false;
	    }, this);

	    //left
	    this.leftArrow.events.onInputDown.add(function(){
	      this.player.customParams.isMovingLeft = true;
	    }, this);

	    this.leftArrow.events.onInputUp.add(function(){
	      this.player.customParams.isMovingLeft = false;
	    }, this);

	    this.leftArrow.events.onInputOver.add(function(){
	      this.player.customParams.isMovingLeft = true;
	    }, this);

	    this.leftArrow.events.onInputOut.add(function(){
	      this.player.customParams.isMovingLeft = false;
	    }, this);

	    //right
	    this.rightArrow.events.onInputDown.add(function(){
	      this.player.customParams.isMovingRight = true;
	    }, this);

	    this.rightArrow.events.onInputUp.add(function(){
	      this.player.customParams.isMovingRight = false;
	    }, this);

	    this.rightArrow.events.onInputOver.add(function(){
	      this.player.customParams.isMovingRight = true;
	    }, this);

	    this.rightArrow.events.onInputOut.add(function(){
	      this.player.customParams.isMovingRight = false;
	    }, this);
  },
}