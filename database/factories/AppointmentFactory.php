<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $client = User::factory()->create(['role' => 'client']);
        $agent = User::factory()->create(['role' => 'agent']);
        $service = Service::factory()->create();
        
        $scheduledAt = fake()->dateTimeBetween('+1 day', '+30 days');
        $endsAt = clone $scheduledAt;
        $endsAt->modify('+' . $service->duration_minutes . ' minutes');

        return [
            'client_id' => $client->id,
            'agent_id' => $agent->id,
            'service_id' => $service->id,
            'scheduled_at' => $scheduledAt,
            'ends_at' => $endsAt,
            'status' => fake()->randomElement(['pending', 'confirmed', 'completed']),
            'amount' => $service->price,
            'stripe_payment_intent_id' => fake()->optional()->regexify('pi_[a-zA-Z0-9]{24}'),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the appointment is confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
            'stripe_payment_intent_id' => fake()->regexify('pi_[a-zA-Z0-9]{24}'),
        ]);
    }

    /**
     * Indicate that the appointment is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'stripe_payment_intent_id' => null,
        ]);
    }

    /**
     * Indicate that the appointment is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'stripe_payment_intent_id' => fake()->regexify('pi_[a-zA-Z0-9]{24}'),
            'scheduled_at' => fake()->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }
}