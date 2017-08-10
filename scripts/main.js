$(function(){
  const warGame = {
    suits: ['clubs','hearts','spades','diamonds'],
    values: ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    card: {
      suit: '',
      value: ''
    },
    deck: [],
    player1Stack: [],
    player2Stack: [],
    buildDeck: function() {
      console.log(this.suits);
        for (var i=0; i < this.suits.length; i++) {
          for (var j=0; j< this.values.length; j++) {
          this.deck.push({suit: this.suits[i], value: this.values[j]});
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
    nextTurn: function() {
      let player1Card = warGame.player1Stack.pop();
      let player2Card = warGame.player2Stack.pop();
      switch(player1Card.value) {
        case 'J':
          wordValue = 'jack';
          break;
        case 'Q':
          wordValue = 'queen';
          break;
        case 'K':
          wordValue = 'king';
          break;
        case 'A':
          wordValue = 'ace';
          break;
        default:
          wordValue = player1Card.value;
      }
      let imgName = 'images/' + wordValue + '_of_' + player1Card.suit + '.png';
      $('#player1-main-card').attr('src',imgName);
      //$('#player1-secondary-card').attr('src',imgName);
      switch(player2Card.value) {
        case 'J':
          wordValue = 'jack';
          break;
        case 'Q':
          wordValue = 'queen';
          break;
        case 'K':
          wordValue = 'king';
          break;
        case 'A':
          wordValue = 'ace';
          break;
        default:
          wordValue = player2Card.value;
      }
      imgName = 'images/' + wordValue + '_of_' + player2Card.suit + '.png';
      $('#player2-main-card').attr('src',imgName);
      //$('#player2-secondary-card').attr('src',imgName);
    },
    newGame: () => {
      console.log('In newGame');
    },
    start: function() {
      console.log('In init');
      $('#player1-secondary-card').hide();
      $('#player2-secondary-card').hide();
      $('#next-turn').click(this.nextTurn);
      $('#new-game').click(this.newGame);
      this.buildDeck();
      this.shuffleDeck();
      this.splitDeck();
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
