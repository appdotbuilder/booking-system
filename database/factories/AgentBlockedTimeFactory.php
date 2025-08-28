<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AgentBlockedTime>
 */
class AgentBlockedTimeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('+1 day', '+30 days');
        $endTime = clone $startTime;
        $endTime->modify('+' . fake()->numberBetween(1, 4) . ' hours');

        $reasons = [
            'Personal appointment',
            'Lunch break',
            'Training session',
            'Equipment maintenance',
            'Sick leave',
            'Vacation',
            'Meeting',
            'Out of office',
        ];

        return [
            'agent_id' => User::factory()->create(['role' => 'agent'])->id,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'reason' => fake()->randomElement($reasons),
        ];
    }

    /**
     * Indicate that the blocked time is for vacation.
     */
    public function vacation(): static
    {
        return $this->state(fn (array $attributes) => [
            'reason' => 'Vacation',
        ]);
    }

    /**
     * Indicate that the blocked time is for a meeting.
     */
    public function meeting(): static
    {
        return $this->state(fn (array $attributes) => [
            'reason' => 'Team meeting',
        ]);
    }
}