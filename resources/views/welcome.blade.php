<!DOCTYPE html>
<html>
    <head>
        <title>Higher, Lower or Same?</title>
        <link href='http://fonts.googleapis.com/css?family=Cardo' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="/css/app.css">
        <link rel="stylesheet" type="text/css" href="/css/style.css">
        <link rel="shortcut icon" href="https://deckofcardsapi.com/static/img/favicon/favicon.ico">

        {{-- crsf_token --}}
        <meta name="csrf-token" content="{{ csrf_token() }}">
    </head>
    <body>
        {{-- Loader --}}
        <div class="lds-dual-ring-wrap">
            <div class="lds-dual-ring"></div>
        </div>

        {{-- Cards desk --}}
        <div class="game">
            <div id="cards" class="cards">
                <img id="player" class="cards__img" src="/images/blank.jpg">
                <p id="choice" class="cards__text"></p>
                <p id="result" class="cards__text"></p>
                <p id="remain" class="cards__text"></p>
            </div>

            {{-- Control buttons --}}
            <div id="controls" class="controls">
                <button id="start" class="start">Start Game</button>
                <button class="lower state controls__btn">Lower</button>
                <button class="same state controls__btn">Same</button>
                <button class="higher state controls__btn">Higher</button>
                <button id="restart" class="start controls__btn">New Game</button>
            </div>
        </div>

        <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
        <script src="/js/script.js"></script>
    </body>
</html>