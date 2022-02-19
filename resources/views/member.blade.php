@extends('layouts.app')

@section('content')
<div class="container member-container">

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
    let user = JSON.parse('{!! json_encode($user, JSON_HEX_TAG) !!}');
    let profile = JSON.parse(`{!! json_encode($profile, JSON_HEX_TAG) !!}`);
</script>

<script src="{!! asset('js/member.js') !!}"></script>
@endsection