'use strict';

const game = {
    //Properties
    title: 'Four Score Game',
    players: [],
    isRunning: false,
    scoreboard: $('#scoreboard'),
    gameboard: $('#gameboard'),
    currentScreen: $('.screen'),
    currentPlayer: 0,
    playerOne : '',
    playerTwo: '',
    playerOneScore: 0,
    playerTwoScore: 0,
    noTimer: $('#difficulty-standard'),
    timer: $('#difficulty-timed'),
    gameSquare: $('.grid-square'),
    tiles: [],
    totalTime : 5000,
    timeRemaining : 5000,
    timeoutID: null,
    winSound : document.getElementById('win-sound'),

    //Buttons
    btnSubmit:$('#player-1-info-submit'),
    btnSubmit2:$('#player-2-info-submit'),
    btnStart: $('#start-game'),
    btnPlayAgain: $('#play-again'),
    btnQuit: $('#btn-quit'),
    btnQuit2: $('#quit-2'),
    btnInfo: $('#infoBtn'),
    btnInfo2: $('#infoBtn2'),


    
    //Methods

    //If timed difficulty was chosen and on the game screen, the interval is initiated
    countdownCheck(){
        if(document.getElementById('difficulty-timed').checked && $('#game-screen').is(':visible')){
            game.countdown()
        } 
    },
    //Interval, can be hard reset when quitting out of the end-game screen
    //Click listener to reset interval after a player clicks is below on line 451
    countdown(){
            console.log('timer has started');
            this.timeoutID = setInterval(game.playerTurn, game.totalTime);
            this.btnQuit2.on('click',function(){
                console.log('hard reset of timer')
                clearInterval(game.timeoutID);
            })
    },
    //Get usernames from DOM, assign to game properties
    getName() {
        game.addPlayer();
    },
    //Adds player object to array, creates divs within the parent div of #player-fields
    addPlayer(oPlayer) {
        game.players.push(oPlayer);
        const playerNameDiv = `<div id='player-${game.players.length}-name'>${oPlayer.name}</div>`;
        const playerScoreDiv= `<div id='player-${game.players.length}-score'>${oPlayer.score}</div>`;
        const playerDiv = `<div id="player-${game.players.length}">${playerNameDiv} ${playerScoreDiv}</div>`;
        document.getElementById('player-fields').innerHTML += playerDiv;
    },
    //When game is over, add a point to the winner
    updatePoints(oPlayer) {
        if(game.currentPlayer == 0){
            game.playerOne.scorePoints(1);
        } else if (game.currentPlayer ==1){
            game.playerTwo.scorePoints(1);
        } else {
            console.log('nobody won');
        }
    },

    //Switch screens and hide/show buttons as necessary
    switchScreen(id){
        this.currentScreen.hide();
        $(`#${id}`).show();
        if (id ==='game-screen') {
            this.isRunning = true;
            this.btnInfo.hide();
            this.btnQuit.show();
            this.btnInfo2.show();
        } else {
            this.isRunning= false;
            this.btnQuit.hide();
            this.btnInfo2.hide();
            this.btnInfo.show();
        }
        if (id ==='end-screen') {
            this.btnQuit.hide();
            this.btnInfo.hide();
            this.btnInfo2.show();
        } else if (id==='splash') {
            this.btnInfo.show();
        };
    },
    //Updates the current player's turn in the html
    selectTurn(){
        $('#current-move').html(game.currentPlayer +1);
    },
    //Create gameboard for me to check win conditions in console
    //change function name later
    arrayGameBoard(){
        for (let i = 0; i < 6; i++ ){
            const row = new Array(6);
            row.fill(null);
            game.tiles[i] = row;
            console.log(row);
        };
    },
    // Alternate player turns, is called to switch after every click
    playerTurn(){
        game.currentPlayer = (game.currentPlayer+1)%2;
        $('#current-move').html(game.currentPlayer +1);
    },
    //Updates game board with colours of players, and update game array with 0 or 1 for players
    //First checks if the square has a class of 'taken', if false, adds player-x's colour and number to array
    //If already has 'taken', does nothing and notifies that square is already taken
    gameGrid(event){
            if(!$(this).hasClass('taken')) {
                $(this).addClass(`player${game.currentPlayer+1}colour`);
                $(this).addClass('taken');
                console.log(`Player ${game.currentPlayer+1} chooses this square.`)
                const columnID = $(event.target).parent().data('column');
                const rowID = $(event.target).data('row');
                game.tiles[rowID][columnID] = game.currentPlayer;
                console.log(rowID);
                console.log(columnID);
                // Win/draw checks
                game.rowCheck();
                game.columnCheck();
                game.diagonalCheck(columnID, rowID);
                game.drawCheck();
                // Change player turn
                game.playerTurn();
            } else {
                setTimeout(function(){
                    alert('That square is already taken, choose another square.');
                }, 150)
            };
    },
    //When the game ends, add a point and update the scoreboard
    gameOver(){
        this.winSound.play();
        $('#current-player-move').hide();
        game.updatePoints();
        $('#end-score').append(game.players[0].name + ' ' + game.players[0].score + ' ' + game.players[1].name + ' ' + game.players[1].score);
        $('#player-1-score').html(game.players[0].score);
        $('#player-2-score').html(game.players[1].score);
    },
    //If the players decide to quit while mid-game, no points are awarded and the end-screen info is just shown
    gameQuit(){
        $('#end-score').append(game.players[0].name + ' ' + game.players[0].score + ' ' + game.players[1].name + ' ' + game.players[1].score);
        $('#player-1-score').html(game.players[0].score);
        $('#player-2-score').html(game.players[1].score);
    },
    //Check for four in a row horizontally/across the row
    rowCheck(rowID){
        console.log(game.tiles)
        let inARow = 0;
        for(let i = 0; i<6; i++){
            console.log(game.tiles[0][i])
            if (game.tiles[0][i] === game.currentPlayer) {
                inARow++;
                if (inARow === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inARow = 0;
                }
            };
        for(let i = 0; i<6; i++) {
            if (game.tiles[1][i] === game.currentPlayer) {
                inARow++;
                if (inARow === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inARow = 0;                
                }
            }
        for(let i = 0; i<6; i++) {
            if (game.tiles[2][i] === game.currentPlayer) {
                inARow++;
                if (inARow === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inARow = 0;                
                }
            }
        for(let i = 0; i<6; i++) {
            if (game.tiles[3][i] === game.currentPlayer) {
                inARow++;
                if (inARow === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inARow = 0;
                }
            }
        for(let i = 0; i<6; i++) {
            if (game.tiles[4][i] === game.currentPlayer) {
                inARow++;
                if (inARow === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inARow = 0;
                }
            }
        for(let i = 0; i<6; i++) {
            if (game.tiles[5][i] === game.currentPlayer) {
                inARow++;
                if (inARow === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inARow = 0;
                }
            }
        },
    //Check for four in a row vertically/down the column
    columnCheck(columnID){
        console.log(game.tiles)
        let inAColumn = 0;
        for(let i = 0; i<6; i++){
            console.log(game.tiles[i][0])
            if (game.tiles[i][0] === game.currentPlayer) {
                inAColumn++;
                if (inAColumn === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inAColumn = 0;
                }
            };
        for(let i = 0; i<6; i++){
            console.log(game.tiles[i][1])
            if (game.tiles[i][1] === game.currentPlayer) {
                inAColumn++;
                if (inAColumn === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inAColumn = 0;
                }
            };
        for(let i = 0; i<6; i++){
            console.log(game.tiles[i][2])
            if (game.tiles[i][2] === game.currentPlayer) {
                inAColumn++;
                if (inAColumn === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inAColumn = 0;
                }
            };
        for(let i = 0; i<6; i++){
            console.log(game.tiles[i][3])
            if (game.tiles[i][3] === game.currentPlayer) {
                inAColumn++;
                if (inAColumn === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inAColumn = 0;
                }
            };
        for(let i = 0; i<6; i++){
            console.log(game.tiles[i][4])
            if (game.tiles[i][4] === game.currentPlayer) {
                inAColumn++;
                if (inAColumn === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inAColumn = 0;
                }
            };
        for(let i = 0; i<6; i++){
            console.log(game.tiles[i][5])
            if (game.tiles[i][5] === game.currentPlayer) {
                inAColumn++;
                if (inAColumn === 4) {
                    console.log('you win');
                    game.switchScreen('end-screen');
                    game.gameOver();
                    break;
                    } 
                } else {
                    inAColumn = 0;
                }
            };
    },
    diagonalCheck(columnID,rowID){
        console.log('diagonal check','player:',game.currentPlayer+1,'col:',columnID,'row:',rowID);
        const minY = utils.projectToMinY([columnID,rowID],this.tiles.length - 1);
        console.log('minY',minY);
    
        let contiguousTiles = 0;
        while (minY[0] >= 0 && minY[1] <= this.tiles.length - 1) {
          if (this.tiles[minY[0]][minY[1]] == game.currentPlayer) {
            contiguousTiles++;
            console.log(contiguousTiles);
            if (contiguousTiles === 4) {
                console.log(`Player ${game.currentPlayer+1} wins with a downward diagonal!`);
                game.switchScreen('end-screen');
                game.gameOver();
                break;
            }
          } else {
                contiguousTiles = 0;
                console.log(contiguousTiles);
          };
          minY[0] -= 1;
          minY[1] += 1;
        };

        const maxY = utils.projectToMaxY([columnID,rowID],this.tiles.length - 1);
        console.log('maxY',maxY);
        contiguousTiles = 0;
        while (maxY[0] >= 0 && maxY[1] >=0) {
          if (this.tiles[maxY[1]][maxY[0]] == game.currentPlayer) {
            contiguousTiles++;
            console.log(contiguousTiles);
            if (contiguousTiles === 4) {
                console.log(`Player ${game.currentPlayer+1} wins with an upward diagonal!!`);
                game.switchScreen('end-screen');
                game.gameOver();
                break;
            }
          } else {
            contiguousTiles = 0;
            console.log(contiguousTiles);
          };
            maxY[0] -= 1;
            maxY[1] -= 1;
        };
    },
    //Checks game arrays for when it doesn't contain null anymore
    //when all the arrays don't have null, switches to end screen with no points awarded
    drawCheck(){
        let anyNulls1 = game.tiles[0].includes(null);
        let anyNulls2 = game.tiles[1].includes(null);
        let anyNulls3 = game.tiles[2].includes(null);
        let anyNulls4 = game.tiles[3].includes(null);
        let anyNulls5 = game.tiles[4].includes(null);
        let anyNulls6 = game.tiles[5].includes(null);
        if(anyNulls1 == false && anyNulls2 == false &&anyNulls3 == false && anyNulls4 == false &&anyNulls5 == false &&anyNulls6 == false){
            console.log('draw!');
            $('#current-player-move').hide();
            game.switchScreen('end-screen');
            game.gameQuit();
        };
    },
    //Removes player colours and taken class off of each square
    //Used after the play again button is clicked from end-game screen
    resetBoard(){
        $('.grid-square').removeClass('player1colour');
        $('.grid-square').removeClass('player2colour');
        $('.grid-square').removeClass('taken');
    },
    //Reset game by removing players, removing scoreboard
    //Used when the game is hard reset by clicking the quit button from the end-game screen
    resetGame(){
        game.players = [];
        game.resetBoard();
        game.arrayGameBoard();
        $('#end-score').empty();
        $('#player-fields').empty();
    },
    //Restart from End screen
    //Resets array game board, calls the hard reset game method above
    restartGame(){
        game.resetBoard();
        game.arrayGameBoard();
    },
};

//class for players
//has name, position, score
class Player {
    constructor(name, score = 0){
        this.name = name;
        this.score = score;
        this.position = game.players.length+1;
        game.addPlayer(this);
    };
    scorePoints(numPoints){
        this.score += numPoints;
    }
}

//Initialize game to hide certain button, add click listener to grid squares, hide current player move text
$('.grid-square').on('click',game.gameGrid);
game.btnInfo2.hide();
game.btnQuit.hide();
$('#current-player-move').hide();
//event listener for clearing time intervals between player turns, checks to see if timed difficulty was chosen
$('.grid-square').on('click', function(){
    if(document.getElementById('difficulty-timed').checked && $('#game-screen').is(':visible')){
        console.log('timer has stopped');
        clearInterval(game.timeoutID);
        console.log('timer is being resetted');
        game.timeoutID = setInterval(game.playerTurn, game.totalTime);
    };
});

//Button event handlers
//Get Usernames and hand off to game function, clear input fields, add to array
game.btnSubmit.on('click',function(){
        game.playerOne = new Player($('#playerOneName').val());
        $('#playerOneName').val('');
        game.playerOneScore = game.players[0].score;
        game.btnSubmit.prop('disabled',true);
});
//same as above
game.btnSubmit2.on('click',function(){
        game.playerTwo = new Player($('#playerTwoName').val());
        $('#playerTwoName').val('');
        game.btnSubmit2.prop('disabled',true);
});
//Start game button
game.btnStart.on('click', function(){
    //if statement to check if playerOne and playerTwo exist using truthy or falsy
        // if(game.playerOne && game.playerTwo){
    if(game.players.length === 2){
        game.switchScreen('game-screen');
        $('#current-player-move').show();
        game.selectTurn();
        game.arrayGameBoard();
        game.restartGame();
        game.countdownCheck();
    } else {
        alert('Two players are needed to play this game. Please add two players');
    };
});
//Quit game while in game, no points awarded
game.btnQuit.on('click',function(){
    $('#current-player-move').hide();
    game.switchScreen('end-screen');
    game.gameQuit();
});
//Quit game from end game screen, reset player names, scores, everything, enables player submit buttons
game.btnQuit2.on('click',function(){
    $('#current-player-move').hide();
    game.switchScreen('splash');
    game.restartGame();
    game.resetGame();
    game.btnSubmit.prop('disabled',false);
    game.btnSubmit2.prop('disabled',false);
});
//Reset game board, game board colours when play again button is selected on end screen
game.btnPlayAgain.on('click', function(){
    $('#current-player-move').show();
    game.switchScreen('game-screen');
    game.restartGame();
    $('#end-score').empty();
});

//Used for diagonal check, checks from a point using coordinates
const utils = {
    projectToMinY: (point, max) => {
      const newPoint = [...point];
      while (newPoint[0] < max && newPoint[1] > 0) {
        newPoint[1]--;
        newPoint[0]++;
      }
      return newPoint;
    },  
    projectToMaxY: (point,max) => {
      const newPoint = [...point];
      while (newPoint[0] < max && newPoint[1] < max) {
        newPoint[1]++;
        newPoint[0]++;
      }
      return newPoint;
    },
};

//Stop audio from looping
game.winSound.loop=false;