<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard
     */
    public function index()
    {
        $totalAppointments = Appointment::count();
        $totalRevenue = Appointment::where('status', 'completed')->sum('amount');
        $totalAgents = User::agents()->count();
        $totalClients = User::clients()->count();

        $recentAppointments = Appointment::with(['client', 'agent', 'service'])
            ->latest()
            ->take(5)
            ->get();

        $monthlyRevenue = Appointment::where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->sum('amount');

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_appointments' => $totalAppointments,
                'total_revenue' => $totalRevenue,
                'total_agents' => $totalAgents,
                'total_clients' => $totalClients,
                'monthly_revenue' => $monthlyRevenue,
            ],
            'recent_appointments' => $recentAppointments,
        ]);
    }

    /**
     * Show admin services management
     */
    public function show(Request $request)
    {
        $type = $request->get('type', 'dashboard');

        switch ($type) {
            case 'services':
                $services = Service::orderBy('name')->paginate(10);
                return Inertia::render('admin/services', [
                    'services' => $services,
                ]);

            case 'agents':
                $agents = User::agents()
                    ->withCount(['agentAppointments'])
                    ->orderBy('name')
                    ->paginate(10);
                return Inertia::render('admin/agents', [
                    'agents' => $agents,
                ]);

            case 'appointments':
                $query = Appointment::with(['client', 'agent', 'service']);

                // Apply filters
                if ($request->status) {
                    $query->where('status', $request->status);
                }

                if ($request->agent_id) {
                    $query->where('agent_id', $request->agent_id);
                }

                if ($request->date_from) {
                    $query->whereDate('scheduled_at', '>=', $request->date_from);
                }

                if ($request->date_to) {
                    $query->whereDate('scheduled_at', '<=', $request->date_to);
                }

                $appointments = $query->orderBy('scheduled_at', 'desc')->paginate(15);
                $agents = User::agents()->orderBy('name')->get();

                return Inertia::render('admin/appointments', [
                    'appointments' => $appointments,
                    'agents' => $agents,
                    'filters' => $request->only(['status', 'agent_id', 'date_from', 'date_to']),
                ]);

            default:
                return $this->index();
        }
    }
}