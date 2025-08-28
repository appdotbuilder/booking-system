<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\AgentAvailability
 *
 * @property int $id
 * @property int $agent_id
 * @property string $day_of_week
 * @property string $start_time
 * @property string $end_time
 * @property bool $is_available
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability query()
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability whereDayOfWeek($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability whereIsAvailable($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentAvailability whereUpdatedAt($value)
 * @method static \Database\Factories\AgentAvailabilityFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class AgentAvailability extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'agent_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_available' => 'boolean',
    ];

    /**
     * Get the agent for this availability
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}