//
//  WalletHelperable.swift
//  Avantis
//
//  Created by 🕷 Natacha on 28/9/2565 BE.
//

import Foundation

class LocalStorageHelperSpy: LocalStorageHelperable {

    // MARK: - DEFAULT PROPERTIES
    var passcode: String?
    var onGoingTransactions: [AVALocalTransaction]
    var finishedTransactions: [AVALocalTransaction]
    var isAlreadyInitialAppFirstLunch: Bool
    var isEnableBiometric: Bool
    var isSkipRestoreOrCreateWallet: Bool
    var isRegistered: Bool
    var localize: Localized?
    var accessToken: String?
    var refreshToken: String?
    var mnemonics: String?

    // MARK: - INJECTION PROPERTIES

    // MARK: - CALLED PROPERTIES
    var initialFirstAppInstallCalled: Bool = false

    init() {
    }

    func initialFirstAppInstall() {
      initialFirstAppInstallCalled = true

    }

    func resetSpy() {
      initialFirstAppInstallCalled = false
    }

}
