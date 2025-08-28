<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $services = [
            ['name' => 'Hair Cut & Style', 'duration' => 60, 'price' => [45, 85]],
            ['name' => 'Hair Color', 'duration' => 120, 'price' => [80, 150]],
            ['name' => 'Facial Treatment', 'duration' => 90, 'price' => [60, 120]],
            ['name' => 'Massage Therapy', 'duration' => 60, 'price' => [70, 130]],
            ['name' => 'Manicure', 'duration' => 45, 'price' => [25, 50]],
            ['name' => 'Pedicure', 'duration' => 60, 'price' => [35, 65]],
            ['name' => 'Makeup Application', 'duration' => 45, 'price' => [40, 80]],
            ['name' => 'Eyebrow Shaping', 'duration' => 30, 'price' => [20, 40]],
        ];

        $service = fake()->randomElement($services);

        return [
            'name' => $service['name'],
            'description' => fake()->paragraph(2),
            'price' => fake()->randomFloat(2, $service['price'][0], $service['price'][1]),
            'duration_minutes' => $service['duration'],
            'is_active' => fake()->boolean(90), // 90% chance of being active
        ];
    }

    /**
     * Indicate that the service is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the service is premium.
     */
    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'price' => fake()->randomFloat(2, 150, 300),
            'duration_minutes' => fake()->randomElement([90, 120, 180]),
            'name' => 'Premium ' . fake()->randomElement(['Spa Package', 'Luxury Treatment', 'Executive Service']),
        ]);
    }
}