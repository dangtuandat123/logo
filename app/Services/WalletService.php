<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * WalletService
 * Xử lý cộng/trừ số dư tài khoản với DB transaction + locking
 * để đảm bảo ACID và tránh race conditions.
 */
class WalletService
{
    /**
     * Nạp tiền vào tài khoản user
     *
     * @throws \Exception Nếu amount <= 0
     */
    public function deposit(User $user, float $amount, string $description = 'Nạp tiền', ?string $referenceId = null): Transaction
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Số tiền nạp phải lớn hơn 0.');
        }

        return DB::transaction(function () use ($user, $amount, $description, $referenceId) {
            // Lock row user để tránh race condition
            $user = User::lockForUpdate()->find($user->id);

            $newBalance = (float) $user->balance + $amount;
            $user->update(['balance' => $newBalance]);

            return Transaction::create([
                'user_id' => $user->id,
                'type' => 'deposit',
                'amount' => $amount,
                'balance_after' => $newBalance,
                'description' => $description,
                'reference_id' => $referenceId,
            ]);
        });
    }

    /**
     * Trừ tiền từ tài khoản user
     *
     * @throws \Exception Nếu không đủ số dư hoặc amount <= 0
     */
    public function deduct(User $user, float $amount, string $description = 'Tải logo', ?string $referenceId = null): Transaction
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Số tiền trừ phải lớn hơn 0.');
        }

        return DB::transaction(function () use ($user, $amount, $description, $referenceId) {
            // Lock row user để tránh race condition
            $user = User::lockForUpdate()->find($user->id);

            if ((float) $user->balance < $amount) {
                throw new \Exception('Số dư không đủ. Vui lòng nạp thêm tiền.');
            }

            $newBalance = (float) $user->balance - $amount;
            $user->update(['balance' => $newBalance]);

            return Transaction::create([
                'user_id' => $user->id,
                'type' => 'deduct',
                'amount' => $amount,
                'balance_after' => $newBalance,
                'description' => $description,
                'reference_id' => $referenceId,
            ]);
        });
    }

    /**
     * Lấy số dư hiện tại (refresh từ DB)
     */
    public function getBalance(User $user): float
    {
        $user->refresh();
        return (float) $user->balance;
    }
}
