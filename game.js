/*jslint bitwise: true, es5: true */
(function (window,  undefined) {
    'use strict';
    var canvas = null, ctx = null;
    var lastPress = null;
    var lastRelease = null;
    var mouse = {x: 0, y: 0};
    var pointer = {x: 0, y: 0};
    var dragging = null;
    var draggables = [];
    var i = 0;
    var l = 0;

    function Rectangle2D(x, y, width, height, createFromTopLeft) {
        this.width = (width === undefined) ? 0 : width;
        this.height = (height === undefined) ? this.width : height;
        if (createFromTopLeft) {
            this.left = (x === undefined) ? 0 : x;
            this.top = (y === undefined) ? 0 : y;
        } else {
            this.x = (x === undefined) ? 0 : x;
            this.y = (y === undefined) ? 0 : y;
        }
    }

    Rectangle2D.prototype = {
        left : 0,
        top : 0,
        width : 0,
        height : 0,

        get x() {
            return this.left + this.width/2;
        },
        set x(value) {
            this.left = value - this.width/2;
        },
        get y() {
            return this.top + this.height/2;
        },
        set y(value) {
            this.top = value - this.height/2;
        },

        get right() {
            return this.left + this.width;
        },
        set right(value) {
            this.left = value - this.width;
        },

        get bottom() {
            return this.top + this.height;
        },
        set bottom(value) {
            this.top = value -this.height;
        },

        contains: function (rect) {
            if (rect !== undefined) {
                return (this.left < (rect.left || rect.x) &&
                        this.right > (rect.right || rect.x) &&
                        this.top < (rect.top || rect.y) &&
                        this.bottom > (rect.bottom || rect.y));
            }
        },

        intersects: function (rect) {
            if (rect !== undefined) {
                return (this.left < rect.right &&
                        this.right > rect.left &&
                        this.top < rect.bottom &&
                        this.bottom > rect.top);
            }
        },

        fill: function (ctx) {
            if (ctx !== undefined) {
                ctx.fillRect(this.left, this.top, this.width, this.height);
            }
        }
    };

    function enableInputs() {
        document.addEventListener('mousemove', function (evt) {
            mouse.x = evt.pageX - canvas.offsetLeft;
            mouse.y = evt.pageY - canvas.offsetTop;
        }, false);

        document.addEventListener('mouseup', function (evt) {
            lastRelease = evt.which;
        }, false);

        canvas.addEventListener('mousedown', function (evt) {
            evt.preventDefault();
            lastPress = evt.which;
        }, false);

        canvas.addEventListener('touchmove', function(evt) {
            evt.preventDefault();
            var t = evt.targetTouches;
            mouse.x = t[0].pageX - canvas.offsetLeft;
            mouse.y = t[0].pageY - canvas.offsetTop;
        }, false);

        canvas.addEventListener('touchstart', function(evt) {
            evt.preventDefault();
            lastPress = 1;
            var t = evt.targetTouches;
            mouse.x = t[0].pageX - canvas.offsetLeft;
            mouse.y = t[0].pageY - canvas.offsetTop;
        }, false);

        canvas.addEventListener('touchend', function(evt) {
            lastRelease = 1;
        }, false);

        canvas.addEventListener('touchcancel', function(evt) {
            lastRelease = 1;
        }, false);
    }

    function random(max) {
        return ~~(Math.random()*max);
    }

    function paint(ctx) {
        //Clean canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Draw Rectangles
        ctx.fillStyle = '#00f';
        for (i=0, l=draggables.length; i<l; i++) {
            draggables[i].fill(ctx);
        }

        //Debug pointer position
        ctx.fillStyle = '#0f0';
        ctx.fillRect(pointer.x-1, pointer.y-1, 2, 2);

        //Debug dragging rectangle
        ctx.fillStyle = '#fff';
        ctx.fillText('Dragging: '+dragging, 0, 10);
    }

    function act() {
        //Set pointer to mouse
        pointer.x = mouse.x;
        pointer.y = mouse.y;

        //Limit pointer into canvas
        if (pointer.x < 0) {
            pointer.x = 0;
        }
        if (pointer.x > canvas.width) {
            pointer.x = canvas.width;
        }
        if (pointer.y < 0) {
            pointer.y = 0;
        }
        if (pointer.y > canvas.height) {
            pointer.y = canvas.height;
        }

        if (lastPress === 1) {
            //Chech for current dragging circle
            for (i=0, l=draggables.length; i<l; i++) {
                if (draggables[i].contains(pointer)) {
                    dragging = i;
                    break;
                }
            }
        } else if (lastRelease === 1) {
            //Release current dragging circle
            dragging = null;
        }

        //Move current dragging circle
        if (dragging !== null) {
            draggables[dragging].x = pointer.x;
            draggables[dragging].y = pointer.y;
        }
    }

    function run() {
        window.requestAnimationFrame(run);
        act();
        paint(ctx);

        lastPress = null;
        lastRelease = null;
    }

    function init() {
        //Get canvas and context
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 300;

        //Create draggables
        for (i=0; i<5; i++) {
            draggables.push(new Rectangle2D(random(canvas.width), random(canvas.height), 20, 20, false));
        }

        //Start game
        enableInputs();
        run();
    }

    window.addEventListener('load', init, false);
}(window));