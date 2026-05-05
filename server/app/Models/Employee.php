<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'dob',
        'salary',
        'hobby',
        'description',
        'position',
    ];

    protected $casts = [
        'dob' => 'date',
        'salary' => 'decimal:2',
    ];
}
