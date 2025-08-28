import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';

interface Appointment {
    id: number;
    scheduled_at: string;
    ends_at: string;
    status: string;
    amount: number;
    client: { name: string; email: string };
    agent: { name: string; email: string };
    service: { name: string };
}

interface PaginatedAppointments {
    data: Appointment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    appointments: PaginatedAppointments;
    [key: string]: unknown;
}

export default function AppointmentsIndex({ appointments }: Props) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title="My Appointments" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📋 My Appointments</h1>
                        <p className="text-gray-600">View and manage your booking history</p>
                    </div>
                    {user?.role === 'client' && (
                        <Link
                            href={route('home')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Book New Appointment
                        </Link>
                    )}
                </div>

                {appointments.data.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {user?.role !== 'client' && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                        )}
                                        {user?.role !== 'agent' && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {appointments.data.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-gray-50">
                                            {user?.role !== 'client' && (
                                                <td className="px-6 py-4 text-sm text-gray-900">{appointment.client.name}</td>
                                            )}
                                            {user?.role !== 'agent' && (
                                                <td className="px-6 py-4 text-sm text-gray-900">{appointment.agent.name}</td>
                                            )}
                                            <td className="px-6 py-4 text-sm text-gray-900">{appointment.service.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDateTime(appointment.scheduled_at)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                {formatCurrency(appointment.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Link
                                                    href={route('appointments.show', appointment.id)}
                                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {appointments.last_page > 1 && (
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                        Previous
                                    </span>
                                    <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                        Next
                                    </span>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing page <span className="font-medium">{appointments.current_page}</span> of{' '}
                                            <span className="font-medium">{appointments.last_page}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                        <span className="text-6xl mb-4 block">📅</span>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
                        <p className="text-gray-600 mb-6">
                            {user?.role === 'client' 
                                ? "You haven't booked any appointments yet. Start by browsing our services."
                                : "No appointments to display."
                            }
                        </p>
                        {user?.role === 'client' && (
                            <Link
                                href={route('home')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                            >
                                Book Your First Appointment
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}