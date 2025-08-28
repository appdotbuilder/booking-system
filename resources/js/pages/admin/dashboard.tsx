import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Stats {
    total_appointments: number;
    total_revenue: number;
    total_agents: number;
    total_clients: number;
    monthly_revenue: number;
}

interface Appointment {
    id: number;
    scheduled_at: string;
    status: string;
    amount: number;
    client: { name: string };
    agent: { name: string };
    service: { name: string };
}

interface Props {
    stats: Stats;
    recent_appointments: Appointment[];
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, recent_appointments }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🔧 Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your booking platform and monitor performance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <span className="text-xl">📅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_appointments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-xl">💰</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.total_revenue)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <span className="text-xl">💼</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_agents}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <span className="text-xl">👤</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                                <p className="text-2xl font-semibold text-gray-900">{stats.total_clients}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <span className="text-xl">📊</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.monthly_revenue)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        href={route('admin.manage', { type: 'services' })}
                        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Manage Services</h3>
                                <p className="text-gray-600">Add, edit, or remove services</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href={route('admin.manage', { type: 'agents' })}
                        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Manage Agents</h3>
                                <p className="text-gray-600">View and configure agent accounts</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href={route('admin.manage', { type: 'appointments' })}
                        className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <span className="text-2xl">📋</span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
                                <p className="text-gray-600">Monitor all bookings and payments</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                            <Link
                                href={route('admin.manage', { type: 'appointments' })}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                View all →
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recent_appointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{appointment.client.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{appointment.agent.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{appointment.service.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(appointment.scheduled_at)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(appointment.amount)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                appointment.status === 'confirmed' 
                                                    ? 'bg-green-100 text-green-800'
                                                    : appointment.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : appointment.status === 'completed'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}