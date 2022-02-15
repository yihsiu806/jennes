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

        section:nth-of-type(2n) {
            background-color: transparent !important;
        }

        a,
        a:hover,
        a:active {
            text-decoration: none !important;
        }

        #popupModal a:hover,
        #popupModal a:active {
            color: #333;
        }

        #popupModal #list li {
            color: #333;
            margin: 1em 0;
        }

        #popupModal #list li::marker {
            color: var(--lucian_blue);
        }

        #popupModal .modal-header {
            background: linear-gradient(107deg, rgba(42, 48, 134, 1) 0%, rgba(121, 9, 92, 0.6) 45%, rgba(0, 212, 255, 0.6) 100%);
        }

        #popupModalLabel {
            color: #fff;
        }

        #popupModal .modal-footer {
            justify-content: space-between !important;
        }

        #popupModal .modal-footer #close {
            border-radius: 160px;
            background-color: transparent;
            color: #808080;
            transition: 0.2s;
        }

        #popupModal .modal-footer #close:hover,
        #popupModal .modal-footer #close:active {
            background-color: #808080;
            color: #fff;
        }

        span.btn-ex {
            display: inline-block;
            background-color: #FAF2C6;
            color: #333;
            padding: 3px 12px;
            border-radius: 1em;
            font-weight: bold;
            margin: 0 1.5px;
        }

        span#appOpens {
            background-color: rgba(42, 48, 134, 1);
            color: #fff;
            padding: 3px 8px;
            font-size: 1.1em;
            font-weight: bold;
            text-transform: uppercase;
            width: max-content;
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