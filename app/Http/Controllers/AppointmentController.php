<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * Display a listing of appointments
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Appointment::with(['client', 'agent', 'service']);

        // Filter appointments based on user role
        if ($user->isClient()) {
            $query->where('client_id', $user->id);
        } elseif ($user->isAgent()) {
            $query->where('agent_id', $user->id);
        }
        // Admin sees all appointments (no additional filter)

        $appointments = $query->orderBy('scheduled_at', 'desc')->paginate(10);

        return Inertia::render('appointments/index', [
            'appointments' => $appointments,
        ]);
    }

    /**
     * Show the form for creating a new appointment
     */
    public function create(Request $request)
    {
        $services = Service::active()->orderBy('name')->get();
        $agents = User::agents()->where('is_active', true)->orderBy('name')->get();

        return Inertia::render('appointments/create', [
            'services' => $services,
            'agents' => $agents,
        ]);
    }

    /**
     * Store a newly created appointment
     */
    public function store(StoreAppointmentRequest $request)
    {
        $service = Service::findOrFail($request->service_id);
        $agent = User::findOrFail($request->agent_id);
        
        // Calculate end time based on service duration
        $scheduledAt = new \DateTime($request->scheduled_at);
        $endsAt = clone $scheduledAt;
        $endsAt->modify('+' . $service->duration_minutes . ' minutes');

        $appointment = Appointment::create([
            'client_id' => $request->user()->id,
            'agent_id' => $request->agent_id,
            'service_id' => $request->service_id,
            'scheduled_at' => $scheduledAt,
            'ends_at' => $endsAt,
            'amount' => $service->price,
            'status' => 'pending', // Will be confirmed after payment
            'notes' => $request->notes,
        ]);

        return redirect()->route('appointments.show', $appointment)
            ->with('success', 'Appointment requested successfully. Complete payment to confirm.');
    }

    /**
     * Display the specified appointment
     */
    public function show(Appointment $appointment)
    {
        $appointment->load(['client', 'agent', 'service']);

        return Inertia::render('appointments/show', [
            'appointment' => $appointment,
        ]);
    }

    /**
     * Show the form for editing the specified appointment
     */
    public function edit(Appointment $appointment)
    {
        $appointment->load(['client', 'agent', 'service']);
        $services = Service::active()->orderBy('name')->get();
        $agents = User::agents()->where('is_active', true)->orderBy('name')->get();

        return Inertia::render('appointments/edit', [
            'appointment' => $appointment,
            'services' => $services,
            'agents' => $agents,
        ]);
    }

    /**
     * Update the specified appointment
     */
    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,confirmed,completed,cancelled',
            'notes' => 'nullable|string',
            'stripe_payment_intent_id' => 'nullable|string',
        ]);

        $appointment->update($validated);

        return redirect()->route('appointments.show', $appointment)
            ->with('success', 'Appointment updated successfully.');
    }

    /**
     * Remove the specified appointment
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment cancelled successfully.');
    }
}