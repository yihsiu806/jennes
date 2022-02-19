@extends('layouts.app')

@section('content')
<div class="container admin-container">

</div>
<div class="page-preloader">
    <div class="spinner">
        <div class="rect1"></div>

        <div class="rect2"></div>

        <div class="rect3"></div>

        <div class="rect4"></div>

        <div class="rect5"></div>
    </div>
</div>
@endsection

@section('bundle')
<script>
    let me = JSON.parse('{!! json_encode($me, JSON_HEX_TAG) !!}');
    let stat = JSON.parse('{!! json_encode($stat, JSON_HEX_TAG) !!}');
</script>

<script src="{!! asset('js/admin.js') !!}"></script>
@endsection