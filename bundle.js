/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  width: 360,
  height: 640
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Boot extends Phaser.State {
  constructor() {
    super();
  }

  init() {
    this.game.stage.disableVisibilityChange = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Boot;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Game extends Phaser.State {
  constructor() {
    super();
  }

  init() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 1000;

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.game.world.setBounds(0, 0, 360, 700);

    this.RUNNING_SPEED = 180;
    this.JUMPING_SPEED = 550;
  }

  preload() {}

  create() {
    this.ground = this.add.sprite(0, 630, 'ground');
    this.ground.scale.setTo(0.563);
    this.game.physics.arcade.enable(this.ground);
    this.ground.body.allowGravity = false;
    this.ground.body.immovable = true;

    this.levelData = JSON.parse(this.game.cache.getText('level'));

    this.platforms = this.add.group();
    this.platforms.enableBody = true;

    this.levelData.platformData.forEach(element => {
      this.platforms.create(element.x, element.y, 'platform');
    }, this);
    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.allowGravity', false);

    //fires
    this.fires = this.add.group();
    this.fires.enableBody = true;

    let fire;
    this.levelData.fireData.forEach(element => {
      fire = this.fires.create(element.x, element.y, 'fire');
      fire.animations.add('fire', [0, 1, 2, 3], 8, true);
      fire.play('fire');
      fire.scale.setTo(1.2);
    }, this);
    this.fires.setAll('body.allowGravity', false);

    //monkey
    this.monkey = this.add.sprite(this.levelData.monkey.x, this.levelData.monkey.y, 'monkey');
    this.monkey.scale.setTo(0.2);
    this.game.physics.arcade.enable(this.monkey);
    this.monkey.body.allowGravity = false;

    this.player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player', 2);
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(0.7);
    this.player.animations.add('walking', [0, 1], 6, true);
    this.game.physics.arcade.enable(this.player);
    this.player.customParams = {
      "alive": true
    };
    this.player.body.collideWorldBounds = true;

    this.game.camera.follow(this.player);

    this.createOnscreenControls();

    this.barrels = this.add.group();
    this.barrels.enableBody = true;
    this.barrels.customParams = {
      "velocityRight": true
    };

    this.createBarrel();
    this.barrelCreator = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.barrelFrequency, this.createBarrel, this);

    this.deathSound = this.game.add.audio('death');
  }

  update() {
    this.game.physics.arcade.collide(this.player, this.ground);
    this.game.physics.arcade.collide(this.player, this.platforms);

    this.game.physics.arcade.collide(this.barrels, this.ground);
    this.game.physics.arcade.collide(this.barrels, this.platforms);

    this.game.physics.arcade.overlap(this.player, this.fires, this.killPlayer);
    this.game.physics.arcade.overlap(this.player, this.barrels, this.killPlayer);
    this.game.physics.arcade.overlap(this.player, this.monkey, this.win);

    if (!this.player.customParams.alive) {
      this.gameOver();
    }

    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown || this.player.customParams.isMovingLeft) {
      this.player.body.velocity.x = -this.RUNNING_SPEED;
      this.player.scale.setTo(-0.7, 0.7);
      this.player.play('walking');
    } else if (this.cursors.right.isDown || this.player.customParams.isMovingRight) {
      this.player.body.velocity.x = this.RUNNING_SPEED;
      this.player.scale.setTo(0.7);
      this.player.play('walking');
    } else if (!this.player.body.touching.down) {
      this.player.frame = 3;
    } else {
      this.player.animations.stop();
      this.player.frame = 2;
    }

    if ((this.cursors.up.isDown || this.player.customParams.mustJump) && this.player.body.touching.down) {
      this.player.body.velocity.y = -this.JUMPING_SPEED;
      this.player.customParams.mustJump = false;
    }

    this.barrels.forEach(element => {
      if ((element.x < 10 || element.x > 340) && element.y > 600) {
        element.kill();
      }
    }, this);
  }

  render() {}

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

    this.leftArrow.fixedToCamera = true;
    this.rightArrow.fixedToCamera = true;
    this.actionButton.fixedToCamera = true;

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

  killPlayer(player, fire) {
    player.customParams.alive = false;
  }

  createBarrel() {
    let barrel = this.barrels.getFirstExists(false);
    if (!barrel) {
      barrel = this.barrels.create(0, 0, 'barrel');
    }
    barrel.body.collideWorldBounds = true;
    barrel.body.bounce.set(1, 0);

    barrel.reset(this.levelData.monkey.x + 50, this.levelData.monkey.y);
    if (this.barrels.customParams.velocityRight) {
      barrel.body.velocity.x = this.levelData.barrelSpeed;
      this.barrels.customParams.velocityRight = false;
    } else {
      barrel.body.velocity.x = -this.levelData.barrelSpeed;
      this.barrels.customParams.velocityRight = true;
    }
  }

  win(player, monkey) {
    alert("You win!!");
    player.customParams.alive = false;
  }
  gameOver() {
    this.deathSound.play();
    this.game.state.start('Game');
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Home extends Phaser.State {
  constructor() {
    super();
  }

  init() {}

  create() {
    this.state.start('Game');
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Home;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Loader extends Phaser.State {
  constructor() {
    super();
  }

  preload() {
    this.addProgressLabel();
    this.load.onFileComplete.add(this.refreshProgress, this);

    this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.logo.anchor.setTo(0.5);

    this.load.image('platform', 'assets/images/platform1.png');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('monkey', 'assets/images/monkey.png');
    this.load.image('arrow', 'assets/images/arrow.png');
    this.load.image('barrel', 'assets/images/barrel.png');

    this.load.spritesheet('fire', 'assets/images/fire.png', 16, 16, 4);
    this.load.spritesheet('player', 'assets/images/player.png', 80, 110, 4);

    this.load.text('level', 'assets/data/level.json');
    this.load.audio('death', ['assets/audio/death.ogg', 'assets/audio/death.mp3']);
  }

  create() {
    this.state.start('Home');
  }

  addProgressLabel() {
    const style = {
      font: '41px Open Sans',
      fill: '#000'
    };

    this.progressLabel = this.add.text(this.game.world.centerX, this.game.world.centerY + 100, 'Loading: 0% (0/0)', style);
    this.progressLabel.anchor.setTo(0.5);
  }

  refreshProgress(progress, cacheKey, success, totalLoaded, totalFiles) {
    this.progressLabel.text = `Loading ${progress}% (${totalLoaded}/${totalFiles})`;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Loader;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const init = function (key) {
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  ga('create', key, 'auto');
  ga('send', 'pageview');
};
/* harmony export (immutable) */ __webpack_exports__["a"] = init;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const init = function () {
  var script = document.createElement('script');
  script.onload = function () {
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
  document.head.appendChild(script);
};
/* harmony export (immutable) */ __webpack_exports__["a"] = init;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vendors_analytics__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vendors_stats__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__boot_boot__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__game_game__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__loader_loader__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__game_home__ = __webpack_require__(3);








__WEBPACK_IMPORTED_MODULE_0__vendors_analytics__["a" /* init */]();
__WEBPACK_IMPORTED_MODULE_1__vendors_stats__["a" /* init */]();

let game = new Phaser.Game(__WEBPACK_IMPORTED_MODULE_2__config__["a" /* default */].width, __WEBPACK_IMPORTED_MODULE_2__config__["a" /* default */].height, Phaser.AUTO);

window.onresize = () => {
  //game.scale.setGameSize(window.innerWidth, window.innerHeight);
};

game.state.add('Boot', __WEBPACK_IMPORTED_MODULE_3__boot_boot__["a" /* default */]);
game.state.add('Game', __WEBPACK_IMPORTED_MODULE_4__game_game__["a" /* default */]);
game.state.add('Loader', __WEBPACK_IMPORTED_MODULE_5__loader_loader__["a" /* default */]);
game.state.add('Home', __WEBPACK_IMPORTED_MODULE_6__game_home__["a" /* default */]);

game.state.start('Boot');

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map