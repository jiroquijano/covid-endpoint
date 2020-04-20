//GOOGLE DRIVE API DOCS: https://developers.google.com/drive/api/v3/
const {google} = require('googleapis');
const credentials = require('../../creds/credentials.json'); //get generated credentials key
const DOH_DATA_ROOT_ID = '10VkiUA8x7TS2jkibhSZK1gmWxFM-EoZP' //Folder ID of DOH Data
const scopes = ['https://www.googleapis.com/auth/drive']; //set scope to accessing drive api
const auth = new google.auth.JWT( //create new authorization object using JWT (JSON Web Token)
    credentials.client_email,
    null,
    credentials.private_key,
    scopes
);

const drive = google.drive({version: "v3", auth}); //get drive client using auth object

const getFoldersList = (callback)=>{
    drive.files.list({
        fields: 'files(id,name)',
        q: `'${DOH_DATA_ROOT_ID}' in parents and name contains 'DOH COVID Data Drop_'` //DOCS/search-files
    },(err,res)=>{
        if(err) callback({error:'Operation failed!'},undefined);
        callback(undefined,res.data);
    });
};

const getFolderID = (date, callback) =>{
    drive.files.list({
        fields: 'files(id,name)',
        q: `'${DOH_DATA_ROOT_ID}' in parents and name contains '${date}'`
    },(err,res)=>{
        if(err) callback({error: "Operation failed!"}, undefined);
        const files = res.data.files;
        if(files.length){
            callback(undefined, files);
        }else{
            callback({error:"No files found"}, undefined);
        }
    });
};

module.exports = {getFolderID, getFoldersList};
