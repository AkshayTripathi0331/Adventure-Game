document.addEventListener("DOMContentLoaded", () => {
    const player = document.getElementById("player");
    const gameContainer = document.getElementById("game-container");
    let playerBottom = 0;
    let gravity = 2;
    let isGameOver = false;

    function createObstacle() {
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
        obstacle.style.left = "800px";
        obstacle.style.bottom = Math.random() * 300 + "px";
        gameContainer.appendChild(obstacle);
        moveObstacle(obstacle);
    }

    function moveObstacle(obstacle) {
        let obstacleLeft = parseInt(
            window.getComputedStyle(obstacle).getPropertyValue("left")
        );

        const obstacleMoveInterval = setInterval(() => {
            if (obstacleLeft <= 0) {
                clearInterval(obstacleMoveInterval);
                gameContainer.removeChild(obstacle);
            }

            if (
                obstacleLeft > 0 &&
                obstacleLeft < 100 &&
                playerBottom < parseInt(
                    window.getComputedStyle(obstacle).getPropertyValue("bottom")
                ) + 40 &&
                playerBottom + 50 > parseInt(
                    window.getComputedStyle(obstacle).getPropertyValue("bottom")
                )
            ) {
                gameOver();
                clearInterval(obstacleMoveInterval);
            }

            obstacleLeft -= 10;
            obstacle.style.left = obstacleLeft + "px";
        }, 20);
    }

    function jump() {
        if (playerBottom < 200) {
            playerBottom += 50;
        }
        player.style.bottom = playerBottom + "px";
    }

    function applyGravity() {
        if (playerBottom > 0) {
            playerBottom -= gravity;
        }
        player.style.bottom = playerBottom + "px";
    }

    function control(e) {
        if ((e.keyCode === 32 || e.keyCode === 38) && !isGameOver) {
            jump();
        }
    }

    function gameOver() {
        isGameOver = true;
        alert("Game Over");
        // You can perform additional actions here, like restarting the game.
    }

    document.addEventListener("keydown", control);

    function gameLoop() {
        if (!isGameOver) {
            applyGravity();

            if (Math.random() < 0.05) {
                createObstacle();
            }
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
