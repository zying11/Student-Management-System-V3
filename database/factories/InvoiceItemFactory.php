<?php

namespace Database\Factories;

use App\Models\InvoiceItem;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = InvoiceItem::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $price = $this->faker->randomFloat(2, 10, 100);
        $quantity = $this->faker->numberBetween(1, 3);
        $total = $price * $quantity;

        return [
            'invoice_id' => Invoice::factory(), // Generates an invoice if not passed
            'item_name' => $this->faker->randomElement(['Math', 'Science', 'English', 'History']),
            'quantity' => $quantity,
            'price' => $price,
            'discount' => 0.00,
            'total' => $total,
        ];
    }
}