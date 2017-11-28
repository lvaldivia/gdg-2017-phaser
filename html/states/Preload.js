Preload = function(){

}

Preload.prototype = {
	preload:function(){
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    this.game.scale.pageAlignHorizontally = true;
	    this.game.scale.pageAlignVertically = true;
		this.game.load.image('ground', 'assets/images/ground.png');    
	    this.game.load.image('platform', 'assets/images/platform.png');    
	    this.game.load.image('goal', 'assets/images/gorilla3.png');    
	    this.game.load.image('arrowButton', 'assets/images/arrowButton.png');    
	    this.game.load.image('actionButton', 'assets/images/actionButton.png');    
	    this.game.load.image('barrel', 'assets/images/barrel.png');    

	    this.game.load.spritesheet('player', 'assets/images/player_spritesheet.png', 28, 30, 5, 1, 1);    
	    this.game.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', 20, 21, 2, 1, 1);      
	  
	    this.game.load.text('level', 'assets/data/level.json');
	    this.game.load.audio("background","assets/sounds/background.mp3");
	    this.game.load.audio("jump","assets/sounds/jump.mp3")
	},
	create:function(){
		this.game.state.start("Game");
	}

}