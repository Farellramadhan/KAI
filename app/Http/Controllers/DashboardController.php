<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {

        if(!Auth::check()){
            return redirect()->route('login');
        }
        return view('dashboard',['user' => Auth::user()]);

    }
    public function profile()
    {

        return view('profile',['user' => Auth::user()]);
    }
}
