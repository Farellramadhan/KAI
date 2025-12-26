<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'KAI') }}</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('/image/favicon.ico') }}">

    @viteReactRefresh
    @vite(['resources/js/main.jsx'])
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
