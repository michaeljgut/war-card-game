$(function(){
  const warGame = {
    suits: ['clubs','hearts','spades','diamonds'],
    values: ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    card: {
      suit: '',
      value: ''
    },
    currentPlayer: '1',
    saveCurrentPlayer: '',
    timesPressed: 0,
    saveTimesPressed: 0,
    player1Card: '',
    player2Card: '',
    gameState: '',
    deck: [],
    player1Stack: [],
    player2Stack: [],
    warStack: [],
    warWinner: '',
    buildDeck: function() {
      console.log(this.suits);
        for (var i=0; i < this.values.length; i++) {
          for (var j=0; j< this.suits.length; j++) {
          this.deck.push({suit: this.suits[j], value: this.values[i]});
          }
        }
    },
    shuffleDeck: function() {
      for (let i = this.deck.length-1; i > 0; i--) {
        let x = Math.floor(Math.random()*i);
        temp = this.deck[x];
        this.deck[x]=this.deck[i];
        this.deck[i]=temp;
      }
    },
    splitDeck: function() {
      this.player1Stack = this.deck.slice(0,26);
      this.player2Stack = this.deck.slice(26);
    },
    splitDeckTest: function() {
//      while (this.deck.length) {
        this.player1Stack.push(this.deck.pop());
        this.player2Stack.push(this.deck.pop());
//      }
      this.player1Stack = this.deck.slice(0,25);
      this.player2Stack = this.deck.slice(25);
        this.player1Stack.unshift(this.deck.pop());
        this.player2Stack.unshift(this.deck.pop());
    },
    getWordValue: function(playerCard) {
      switch(playerCard.value) {
        case 'J':
          return 'jack';
        case 'Q':
          return 'queen';
        case 'K':
          return 'king';
        case 'A':
          return 'ace';
        default:
          return playerCard.value;
      }
    },
    getNextCard: function(player) {
      if ('1' === player) {
        if (this.player1Stack.length) {
          return this.player1Stack.shift();
        } else {
          if (this.player2Stack.length) {
            this.warWinner = '2';
            this.gameState = 'win';
            return null;
          } else {
            this.gameState = 'draw';
            return null;
          }
        }
      } else {
        if (this.player2Stack.length) {
          return this.player2Stack.shift();
        } else {
          if (this.player1Stack.length) {
            this.warWinner = '1';
            this.gameState = 'win';
            return null;
          } else {
            this.gameState = 'draw';
            return null;
          }
        }
      }
    },
    war: function() {
      warGame.gameState = 'war';
      warGame.saveTimesPressed = warGame.timesPressed;
      warGame.timesPressed = 0;
      warGame.saveCurrentPlayer = warGame.currentPlayer;
      warGame.currentPlayer = '1';
      warGame.nextTurn();
    },
    gameOver: function() {
      if ('win' === this.gameState) {
        result = 'Game Over, Player' + this.warWinner + ' Has Won!';
      } else {
        result = 'Draw! Game Over!';
      }
      $('#result').text(result);
    },
    nextTurn: function() {
      debugger;
      if (('win' === this.gameState) || ('draw' === this.gameState)) {
        alert('Illegal move, game over!');
      }
      warGame.timesPressed++;
      let imgName = '';
      let rank1 = 0;
      let rank2 = 0;
      if ('war' === warGame.gameState) {
        $('#player1-secondary-card').show();
        $('#player2-secondary-card').show();
      } else {
        $('#player1-secondary-card').hide();
        $('#player2-secondary-card').hide();
      }
      if (3 === warGame.timesPressed) {
        let imgName = 'images/back.png';
        if ('war' === warGame.gameState) {
          $('#player1-secondary-card').attr('src',imgName);
          $('#player2-secondary-card').attr('src',imgName);
          $('#player1-main-card').attr('src',imgName);
          $('#player2-main-card').attr('src',imgName);
          // $('#player1-secondary-card').hide();
          // $('#player2-secondary-card').hide();
          warGame.gameState = '';
          while (warGame.warStack.length) {
            warGame.player1Card = warGame.warStack.pop();
            warGame.player2Card = warGame.warStack.pop();
            if (warWinner === '1') {
              warGame.player1Stack.push(warGame.player1Card,warGame.player2Card);
            } else {
              warGame.player2Stack.push(warGame.player1Card,warGame.player2Card);
            }
          }
        } else {
          $('#player1-main-card').attr('src',imgName);
          $('#player2-main-card').attr('src',imgName);
        }
        $('#player2-score').text(warGame.player2Stack.length);
        $('#player1-score').text(warGame.player1Stack.length);
        $('#player-turn').text(warGame.currentPlayer);
        warGame.currentPlayer = '1';
        warGame.timesPressed = 0;
        return;
      }
      if ('1' === warGame.currentPlayer) {
        warGame.player1Card = warGame.getNextCard(this.currentPlayer);
        if (this.player1Card === null) {
          this.gameOver();
          return;
        }
        wordValue = warGame.getWordValue(warGame.player1Card);
        imgName = 'images/' + wordValue + '_of_' + warGame.player1Card.suit + '.png';
        if ('war' === warGame.gameState) {
          $('#player1-secondary-card').attr('src',imgName);
        }
        else {
          $('#player1-main-card').attr('src',imgName);
        }
      } else {
        warGame.player2Card = warGame.getNextCard(this.currentPlayer);
        if (this.player2Card === null) {
          this.gameOver();
          return;
        }
        wordValue = warGame.getWordValue(warGame.player2Card);
        imgName = 'images/' + wordValue + '_of_' + warGame.player2Card.suit + '.png';
        if ('war' === warGame.gameState) {
          $('#player2-secondary-card').attr('src',imgName);
        }
        else {
          $('#player2-main-card').attr('src',imgName);
        }
      }
      //$('#player1-secondary-card').attr('src',imgName);
      if ('2' === warGame.currentPlayer){
        rank1 = warGame.values.indexOf(warGame.player1Card.value);
        rank2 = warGame.values.indexOf(warGame.player2Card.value);
        if (rank1 > rank2) {
          warGame.player1Stack.push(warGame.player1Card,warGame.player2Card);
          warWinner = '1';
          if (('war' === warGame.gameState) && ('3' === warGame.timesPressed)){
            warGame.timesPressed = warGame.saveTimesPressed;
            warGame.currentPlayer = warGame.saveCurrentPlayer;
            warGame.gameState = '';
            imgName = 'images/back.png';
            $('#player1-secondary-card').attr('src',imgName);
            $('#player2-secondary-card').attr('src',imgName);
          }
        }
        else if (rank1 < rank2) {
          warGame.player2Stack.push(warGame.player1Card,warGame.player2Card);
          warWinner = '2';
          if (('war' === warGame.gameState) && ('3' === warGame.timesPressed)){
            warGame.timesPressed = warGame.saveTimesPressed;
            warGame.currentPlayer = warGame.saveCurrentPlayer;
            warGame.gameState = '';
            imgName = 'images/back.png';
            $('#player1-secondary-card').attr('src',imgName);
            $('#player2-secondary-card').attr('src',imgName);
          }
        } else {
          warGame.warStack.push(warGame.player1Card,warGame.player2Card)
          warGame.player1Card = this.getNextCard('1');
          if (this.player1Card === null) {
            this.gameOver();
            return;
          }
          warGame.player2Card = this.getNextCard('2');
          if (this.player2Card === null) {
            this.gameOver();
            return;
          }
          warGame.warStack.push(warGame.player1Card,warGame.player2Card)
          warGame.war();
        }
        if ('war' !== warGame.gameState) {
          warGame.currentPlayer = '1';
        }
      }
      else {
        warGame.currentPlayer = '2';
      }
      let resultText = 'It\'s Player' + this.currentPlayer + '\'s Turn';
      $('#result').text(resultText);
      //$('#player2-secondary-card').attr('src',imgName);
    },
    newGame: () => {
      console.log('In newGame');
//      console.log(this);
      warGame.currentPlayer = '1',
      warGame.timesPressed = 0;
      warGame.gameState = '';
      warGame.player1Stack = [];
      warGame.player2Stack = [];
      warGame.deck = [];
      warGame.buildDeck();
//      this.shuffleDeck();
      warGame.splitDeckTest();
      $('#player2-score').text(warGame.player2Stack.length);
      $('#player1-score').text(warGame.player1Stack.length);
      let resultText = 'It\'s Player' + warGame.currentPlayer + '\'s Turn';
      $('#result').text(resultText);
      let imgName = 'images/back.png';
      $('#player1-secondary-card').attr('src',imgName);
      $('#player2-secondary-card').attr('src',imgName);
      $('#player1-main-card').attr('src',imgName);
      $('#player2-main-card').attr('src',imgName);
    },
    start: function() {
      console.log('In init');
      $('#player1-secondary-card').hide();
      $('#player2-secondary-card').hide();
      $('#next-turn').click(this.nextTurn.bind(warGame));
      $('#new-game').click(this.newGame.bind(warGame));
      this.buildDeck();
//      this.shuffleDeck();
      this.splitDeckTest();
      $('#player2-score').text(warGame.player2Stack.length);
      $('#player1-score').text(warGame.player1Stack.length);
      let resultText = 'It\'s Player' + this.currentPlayer + '\'s Turn';
      $('#result').text(resultText);
    }
    // let $gameBoard = $('<div id="game-board"></div>');
    // $gameBoard.appendTo('body');
    // let $player1DownCard = $('<img src="images/back.png" id="player1-down-card"/>');
    // $player1DownCard.appendTo('div');
    // let $player2DownCard = $('<img src="images/back.png" id="player2-down-card"/>');
    // $player2DownCard.appendTo('div');
  }
  warGame.start();
  console.log(warGame);
});
