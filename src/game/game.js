export default class Game extends Phaser.State {
  constructor() {
    super();
  }

  init() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;

    this.cursors = this.game.input.keyboard.createCursorKeys();


    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 550;
  }

  preload() {

  }

  create() {
    this.ground = this.add.sprite(0, 570, 'ground');
    this.ground.scale.setTo(0.563);
    this.game.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;


    let platformData = [
      {"x": 0, "y": 430},
      {"x": 260, "y": 430},
      {"x": 150, "y": 290},
      {"x": 0, "y": 140}
    ];

    this.platforms = this.add.group();
    this.platforms.enableBody = true;

    platformData.forEach((element) => {
      this.platforms.create(element.x, element.y, 'platform');
    }, this);
    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);

    this.player = this.add.sprite(100, 200, 'player', 2);
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(0.7);
    this.player.animations.add('walking', [0, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.customParams = {};

    this.createOnscreenControls();
  }

  update() {
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.platforms);

    this.player.body.velocity.x = 0;

    if(this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
    }
    else if(this.cursors.right.isDown || this.player.customParams.isMovingRight) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
    }

    if((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
        this.player.body.velocity.y = -this.JUMPING_SPEED;
        this.player.customParams.mustJump = false;
    }
  }

  render() {

  }

  createOnscreenControls() {
    this.leftArrow = this.add.button(50, 610, 'arrow');
    this.leftArrow.anchor.setTo(0.5);
    this.rightArrow = this.add.button(130, 610, 'arrow');
    this.rightArrow.anchor.setTo(0.5);
    this.rightArrow.angle = 180;
    this.actionButton = this.add.button(300, 610, 'arrow');
    this.actionButton.anchor.setTo(0.5);
    this.actionButton.angle = 90;

    this.leftArrow.alpha = 0.7;
    this.rightArrow.alpha = 0.7;
    this.actionButton.alpha = 0.7;

    this.actionButton.events.onInputDown.add(() => {
      this.player.customParams.mustJump = true;
    }, this);
    this.actionButton.events.onInputUp.add(() => {
      this.player.customParams.mustJump = false;
    }, this);

    //left
    this.leftArrow.events.onInputDown.add(() => {
      this.player.customParams.isMovingLeft = true;
    }, this);
    this.leftArrow.events.onInputUp.add(() => {
      this.player.customParams.isMovingLeft = false;
    }, this);
    this.leftArrow.events.onInputOver.add(() => {
      this.player.customParams.isMovingLeft = true;
    }, this);
    this.leftArrow.events.onInputOut.add(() => {
      this.player.customParams.isMovingLeft = false;
    }, this);

    //right
    this.rightArrow.events.onInputDown.add(() => {
      this.player.customParams.isMovingRight = true;
    }, this);
    this.rightArrow.events.onInputUp.add(() => {
      this.player.customParams.isMovingRight = false;
    }, this);
    this.rightArrow.events.onInputOver.add(() => {
      this.player.customParams.isMovingRight = true;
    }, this);
    this.rightArrow.events.onInputOut.add(() => {
      this.player.customParams.isMovingRight = false;
    }, this);
  }

}
