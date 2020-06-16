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

    function Circle(x, y, radius) {
        this.x = (x === undefined) ? 0 : x;
        this.y = (y === undefined) ? 0 : y;
        this.radius = (radius === undefined) ? 0 : radius;
    }

    Circle.prototype.distance = function (circle) {
        if (circle !== undefined) {
            var dx = this.x - circle.x;
            var dy = this.y - circle.y;
            var circleRadius = circle.radius || 0;
            return (Math.sqrt(dx*dx + dy*dy) - (this.radius + circleRadius));
        }
    };

    Circle.prototype.fill = function (ctx) {
        if (ctx !== undefined) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
            ctx.fill();
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

        //Draw Circles
        ctx.fillStyle = '#00f';
        for (i=0, l=draggables.length; i<l; i++) {
            draggables[i].fill(ctx);
        }

        //Debug pointer position
        ctx.fillStyle = '#0f0';
        ctx.fillRect(pointer.x-1, pointer.y-1, 2, 2);

        //Debug dragging circle
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
                if (draggables[i].distance(pointer)<0) {
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
            draggables.push(new Circle(random(canvas.width), random(canvas.height), 10));
        }

        //Start game
        enableInputs();
        run();
    }

    window.addEventListener('load', init, false);
}(window));