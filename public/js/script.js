
//api data
var dealer = {
    deck: '',
    drawn: ''
};

//game states
var game = {
    status: '',
    deckId: '',
    remaining: '',
    result: '',
    player: '',
    drawn: '',
};

//elements
var player = $('#player'),
    start = $('#start'),
    lower = $('.lower'),
    same = $('.same'),
    higer = $('.higher'),
    state = $('.state'),
    result = $('#result'),
    choice = $('#choice'),
    remain = $('#remain'),
    restart = $('#restart');

//cards
var cards = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'JACK': 11,
    'QUEEN': 12,
    'KING': 13,
    'ACE': 1
};

//messages
var messages = {
    start: 'Please choose lower higher or same!',
    remaining: game.remaining + ' cards remaining!',
    lower: 'Your choice is Lower!',
    same: 'Your choice is Same!',
    higher: 'Your choice is Higher!',
    win: 'You have won!',
    correct: 'And you are right!',
    incorrect: 'Oops ... wrong choice, try one more time!',
    restart: 'Click "New Game" button for another try',
};

start.on('click', function(){
    newDeal();
});

function newDeal() {
    $.ajax({
        url: '/api/deal',
        type: 'get',
        dataType: 'json',
        data: {
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        beforeSend: function () {
            // loader animation
            $('.lds-dual-ring-wrap').show();
        },
        success: function (json) {
            let dataDeck = JSON.parse(json);

            // loader animation
            $('.lds-dual-ring-wrap').hide();

            if (dataDeck.success === true) {
                // new deck data
                game.status = 'NEW';
                game.deckId = dataDeck.deck_id;
                game.remaining = dataDeck.remaining;
                game.drawn = 52 - parseInt(dataDeck.remaining);

                start.hide();

                // deal first card
                $.ajax({
                    url: '/api/shuffle',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        deckId: game.deckId,
                        _token: $('meta[name="csrf-token"]').attr('content'),
                    },
                    beforeSend: function () {
                        // loader animation
                        $('.lds-dual-ring-wrap').show();
                    },
                    success: function (json_shuffle) {
                        let dataDeckShuffled = JSON.parse(json_shuffle);

                        // loader animation
                        $('.lds-dual-ring-wrap').hide();

                        if (dataDeckShuffled.success === true) {
                            // game card
                            game.deckId = dataDeckShuffled.deck_id;
                            game.remaining = dataDeckShuffled.remaining;
                            game.drawn = dataDeckShuffled.cards[0].value;

                            // dealed card to compare
                            dealer.drawn = dataDeckShuffled.cards[0].value;

                            /*console.log('dealCard game.drawn = ' + game.drawn);
                            console.log('dealCard dealer.drawn = ' + dealer.drawn);
                            console.log('dealCard cards = ' + cards[dealer.drawn]);*/


                            $('.cards__img').attr('src', dataDeckShuffled.cards[0].image);
                            $('#remain').text('You have ' + game.remaining + ' cards remaining!');
                        } else {
                            alert ('Ooooooops... Shuffling failed');
                            location.reload();
                        }
                    },
                    error: function () {
                        // error handler
                        alert('Error when shuffle');
                        location.reload();
                    }
                });

                state.show();
                restart.show();
            } else {
                alert ('Ooooooops... Something went wrong');
                location.reload();
            }
        },
        error: function () {
            // error handler
            alert('Error when deal');
            location.reload();
        }
    });
}

// Choosing next card
state.on('click', function() {
    console.log('click');
    // players choice
    let guess = $(this).attr('class').split(' ')[0].toLowerCase();
    choice.text(messages[guess]);
    game.player = guess;

    // next card
    dealCard(game.deckId);
});

function dealCard(deckId) {
    $.ajax({
        url: '/api/shuffle',
        type: 'get',
        dataType: 'json',
        data: {
            deckId: deckId,
            _token: $('meta[name="csrf-token"]').attr('content'),
        },
        beforeSend: function () {
            // loader animation
            $('.lds-dual-ring-wrap').show();
        },
        success: function (json_shuffle) {
            let dataDeckShuffled = JSON.parse(json_shuffle);

            // loader animation
            $('.lds-dual-ring-wrap').hide();

            if (dataDeckShuffled.success === true) {
                // Game cards
                game.deckId = dataDeckShuffled.deck_id;
                game.remaining = dataDeckShuffled.remaining;
                game.drawn = dataDeckShuffled.cards[0].value;

                $('.cards__img').attr('src', dataDeckShuffled.cards[0].image);
                $('#remain').text('You have ' + game.remaining + ' cards remaining!');

                console.log('checkResult()');
                checkResult();

                // Dealed card to comapre
                dealer.drawn = dataDeckShuffled.cards[0].value;
                //console.log('dealCard game.drawn 196 = ' + game.drawn);
            } else {
                alert ('Ooooooops... Shuffling failed');
                location.reload();
            }
        },
        error: function () {
            // error handler
            alert('Error when shuffle');
            location.reload();
        }
    });
}

function checkResult() {
    // Cards reamin in deck
    remain.text(messages.remaining);

    console.log('dealer.drawn = ' + dealer.drawn);
    console.log('game.drawn = ' + game.drawn);
    console.log('game.player = ' + game.player);

    if (game.remaining === 0) {
        // Game won;
        result.text(messages.win);
    } else if ( (cards[dealer.drawn] < cards[game.drawn] && game.player === 'higher') || (cards[dealer.drawn] > cards[game.drawn] && game.player === 'lower') || (cards[dealer.drawn] == cards[game.drawn]&& game.player === 'same') ) {
        // Game is in process
        result.text(messages.correct);
    } else {
        // Game lost, starting new game
        result.text(messages.incorrect);
        remain.text(messages.restart);
        state.hide();
    }
}

restart.on('click', function(){
    //delete card data
    dealer.draw = '';

    //clear/hide elements
    player.attr('src', '/images/blank.jpg');
    result.text('');
    choice.text('');
    remain.text('New game started');
    restart.hide();
    state.hide();

    setTimeout(function () {
        remain.text('');
        newDeal();
    }, 1000);

});