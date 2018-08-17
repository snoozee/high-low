
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
    start: 'Please choose lower or higher!',
    remaining: 'You have ' + game.remaining + ' cards remaining!',
    lower: 'You chose Lower!',
    same: 'You chose Same!',
    higher: 'You chose Higher!',
    win: 'You have won!',
    correct: 'You are correct!',
    incorrect: 'You are incorrect, please start again!',
    restart: 'Please press "New Game" button',
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
                game.status = 'NEW';
                game.deckId = dataDeck.deck_id;
                game.remaining = dataDeck.remaining;
                game.drawn = 52 - parseInt(dataDeck.remaining);

                start.hide();

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
                            game.deckId = dataDeckShuffled.deck_id;
                            game.remaining = dataDeckShuffled.remaining;
                            game.drawn = dataDeckShuffled.cards[0].value;

                            dealer.drawn = dataDeckShuffled.cards[0].value;

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

                state.on('click', function() {
                    let guess = $(this).attr('class').split(' ')[0].toLowerCase();

                    game.status = 'STARTED';
                    choice.text(messages[guess]);

                    game.player = guess;

                    dealCard(game.deckId);
                    //obtainStatus();
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
                game.deckId = dataDeckShuffled.deck_id;
                game.remaining = dataDeckShuffled.remaining;
                game.drawn = dataDeckShuffled.cards[0].value;
                game.status = 'SELECTED';

                $('.cards__img').attr('src', dataDeckShuffled.cards[0].image);
                $('#remain').text('You have ' + game.remaining + ' cards remaining!');

                checkResult();

                dealer.drawn = dataDeckShuffled.cards[0].value;
                console.log('dealCard game.drawn = ' + game.drawn);
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
    remain.text(messages.remaining);

    console.log('dealer.drawn = ' + dealer.drawn);
    console.log('game.drawn = ' + game.drawn);
    console.log('game.player = ' + game.player);

    if (game.remaining === 0) {
        game.status = 'WIN';
        result.text(messages.win);
    } else if ( (dealer.drawn < game.drawn && game.player === 'higher') || (dealer.drawn > game.drawn && game.player === 'lower') || (dealer.drawn == game.drawn && game.player === 'same') ) {
        game.status = 'CORRECT';
        result.text(messages.correct);
    } else {
        game.status = 'LOSE';
        result.text(messages.incorrect);
        remain.text(messages.restart);
        state.hide();
    }
}

restart.on('click', function(){
    //delete card data
    dealer.draw = '';

    //clear/hide elements
    player.attr('src', '/public/images/blank.jpg');
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