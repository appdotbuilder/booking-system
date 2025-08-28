<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AgentBlockedTimeController extends Controller
{
    /**
     * Store blocked time slots
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'reason' => 'nullable|string|max:255',
        ]);

        $agent = $request->user();

        $agent->blockedTimes()->create([
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'reason' => $validated['reason'] ?? 'Unavailable',
        ]);

        return redirect()->back()
            ->with('success', 'Time blocked successfully.');
    }
}