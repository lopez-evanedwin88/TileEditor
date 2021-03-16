var map = {
    cols: 15,
    rows: 10,
    tsize: 47,
    layers: [[
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    ], [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]],
    selectedTile: {},
    getTile: function (layer, col, row) {
        return this.layers[layer][row * map.cols + col];
    },
    setTile: function (layer, col, row, tile) {
        this.layers[layer][row * map.cols + col] = tile;
        return this.layers;
    },
    isSolidTileAtXY: function (x, y) {
        var col = Math.floor(x / this.tsize);
        var row = Math.floor(y / this.tsize);

        // tiles 3 and 5 are solid -- the rest are walkable
        // loop through all layers and return TRUE if any tile is solid
        return this.layers.reduce(function (res, layer, index) {
            var tile = this.getTile(index, col, row);
            var isSolid = tile === 3 || tile === 5;
            return res || isSolid;
        }.bind(this), false);
    },
    getCol: function (x) {
        return Math.floor(x / this.tsize);
    },
    getRow: function (y) {
        return Math.floor(y / this.tsize);
    },
    getX: function (col) {
        return col * this.tsize;
    },
    getY: function (row) {
        return row * this.tsize;
    }
};

Game.load = function () {
    return [
        Loader.loadImage('tiles', 'assets/assets.png'),
    ];
};

Game.init = function () {
    Mouse.listenForEvents();
    this.tileAtlas = Loader.getImage('tiles');
};

Game.update = function () {
    // handle hero movement with arrow keys
    const coord = Mouse.isClicked();

    if(Object.keys(Mouse.isClicked()).length > 0 && Object.keys(map.selectedTile).length === 0) {
        if (map.getTile(1, map.getCol(coord.x), map.getRow(coord.y)) !== 0) {
            map.selectedTile.col = map.getCol(coord.x);
            map.selectedTile.row = map.getRow(coord.y);
            map.selectedTile.tile = map.getTile(1, map.getCol(coord.x), map.getRow(coord.y));
        }
    } else if (Object.keys(map.selectedTile).length > 0 && Object.keys(Mouse.isClicked()).length > 0) {
        if (map.getTile(1, map.getCol(coord.x), map.getRow(coord.y)) !== 0) {
            alert("Block is not empty. Please choose another that is empty");
        } else {
            map.setTile(1, map.selectedTile.col, map.selectedTile.row, 0);
            map.setTile(1, map.getCol(coord.x), map.getRow(coord.y), map.selectedTile.tile);
            this._drawLayer(1);
            map.selectedTile = {};
        }
    }
    Mouse.emptyCoords();
};

Game._drawLayer = function (layer) {
    for (var c = 0; c < map.cols; c++) {
        for (var r = 0; r < map.rows; r++) {
            var tile = map.getTile(layer, c, r);
            if (tile !== 0) { // 0 => empty tile
                this.ctx.drawImage(
                    this.tileAtlas, // image
                    (tile - 1) * map.tsize, // source x
                    0, // source y
                    map.tsize, // source width
                    map.tsize, // source height
                    c * map.tsize,  // target x
                    r * map.tsize, // target y
                    map.tsize, // target width
                    map.tsize // target height
                );
            }
        }
    }
};

Game.render = function () {
    // draw map background layer
    this._drawLayer(0);
    // draw game sprites
    // this.ctx.drawImage(this.hero.image, this.hero.x, this.hero.y);
    // draw map top layer
    this._drawLayer(1);
};
