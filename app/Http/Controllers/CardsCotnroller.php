<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use GuzzleHttp\Client;

class CardsCotnroller extends Controller
{
    public function deal(Request $request)
    {
        // new deck requset
        $request_url = "https://deckofcardsapi.com/api/deck/new/shuffle/";

        // To obtain data we'll use Guzzle
        $client = new Client();
        $result = $client->request('GET', $request_url);
        $response = $result->getBody()->getContents();

        // retur data to front in json format
        return json_encode($response);
    }

    public function shuffle(Request $request)
    {
        // new card request
        $request_url = "http://deckofcardsapi.com/api/deck/" . $request->deckId . "/draw/?count=1";

        $client = new Client(); //GuzzleHttp\Client
        $result = $client->request('GET', $request_url);
        $response = $result->getBody()->getContents();

        return json_encode($response);
    }
}
