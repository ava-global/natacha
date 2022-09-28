//
//  WalletHelperable.swift
//  Avantis
//
//  Created by Peerasak Unsakon on 16/7/2565 BE.
//

protocol EthereumServiceProtocol {
    func getGasPrice() async throws -> BigUInt
    func getEstimateGas(of transaction: EthereumTransaction) async throws -> BigUInt
    func getReceipt(txHash: String) async throws -> EthereumTransactionReceipt
    func getBalance(of token: Token) async throws -> BigUInt
    func getAllowance(token: Token,
                      spender: EthereumAddress) async throws -> BigUInt
    func getApproveTransaction(token: Token,
                               spender: EthereumAddress,
                               amount: BigUInt) throws -> EthereumTransaction
    func getBlockInfo(byNumber: BigUInt) async throws -> EthereumBlockInfo
    func approve(for token: Token,
                 spender: EthereumAddress,
                 amount: BigUInt,
                 gasLimit: BigUInt,
                 gasPrice: BigUInt) async throws -> String

    func send(transaction: EthereumTransaction) async throws -> String
    func update(account: EthereumAccountProtocol)
    func clearAccount()
}
