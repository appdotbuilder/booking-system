import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface MonthlyStats {
    total_appointments: number;
    completed_appointments: number;
    total_revenue: number;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    ends_at: string;
    status: string;
    amount: number;
    client: { name: string; email: string };
    service: { name: string };
}

interface Props {
    upcoming_appointments: Appointment[];
    today_appointments: Appointment[];
    monthly_stats: MonthlyStats;
    [key: string]: unknown;
}

export default function AgentDashboard({ upcoming_appointments, today_appointments, monthly_stats }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AppLayout>
            <Head title="Agent Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">💼 Agent Dashboard</h1>
                    <p className="text-gray-600">Manage your schedule and track your performance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <span className="text-xl">📅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                <p className="text-2xl font-semibold text-gray-900">{monthly_stats.total_appointments} appointments</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-xl">✅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-semibold text-gray-900">{monthly_stats.completed_appointments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <span className="text-xl">💰</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Revenue</p>
                                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(monthly_stats.total_revenue)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        href={route('agent.availability')}
                        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <span className="text-2xl">🗓️</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Manage Schedule</h3>
                                <p className="text-gray-600">Set your availability and blocked times</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href={route('agent.appointments')}
                        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <span className="text-2xl">📋</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
                                <p className="text-gray-600">View your booking history</p>
                            </div>
                        </div>
                    </Link>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <span className="text-2xl">💳</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Stripe Account</h3>
                                <p className="text-gray-600">Manage payment settings</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Today's Appointments */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">
                                📅 Today's Schedule ({new Date().toLocaleDateString()})
                            </h2>
                        </div>
                        <div className="p-6">
                            {today_appointments.length > 0 ? (
                                <div className="space-y-4">
                                    {today_appointments.map((appointment) => (
                                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-medium text-gray-900">{appointment.client.name}</h3>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {appointment.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{appointment.service.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {formatTime(appointment.scheduled_at)} - {formatTime(appointment.ends_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">{formatCurrency(appointment.amount)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-4xl mb-4 block">🎉</span>
                                    <p className="text-gray-500">No appointments scheduled for today</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="px-6 py-4 border-b">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">🔮 Upcoming Appointments</h2>
                                <Link
                                    href={route('agent.appointments')}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    View all →
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {upcoming_appointments.length > 0 ? (
                                <div className="space-y-4">
                                    {upcoming_appointments.map((appointment) => (
                                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-medium text-gray-900">{appointment.client.name}</h3>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {appointment.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{appointment.service.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(appointment.scheduled_at)} at {formatTime(appointment.scheduled_at)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">{formatCurrency(appointment.amount)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-4xl mb-4 block">📭</span>
                                    <p className="text-gray-500">No upcoming appointments</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}