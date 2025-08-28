<?php

namespace Database\Seeders;

use App\Models\AgentAvailability;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BookingSystemSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@bookease.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create sample agents
        $agents = [];
        $agentData = [
            ['name' => 'Sarah Johnson', 'email' => 'sarah@bookease.com'],
            ['name' => 'Michael Davis', 'email' => 'michael@bookease.com'],
            ['name' => 'Emily Chen', 'email' => 'emily@bookease.com'],
            ['name' => 'David Wilson', 'email' => 'david@bookease.com'],
        ];

        foreach ($agentData as $agent) {
            $agents[] = User::create([
                'name' => $agent['name'],
                'email' => $agent['email'],
                'password' => Hash::make('password'),
                'role' => 'agent',
                'is_active' => true,
                'stripe_account_id' => 'acct_' . uniqid(),
                'email_verified_at' => now(),
            ]);
        }

        // Create sample clients
        $clients = [];
        $clientData = [
            ['name' => 'John Smith', 'email' => 'john@example.com'],
            ['name' => 'Lisa Brown', 'email' => 'lisa@example.com'],
            ['name' => 'Robert Taylor', 'email' => 'robert@example.com'],
            ['name' => 'Maria Garcia', 'email' => 'maria@example.com'],
            ['name' => 'James Anderson', 'email' => 'james@example.com'],
        ];

        foreach ($clientData as $client) {
            $clients[] = User::create([
                'name' => $client['name'],
                'email' => $client['email'],
                'password' => Hash::make('password'),
                'role' => 'client',
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        }

        // Create sample services
        $services = [];
        $serviceData = [
            [
                'name' => 'Hair Cut & Style',
                'description' => 'Professional haircut and styling service with consultation',
                'price' => 65.00,
                'duration_minutes' => 60,
            ],
            [
                'name' => 'Hair Color Treatment',
                'description' => 'Full hair coloring service with premium products',
                'price' => 120.00,
                'duration_minutes' => 120,
            ],
            [
                'name' => 'Deep Tissue Massage',
                'description' => 'Therapeutic massage for muscle tension and relaxation',
                'price' => 90.00,
                'duration_minutes' => 60,
            ],
            [
                'name' => 'Facial Treatment',
                'description' => 'Rejuvenating facial with cleansing and moisturizing',
                'price' => 85.00,
                'duration_minutes' => 90,
            ],
            [
                'name' => 'Manicure & Pedicure',
                'description' => 'Complete nail care service with polish',
                'price' => 55.00,
                'duration_minutes' => 75,
            ],
            [
                'name' => 'Personal Training Session',
                'description' => 'One-on-one fitness training with certified trainer',
                'price' => 75.00,
                'duration_minutes' => 60,
            ],
        ];

        foreach ($serviceData as $service) {
            $services[] = Service::create($service);
        }

        // Create agent availabilities
        $daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        
        foreach ($agents as $agent) {
            foreach ($daysOfWeek as $day) {
                // Most agents work 9 AM to 5 PM
                $startHour = $day === 'saturday' ? 10 : 9;
                $endHour = $day === 'saturday' ? 15 : 17;
                
                AgentAvailability::create([
                    'agent_id' => $agent->id,
                    'day_of_week' => $day,
                    'start_time' => sprintf('%02d:00:00', $startHour),
                    'end_time' => sprintf('%02d:00:00', $endHour),
                    'is_available' => true,
                ]);
            }
        }

        // Create sample appointments
        $statuses = ['confirmed', 'pending', 'completed'];
        
        for ($i = 0; $i < 20; $i++) {
            $agent = fake()->randomElement($agents);
            $client = fake()->randomElement($clients);
            $service = fake()->randomElement($services);
            
            // Generate random date within next 30 days or past 30 days
            $scheduledAt = fake()->dateTimeBetween('-30 days', '+30 days');
            $endsAt = clone $scheduledAt;
            $endsAt->modify('+' . $service->duration_minutes . ' minutes');
            
            // Set status based on date
            $status = $scheduledAt < now() ? 'completed' : fake()->randomElement(['confirmed', 'pending']);
            
            Appointment::create([
                'client_id' => $client->id,
                'agent_id' => $agent->id,
                'service_id' => $service->id,
                'scheduled_at' => $scheduledAt,
                'ends_at' => $endsAt,
                'status' => $status,
                'amount' => $service->price,
                'stripe_payment_intent_id' => $status === 'completed' ? 'pi_' . uniqid() : null,
                'notes' => fake()->optional(0.3)->sentence(),
            ]);
        }
    }
}