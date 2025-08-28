import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

interface Appointment {
    id: number;
    scheduled_at: string;
    ends_at: string;
    status: string;
    amount: number;
    notes: string | null;
    stripe_payment_intent_id: string | null;
    client: { name: string; email: string };
    agent: { name: string; email: string };
    service: { name: string; description: string; duration_minutes: number };
}

interface Props {
    appointment: Appointment;
    [key: string]: unknown;
}

export default function AppointmentShow({ appointment }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            router.delete(route('appointments.destroy', appointment.id));
        }
    };

    const handleMarkCompleted = () => {
        router.patch(route('appointments.update', appointment.id), {
            status: 'completed'
        });
    };

    const isPast = new Date(appointment.scheduled_at) < new Date();
    const canCancel = !isPast && appointment.status !== 'cancelled' && appointment.status !== 'completed';
    const canMarkCompleted = appointment.status === 'confirmed' && isPast;

    return (
        <AppLayout>
            <Head title={`Appointment #${appointment.id}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📋 Appointment Details</h1>
                        <p className="text-gray-600">Appointment #{appointment.id}</p>
                    </div>
                    <Link
                        href={route('appointments.index')}
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        ← Back to Appointments
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Appointment Information</h2>
                                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Service</label>
                                    <p className="text-gray-900 font-medium">{appointment.service.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">{appointment.service.description}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
                                    <p className="text-gray-900">{appointment.service.duration_minutes} minutes</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Date & Time</label>
                                    <p className="text-gray-900 font-medium">{formatDateTime(appointment.scheduled_at)}</p>
                                    <p className="text-sm text-gray-600">
                                        Ends at {new Date(appointment.ends_at).toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
                                    <p className="text-gray-900 font-semibold text-lg">{formatCurrency(appointment.amount)}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Client</label>
                                    <p className="text-gray-900 font-medium">{appointment.client.name}</p>
                                    <p className="text-sm text-gray-600">{appointment.client.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Agent</label>
                                    <p className="text-gray-900 font-medium">{appointment.agent.name}</p>
                                    <p className="text-sm text-gray-600">{appointment.agent.email}</p>
                                </div>
                            </div>

                            {appointment.notes && (
                                <div className="mt-6 pt-6 border-t">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Notes</label>
                                    <p className="text-gray-900">{appointment.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Payment Information */}
                        {appointment.stripe_payment_intent_id && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Payment Information</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-green-600 text-sm">✓</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Payment Status</p>
                                            <p className="font-medium text-green-600">Paid</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment ID</p>
                                        <p className="font-mono text-sm text-gray-900">{appointment.stripe_payment_intent_id}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                {canMarkCompleted && (
                                    <Button 
                                        onClick={handleMarkCompleted}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        ✅ Mark as Completed
                                    </Button>
                                )}

                                <Link
                                    href={route('appointments.edit', appointment.id)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center block transition-colors"
                                >
                                    ✏️ Edit Appointment
                                </Link>

                                {canCancel && (
                                    <Button 
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="w-full border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                        ❌ Cancel Appointment
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="font-medium text-gray-900 mb-3">📞 Need Help?</h4>
                            <p className="text-sm text-gray-600 mb-3">
                                Contact our support team if you need to make changes to your appointment.
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                    <span className="text-gray-500 mr-2">📧</span>
                                    <span className="text-gray-700">support@bookease.com</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-500 mr-2">📱</span>
                                    <span className="text-gray-700">(555) 123-4567</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}