//
//  WalletHelperable.swift
//  Avantis
//
//  Created by 🕷 Natacha on 28/9/2565 BE.
//

import Foundation

class WalletHelperSpy: WalletHelperable {

    // MARK: - DEFAULT PROPERTIES
    var hasWallet: Bool
    var account: EthereumAccount?

    // MARK: - INJECTION PROPERTIES
    var fnGenerateMnemonicPhaseResult: [String]
    var fnGetMnemonicPhaseResult: [String]

    // MARK: - CALLED PROPERTIES
    var restoreWalletCalled: Bool = false
    var generateMnemonicPhaseCalled: Bool = false
    var getMnemonicPhaseCalled: Bool = false
    var unlinkWalletCalled: Bool = false

    init(fnGenerateMnemonicPhaseResult: [String], fnGetMnemonicPhaseResult: [String]) {
        self.fnGenerateMnemonicPhaseResult = fnGenerateMnemonicPhaseResult
        self.fnGetMnemonicPhaseResult = fnGetMnemonicPhaseResult
    }

    func restoreWallet(mnemonicWords: [String]) throws {
      restoreWalletCalled = true

    }

    func generateMnemonicPhase() throws -> [String] {
      generateMnemonicPhaseCalled = true

      return fnGenerateMnemonicPhaseResult
    }

    func getMnemonicPhase() throws -> [String] {
      getMnemonicPhaseCalled = true

      return fnGetMnemonicPhaseResult
    }

    func unlinkWallet() throws {
      unlinkWalletCalled = true

    }

    func resetSpy() {
      restoreWalletCalled = false
      generateMnemonicPhaseCalled = false
      getMnemonicPhaseCalled = false
      unlinkWalletCalled = false
    }

}
