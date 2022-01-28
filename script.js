class Game {
  // Public Class Field Declarations - Stage 4 TC39
  // Support: https://github.com/tc39/proposal-class-fields#implementations
  SPEED = 2000

  currentHoleID = null
  currentTime = 60
  molesWhacked = 0
  hits = 0

  gameLoopInterval = setInterval(() => this.popUp(), this.SPEED)
  timerInterval = setInterval(() => this.updateTime(), 1000)

  holes = document.querySelectorAll('[data-id]')
  molesWhackedEl = document.querySelector('.molesWhacked b')
  timeLeftEl = document.querySelector('.timeLeft b')

  constructor(onGameOver) {
    this.onGameOver = onGameOver
    
    this.timeLeftEl.innerText = this.currentTime + 's'
    this.molesWhackedEl.innerText = this.molesWhacked

    this.holes.forEach((hole) => {
      hole.addEventListener('click', () => this.evalWhack(hole))
    })
  }

  removeAllMoles() {
    this.currentHoleID = null
    this.holes.forEach((hole) => hole.classList.remove('mole'))
  }

  animateTheMole() {
    const holeEl = document.querySelector(`[data-id="${this.currentHoleID}"`)

    // animationend hit
    holeEl.onanimationend = function () {
      this.classList.remove('mole', 'hit')

      // animationend fadeBack
      this.onanimationend = function () {
        this.classList.remove('fadeBack')
        this.onanimationend = null
      }

      this.classList.add('fadeBack')
    }

    holeEl.classList.add('hit')
    this.currentHoleID = null
  }

  popUp() {
    this.removeAllMoles()

    const randomID = Math.floor(Math.random() * this.holes.length)

    this.currentHoleID = randomID

    const holeEl = document.querySelector(`[data-id="${randomID}"]`)
    holeEl.classList.add('mole')
  }

  evalWhack(hole) {
    const whackedHoleID = Number(hole.dataset.id)

    this.hits++

    if (whackedHoleID !== this.currentHoleID) return

    this.updateScore()

    this.animateTheMole()
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
