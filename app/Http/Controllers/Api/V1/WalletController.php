<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\WalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function __construct(
        private readonly WalletService $walletService,
    ) {
    }

    /**
     * Lấy số dư hiện tại
     */
    public function balance(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'balance' => $this->walletService->getBalance($request->user()),
            ],
        ]);
    }

    /**
     * Nạp tiền (demo — trong thực tế sẽ integrate payment gateway)
     */
    public function deposit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1000',
            'description' => 'nullable|string|max:255',
        ]);

        try {
            $transaction = $this->walletService->deposit(
                $request->user(),
                (float) $validated['amount'],
                $validated['description'] ?? 'Nạp tiền vào tài khoản',
            );

            return response()->json([
                'status' => 'success',
                'data' => [
                    'transaction' => $transaction,
                    'balance' => $this->walletService->getBalance($request->user()),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Lịch sử giao dịch
     */
    public function transactions(Request $request): JsonResponse
    {
        $transactions = $request->user()
            ->transactions()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $transactions,
        ]);
    }
}
