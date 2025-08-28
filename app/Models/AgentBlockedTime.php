<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\AgentBlockedTime
 *
 * @property int $id
 * @property int $agent_id
 * @property \Illuminate\Support\Carbon $start_time
 * @property \Illuminate\Support\Carbon $end_time
 * @property string|null $reason
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|AgentBlockedTime newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AgentBlockedTime newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AgentBlockedTime query()
 * @method static \Illuminate\Database\Eloquent\Builder|AgentBlockedTime whereAgentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentBlockedTime whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentBlockedTime whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentBlockedTime whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentBlockedTime whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentBlockedTime whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AgentBlockedTime whereUpdatedAt($value)
 * @method static \Database\Factories\AgentBlockedTimeFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class AgentBlockedTime extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'agent_id',
        'start_time',
        'end_time',
        'reason',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Get the agent for this blocked time
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}