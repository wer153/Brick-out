var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var x = canvas.width/2;
    var y = canvas.height-30;
    var dx = 2;
    var dy = -3;
    var ballRadius = 10;
    var ballColor = "#0095DD";
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;
    var bottomMargin = 10;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var maxScore = 0;
    var lives = 3;
    var brickColor = "#0095DD"
    var newColor = "#3F51B5"
    var defaultColor = "#0095DD"

    var bricks = [];
    for(var c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(var r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
            maxScore+=1;
        }
    }

    for(var c=0; c<brickColumnCount; c++) {
      obj = bricks[c][0]
      obj.status += 1 ;
      maxScore+=1;
    }
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e)
    {
      if(e.keyCode == 39)
      {
        rightPressed = true;
      }
      else if(e.keyCode == 37){
        leftPressed = true;
      }
    }
    function keyUpHandler(e)
    {
      if(e.keyCode == 39)
      {
        rightPressed = false;
      }
      else if(e.keyCode == 37){
        leftPressed = false;
      }
    }
    function mouseMoveHandler(e)
    {
      var relativeX = e.clientX - canvas.offsetLeft;
      if(relativeX > 0 && relativeX < canvas.width)
      {
        paddleX = relativeX - paddleWidth/2;
      }
    }

    function finishGame(msg)
    {
      alert(msg)
      document.location.reload();
      clearInterval(interval);
    }
    function drawScore()
    {
      ctx.font = "16px Arial";
      ctx.fillStyle = defaultColor;
      ctx.fillText("Score: "+score, 8, 20);
    }
    function drawLives()
    {
      ctx.font = "16px Arial";
      ctx.fillStyle = defaultColor;
      ctx.fillText("Lives: "+lives, canvas.width-65,20);
    }
    function detectCollision()
    {
      for(var c=0; c<brickColumnCount; c++)
      {
        for(var r=0; r<brickRowCount; r++)
        {
          var b = bricks[c][r];
          if(b.status >= 1)
          {
            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight)
            {
              dy = -dy;
              b.status -= 1;
              score += 1;
              if(score == maxScore)
              {
                finishGame("YOU WIN, CONGRATULATIONS!")
              }
            }
          }
        }
      }
    }
    function drawBricks()
    {
      for(var c=0; c<brickColumnCount; c++)
      {
        for(var r=0; r<brickRowCount; r++)
        {
          if(bricks[c][r].status >=1)
          {
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            if(bricks[c][r].status >1)
            {
              brickColor = newColor;
            }
            else
            {
              brickColor = defaultColor;
            }
            ctx.fillStyle = brickColor;
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }
    function drawPaddle()
    {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height-bottomMargin-paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = defaultColor;
      ctx.fill();
      ctx.closePath();
    }
    function changeBallColor()
    {
      ballColor = "#"+Math.round(Math.random() * 0xFFFFFF ).toString(16)
    }

    function drawBall()
    {
      ctx.beginPath();
      ctx.arc(x,y,ballRadius,0,Math.PI*2);
      ctx.fillStyle = ballColor;
      ctx.fill();
      ctx.closePath();
    }

    function draw()
    {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      detectCollision();

      if(y + dy < ballRadius)
      {
          dy = -dy;
          changeBallColor()
      }
      else if(y + dy > canvas.height-ballRadius-bottomMargin)
      {
          if(x > paddleX && x < paddleX + paddleWidth)
          {
              dy = -dy;
              changeBallColor()
          }
          else
          {
            lives--;
            if(lives==0)
            {
              finishGame("GAME OVER");
            }
            else {
              {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
              }
            }
          }
      }

      if(x + dx < ballRadius || x + dx > canvas.width-ballRadius )
      {
        dx = -dx
        changeBallColor()
      }

      if(rightPressed && paddleX < canvas.width-paddleWidth)
      {
        paddleX += 4;
      }
      else if(leftPressed && paddleX > 0)
      {
        paddleX -= 4;
      }
      x += dx;
      y += dy;
    }

    var interval = setInterval(draw,10);