//
// Asset loader
//

var Loader = {
    images: {}
};

Loader.loadImage = function (key, src) {
    var img = new Image();

    var d = new Promise(function (resolve, reject) {
        img.onload = function () {
            this.images[key] = img;
            resolve(img);
        }.bind(this);

        img.onerror = function () {
            reject('Could not load image: ' + src);
        };
    }.bind(this));

    img.src = src;
    return d;
};

Loader.getImage = function (key) {
    return (key in this.images) ? this.images[key] : null;
};

var Mouse = {};
Mouse.coord = {};

Mouse.listenForEvents = function () {
    window.addEventListener('mousedown', e => {
        this.coord.x = e.offsetX;
        this.coord.y = e.offsetY;
      });
}

Mouse.isClicked = function () {
    return this.coord;
};

Mouse.emptyCoords = function () {
    this.coord = {};
    return this.coord;
}

//
// Game object
//

var Game = {};

Game.run = function (context) {
    this.ctx = context;
    this._previousElapsed = 0;

    var p = this.load();
    Promise.all(p).then(function (loaded) {
        this.init();
        window.requestAnimationFrame(this.tick);
    }.bind(this));
};

Game.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // clear previous frame
    this.ctx.clearRect(0, 0, 512, 512);

    this.update();
    this.render();
}.bind(Game);

// override these methods to create the demo
Game.init = function () {};
Game.update = function () {};
Game.render = function () {};

//
// start up function
//

window.onload = function () {
    var context = document.getElementById('demo').getContext('2d');
    Game.run(context);
};
