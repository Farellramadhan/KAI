<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|min:3',
            'email'    => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => [
                    'email' => ['Email sudah terdaftar.']
                ]
            ], 400);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 201);
    }

    // ✅ Login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            return response()->json([
                'message' => 'Login berhasil',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]);
        }

        return response()->json([
            'message' => 'Kesalahan validasi',
            'errors' => [
                'email' => ['Email atau password salah.']
            ]
        ], 400);
    }

    // ✅ Logout
    public function logout(Request $request)
    {
        Auth::logout();
        
        // Regenerate session ID first to prevent session fixation
        $request->session()->flush(); // Clear all session data
        $request->session()->regenerate(); // Generate new session ID
        $request->session()->regenerateToken(); // Generate new CSRF token
        
        // Return JSON if request expects JSON
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Logout berhasil',
                'session_regenerated' => true
            ]);
        }
        
        return redirect('/');
    }

    // ✅ Get authenticated user
    public function user(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
        ]);
    }

    // ✅ Request password reset (send code to email)
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => [
                    'email' => ['Email tidak terdaftar dalam sistem.']
                ]
            ], 400);
        }

        // Generate 6-digit code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Delete any existing reset codes for this email
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Store the reset code
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($code),
            'created_at' => Carbon::now()
        ]);

        // Try to send email with a branded template, but don't fail if mail is not configured
        try {
            Mail::send('emails.password_reset', [
                'user' => $user,
                'code' => $code,
            ], function ($message) use ($request) {
                $message->to($request->email)
                    ->subject('Reset Password - KAI Device Management');
            });
        } catch (\Exception $e) {
            // Log the error but continue - for development without mail config
            \Log::warning('Failed to send password reset email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Kode verifikasi telah dikirim ke email Anda.',
            // Include code in development mode for testing (remove in production)
            'code' => config('app.debug') ? $code : null
        ]);
    }

    // ✅ Verify reset code
    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => [
                    'code' => ['Tidak ada permintaan reset password untuk email ini.']
                ]
            ], 400);
        }

        // Check if code is expired (5 minutes)
        if (Carbon::parse($resetRecord->created_at)->addMinutes(5)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => [
                    'code' => ['Kode verifikasi sudah kadaluarsa. Silakan minta kode baru.']
                ]
            ], 400);
        }

        // Verify the code
        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => [
                    'code' => ['Kode verifikasi tidak valid.']
                ]
            ], 400);
        }

        return response()->json([
            'message' => 'Kode verifikasi valid.',
            'verified' => true
        ]);
    }

    // ✅ Reset password with verified code
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => 'required|min:6|confirmed'
        ]);

        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => [
                    'code' => ['Tidak ada permintaan reset password untuk email ini.']
                ]
            ], 400);
        }

        // Check if code is expired (5 minutes)
        if (Carbon::parse($resetRecord->created_at)->addMinutes(5)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => [
                    'code' => ['Kode verifikasi sudah kadaluarsa.']
                ]
            ], 400);
        }

        // Verify the code
        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => [
                    'code' => ['Kode verifikasi tidak valid.']
                ]
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => [
                    'email' => ['User tidak ditemukan.']
                ]
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the reset token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password berhasil direset. Silakan login dengan password baru.'
        ]);
    }
}
