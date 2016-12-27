let overlay = document.getElementById('overlay');
let startButton = document.getElementById('center');

startButton.onclick = function() {
  overlay.style.display = "none";
  const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

  let win_height = window.innerHeight,
      win_width = window.innerWidth;

  let max = 0;
  let front_emitter;
  let mid_emitter;
  let back_emitter;
  let update_interval = 4 * 60;
  let i = 0;
  let spacebar;
  let up;
  let speed_multiplier = 1;
  const max_mulitplier = 3;
  let scoreText;
  let score = 0;
  let difficulty = 1;
  let jumps = 0;

  let mainState = {

    preload: function() {
      // GROUND AND SKY
      this.game.load.image('ground', 'assets/ground.png');
      this.game.load.image('sky', 'assets/sky.png');

      // MOUNTAINS
      this.game.load.image('mountains_bg', 'assets/mountains-bg.png');
      this.game.load.image('mountains_mid_1', 'assets/mountains-mid-1.png');
      this.game.load.image('mountains_mid_2', 'assets/mountains-mid-2.png');

      // OBSTACLES AND BONUSES
      this.game.load.image('pretzel', 'assets/pretzel.png');
      this.game.load.image('rock', 'assets/rock.png');
      this.game.load.image('spike', 'assets/spikes.png');
      this.game.load.spritesheet('wolf', 'assets/wolf_spritesheet_2.png', 153, 138);

      // SNOWFLAKES
      this.game.load.spritesheet('snowflakes', 'assets/snowflakes.png', 17, 17);
      this.game.load.spritesheet('snowflakes_large', 'assets/snowflakes_large.png', 64, 64);

      // AUDIO
      this.game.load.audio('wind', ['assets/wind1.wav']);
      this.game.load.audio('music', ['assets/path_to_lake_land.ogg']);

      // PLAYER
      this.game.load.image('agnes', 'assets/agnes_agnes.png');
    },

    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#4f4f4f';

      this.sky = game.add.sprite(0, 0, 'sky');

      this.mountains_bg = this.game.add.tileSprite(0, win_height - 1000, win_width, 1000, 'mountains_bg');

      this.mountains_mid_1 = this.game.add.tileSprite(0, win_height - 675, win_width, 770, 'mountains_mid_1');

      this.mountains_mid_2 = this.game.add.tileSprite(0, win_height - 350, win_width, 482, 'mountains_mid_2');

      this.ground = this.game.add.tileSprite(0, win_height - 100, win_width, 100, 'ground');

      this.agnes = game.add.sprite(win_width / 10, win_height - 230, 'agnes');
      this.agnes.scale.setTo(0.45, 0.45);

      game.physics.arcade.enable([ this.ground, this.agnes ], Phaser.Physics.ARCADE);
      this.ground.body.immovable = true;
      this.ground.body.allowGravity = false;
      this.agnes.body.collideWorldBounds = true;
      this.agnes.body.gravity.y = 2000;


      // SETTING UP EMITTERS FOR SNOWFLAKES
      this.back_emitter = game.add.emitter(game.world.centerX, -32, 600);
      this.back_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
      this.back_emitter.maxParticleScale = 0.6;
      this.back_emitter.minParticleScale = 0.2;
      this.back_emitter.setYSpeed(20, 100);
      this.back_emitter.gravity = 0;
      this.back_emitter.width = game.world.width * 1.5;
      this.back_emitter.minRotation = 0;
      this.back_emitter.maxRotation = 40;

      this.mid_emitter = game.add.emitter(game.world.centerX, -32, 250);
      this.mid_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
      this.mid_emitter.maxParticleScale = 1.2;
      this.mid_emitter.minParticleScale = 0.8;
      this.mid_emitter.setYSpeed(50, 150);
      this.mid_emitter.gravity = 0;
      this.mid_emitter.width = game.world.width * 1.5;
      this.mid_emitter.minRotation = 0;
      this.mid_emitter.maxRotation = 40;

      this.front_emitter = game.add.emitter(game.world.centerX, -32, 50);
      this.front_emitter.makeParticles('snowflakes_large', [0, 1, 2, 3, 4, 5]);
      this.front_emitter.maxParticleScale = 1;
      this.front_emitter.minParticleScale = 0.5;
      this.front_emitter.setYSpeed(100, 200);
      this.front_emitter.gravity = 0;
      this.front_emitter.width = game.world.width * 1.5;
      this.front_emitter.minRotation = 0;
      this.front_emitter.maxRotation = 40;

      this.changeWindDirection();

      this.back_emitter.start(false, 14000, 20);
      this.mid_emitter.start(false, 12000, 40);
      this.front_emitter.start(false, 6000, 1000);

      this.music = this.game.add.audio('music', true);
      this.music.loop = true;
      this.music.play();

      this.wind = this.game.add.audio('wind', true);
      this.wind.loop = true;
      this.wind.play();

      // cursors = game.input.keyboard.createCursorKeys();
      spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      up = game.input.keyboard.addKey(Phaser.Keyboard.UP);

      game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.UP]);
      scoreText = game.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#222'});

      this.wolves = game.add.group();
      this.wolves.enableBody = true;
      this.wolves.createMultiple(10, 'wolf');
      for (let i of this.wolves.children) {
        i.scale.setTo(1.2, 1.2);
        i.scale.x *= -1;
        i.animations.add('walk', [0, 1, 2, 3, 4, 5]);
      }

      this.pretzels = game.add.group();
      this.pretzels.enableBody = true;
      this.pretzels.createMultiple(10, 'pretzel');
      for (let i of this.pretzels.children) {
        i.scale.setTo(0.15, 0.15);
      }

      this.rocks = game.add.group();
      this.rocks.enableBody = true;
      this.rocks.createMultiple(10, 'rock');
      for (let i of this.rocks.children) {
        i.scale.setTo(1.5, 1.5);
      }

      this.spikes = game.add.group();
      this.spikes.enableBody = true;
      this.spikes.createMultiple(10, 'spike');
      for (let i of this.spikes.children) {
        i.scale.setTo(1.5, 1.5);
      }
    },

    update: function() {
      let bonus_appears = Math.random();
      let rock_appears = Math.random();
      let spike_appears = Math.random();
      // let wolf_appears = Math.random();

      if (bonus_appears < 0.003) {
        this.addAPretzel();
      }
      if (rock_appears < 0.005) {
        this.addARock();
      }
      if (spike_appears < 0.005) {
        this.addASpike();
      }
      if (wolf_appears < 0.002) {
        this.addAWolf();
      }

      for (let i of this.pretzels.children) {
        i.body.x -= 5 * speed_multiplier;
      }
      for (let i of this.rocks.children) {
        i.body.x -= 5 * speed_multiplier;
      }
      for (let i of this.spikes.children) {
        i.body.x -= 5 * speed_multiplier;
      }
      for (let i of this.wolves.children) {
        i.body.x -= 7 * speed_multiplier;
      }

      this.ground.tilePosition.x -= 5 * speed_multiplier;
      this.mountains_bg.tilePosition.x -= 0.1 * speed_multiplier;
      this.mountains_mid_1.tilePosition.x -= 0.5 * speed_multiplier;
      this.mountains_mid_2.tilePosition.x -= 0.9 * speed_multiplier;

      this.i++;
      if (this.i === this.update_interval) {
        this.changeWindDirection();
        this.update_interval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
        this.i = 0;
      };

      game.physics.arcade.collide(this.agnes, this.ground);

      if (jumps < 1) {
        if (spacebar.isDown || up.isDown) {
          if (spacebar.downDuration(5) || up.downDuration(5)) {
            this.agnes.body.velocity.y = -800;
            jumps++;
          }
        }
      }

      if (this.agnes.body.touching.down) {
        jumps = 0;
      }

      if (speed_multiplier < max_mulitplier) {
        speed_multiplier += 0.005;
      }

      game.physics.arcade.overlap(this.agnes, this.pretzels, this.collectPretzel, null, this);
      game.physics.arcade.overlap(this.agnes, this.rocks, this.die, null, this);
      game.physics.arcade.overlap(this.agnes, this.wolves, this.die, null, this);
      game.physics.arcade.overlap(this.agnes, this.spikes, this.die, null, this);
    },

    changeWindDirection: function() {
      let multi = Math.floor((this.max + 200) / 4),
          frag = (Math.floor(Math.random() * 100) - multi);

      if (this.max > 200) max = 150;
      if (this.max < -200) max = -150;

      this.setXSpeed(this.back_emitter, this.max);
      this.setXSpeed(this.mid_emitter, this.max);
      this.setXSpeed(this.front_emitter, this.max);
    },

    setXSpeed: function(emitter, max) {
      emitter.setXSpeed(max - 20, max);
      emitter.forEachAlive(this.setParticleXSpeed, this, max);
    },
    setParticleXSpeed: function(particle, max) {
      particle.body.velocity.x = max - Math.floor(Math.random() * 30);
    },
    addAPretzel: function() {
      this.pretzel = this.pretzels.getFirstDead();
      let random_height = Math.floor(Math.random() * (500 - 170)) + 170;
      this.pretzel.reset(win_width, win_height - random_height);
      this.pretzel.checkWorldBounds = true;
      this.pretzel.outOfBoundsKill = true;
      this.pretzel.body.immovable = true;
    },
    addARock: function() {
      this.rock = this.rocks.getFirstDead();
      this.rock.reset(win_width, win_height - 150);
      this.rock.checkWorldBounds = true;
      this.rock.outOfBoundsKill = true;
      this.rock.body.immovable = true;
    },
    addASpike: function() {
      this.spike = this.spikes.getFirstDead();
      this.spike.reset(win_width, win_height - 150);
      this.spike.checkWorldBounds = true;
      this.spike.outOfBoundsKill = true;
      this.spike.body.immovable = true;
    },
    addAWolf: function() {
      this.wolf = this.wolves.getFirstDead();
      this.wolf.reset(win_width, win_height - 230);
      this.wolf.checkWorldBounds = true;
      this.wolf.outOfBoundsKill = true;
      this.wolf.body.immovable = true;
      this.wolf.animations.play('walk');
    },
    jump: function() {
        this.agnes.body.velocity = -800;
        jumps--;
    },
    collectPretzel: function(player, pretzel) {
      pretzel.kill();
      score += 10;
      scoreText.text = 'Score: ' + score;
    },
    die: function(player, obstacle) {
      game.state.start('main');
      this.music.stop();
      this.wind.stop();
    },
  };

  game.state.add('main', mainState);
  game.state.start('main');
}
