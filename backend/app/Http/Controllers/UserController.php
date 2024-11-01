<?php
namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;

use Illuminate\Http\JsonResponse;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function index(): JsonResponse {
        return $this->userService->getAllUsers();
    }

    public function show(int $id): JsonResponse {
        return $this->userService->getUserById($id);
    }

    public function store(UserStoreRequest $request): JsonResponse {
        return $this->userService->createUser($request->validated());
    }

    public function update(UserUpdateRequest $request, int $id): JsonResponse {
        return $this->userService->updateUser($request->validated(), $id);
    }

    public function destroy(int $id): JsonResponse {
        return $this->userService->deleteUser($id);
    }

    public function forgotPassword(ForgotPasswordRequest $request) :JsonResponse {
        return $this->userService->forgotPassword($request);
    }

    public function resetPassword(ResetPasswordRequest $request) :JsonResponse {
        return $this->userService->resetPassword($request);
    }
}