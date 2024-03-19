<?php

namespace App\Http\Controllers;

use App\Mail\StagiaireEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\StudentEmail;

class EmailController extends Controller
{
    public function sendEmail(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'subject' => 'required',
                'content' => 'required',
            ]);

            Mail::to($request->email)
                ->send(new StagiaireEmail($request->subject, $request->content));

            return response()->json(['message' => 'Email sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while sending the email.', 'error' => $e->getMessage()], 500);
        }
    }
}
