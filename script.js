// step 1.
// project setup

const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

// step 2
//

const gravity = 0.7;

class Sprite {
    constructor({position, velocity, color, offset}) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // attack box
        if (this.isAttacking) {
            c.fillStyle = 'green';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else this.velocity.y += gravity;
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const player = new Sprite({
    position: {
        x: 200,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    color: 'blue'
})


const enemy = new Sprite({
    position: {
        x: 700,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 50,
        y: 0
    },
    color: 'red'
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

// versi timer sendiri
// let timer = 10;
// let timerInterval;
// const timerText = document.getElementById('gameTimer');

// function startTimer() {
//     setInterval(() => {
//         timer -= 1;
//         timerText.innerHTML = timer;
//     }, 1000);
// }

// startTimer();

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId);
    document.getElementById('displayText').style.display = 'flex';

    if (player.health === enemy.health) {
        document.getElementById('displayText').innerHTML = 'Tie';
    } else if (player.health > enemy.health) {
        document.getElementById('displayText').innerHTML = 'Player 1 Wins!';
    } else if (player.health < enemy.health) {
        document.getElementById('displayText').innerHTML = 'Player 2 Wins!';
    }
}

let timer = 60;
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--
        document.getElementById('gameTimer').innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({player, enemy, timerId});        
    }
}

decreaseTimer();

function rectangularCollision({rectangle1, rectangle2}) {
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    // detect collision for player
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        })
        &&
        player.isAttacking
    ) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.getElementById('enemyHealth').style.width = enemy.health + '%';
    }

    // detect collision for enemy
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })
        &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.getElementById('playerHealth').style.width = player.health + '%';
    }

    // end game if one lost all hp
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId});
    }
}

animate();

// step 3

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break
        case 'w':
            player.velocity.y = -20;
            break;
        case ' ':
            player.attack();
            break;

        // enemy movement
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break
        case 'ArrowUp':
            enemy.velocity.y = -20;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break

        // enemy movement
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break
    }
})