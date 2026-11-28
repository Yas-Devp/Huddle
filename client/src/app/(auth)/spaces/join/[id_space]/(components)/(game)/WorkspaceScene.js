import Phaser from "phaser";

// Tiled tileset name -> image in public/assets/maps/room1_assets/.
// The names must match rooms1.json exactly.
const TILESET_IMAGES = [
  ["doors_stairs", "/assets/maps/room1_assets/doors_windows_stairs.png"],
  ["floors", "/assets/maps/room1_assets/floors.png"],
  ["furniture1", "/assets/maps/room1_assets/furniture1.png"],
  ["items", "/assets/maps/room1_assets/items.png"],
];

// Draw order from Tiled. Child layers of a group are flattened as
// "Group name/Layer name" by the Tiled parser.
const LAYER_NAMES = [
  "floor",
  "Group 1/furniture",
  "Group 1/furniture2",
  "walls",
  "items",
];

export class WorkspaceScene extends Phaser.Scene {
  constructor(name) {
    super("WorkspaceScene");

    this.name = name;
    this.player = null;
    this.cursors = null;
    this.wasd = null;
    this.walls = null;
    this.nameLabel = null;
    this.layers = {};

    this.people = [];
    this.otherPlayers = {};

    this.playerSpeed = 150;
    this.lastDirection = "down";
  }

  init(data) {
    this.people = data?.people ?? [];
  }

  // -------------------------
  // PRELOAD
  // -------------------------

  preload() {
    this.load.spritesheet("player", "/assets/characters/Adventurer.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.tilemapTiledJSON("workspace", "/assets/maps/rooms1.json");

    TILESET_IMAGES.forEach(([key, url]) => {
      this.load.image(key, url);
    });

    this.load.on("loaderror", (file) => {
      console.error("Asset loading failed:", file.src);
    });
  }

  // -------------------------
  // CREATE
  // -------------------------

  create() {
    // 1. Create Tiled map
    const map = this.make.tilemap({ key: "workspace" });

    // 2. Link each Tiled tileset to the image we just loaded.
    const tilesets = TILESET_IMAGES.map(([key]) =>
      map.addTilesetImage(key, key),
    ).filter(Boolean);

    if (tilesets.length === 0) {
      console.error("No tileset could be linked; check the map asset names.");
      return;
    }

    // 3. Render every layer in the same order as Tiled.
    this.layers = {};

    LAYER_NAMES.forEach((name, index) => {
      const layer = map.createLayer(name, tilesets);

      if (!layer) {
        console.warn(`Layer not found: ${name}`);
        return;
      }

      layer.setDepth(index);
      this.layers[name] = layer;
    });

    // The player can walk anywhere inside the map
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // 4. Create player animations
    this.createAnimations();

    // 5. Create local player
    this.createPlayer();

    // 6. Configure collisions
    this.createCollisions(map);

    // 7. Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D");

    // 8. Camera
    this.fitCamera(map);
    this.cameras.main.startFollow(this.player, true);

    const handleResize = () => this.fitCamera(map);
    this.scale.on("resize", handleResize);
    this.events.once("shutdown", () => {
      this.scale.off("resize", handleResize);
    });

    console.log("Workspace map ready:", map.width, "x", map.height);
  }

  // -------------------------
  // ANIMATIONS
  // -------------------------

  createAnimations() {
    // [key, first frame, last frame, frame rate]
    const animations = [
      ["idle-down", 0, 1, 2],
      ["idle-left", 2, 3, 2],
      ["idle-right", 4, 5, 2],
      ["idle-up", 6, 7, 2],

      ["walk-down", 8, 11, 10],
      ["walk-left", 12, 15, 10],
      ["walk-right", 16, 19, 10],
      ["walk-up", 20, 23, 10],
    ];

    animations.forEach(([key, start, end, frameRate]) => {
      if (this.anims.exists(key)) return;

      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers("player", { start, end }),
        frameRate,
        repeat: -1,
      });
    });
  }

  // -------------------------
  // PLAYER
  // -------------------------

  createPlayer() {
    this.player = this.physics.add.sprite(200, 200, "player").setScale(1.5);

    this.player.setCollideWorldBounds(true);

    // Small hitbox around the feet
    this.player.body.setSize(9, 9);
    this.player.body.setOffset(20, 30);

    this.player.play("idle-down");

    // Player name
    this.nameLabel = this.add.text(
      this.player.x,
      this.player.y - 35,
      this.name,
      {
        fontFamily: "Inter",
        fontSize: "8px",
        color: "#ffffff",
        backgroundColor: "#00000099",
        padding: { x: 5, y: 3 },
      },
    );

    this.nameLabel.setOrigin(0.5, 0.5);
    this.nameLabel.setDepth(10000);
  }

  // -------------------------
  // COLLISIONS
  // -------------------------

  createCollisions(map) {
    const collisionLayer = map.getObjectLayer("Collisions");

    if (!collisionLayer) {
      console.warn('Tiled object layer "Collisions" not found.');
      return;
    }

    this.walls = this.physics.add.staticGroup();

    collisionLayer.objects.forEach((obj) => {
      if (!obj.width || !obj.height) return;

      // Tiled uses the top-left corner, Phaser zones use the center
      const zone = this.add.zone(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        obj.width,
        obj.height,
      );

      this.physics.add.existing(zone, true);
      this.walls.add(zone);
    });

    this.physics.add.collider(this.player, this.walls);
  }

  // -------------------------
  // CAMERA
  // -------------------------

  fitCamera(map) {
    const camera = this.cameras.main;

    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.setZoom(2);
  }

  // -------------------------
  // MOVEMENT
  // -------------------------

  update() {
    if (!this.player || !this.player.body) return;

    const body = this.player.body;

    let velocityX = 0;
    let velocityY = 0;

    // Horizontal movement
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      velocityX = -this.playerSpeed;
      this.lastDirection = "left";
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      velocityX = this.playerSpeed;
      this.lastDirection = "right";
    }

    // Vertical movement
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      velocityY = -this.playerSpeed;
      this.lastDirection = "up";
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      velocityY = this.playerSpeed;
      this.lastDirection = "down";
    }

    // Normalize diagonal movement
    const velocity = new Phaser.Math.Vector2(velocityX, velocityY);

    if (velocity.length() > 0) {
      velocity.normalize().scale(this.playerSpeed);
      body.setVelocity(velocity.x, velocity.y);
      this.player.play(`walk-${this.lastDirection}`, true);
    } else {
      body.setVelocity(0, 0);
      this.player.play(`idle-${this.lastDirection}`, true);
    }

    // Update player depth for Y sorting
    this.player.setDepth(this.player.y + 10);

    // Update player name position
    this.nameLabel.setPosition(this.player.x, this.player.y - 35);
    this.nameLabel.setDepth(this.player.y + 11);
  }

  // -------------------------
  // REACT PEOPLE PROP
  // -------------------------

  updatePeople(people) {
    this.people = people;

    // Synchronize the React people prop with Phaser players.
    // Remote player sprites (this.otherPlayers) and Socket.IO events
    // can be added here once the data structure is defined.
  }
}
