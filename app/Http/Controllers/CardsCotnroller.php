<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use GuzzleHttp\Client;
use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\GuzzleException;

class CardsCotnroller extends Controller
{
    public function deal(Request $request)
    {
        $request_url = "https://deckofcardsapi.com/api/deck/new/shuffle/";

        $client = new Client(); //GuzzleHttp\Client
        $result = $client->request('GET', $request_url);
        $response = $result->getBody()->getContents();

        return json_encode($response);
    }

    public function shuffle(Request $request)
    {
        $request_url = "http://deckofcardsapi.com/api/deck/" . $request->deckId . "/draw/?count=1";

        $client = new Client(); //GuzzleHttp\Client
        $result = $client->request('GET', $request_url);
        $response = $result->getBody()->getContents();

        return json_encode($response);
    }
}
