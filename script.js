class Game {
  SPEED = 2000

  constructor(onGameOver) {
    this.gameLoopInterval = setInterval(() => this.gameLoop(), this.SPEED)
    this.timerInterval = setInterval(() => this.timer(), 1000)

    this.currentHoleID = null
    this.currentTime = 60
    this.molesWhacked = 0
    this.hits = 0

    this.holes = document.querySelectorAll('[data-id]')
    this.holes.forEach((hole) => {
      hole.addEventListener('click', () => this.whack(hole))
    })

    this.molesWhackedEl = document.querySelector('.molesWhacked b')
    this.timeLeftEl = document.querySelector('.timeLeft b')

    this.onGameOver = onGameOver
  }

  whack(hole) {
    let whackedHoleID = hole.dataset.id

    this.hits++

    return this.evalWhack(whackedHoleID)
  }

  removeAllMoles() {
    this.currentHoleID = null
    this.holes.forEach((hole) => hole.classList.remove('mole'))
  }

  animateAMole(holeID) {
    const el = document.querySelector(`[data-id="${holeID}"`)

    // Animationend hit
    el.onanimationend = function () {
      this.classList.remove('mole', 'hit')

      // Animationend fadeBack
      this.onanimationend = function () {
        this.classList.remove('fadeBack')
        this.onanimationend = null
      }

      this.classList.add('fadeBack')
    }

    el.classList.add('hit')
    this.currentHoleID = null
  }

  popUp() {
    this.removeAllMoles()

    let randomID = Math.floor(Math.random() * this.holes.length)

    this.currentHoleID = randomID

    let el = document.querySelector(`[data-id="${randomID}"]`)
    el.classList.add('mole')
  }

  evalWhack(whackedHoleID) {
    if (Number(whackedHoleID) !== this.currentHoleID) return

    this.updateScore()

    this.animateAMole(this.currentHoleID)
  }

  updateScore() {
    this.molesWhacked++

    this.molesWhackedEl.innerText = this.molesWhacked
  }

  updateTime() {
    this.currentTime--

    this.timeLeftEl.innerText = this.currentTime + 's'

    if (this.currentTime > 0) return // Time's not up yet!

    // Game over!
    this.removeAllMoles()

    clearInterval(this.timerInterval)
    clearInterval(this.gameLoopInterval)

    this.onGameOver()
  }

  gameLoop() {
    // Mullvad ska bli synlig.
    this.popUp()
  }

  timer() {
    // Här ska vi räkna ner tiden.
    this.updateTime()
  }
}

let game = new Game(onGameOver)

function onGameOver () {
  alert(`Time's out! You whacked ${game.molesWhacked} moles in ${game.hits} hits.`)

  // Go again?
  const goAgainBool = confirm('Go again?')

  if (!goAgainBool) return // We're done here!

  // New game!
  game = new Game(onGameOver)
}
