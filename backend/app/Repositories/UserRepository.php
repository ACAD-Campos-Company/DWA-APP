<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function paginatedAllUsers(int $perPage = 50) {
        return User::paginate($perPage);
    }

    public function findActiveUserById(int $id): ?User {
        return User::where('id', $id)->whereNull('deleted_at')->first();
    }

    public function findActiveUserByDocument(string $document): ?User {
        return User::where('document', $document)->whereNull('deleted_at')->first();
    }

    public function paginateAllActiveUsers(int $perPage = 50) {
        return User::whereNull('deleted_at')->paginate($perPage);
    }

    public function create(array $data): User {
        return User::create($data);
    }

    public function update(User $user, array $data): bool {
        return $user->update($data);
    }

    public function softDelete(User $user): bool {
        return $user->update(['deleted_at' => now()]);
    }
}