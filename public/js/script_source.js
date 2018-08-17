(function() {
    //api data
    var dealer = {
        deck: '',
        draw: ''
    };

    //game states
    var game = {
        status: '',
        deckId: 'cs4zwqas47hh',
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
    var cards = [{'ACE': 1}, {'2': 2}, {'3': 3}, {'4': 4}, {'5': 5}, {'6': 6}, {'7': 7}, {'8': 8}, {'9': 9}, {'10': 10}, {'JACK': 11}, {'QUEEN': 12}, {'KING': 13}];

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
    };

    //urls
    var deck = "http://deckofcardsapi.com/api/deck/" + game.deckId + "/shuffle/",
        card = "http://deckofcardsapi.com/api/deck/" + game.deckId + "/draw/?count=1",
        shuffle = "http://deckofcardsapi.com/api/deck/" + game.deckId + "/shuffle/";

    function init() {
        start.show();
        game.status = 'NEW';

        start.on('click', function(){
            var dealer = {} ? getResult(deck) : getResult(shuffle);

            start.hide();

            state.show();
            restart.show();
        });
    }

    function getResult(stateUrl) {
        $.ajax({
            url: stateUrl,
            type: 'GET'
        }).then(function(data) {
            if (dealer.deck === '') {
                dealer.deck = data;
            } else {
                dealer.draw = data;
            }
            obtainStatus();
        });
    }


    function obtainStatus() {
        console.log(game.status);
        switch (game.status) {
            case "NEW":
                game.status = 'STARTED';
                getResult(card);
                break;
            case "STARTED":
                player.attr('src', dealer.draw.cards[0].image);
                choice.text(messages.start);
                drawCard();
                break;
            case "CORRECT":
                drawCard();
                break;
            case "SELECTED":
                checkResult();
                break;
            case "LOSE":
                //lose animation
                break;
            default:
                console.log('no status');
        }
    }

    function checkResult() {
        player.attr('src', dealer.draw.cards[0].image);
        game.remaining = dealer.draw.remaining;
        remain.text(messages.remaining);

        if (game.remaining === 0) {
            game.status = 'WIN';
            result.text(messages.win);
        } else if ( (dealer.draw.cards[0].value >= game.drawn && game.player === 'higher') || (dealer.draw.cards[0].value <= game.drawn && game.player === 'lower') || (dealer.draw.cards[0].value == game.drawn && game.player === 'same') ) {
            game.status = 'CORRECT';
            result.text(messages.correct);
            drawCard();
        } else {
            game.status = 'LOSE';
            result.text(messages.incorrect);
            remain.hide();
            state.hide();
        }
    }

    function drawCard() {
        state.on('click', function(){
            var guess = $(this).attr('class').split(' ')[0].toLowerCase();

            game.status = 'SELECTED';
            choice.text(messages[guess]);
            game.drawn = dealer.draw.cards[0].value;
            game.player = guess;
            getResult(card);
        });
    }

    restart.on('click', function(){
        //delete card data
        dealer.draw = '';

        //clear/hide elements
        player.attr('src', 'blank.jpg');
        result.text('');
        choice.text('');
        remain.text('');
        restart.hide();
        state.hide();

        //restart the game
        init();
    });

    init();


}());