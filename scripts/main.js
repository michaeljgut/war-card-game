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
    gameState: 'regular',

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

    /**
      * getNextCard will get the next card from player's stack. If the stack is empty it returns null. Otherwise it
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

    // function gameOver will determine whether the game was won or ended in a draw and display a text message
    gameOver: function() {
      if ('win' === this.gameState) {
        result = 'Game Over, Player' + this.warWinner + ' Has Won!';
      } else {
        result = 'Draw! Game Over!';
      }
      $('#result').text(result);
    },

    /**
      * nextTurn is called when the Next Turn button is clicked. It will check who's turn it is and turn over that player's card.
      * If the game is in the war state, then the player's secondary card is turned over. If it is player 2's turn, then after
      * their card is turned over player 1 and player 2's cards are compared to see who's card has a higher rank. The winner gets
      * both cards added to the bottom of their stack. The next turn button must be clicked a third time to display the results
      * of the comparison and to display the next 2 cards face down. The winner's score will increase by 2 and the loser's
      * score will decrease by 2 on the third click. Clicking Next Turn again will repeat the process. If both player's cards have
      * the same rank, then the gameState is set to war. The current cards are placed on the war stack. Then a card is retrieved
      * from each player's stack and pushed on the war stack. Then play resumes like normal as each player must click the Next Turn
      * button to see the next card from their stack. These cards are then compared and the winner gets all  of the cards on the
      * war stack. If these 2 cards are also the same rank then the process repeats until one player wins the comparison or runs out
      * of cards. If both players run out of cards at the same time this is called a draw.
    */
    nextTurn: function() {
      debugger;
      // Check if the game is over, then New Game button must be clicked.
      if (('win' === this.gameState) || ('draw' === this.gameState)) {
        alert('Illegal move, game over!');
        return;
      }
      this.timesPressed++;

      // imgName will hold the file name of the card to be displayed
      let imgName = '';

      // rank1 is the rank of player1's current card
      let rank1 = 0;

      // rank2 is the rank of player2's current card
      let rank2 = 0;

      // Only display the secondary cards when the gameState is war
      if ('war' === this.gameState || 'afterWar' === this.gameState) {
        $('#player1-secondary-card').show();
        $('#player2-secondary-card').show();
      } else {
        $('#player1-secondary-card').hide();
        $('#player2-secondary-card').hide();
      }

      /**
        * When the Next Turn button is pressed 3 consecutive times, show the backs of the cards and update the player's score by
        * checking the length of their respective stacks. If it's the war state, show the backs of the secondary cards. If the
        * game state is after war then show the backs of all the cards and then hide the secondary cards since they are no longer
        * needed and then reset the game state to regular.
        */
      if (3 === this.timesPressed) {
        imgName = 'images/back.png';
        if ('war' === this.gameState) {
          $('#player1-secondary-card').attr('src',imgName);
          $('#player2-secondary-card').attr('src',imgName);
        } else if ('afterWar' === this.gameState) {
          $('#player1-main-card').attr('src',imgName);
          $('#player2-main-card').attr('src',imgName);
          $('#player1-secondary-card').attr('src',imgName);
          $('#player2-secondary-card').attr('src',imgName);
          $('#player1-secondary-card').hide();
          $('#player2-secondary-card').hide();
          this.gameState = 'regular';
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
      } // if 3 times pressed

      // Display player1 or player2's card. Check if there are no more cards in either player's stack first.
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

      /**
        * Compare the cards if it's player2's turn, since both cards are now in play. Depending on who has the higher card, put
        * both cards on the winning player's stack. If the ranks are equal, go into the war state. Place the current cards onto
        * the war stack along with the next 2 cards from each player's stack. The war stack is necessary because we still don't
        * know who will win this war.
        */
      if ('2' === this.currentPlayer){
        rank1 = this.values.indexOf(this.player1Card.value);
        rank2 = this.values.indexOf(this.player2Card.value);
        if (rank1 > rank2) {
          this.player1Stack.push(this.player1Card,this.player2Card);
          warWinner = '1';
          if ('war' === this.gameState) {
            while (this.warStack.length) {
              this.player1Card = this.warStack.pop();
              this.player2Card = this.warStack.pop();
              this.player1Stack.push(this.player1Card,this.player2Card);
            }
            this.currentPlayer = '1';
            this.gameState = 'afterWar';
          }
        }
        else if (rank1 < rank2) {
          this.player2Stack.push(this.player1Card,this.player2Card);
          warWinner = '2';
          if ('war' === this.gameState) {
            while (this.warStack.length) {
              this.player1Card = this.warStack.pop();
              this.player2Card = this.warStack.pop();
              this.player2Stack.push(this.player1Card,this.player2Card);
            }
            this.currentPlayer = '1';
            this.gameState = 'afterWar';
          }
        } else { // war
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
          // Set the gameState to war
          this.gameState = 'war';
        }
        this.currentPlayer = '1';
      }
      else {
        this.currentPlayer = '2';
      }
      let resultText = 'It\'s Player' + this.currentPlayer + '\'s Turn';
      $('#result').text(resultText);
    },
    /**
      * The newGame function is called when the New Game button is clicked. It will re-initialize the warGame fields and then
      * reshuffle and split the deck.
      */
    newGame: function() {
      this.currentPlayer = '1',
      this.timesPressed = 0;
      this.gameState = 'regular';
      this.player1Stack = [];
      this.player2Stack = [];
      this.warStack = [];
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
    /**
      * The start function will hide the secondary cards since they are only needed in the war state. It will set up the event
      * listeners, build, shuffle and split the deck, then display the number of cards in each player's stack and give a message
      * as to who's turn it is.
      */
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
