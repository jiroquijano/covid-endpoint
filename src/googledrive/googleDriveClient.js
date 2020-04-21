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

const getFoldersList = async(callback) =>{
    try{
        const response = await drive.files.list({
            fields: 'files(id,name)',
            q: `'${DOH_DATA_ROOT_ID}' in parents and name contains 'DOH COVID Data Drop_'` //DOCS/search-files
            });
        callback(undefined,response.data.files);
    } catch(err) {
        callback(err,undefined);
    }
};

const getFolderWithDate = async (date, callback) =>{
    try{
        const response = await drive.files.list({
            fields: 'files(id,name)',
            q: `'${DOH_DATA_ROOT_ID}' in parents and name contains '${date}'`
        });
        if(response.data.files.length === 0) return callback({error:`DOH Data drop for ${date} (still) unavailable`},undefined);
        callback(undefined,response.data.files);

    }catch(err){
        callback(err,undefined);
    }
};

const getFileInfo = async(folderID, fileType, callback) =>{
    try{
        const response = await drive.files.list({
            fields: 'files(webContentLink,name,id)',
            q: `'${folderID}' in parents and name contains '${fileType}' and mimeType = "text/csv"`
        });
        callback(undefined,response.data.files);
    }catch(error){
        callback(error,undefined);
    }
};

const getDownloadLink = (date,fileType,callback)=>{
    getFolderWithDate(date,(error,folderData)=>{
        if(error) return callback(error,undefined);

        if(folderData.length > 0){
            const folderID = folderData[0].id;

            getFileInfo(folderID,fileType,(err,fileData)=>{
                if(err) return callback(err,undefined);
                callback(undefined,fileData);
            });

        }
    });
};

module.exports = {getFolderWithDate, getFoldersList, getDownloadLink};
