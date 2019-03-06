const _profileApi = require('../api/profile');

var profileUtility = class ProfileUtility{
    constructor(apiBaseUrl, passport, passphrase) {
        this._profileService = new _profileApi.ProfileApi(apiBaseUrl, passport, passphrase);
    }

    async getAllProfileTypes(){
        return await this._profileService.getAllProfileTypes();
    }
    
    async getProfileType(profileTypeId){
        if(!profileTypeId){
            throw new Error("profileTypeId not provided");
        }

        return await this._profileService.getProfileType(profileTypeId);
    }
};

exports.ProfileUtility = profileUtility;