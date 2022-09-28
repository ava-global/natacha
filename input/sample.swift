//
//  WalletHelperable.swift
//  Avantis
//
//  Created by Peerasak Unsakon on 16/7/2565 BE.
//

import Foundation
import web3

public protocol WalletHelperable {
    var hasWallet: Bool { get }
    var account: EthereumAccount? { get }

    func restoreWallet(mnemonicWords: [String]) throws
    func generateMnemonicPhase() throws -> [String]
    func getMnemonicPhase() throws -> [String]
    func unlinkWallet() throws
}
