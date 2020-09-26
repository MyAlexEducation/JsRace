const score = document.querySelector('.score');
const start = document.querySelector('.game__start');
const gameArea = document.querySelector('.game__area');
const topScore = documentElement.querySelector('#topScore');

const car = document.createElement('div');
car.classList.add('car');

const audio = document.createElement('embed');
audio.src = 'music.mp3';
audio.type = 'audio/mp3';
audio.style.cssText = 'position: absolute; top: -1000px;';

const MAX_ENEMY = 7;
const HEIGHT_ELEM = 75;

const countSection = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM);

gameArea.style.height = countSection * HEIGHT_ELEM;

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 2
}

const result = localStorage.getItem('nfjs_score', setting.score);

topScore.textContent = result ? result : 0;

const addLocalStorage = () => {
    localStorage.setItem('nfjs_score', setting.score);
    topScore.textContent = setting.score;
}

function getQuantityElementElements(heightElement) {
    return (gameArea.offsetHeight / heightElement) + 1;
}

function startGame(evt){
    const target = evt.target;
    if (target === start) return
    switch (target.id) {
        case 'ease':
            setting.speed = 3;
            setting.traffic = 4;
            break;
        case 'medium':
            setting.speed = 5;
            setting.traffic = 3;
            break;
        case 'hard':
            setting.speed = 8;
            setting.traffic = 2;
            break;
    }
    start.classList.add('hide');
    gameArea.innerHTML = '';
    for (let i = 0; i < getQuantityElementElements(HEIGHT_ELEM); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.height = (HEIGHT_ELEM / 2) + 'px';
        line.style.top = (i * HEIGHT_ELEM) + 'px';
        line.y = i * HEIGHT_ELEM;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElementElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
        enemy.classList.add('enemy');
        enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
        gameArea.appendChild(enemy);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - HEIGHT_ELEM / 2)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./image/enemy${randomEnemy}.png) center / cover no-repeat`;
        
    }
    setting.score = 0;
    setting.start = true;  
    gameArea.appendChild(car);
    gameArea.append(audio);
    car.style.left = (gameArea.offsetWidth - car.offsetWidth) / 2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = line.y + 'px';
        if(line.y >= gameArea.offsetHeight) {
            line.y = -HEIGHT_ELEM;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&
            carRect.bottom >= enemyRect.top &&
            carRect.left <= enemyRect.right &&
            carRect.right >= enemyRect.left) {
                setting.start = false;
                start.classList.remove('hide');
                audio.remove();
                start.style.top = score.offsetHeight;
                addLocalStorage();
            }
        item.y += setting.speed / 2;
        
        if (item.y >= gameArea.offsetHeight) {
            item.y = -HEIGHT_ELEM * setting.traffic;
            do {

            } while ([...enemy].every(elem => item.style.left !== elem.style.left < elem.offsetWidth &&
                elem.style.left > elem.offsetWidth))
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - item.offsetWidth)) + 'px';
        }

        item.style.top = item.y + 'px';
    });
    
}

function playGame(){
    moveRoad();
    moveEnemy();
    if (setting.start) {
        setting.score += setting.speed;
        score.textContent = 'score:' + setting.score;
        if(keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }
        if(keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    } 
}

function startRun(evt) {   
    if(keys.hasOwnProperty(evt.key)) {
        evt.preventDefault();
        keys[evt.key] = true;
    }
}

function stopRun(evt) {  
    if (keys.hasOwnProperty(evt.key)) {
        evt.preventDefault();
        keys[evt.key] = false;
    }
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
