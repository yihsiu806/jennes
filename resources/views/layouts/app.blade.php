<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Apply | JENES Upskilling Academy for Youth and Women</title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    <style>
        #mainNav {
            background-color: #222;
        }
    </style>
</head>

<body>

    <div id="app">
        <!-- Authentication Links -->
        <div class="container">
            <div class="row justify-content-end" style="margin-top: 120px;">
                @guest
                @if (Route::has('register'))
                @endif
                @else
                <div class="col-auto">
                    <a class="btn btn-secondary btn-lg" href="{{ route('logout') }}" onclick="event.preventDefault();
                    document.getElementById('logout-form').submit();">
                        {{ __('Logout') }}
                    </a>

                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                        @csrf
                    </form>
                </div>
                @endguest
            </div>
        </div>

        <main class="py-4">
            @yield('content')
        </main>
    </div>

    @yield('bundle')

</body>

</html>