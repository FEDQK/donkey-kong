export default class Game extends Phaser.State {
  constructor() {
    super();
  }

  init() {

  }

  preload() {

  }

  create() {
    this.ground = this.add.sprite(0, 570, 'ground');
    this.ground.scale.setTo(0.563);
    this.game.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;


    let platform = this.add.sprite(0, 300, 'platform');
    platform.scale.setTo(0.4);
    this.game.physics.arcade.enable(platform);
    platform.body.allowGravity = false;
    platform.body.immovable = true;



    this.player = this.add.sprite(100, 200, 'player', 2);
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(0.7);
    this.player.animations.add('walking', [0, 1], 6, true);
    this.game.physics.arcade.enable(this.player);


  }

  update() {
  }

  render() {

  }

}
