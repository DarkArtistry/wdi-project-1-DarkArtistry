  document.addEventListener('DOMContentLoaded', function () {

    var bgmusic = document.querySelectorAll('audio')

    bgmusic[0].play()

    var canvas = document.querySelector('#canvas')
    var ctx = canvas.getContext('2d')
    var speed = 300
    var ballRadius = 13
    var then = Date.now()
    var delta = 0

    // introduction n end
    var intro = document.querySelector('.introwrapper')
    var start = document.querySelector('#start')
    start.addEventListener('click', function () {
      canvas.style.display = 'block'
      intro.style.display = 'none'
      update()
    })
    var win1 = document.querySelector('#win1')
    var win2 = document.querySelector('#win2')
    var retry = document.querySelectorAll('.retry')

    retry[0].addEventListener('click', function () {
      canvas.style.display = 'block'
      win1.style.display = 'none'
      ballRadius = 13
    })

    retry[1].addEventListener('click', function () {
      canvas.style.display = 'block'
      win2.style.display = 'none'
      ballRadius = 13
    })

    // event listener
    var keysDown = {}
    document.addEventListener('keydown', function (e) {
      keysDown[e.key] = e.code
      // console.log(keysDown[e.key])

      // console.log(game.auto.y)
    })

    document.addEventListener('keyup', function (e) {
      delete keysDown[e.key]

      // console.log(keysDown[e.key])
    })
    function Autobots (img, x, y) {
      // console.log('autobots', this)
      this.img = img
      this.x = x
      this.y = y
    }

    function Decepticons (img, x, y) {
      Autobots.call(this, img, x, y)
      this.img = img
      this.x = x
      this.y = y
    }

    Autobots.prototype.limit = function () {
      if (this.x < 0) {
        this.x = 0
      }
      if (this.x > canvas.width - 50) {
        this.x = canvas.width - 50
      }
      if (this.y < 0) {
        this.y = 0
      }
      if (this.y > canvas.height - 50) {
        this.y = canvas.height - 50
      }
    }

    // Autobots.prototype.rebound = function () {
    //
    //   if (game.auto.x <= game.decep.x - 25 && game.auto.x >= game.decep.x + 25 && game.auto.y <= game.decep.y - 25 && game.auto.y >= game.decep.y + 25) {
    //     game.auto.x += 8
    //     game.auto.y += 8
    //     game.decep.x += 8
    //     game.decep.y += 8
    //   }
    // }

    Autobots.prototype.draw = function () {
      var image = createImage(this.img)
      ctx.drawImage(image, this.x, this.y)
    }

    function createImage (hero) {
      if (hero === 'OptimusP.gif') {
        return document.querySelector('#OP')
      }
      if (hero === 'Starscream.gif') {
        return document.querySelector('#SS')
      }
    }

    Decepticons.prototype = Object.create(Autobots.prototype)

    function Ball (x, y, radius, start, end) {
      this.speedX = 8
      this.speedY = -8
      this.x = x
      this.y = y
      this.radius = radius
      this.start = start
      this.end = end
    }

    // game constructor
    function Dodge () {
      this.auto = new Autobots('OptimusP.gif', canvas.width / 3, canvas.height / 3)
      this.decep = new Decepticons('Starscream.gif', (canvas.width / 3) * 2, (canvas.height / 3) * 2)
      // console.log('dodge', this.decep)
      this.ballArray = []
    }

    Dodge.prototype.createBall = function () {
      var newBall = new Ball(Math.random() * canvas.width + ballRadius, Math.random() * canvas.height + ballRadius, ballRadius, 0, Math.PI * 2)

      this.ballArray.push(newBall)
    }
    // console.log(ctx);

    Ball.prototype.throw = function () {
      this.x += this.speedX
      this.y += this.speedY
      if (this.x + this.speedX < 0 || this.x + this.speedX + ballRadius > canvas.width) {
        this.speedX = -this.speedX
      }

      if (this.y + this.speedY - ballRadius < 0 || this.y + this.speedY + ballRadius > canvas.height) {
        this.speedY = -this.speedY
      }
    }

    function ballColor () {
      return 'rgb(' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ', ' + Math.floor(Math.random() * 255) + ')'
    }

    function move () {
      if ('w' in keysDown) {
        game.auto.y -= speed * (delta / 1000)
      }
      if ('s' in keysDown) {
        game.auto.y += speed * (delta / 1000)
      }
      if ('a' in keysDown) {
        game.auto.x -= speed * (delta / 1000)
      }
      if ('d' in keysDown) {
        game.auto.x += speed * (delta / 1000)
      }
      if ('ArrowUp' in keysDown) {
        game.decep.y -= speed * (delta / 1000)
      }
      if ('ArrowDown' in keysDown) {
        game.decep.y += speed * (delta / 1000)
      }
      if ('ArrowLeft' in keysDown) {
        game.decep.x -= speed * (delta / 1000)
      }
      if ('ArrowRight' in keysDown) {
        game.decep.x += speed * (delta / 1000)
      }
    }

    function update () {
      var now = Date.now()
      delta = now - then
      move()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      game.auto.draw()
      game.decep.draw()
      game.auto.limit()
      game.decep.limit()
      // game.auto.rebound()
      // game.decep.rebound()
      game.ballArray.forEach(function (ball) {
        ball.throw()
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.radius, ball.start, ball.end)
        ctx.fillStyle = ballColor()
        ctx.fill()
      })
      canvas.style.borderColor = ballColor()
      collisionDetection()
      then = now
      requestAnimationFrame(update)

      // console.log(game.auto)
    }

    function collisionDetection () {
      game.ballArray.forEach(function (ball) {
        if (ball.x >= game.auto.x - 25 && ball.x <= game.auto.x + 25 && ball.y <= game.auto.x + 25 && ball.y >= game.auto.y - 25) {
          canvas.style.display = 'none'
          win2.style.display = 'block'
          game.ballArray = []

        } if (ball.x >= game.decep.x - 25 && ball.x <= game.decep.x + 25 && ball.y <= game.decep.y + 25 && ball.y >= game.decep.y -25) {
          canvas.style.display = 'none'
          win1.style.display = 'block'
          game.ballArray = []
        }
      })
    }

    var game = new Dodge()

    for (var i = 0; i < 1; i++) {
      game.createBall()
    }

    setInterval(function () {
      ballRadius+= 2
      game.createBall()
    }, 5000)
  })
