const _profileApi = require('../api/profile');
const _constants = require('../constants');

var profileUtility = class ProfileUtility{
    constructor(apiBaseUrl, passport, passphrase) {
        this._profileService = new _profileApi.ProfileApi(apiBaseUrl, passport, passphrase);
    }

    async getAllProfileTypes(useApi){
        if(useApi){
            return await this._profileService.getAllProfileTypes();
        }
        else{
            return _constants.Constants.profileTypes;
        } 
    }
    
    async getProfileType(profileTypeId, useApi){
        if(!profileTypeId){
            throw new Error("profileTypeId not provided");
        }

        if(useApi){
            return await this._profileService.getProfileType(profileTypeId);
        }
        else{
           return this.getProfileTypeById(_constants.Constants.profileTypes);
        }
    }

    getProfileTypeById(profileTypes, profileTypeId){
        for(let i=0; i<profileTypes.length; i++){
            if(profileTypeId == profileTypes[i].id){
                return profileTypes[i];
            }
        }

        return null;
    }
};

exports.ProfileUtility = profileUtility;