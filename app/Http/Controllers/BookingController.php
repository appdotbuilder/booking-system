<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display the main booking page with services
     */
    public function index()
    {
        $services = Service::active()->orderBy('name')->get();
        $agents = User::agents()->where('is_active', true)->orderBy('name')->get();

        return Inertia::render('booking/index', [
            'services' => $services,
            'agents' => $agents,
        ]);
    }

    /**
     * Get agent availability for a specific service
     */
    public function show(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'agent_id' => 'required|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
        ]);

        $service = Service::findOrFail($request->service_id);
        $agent = User::findOrFail($request->agent_id);

        // Get agent's availability for the requested date
        $dayOfWeek = strtolower(date('l', strtotime($request->date)));
        $availability = $agent->availabilities()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->first();

        $availableSlots = [];
        
        if ($availability) {
            // Get existing appointments for this agent on this date
            $existingAppointments = Appointment::where('agent_id', $agent->id)
                ->whereDate('scheduled_at', $request->date)
                ->whereIn('status', ['confirmed', 'pending'])
                ->get();

            // Get blocked times for this agent on this date
            $blockedTimes = $agent->blockedTimes()
                ->whereDate('start_time', $request->date)
                ->get();

            // Generate available time slots
            $availableSlots = $this->generateAvailableSlots(
                $request->date,
                $availability,
                $service->duration_minutes,
                $existingAppointments,
                $blockedTimes
            );
        }

        return response()->json([
            'service' => $service,
            'agent' => $agent,
            'available_slots' => $availableSlots,
        ]);
    }

    /**
     * Generate available time slots
     */
    protected function generateAvailableSlots($date, $availability, $serviceDuration, $existingAppointments, $blockedTimes)
    {
        $slots = [];
        $startTime = strtotime($date . ' ' . $availability->start_time);
        $endTime = strtotime($date . ' ' . $availability->end_time);
        $slotDuration = $serviceDuration * 60; // Convert to seconds

        for ($time = $startTime; $time + $slotDuration <= $endTime; $time += 1800) { // 30-minute increments
            $slotStart = date('Y-m-d H:i:s', $time);
            $slotEnd = date('Y-m-d H:i:s', $time + $slotDuration);

            // Check if this slot conflicts with existing appointments
            $hasConflict = false;
            
            foreach ($existingAppointments as $appointment) {
                $appointmentStart = strtotime($appointment->scheduled_at);
                $appointmentEnd = strtotime($appointment->ends_at);
                
                if (($time < $appointmentEnd) && ($time + $slotDuration > $appointmentStart)) {
                    $hasConflict = true;
                    break;
                }
            }

            // Check if this slot conflicts with blocked times
            if (!$hasConflict) {
                foreach ($blockedTimes as $blocked) {
                    $blockedStart = strtotime($blocked->start_time);
                    $blockedEnd = strtotime($blocked->end_time);
                    
                    if (($time < $blockedEnd) && ($time + $slotDuration > $blockedStart)) {
                        $hasConflict = true;
                        break;
                    }
                }
            }

            if (!$hasConflict) {
                $slots[] = [
                    'start_time' => $slotStart,
                    'end_time' => $slotEnd,
                    'display_time' => date('g:i A', $time),
                ];
            }
        }

        return $slots;
    }
}