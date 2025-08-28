<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AgentAvailability;
use App\Models\AgentBlockedTime;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgentController extends Controller
{
    /**
     * Display the agent dashboard
     */
    public function index(Request $request)
    {
        $agent = $request->user();

        $upcomingAppointments = $agent->agentAppointments()
            ->with(['client', 'service'])
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();

        $todayAppointments = $agent->agentAppointments()
            ->with(['client', 'service'])
            ->whereDate('scheduled_at', today())
            ->orderBy('scheduled_at')
            ->get();

        $monthlyStats = [
            'total_appointments' => $agent->agentAppointments()->whereMonth('created_at', now()->month)->count(),
            'completed_appointments' => $agent->agentAppointments()->where('status', 'completed')->whereMonth('created_at', now()->month)->count(),
            'total_revenue' => $agent->agentAppointments()->where('status', 'completed')->whereMonth('created_at', now()->month)->sum('amount'),
        ];

        return Inertia::render('agent/dashboard', [
            'upcoming_appointments' => $upcomingAppointments,
            'today_appointments' => $todayAppointments,
            'monthly_stats' => $monthlyStats,
        ]);
    }

    /**
     * Show the form for editing agent availability
     */
    public function edit(Request $request)
    {
        $agent = $request->user();
        $availabilities = $agent->availabilities()->orderBy('day_of_week')->get();

        return Inertia::render('agent/availability', [
            'availabilities' => $availabilities,
        ]);
    }

    /**
     * Update agent availability
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'availabilities' => 'required|array',
            'availabilities.*.day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'availabilities.*.start_time' => 'required|date_format:H:i',
            'availabilities.*.end_time' => 'required|date_format:H:i|after:availabilities.*.start_time',
            'availabilities.*.is_available' => 'boolean',
        ]);

        $agent = $request->user();
        
        // Delete existing availabilities
        $agent->availabilities()->delete();

        // Create new availabilities
        foreach ($validated['availabilities'] as $availability) {
            $agent->availabilities()->create([
                'day_of_week' => $availability['day_of_week'],
                'start_time' => $availability['start_time'],
                'end_time' => $availability['end_time'],
                'is_available' => $availability['is_available'] ?? true,
            ]);
        }

        return redirect()->route('agent.availability')
            ->with('success', 'Availability updated successfully.');
    }

    /**
     * Display a listing of agent's appointments
     */
    public function show(Request $request)
    {
        $agent = $request->user();
        
        $query = $agent->agentAppointments()->with(['client', 'service']);

        // Apply date filter if provided
        if ($request->date) {
            $query->whereDate('scheduled_at', $request->date);
        }

        $appointments = $query->orderBy('scheduled_at')->paginate(15);

        return Inertia::render('agent/appointments', [
            'appointments' => $appointments,
            'filters' => $request->only(['date']),
        ]);
    }


}