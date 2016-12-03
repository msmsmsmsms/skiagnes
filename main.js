let overlay = document.getElementById('overlay');
let startButton = document.getElementById('center');

startButton.onclick = function() {
  overlay.style.display = "none";
  const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

  let win_height = window.innerHeight,
      win_width = window.innerWidth;

  let mainState = {
    let max = 0;
    let front_emitter;
    let mid_emitter;
    let back_emitter;
    let update_interval = 4 * 60;
    let i = 0;

    preload: function() {
      this.game.load.image('ground', 'assets/ground.png');
      this.game.load.image('sky', 'assets/sky.png');

      this.game.load.image('mountains_bg', 'assets/mountains-bg.png');
      this.game.load.image('mountains_mid_1', 'assets/mountains-mid-1.png');
      this.game.load.image('mountains_mid_2', 'assets/mountains-mid-2.png');

      this.game.load.image('snowflakes', 'assets/snowflakes.png', 17, 17);
      this.game.load.image('snowflakes_large', 'assets/snowflakes_large.png', 64, 64);

    },

    create: function() {
      game.stage.backgroundColor = '#4f4f4f';

      this.sky = this.game.add.sprite(0, 0, 'sky');

      // this.mountains_bg = this.game.add.sprite(game.world.centerX, game.world.centerY, 'mountains_bg').anchor.setTo(0.5, 0.5);

      this.mountains_bg = this.game.add.tileSprite(0, win_height - 1000, win_width, 1000, 'mountains_bg');

      this.mountains_mid_1 = this.game.add.tileSprite(0, win_height - 675, win_width, 770, 'mountains_mid_1');

      this.mountains_mid_2 = this.game.add.tileSprite(0, win_height - 350, win_width, 482, 'mountains_mid_2');

      this.ground = this.game.add.tileSprite(0, win_height - 100, win_width, 100, 'ground');
    },

    update: function() {
      this.ground.tilePosition.x -= 3;
      this.mountains_bg.tilePosition.x -= 0.1;
      this.mountains_mid_1.tilePosition.x -= 0.3;
      this.mountains_mid_2.tilePosition.x -= 0.5;
    },
  };

  game.state.add('main', mainState);
  game.state.start('main');
}
