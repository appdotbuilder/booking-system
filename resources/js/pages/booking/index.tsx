import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    duration_minutes: number;
    formatted_price: string;
    formatted_duration: string;
}

interface Agent {
    id: number;
    name: string;
    email: string;
}

interface Props {
    services: Service[];
    agents: Agent[];
    [key: string]: unknown;
}

export default function BookingIndex({ services, agents }: Props) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<Array<{
        start_time: string;
        end_time: string;
        display_time: string;
    }>>([]);
    const [loading, setLoading] = useState(false);

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setSelectedAgent(null);
        setSelectedDate('');
        setAvailableSlots([]);
    };

    const handleAgentSelect = (agent: Agent) => {
        setSelectedAgent(agent);
        setSelectedDate('');
        setAvailableSlots([]);
    };

    const handleDateSelect = async (date: string) => {
        setSelectedDate(date);
        if (!selectedService || !selectedAgent) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/booking/availability?service_id=${selectedService.id}&agent_id=${selectedAgent.id}&date=${date}`);
            const data = await response.json();
            setAvailableSlots(data.available_slots || []);
        } catch (error) {
            console.error('Error fetching availability:', error);
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = (slot: { start_time: string; end_time: string; display_time: string }) => {
        router.post(route('appointments.store'), {
            service_id: selectedService?.id,
            agent_id: selectedAgent?.id,
            scheduled_at: slot.start_time,
            notes: '',
        });
    };

    return (
        <>
            <Head title="Book Appointment" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 Book an Appointment</h1>
                        <p className="text-gray-600">Select a service, choose your preferred agent, and pick a time that works for you.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Step 1: Select Service */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm mr-2">1</span>
                                Choose Service
                            </h2>
                            <div className="space-y-3">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => handleServiceSelect(service)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                            selectedService?.id === service.id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium text-gray-900">{service.name}</h3>
                                            <span className="text-blue-600 font-semibold">{service.formatted_price}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                                        <span className="text-xs text-gray-500">⏱️ {service.formatted_duration}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Select Agent */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm mr-2">2</span>
                                Choose Agent
                            </h2>
                            {!selectedService ? (
                                <p className="text-gray-500 text-sm">Please select a service first</p>
                            ) : (
                                <div className="space-y-3">
                                    {agents.map((agent) => (
                                        <div
                                            key={agent.id}
                                            onClick={() => handleAgentSelect(agent)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                                selectedAgent?.id === agent.id
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium mr-3">
                                                    {agent.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{agent.name}</h3>
                                                    <p className="text-sm text-gray-600">{agent.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Step 3: Select Date & Time */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900">
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm mr-2">3</span>
                                Pick Date & Time
                            </h2>
                            {!selectedService || !selectedAgent ? (
                                <p className="text-gray-500 text-sm">Please select a service and agent first</p>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            value={selectedDate}
                                            onChange={(e) => handleDateSelect(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {selectedDate && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                                            {loading ? (
                                                <div className="text-center py-4">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                                    <p className="text-sm text-gray-500 mt-2">Loading availability...</p>
                                                </div>
                                            ) : availableSlots.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                                    {availableSlots.map((slot, index) => (
                                                        <Button
                                                            key={index}
                                                            onClick={() => handleBooking(slot)}
                                                            variant="outline"
                                                            className="text-sm hover:bg-blue-50 hover:border-blue-300"
                                                        >
                                                            {slot.display_time}
                                                        </Button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm py-4 text-center">
                                                    No available slots for this date. Please try another date.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    {selectedService && selectedAgent && (
                        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">📋 Booking Summary</h3>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <label className="text-gray-600">Service:</label>
                                    <p className="font-medium">{selectedService.name}</p>
                                    <p className="text-blue-600">{selectedService.formatted_price}</p>
                                </div>
                                <div>
                                    <label className="text-gray-600">Agent:</label>
                                    <p className="font-medium">{selectedAgent.name}</p>
                                </div>
                                <div>
                                    <label className="text-gray-600">Duration:</label>
                                    <p className="font-medium">{selectedService.formatted_duration}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}