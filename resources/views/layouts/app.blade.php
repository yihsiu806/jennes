<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="Upskilling Academy for Youth and Women Entrepreneurship and Financial Inclusion Programme" />
    <meta name="keywords" content="jennes, youth, economy, upskilling, academy" />
    <meta name="author" content="Upskilling Academy @ SALCC" />

    <!-- Favicon-->
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico" />

    <!-- Karla Font -->
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />

    <!-- Font Awesome 4.7 -->
    <script src="https://use.fontawesome.com/4251cd23a1.js" defer></script>

    <!-- Core theme CSS (includes Bootstrap)-->
    <link href="/dev/styles.css" rel="stylesheet" />

    <!-- override css -->
    <link rel="stylesheet" href="/dev/_style.css" />

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Apply | JENES Upskilling Academy for Youth and Women</title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    <style>
        body {
            font-size: 16.5px;
        }

        #mainNav {
            background-color: #222;
        }
    </style>
</head>

<body>

    <!-- navbar -->
    <?php include_once($_SERVER['DOCUMENT_ROOT'] . '/dev/navbar.html'); ?>

    <div id="app">
        <!-- Authentication Links -->
        <div class="container">
            <div class="row justify-content-end align-items-center" style="margin-top: 120px;">
                @guest
                @if (Route::has('register'))
                @endif
                @else
                <div id="helloMsg" class="col-auto"></div>
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

    <!-- footer -->
    <?php include_once($_SERVER['DOCUMENT_ROOT'] . '/dev/footer.html'); ?>
</body>

</html>