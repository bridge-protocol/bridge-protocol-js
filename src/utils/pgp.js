var kbpgp = require("kbpgp");

var pgpUtility = class PgpUtility {
	constructor() { }

	readArmoredPrivateKey(armoredPrivateKey, passphrase) {
		return new Promise((resolve, reject) => {
			kbpgp.KeyManager.import_from_armored_pgp({ armored: armoredPrivateKey }, function (err, privateKeyManager) {
				if (!err) {
					if (privateKeyManager.is_pgp_locked()) {
						privateKeyManager.unlock_pgp({ passphrase: passphrase }, function (err) {
							if (!err) {
								resolve(privateKeyManager);
							}
							else reject(err);
						});
					}
					else {
						resolve(privateKeyManager);
					}
				}
				else reject(err);
			});
		});
	}

	readArmoredPublicKey(armoredPublicKey) {
		//Read the armored public key and return the non-armored key manager
		return new Promise((resolve, reject) => {
			kbpgp.KeyManager.import_from_armored_pgp({ armored: armoredPublicKey }, function (err, publicKeyManager) {
				if (err) reject(err);
				else resolve(publicKeyManager);
			});
		})
	}

	getFingerprintForPublicKey(armoredPublicKey) {
		//Import the key into the key manager, then export the fingerprint as hex
		return new Promise((resolve, reject) => {
			kbpgp.KeyManager.import_from_armored_pgp({ armored: armoredPublicKey }, function (err, keyManager) {
				if (err) reject(err);
				else resolve(keyManager.get_pgp_fingerprint().toString('hex'));
			});
		});
	}

	async generateKey(passphrase) {
		var newKey = {
			public: null,
			private: null
		};

		var key = await generateKeyAndSign();
		newKey.private = await privateExport();
		newKey.public = await publicExport();
		return newKey;

		function generateKeyAndSign() {
			return new Promise((resolve, reject) => {
				kbpgp.KeyManager.generate_ecc({ userid: "user@bridgeprotocol.io" }, function (err, theKey) {
					if (err) reject(err);
					else {
						theKey.sign({}, function (err2) {
							if (err2) reject(err2);
							else resolve(theKey);
						});
					}
				});
			});
		}
		function privateExport() {
			return new Promise((resolve, reject) => {
				key.export_pgp_private({ passphrase: passphrase }, function (err, pgp_private) {
					if (err) reject(err);
					else {
						resolve(pgp_private);
					}
				});
			})
		}
		function publicExport() {
			return new Promise((resolve, reject) => {
				key.export_pgp_public({}, function (err, pgp_public) {
					if (err) reject(err);
					else {
						resolve(pgp_public);
					}
				});
			})
		}
	}

	async encrypt(message, publicKey, privateKey, passphrase) {
		var params = {
			msg: message,
			encrypt_for: await this.readArmoredPublicKey(publicKey),
			sign_with: await this.readArmoredPrivateKey(privateKey, passphrase)
		};

		return new Promise((resolve, reject) => {
			kbpgp.box(params, function (err, result_string, result_buffer) {
				if (err) reject(err);
				else resolve(result_string);
			});
		});
	}

	async sign(message, privateKey, passphrase) {
		var params = {
			detached: false,
			msg: message,
			sign_with: await this.readArmoredPrivateKey(privateKey, passphrase)
		};

		return new Promise((resolve, reject) => {
			kbpgp.box(params, function (err, result_string, result_buffer) {
				if (err) reject(err);
				else resolve(result_string);
			});
		});
	}

	async decryptAndVerify(options) {
		// options = {
		// 	message: 'hadur',
		// 	publicKey: 'hadak ura',
		// 	privateKey: 'hodor',
		// 	passphrase: 'hold the door'
		// };
		var fingerprint = await this.getFingerprintForPublicKey(options.publicKey);
		var ring;
		if (options.privateKey)
			ring = await getKeyring(options.publicKey, options.privateKey, options.passphrase);
		else
			ring = await getKeyring(options.publicKey);

		var result = await unbox(ring, options.message);

		return {
			decryptedContent: result.decryptedContent,
			verified: result.signerFingerprint === fingerprint
		};
	}
};

function unbox(keyring, content) {
	return new Promise((resolve, reject) => {
		kbpgp.unbox({ keyfetch: keyring, armored: content }, (err, literals) => {
			if (err) {
				console.log(`Problem: ${err}`);
				reject(err);
			}
			else {
				var decryptedContent = literals[0].toString();

				var ds = null, km = null;
				ds = literals[0].get_data_signer();
				if (ds) { km = ds.get_key_manager(); }

				if (km) {
					var signerFingerprint = km.get_pgp_fingerprint().toString('hex');

					resolve({
						signerFingerprint,
						decryptedContent
					});
				}
				else
					reject(new Error("Key manager not found."));
			}
		});
	});
}

async function getKeyring(publicKey, privateKey, passphrase) {
	var ring = new kbpgp.keyring.KeyRing();
	var result = [];
	var km = await (publicKey ? importKey(publicKey) : importKey(privateKey));
	var otherKm;

	if (publicKey && privateKey) {
		let merge = await mergePrivate(km, privateKey);
		if(merge && km.is_pgp_locked())
			await unlock(km, passphrase);
		else if(!merge){
			// if keys don't match, we need a separate key manager for each
			otherKm = await importKey(privateKey);

			if (otherKm.is_pgp_locked()) 
				await unlock(otherKm, passphrase);
				
			result.push(otherKm);
		}
	}

	result.push(km);

	for (let item of result)
		ring.add_key_manager(item);

	return ring;

	function importKey(key) {
		return new Promise((resolve, reject) => {
			kbpgp.KeyManager.import_from_armored_pgp({ armored: key }, function (err, km) {
				if (err) reject(err);
				else resolve(km);
			});
		});
	}

	function mergePrivate(keyManager, privKey) {
		return new Promise((resolve, reject) => {
			if (!privKey) resolve();
			keyManager.merge_pgp_private({ armored: privKey }, function (err) {
				if (err)
					resolve(false);
				else 
					resolve(true);
			});
		});
	}

	function unlock(keyManager, passphrase) {
		return new Promise((resolve, reject) => {
			keyManager.unlock_pgp({ passphrase }, function (err) {
				if (err) reject(err);
				else resolve();
			});
		});
	}
};

exports.PgpUtility = new pgpUtility();