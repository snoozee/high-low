<p>The project is basen on Laravel 5.6 and Jquery.</p>
<p>To use the PHP stream handler in Laravel we'll need install Guzzle</p>
<br/>
<ol>
  <li>Download from Git.</li>
  <li>.env.example => .env</li>
  <li>composer install</li>
  <li>php artisan key:generate</li>
  <li>composer require guzzlehttp/guzzle</li>
</ol>

<h2>Files</h2>
<ul>
  <li><b>View file</b> - recources/views/welcome.blade.php</li>
  <li><b>JS scripts</b> - public/js/script.js</li>
  <li><b>Style file</b> - public/css/style.css</li>
  <li><b>Image</b> - public/images/blank.jpg</li>
  <li><b>Routes</b>: <br/>
    <ul>
      <li>routes/api.php - to obtain Deckofcardsapi data</li>
      <li>routes/web.php - to to show page</li>
   </ul>
  <li><b>Controller</b> - app/Http/Controllers/CardsCotnroller.php - recieving and operating Deckofcardsapi data</li>
</ul>
