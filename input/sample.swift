//
//  WalletHelperable.swift
//  Avantis
//
//  Created by Peerasak Unsakon on 16/7/2565 BE.
//

protocol LocalStorageHelperable {
    var passcode: String? { get set }
    var onGoingTransactions: [AVALocalTransaction] { get set }
    var finishedTransactions: [AVALocalTransaction] { get set }
    var isAlreadyInitialAppFirstLunch: Bool { get set }
    var isEnableBiometric: Bool { get set }
    var isSkipRestoreOrCreateWallet: Bool { get set }
    var isRegistered: Bool { get set }
    var localize: Localized? { get set }
    var accessToken: String? { get set }
    var refreshToken: String? { get set }
    var mnemonics: String? { get set }

    func initialFirstAppInstall()
}
