<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StagiaireEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $content;

    public function __construct($subject, $content)
    {
        $this->subject = $subject;
        $this->content = $content;
    }

    public function build()
{
    return $this->subject($this->subject)
        ->html('<h1>' . $this->subject . '</h1><p>' . $this->content . '</p>');
}
}
