<?php

namespace App\Services;
use Twilio\Rest\Client;

class TwilioService
{
    protected $client;
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->client = new Client(env('TWILIO_ACCOUNT_SID'), env('TWILIO_AUTH_TOKEN'));
    }

    public function sendSms($to, $message)
    {
        return $this->client->messages->create($to, [
            'from' => env('TWILIO_PHONE_NUMBER'),
            'body' => $message,
        ]);
    }
}
