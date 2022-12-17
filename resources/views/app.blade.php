<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Aplikasi Kasir Kafe</title>
    <link rel="stylesheet" href="{{ asset('css/bootstrap.css') }}">
</head>

<body>
    <div id="app">
    </div>
    <script>
        const csrf = `{{ csrf_token() }}`;
        const credentials = `{{ Auth::user()->username }}`;
        const baseUrl = `{{ url('') }}`;
    </script>
    <script src="{{ asset('js/loadingOverlay.js') }}"></script>
    <script src="{{ asset('js/bootstrap.js') }}"></script>
    <script type="module" src="{{asset('SPA/src/js/main.js')}}"></script>

</body>

</html>