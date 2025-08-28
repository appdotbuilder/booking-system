import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <AppLayout>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">👋 Welcome back, {user?.name}!</h1>
                    <p className="text-gray-600">Here's what's happening with your appointments</p>
                </div>

                {/* Client Dashboard */}
                {user?.role === 'client' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            href={route('home')}
                            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Book New Appointment</h3>
                                    <p className="text-gray-600">Browse services and schedule with your preferred agent</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('appointments.index')}
                            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">My Appointments</h3>
                                    <p className="text-gray-600">View your booking history and upcoming appointments</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Fallback for other roles or generic dashboard */}
                {user?.role !== 'client' && (
                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                        <span className="text-6xl mb-4 block">📊</span>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h3>
                        <p className="text-gray-600 mb-6">
                            {user?.role === 'admin' && "Manage your booking platform from the admin panel"}
                            {user?.role === 'agent' && "Track your appointments and manage your schedule"}
                            {!user?.role && "Welcome to your dashboard"}
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                href={route('appointments.index')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                View Appointments
                            </Link>
                            {user?.role === 'client' && (
                                <Link
                                    href={route('home')}
                                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Book Appointment
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Stats or Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Quick Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">📅</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">-</p>
                            <p className="text-sm text-gray-600">Total Appointments</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">✅</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">-</p>
                            <p className="text-sm text-gray-600">Completed</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">⏰</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">-</p>
                            <p className="text-sm text-gray-600">Upcoming</p>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            📊 Detailed statistics available in your appointments section
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}