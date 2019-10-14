class Constants {
    constructor() {
        this.bridgeApiUrl = "https://bridgeprotocol.azurewebsites.net/api/";
        this.bridgeExplorerUrl = "https://bridgeprotocol.azurewebsites.net/explorer/";
        this.bridgePassportId = "d7bc3488073454a6ce32b13a1e8cda6a8bddf16d";
        this.bridgePublicKey = "2d2d2d2d2d424547494e20504750205055424c4943204b455920424c4f434b2d2d2d2d2d0a56657273696f6e3a204b657962617365204f70656e5047502076322e302e38320a436f6d6d656e743a2068747470733a2f2f6b6579626173652e696f2f63727970746f0a0a786d384558482b734e684d464b34454541434944417753523271707949585168386a6f6f7936794c52624b546942585345467a537a2f4d615976516e395649360a795a4a7634584e38525139744d733957593771665474694e4f324e41437635324b634b4c46752f2b456a486a4d6f4c78596671334739693762495565654d55740a7a62734245675944553031646f31715641515a6141767a4e466e567a5a584a41596e4a705a47646c63484a766447396a6232777561572f436c67515445776f410a4867554358482b734e67496241514d4c4351634446516f494168344241686541417859434151495a4151414b435241656a4e70716939337862576a49415944690a3870594b766148594b512b2b3555654a58425653377a704f3441485943675a4f4872696e4458325037476f766669524a65416e4851597a7576587079577677420a6632684c73424666354938796b6b2b4c30332b56575269723665795135454268394c764f69796b4f6a447852766b6d53524273466b5152624f366a52706176780a384d35574246782f7244595343437147534d34394177454841674d455a7a6e394e476b4f4757757147666564753237334577565050324e6f4d6c725a2b73567a0a6b65524d6b3257785635395a6876764f622b79694e4b4d5964393370505737545a75304d33707970363176444977496e76414d4243676e436877515945776f410a4477554358482b734e67554a44776d63414149624441414b435241656a4e7071693933786261776d41583439465564637a735044367a6c304a6663384552716f0a39416d686f746b42414f7835734876696730564c5a396e46552b726947664b734d624a58316639772b645942674c49365a4c45754132425841586536382f63690a56363242324c704a354235765352436b6e6a356c2f376464596f5a4b34762b6575634a38514f54596132454c4b7335534246782f7244595443437147534d34390a4177454841674d454c6e55467059446534554d51663669697359314f585a32336f6350445937575449696165575a51667a4d37736b6a7437656e4841705136770a334768424c376468785043484a5251526877487a594c2b6e6d4f364e6d4d4c414a77515945776f414477554358482b734e67554a44776d6341414962496742710a435241656a4e7071693933786256386742426b544367414742514a636636773241416f4a45427a3278412b627a32726e61484d42414f30374b4f505242384c4a0a384f575467376a732b6b5678763152566f557a506b466655756f354257452f2f4150774a4f6e3637764f684857634870796f6f6a6f7553554b53774f655554330a64784e7272414c4b2f6f3758383557744158394462707a48346459476c372f6f76515667456f6f48585a79374f6874366f6b56576b7a506f6f5a324e4b2f356d0a42654b3473362b362b61486d467376704a4c51426750757534476a686935795a703348326e6866727a54554e786c6850744a787a2b454a744d7973455432386c0a565735426a643666766a6d6b743051625039472b61773d3d0a3d585855540a2d2d2d2d2d454e4420504750205055424c4943204b455920424c4f434b2d2d2d2d2d0a";
        this.bridgeContractHash = "0xe7692ab0005cda56121e4d5384e7647f97f3035d";
        this.bridgeContractAddress = "AS6suhfGBbj9temaLLHSQRZ363xdx8e94n";
        this.bridgeAddress = "ALEN8KC46GLaadRxaWdvYBUhdokT3RhxPC";
        this.brdgHash = "0xbac0d143a547dc66a1d6a2b7d66b06de42614971";
        this.neoHash = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
        this.gasHash = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
        this.partners = this.getPartners();
        this.claimTypes = this.getClaimTypes();
        this.profileTypes = this.getProfileTypes();
    }

    getPartners() {
        return [
            {
                "id": "d7bc3488073454a6ce32b13a1e8cda6a8bddf16d",
                "name": "Bridge Protocol Corporation",
                "publicKey": "2d2d2d2d2d424547494e20504750205055424c4943204b455920424c4f434b2d2d2d2d2d0a56657273696f6e3a204b657962617365204f70656e5047502076322e302e38320a436f6d6d656e743a2068747470733a2f2f6b6579626173652e696f2f63727970746f0a0a786d384558482b734e684d464b34454541434944417753523271707949585168386a6f6f7936794c52624b546942585345467a537a2f4d615976516e395649360a795a4a7634584e38525139744d733957593771665474694e4f324e41437635324b634b4c46752f2b456a486a4d6f4c78596671334739693762495565654d55740a7a62734245675944553031646f31715641515a6141767a4e466e567a5a584a41596e4a705a47646c63484a766447396a6232777561572f436c67515445776f410a4867554358482b734e67496241514d4c4351634446516f494168344241686541417859434151495a4151414b435241656a4e70716939337862576a49415944690a3870594b766148594b512b2b3555654a58425653377a704f3441485943675a4f4872696e4458325037476f766669524a65416e4851597a7576587079577677420a6632684c73424666354938796b6b2b4c30332b56575269723665795135454268394c764f69796b4f6a447852766b6d53524273466b5152624f366a52706176780a384d35574246782f7244595343437147534d34394177454841674d455a7a6e394e476b4f4757757147666564753237334577565050324e6f4d6c725a2b73567a0a6b65524d6b3257785635395a6876764f622b79694e4b4d5964393370505737545a75304d33707970363176444977496e76414d4243676e436877515945776f410a4477554358482b734e67554a44776d63414149624441414b435241656a4e7071693933786261776d41583439465564637a735044367a6c304a6663384552716f0a39416d686f746b42414f7835734876696730564c5a396e46552b726947664b734d624a58316639772b645942674c49365a4c45754132425841586536382f63690a56363242324c704a354235765352436b6e6a356c2f376464596f5a4b34762b6575634a38514f54596132454c4b7335534246782f7244595443437147534d34390a4177454841674d454c6e55467059446534554d51663669697359314f585a32336f6350445937575449696165575a51667a4d37736b6a7437656e4841705136770a334768424c376468785043484a5251526877487a594c2b6e6d4f364e6d4d4c414a77515945776f414477554358482b734e67554a44776d6341414962496742710a435241656a4e7071693933786256386742426b544367414742514a636636773241416f4a45427a3278412b627a32726e61484d42414f30374b4f505242384c4a0a384f575467376a732b6b5678763152566f557a506b466655756f354257452f2f4150774a4f6e3637764f684857634870796f6f6a6f7553554b53774f655554330a64784e7272414c4b2f6f3758383557744158394462707a48346459476c372f6f76515667456f6f48585a79374f6874366f6b56576b7a506f6f5a324e4b2f356d0a42654b3473362b362b61486d467376704a4c51426750757534476a686935795a703348326e6866727a54554e786c6850744a787a2b454a744d7973455432386c0a565735426a643666766a6d6b743051625039472b61773d3d0a3d585855540a2d2d2d2d2d454e4420504750205055424c4943204b455920424c4f434b2d2d2d2d2d0a",
                "verificationServices": [
                    "emailVerification",
                    "identityVerification",
                    "watchlistSearch"
                ],
                "infoUrl": "https://bridgeprotocol.azurewebsites.net/verification"
            },
        ]
    }

    getClaimTypes() {
        return [
            {
                "id": 1,
                "name": "First Name",
                "description": "Owner first name",
                "dataType": "string",
                "scope": "private",
                "defaultExpirationDays": 0
            },
            {
                "id": 2,
                "name": "Last Name",
                "description": "Owner last name",
                "dataType": "string",
                "scope": "private",
                "defaultExpirationDays": 0
            },
            {
                "id": 3,
                "name": "Email Address",
                "description": "Owner verified email address",
                "dataType": "string",
                "scope": "private",
                "defaultExpirationDays": 0
            },
            {
                "id": 4,
                "name": "Date of Birth",
                "description": "Owner date of birth",
                "dataType": "string",
                "scope": "private",
                "defaultExpirationDays": 0
            },
            {
                "id": 5,
                "name": "Gender",
                "description": "Owner gender",
                "dataType": "string",
                "scope": "private",
                "defaultExpirationDays": 0
            },
            {
                "id": 100001,
                "name": "Over 18",
                "description": "This claim verifies that the owner is over the age of 18 as verified by one or more official documents that comply with KYC and AML regulation.",
                "dataType": "boolean",
                "scope": "public",
                "defaultExpirationDays": 0
            },
            {
                "id": 100002,
                "name": "Over 21",
                "description": "This claim verifies that the owner is over the age of 21 as verified by one or more official documents that comply with KYC and AML regulation.",
                "dataType": "boolean",
                "scope": "public",
                "defaultExpirationDays": 0
            },
            {
                "id": 100003,
                "name": "Accredited Investor",
                "description": "This claim verifies that the owner is an accredited investor.",
                "dataType": "boolean",
                "scope": "public",
                "defaultExpirationDays": 90
            },
            {
                "id": 100004,
                "name": "Nationality",
                "description": "The verified country of origin for the owner",
                "dataType": "string",
                "scope": "public",
                "defaultExpirationDays": 90
            },
            {
                "id": 100005,
                "name": "State / Province",
                "description": "The verified state or province for the owner",
                "dataType": "string",
                "scope": "public",
                "defaultExpirationDays": 90
            },
            {
                "id": 100006,
                "name": "Watchlist Clear",
                "description": "This claim verifies that the owner was not found on any watchlists.",
                "dataType": "boolean",
                "scope": "public",
                "defaultExpirationDays": 90
            },
            {
                "id": 100007,
                "name": "Visual Watchlist Clear",
                "description": "This claim verifies that the owner was not found on any facial match watchlists.",
                "dataType": "boolean",
                "scope": "public",
                "defaultExpirationDays": 90
            }
        ];
    }

    getProfileTypes() {
        return [
            {
                "id": 1,
                "name": "Age Verification Over 18",
                "description": "Age Verification Profile for 18+",
                "claimTypes": [
                    100001
                ]
            },
            {
                "id": 2,
                "name": "Age Verification Over 21",
                "description": "Age Verification Profile for 21+",
                "claimTypes": [
                    100002
                ]
            },
            {
                "id": 3,
                "name": "Basic KYC and AML Profile",
                "description": "KYC Profile to verify the owner is over the age of 18, that they are not on any text watchlists, and provides their nationality.",
                "claimTypes": [
                    100001,
                    100004,
                    100005
                ]
            }
        ];
    }
}

exports.Constants = new Constants();