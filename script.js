// Globala variabler
let SPEED = 2000

let gameLoopInterval = setInterval(gameLoop, SPEED)
let timerInterval = setInterval(timer, 1000)

const holes = document.querySelectorAll('[data-id]')

// Ett object med default värden.
let _Game = {
  currentHole: null,
  currentTime: 60,
  molesWhacked: 0,
  hits: 0,
}

let Game = {
  currentHoleID: _Game.currentHole, // *
  currentTime: _Game.currentTime, // *
  molesWhacked: _Game.molesWhacked, // *
  hits: _Game.hits, // *

  // *
  whack(hole) {
    let whackedHoleID = hole.dataset.id

    this.hits++

    return this.evalWhack(whackedHoleID)
  },

  // *
  removeAllMoles() {
    this.currentHoleID = null
    holes.forEach((hole) => hole.classList.remove('mole'))
  },

  // *
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
  },

  popUp() {
    this.removeAllMoles()

    let randomID = Math.floor(Math.random() * holes.length)

    this.currentHoleID = randomID

    let el = document.querySelector(`[data-id="${randomID}"]`)
    el.classList.add('mole')
  },

  // *
  evalWhack(whackedHoleID) {
    if (Number(whackedHoleID) !== this.currentHoleID) return

    this.updateScore()

    this.animateAMole(this.currentHoleID)
  },

  updateScore() {
    this.molesWhacked++

    document.querySelector('.molesWhacked b').innerText = this.molesWhacked
  },

  // *
  updateTime() {
    this.currentTime--

    document.querySelector('.timeLeft b').innerText = this.currentTime + 's'

    if (this.currentTime <= 0) {
      // Game over
      this.removeAllMoles()

      clearInterval(timerInterval)
      clearInterval(gameLoopInterval)

      // GG!
      alert(`Time's out! You whacked ${this.molesWhacked} moles in ${this.hits} hits.`)

      // Go again?
      const goAgainBool = confirm('Go again?')

      if (goAgainBool) {
        Game = { ...Game, ..._Game }
        timerInterval = setInterval(timer, 1000)
        gameLoopInterval = setInterval(gameLoop, SPEED)
      }
    }
  }
}

// *
holes.forEach((hole) => {
  hole.addEventListener('click', () => Game.whack(hole))
})

function gameLoop() {
  // Mullvad ska bli synlig.
  Game.popUp()
}

function timer() {
  // Här ska vi räkna ner tiden.
  Game.updateTime()
}
