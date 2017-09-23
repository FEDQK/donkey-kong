export default class Boot extends Phaser.State {
  constructor() {
    super();
  }

  init() {
    this.game.stage.disableVisibilityChange = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;
  }


  preload() {
    this.load.image('preloadBar', 'assets/images/bar.png');
    this.load.image('logo', 'assets/images/toy.png');

  }

  create() {
    this.game.stage.backgroundColor = '#fff';


    this.state.start('Loader');
  }
}
