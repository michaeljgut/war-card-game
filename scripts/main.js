/**
  * War Card Game: Uses jquery for DOM manipulation. Will create a deck of cards, shuffle and split the deck, and wait for the next
  * turn button to be pressed. When the next turn button is pressed, player 1's card is displayed. When the next turn button is
  * pressed again player 2's card is displayed. The 2 cards  are then compared. The player with the higher card takes both cards and
  * places them on the bottom of their stack. This continues until one player has no more cards and the other player wins. If both
  * cards have the same rank, this is called the war state. Then each player places one card face down and one card face up. The
  * player with the higher card then takes all 6 cards and places them at the bottom of their stack. If the face up cards are also
  * the same rank then the process continues until the face up cards are of different value and a player wins all the cards in the
  * war stack. When the New Game button is pressed the game starts over. Aces are high.
  */
$(function(){
  const warGame = {
    suits: ['clubs','hearts','spades','diamonds'],
    values: ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    card: {
      suit: '',
      value: ''
    },

    // currentPlayer is used in the header message to determine who's turn it is.
    currentPlayer: '1',

    // timesPressed is used to keep track of how many times the next turn button is pressed
    timesPressed: 0,

    // player!Card is player 1's current card being compared
    player1Card: '',

    // player2Card is player 2's current card being compared
    player2Card: '',

    // gameState is used to determine if the game is in the war state of if the game ended in either a win or a draw
    gameState: '',

    // deck represents the deck of 52 cards
    deck: [],

    // player1Stack is player1's cards remaining
    player1Stack: [],

    // player2Stack is player2's cards remaining
    player2Stack: [],

    // warStack is the cards that were put in play when a war state is reached.
    warStack: [],

    // warWinnder is the winner of the war state and also represents the winner of the game
    warWinner: '',

    // buildDeck creates all 52 cards
    buildDeck: function() {
        for (var i=0; i < this.values.length; i++) {
          for (var j=0; j< this.suits.length; j++) {
          this.deck.push({suit: this.suits[j], value: this.values[i]});
          }
        }
    },

    /** I took this algorithm from this web page:
      * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array and modified it
      * slightly
      */
    shuffleDeck: function() {
      for (let i = this.deck.length-1; i > 0; i--) {
        let x = Math.floor(Math.random()*i);
        temp = this.deck[x];
        this.deck[x]=this.deck[i];
        this.deck[i]=temp;
      }
    },

    // splitDeck splits the shuffled deck of cards into 2 even stacks
    splitDeck: function() {
      this.player1Stack = this.deck.slice(0,26);
      this.player2Stack = this.deck.slice(26);
    },

    // This function converts a cards value into a word used in the name of the image file for that card.
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

    /** getNextCard will get the next card from player's stack. If the stack is empty it returns null. Otherwise it
      * will return the card retrieved.
      */
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

    // function war will set the gameState to war and reset the currentPlayer and timesPressed values
    war: function() {
      this.gameState = 'war';
      this.timesPressed = 0;
      this.currentPlayer = '1';
    },

    // gameOver will determine whether the game was won or ended in a draw and display a text message
    gameOver: function() {
      if ('win' === this.gameState) {
        result = 'Game Over, Player' + this.warWinner + ' Has Won!';
      } else {
        result = 'Draw! Game Over!';
      }
      $('#result').text(result);
    },

    /** nextTurn is called when
    */
    nextTurn: function() {
      if (('win' === this.gameState) || ('draw' === this.gameState)) {
        alert('Illegal move, game over!');
      }
      this.timesPressed++;
      let imgName = '';
      let rank1 = 0;
      let rank2 = 0;
      if ('war' === this.gameState) {
        $('#player1-secondary-card').show();
        $('#player2-secondary-card').show();
      } else {
        $('#player1-secondary-card').hide();
        $('#player2-secondary-card').hide();
      }
      if (3 === this.timesPressed) {
        imgName = 'images/back.png';
        if ('war' === this.gameState) {
          $('#player1-secondary-card').attr('src',imgName);
          $('#player2-secondary-card').attr('src',imgName);
          $('#player1-main-card').attr('src',imgName);
          $('#player2-main-card').attr('src',imgName);
          this.gameState = '';
          while (this.warStack.length) {
            this.player1Card = this.warStack.pop();
            this.player2Card = this.warStack.pop();
            if (warWinner === '1') {
              this.player1Stack.push(this.player1Card,this.player2Card);
            } else {
              this.player2Stack.push(this.player1Card,this.player2Card);
            }
          }
        } else {
          $('#player1-main-card').attr('src',imgName);
          $('#player2-main-card').attr('src',imgName);
        }
        $('#player2-score').text(this.player2Stack.length);
        $('#player1-score').text(this.player1Stack.length);
        $('#player-turn').text(this.currentPlayer);
        this.currentPlayer = '1';
        this.timesPressed = 0;
        return;
      }
      if ('1' === this.currentPlayer) {
        this.player1Card = this.getNextCard(this.currentPlayer);
        if (this.player1Card === null) {
          this.gameOver();
          return;
        }
        wordValue = this.getWordValue(warGame.player1Card);
        imgName = 'images/' + wordValue + '_of_' + this.player1Card.suit + '.png';
        if ('war' === this.gameState) {
          $('#player1-secondary-card').attr('src',imgName);
          imgName = 'images/back.png';
          $('#player2-secondary-card').attr('src',imgName);
        }
        else {
          $('#player1-main-card').attr('src',imgName);
        }
      } else {
        this.player2Card = this.getNextCard(this.currentPlayer);
        if (this.player2Card === null) {
          this.gameOver();
          return;
        }
        wordValue = this.getWordValue(this.player2Card);
        imgName = 'images/' + wordValue + '_of_' + this.player2Card.suit + '.png';
        if ('war' === this.gameState) {
          $('#player2-secondary-card').attr('src',imgName);
        }
        else {
          $('#player2-main-card').attr('src',imgName);
        }
      }
      if ('2' === this.currentPlayer){
        rank1 = this.values.indexOf(this.player1Card.value);
        rank2 = this.values.indexOf(this.player2Card.value);
        if (rank1 > rank2) {
          this.player1Stack.push(this.player1Card,this.player2Card);
          warWinner = '1';
          if ('war' === this.gameState) {
            if ('3' === this.timesPressed){
              this.timesPressed = 0;
              this.currentPlayer = '1';
              this.gameState = '';
              imgName = 'images/back.png';
              $('#player1-secondary-card').attr('src',imgName);
              $('#player2-secondary-card').attr('src',imgName);
              $('#player1-secondary-card').hide();
              $('#player2-secondary-card').hide();
            }
          }
        }
        else if (rank1 < rank2) {
          this.player2Stack.push(this.player1Card,this.player2Card);
          warWinner = '2';
          if ('war' === this.gameState) {
            if ('3' === this.timesPressed){
              this.timesPressed = 0;
              this.currentPlayer = '1';
              this.gameState = '';
              imgName = 'images/back.png';
              $('#player1-secondary-card').attr('src',imgName);
              $('#player2-secondary-card').attr('src',imgName);
              $('#player1-secondary-card').hide();
              $('#player2-secondary-card').hide();
            }
          }
        } else {
          this.warStack.push(this.player1Card,this.player2Card)
          this.player1Card = this.getNextCard('1');
          if (this.player1Card === null) {
            this.gameOver();
            return;
          }
          this.player2Card = this.getNextCard('2');
          if (this.player2Card === null) {
            this.gameOver();
            return;
          }
          this.warStack.push(this.player1Card,this.player2Card)
          this.war();
        }
        this.currentPlayer = '1';
      }
      else {
        this.currentPlayer = '2';
      }
      let resultText = 'It\'s Player' + this.currentPlayer + '\'s Turn';
      $('#result').text(resultText);
    },
    newGame: function() {
      this.currentPlayer = '1',
      this.timesPressed = 0;
      this.gameState = '';
      this.player1Stack = [];
      this.player2Stack = [];
      this.deck = [];
      this.buildDeck();
      this.shuffleDeck();
      this.splitDeck();
      $('#player2-score').text(this.player2Stack.length);
      $('#player1-score').text(this.player1Stack.length);
      let resultText = 'It\'s Player' + this.currentPlayer + '\'s Turn';
      $('#result').text(resultText);
      let imgName = 'images/back.png';
      $('#player1-secondary-card').attr('src',imgName);
      $('#player2-secondary-card').attr('src',imgName);
      $('#player1-main-card').attr('src',imgName);
      $('#player2-main-card').attr('src',imgName);
      $('#player1-secondary-card').hide();
      $('#player2-secondary-card').hide();
    },
    start: function() {
      $('#player1-secondary-card').hide();
      $('#player2-secondary-card').hide();
      $('#next-turn').click(this.nextTurn.bind(warGame));
      $('#new-game').click(this.newGame.bind(warGame));
      this.buildDeck();
      this.shuffleDeck();
      this.splitDeck();
      $('#player2-score').text(warGame.player2Stack.length);
      $('#player1-score').text(warGame.player1Stack.length);
      let resultText = 'It\'s Player' + this.currentPlayer + '\'s Turn';
      $('#result').text(resultText);
    }
  }
  warGame.start();
});
