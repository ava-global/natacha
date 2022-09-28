//
//  WalletHelperable.swift
//  Avantis
//
//  Created by Peerasak Unsakon on 16/7/2565 BE.
//

protocol CryptographicHelperable {
    func encrypt(plaintext: String, forKey keyName: String) throws -> Data
    func decrypt(_ ciphertext: Data, forKeyName keyName: String) throws -> Data
    func removeKey(_ name: String)
}
