<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Invoice::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'invoice_number' => 'INV-' . strtoupper($this->faker->unique()->bothify('#########')),
            'issue_date' => $this->faker->date(),
            'due_date' => $this->faker->date(),
            'student_id' => Student::factory(), // Generates a student if not passed
            'payment_method' => $this->faker->randomElement(['cash', 'card', 'bank transfer']),
            'add_notes' => $this->faker->sentence('-'),
            'total_payable' => 0,
        ];
    }
}
