<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AgentAvailability>
 */
class AgentAvailabilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startHour = fake()->numberBetween(8, 16); // 8 AM to 4 PM start
        $endHour = $startHour + fake()->numberBetween(4, 8); // 4-8 hour shifts

        return [
            'agent_id' => User::factory()->create(['role' => 'agent'])->id,
            'day_of_week' => fake()->randomElement(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
            'start_time' => sprintf('%02d:00:00', $startHour),
            'end_time' => sprintf('%02d:00:00', min($endHour, 22)), // Max 10 PM
            'is_available' => fake()->boolean(85), // 85% chance of being available
        ];
    }

    /**
     * Indicate that the availability is for weekdays only.
     */
    public function weekdays(): static
    {
        return $this->state(fn (array $attributes) => [
            'day_of_week' => fake()->randomElement(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
        ]);
    }

    /**
     * Indicate that the availability is for weekends only.
     */
    public function weekends(): static
    {
        return $this->state(fn (array $attributes) => [
            'day_of_week' => fake()->randomElement(['saturday', 'sunday']),
        ]);
    }
}