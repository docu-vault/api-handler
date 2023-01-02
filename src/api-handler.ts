const axios = require('axios');
const {Logger} = require('@docu-vault/logger');

const logger = new Logger('APIHandler: ');

/* 
 Thisi  a generic data service to fetch data from api's. It is expected that there is some
 level of interfacing to be followed for this to work in general.
 */
export class APIHandler
{
    private url : string;

	/* url is base url of the api */
    constructor (url: string )
    {
        this.url = url;
        logger.debug('APIHandler: url passed is' , url);
    }
    /*
    Packages the response and results so that it would be consistent for the 
    caller in case of success or error 
    data = {
        ok : boolean // true if no error. false if there is an error
        message: String // error message in case of error. otherwise null
        result: [] //an array of objects. 
    }
    */
    returnStatus (response : any, result: any) 
    {
        var res : any = {};
        //logger.debug('returnStatus: response is : ', response);
        res.result = result;
        res.message = response.statusText || "unknown error" ;
        res.ok = response.ok || true;
        res.statusCode = response.status;
        //logger.debug('returnStaus: res is: ', res);
        return res;
    }
    returnExceptionStatus (err: any)
    {
        var res : any ={};
        logger.error('returnExceptionStatus: exception thrown is : ', JSON.stringify(err));
        // check to see if there are any errors like CORS or network error etc.
        if ( err && ! err.response ) 
        {
            res.ok = false;
            res.statusCode = err.code;
            res.result=[],
            res.message = err.message; 
            return res;
        }
        // else, http related error and should have all other fields
        res.result = [];
        res.message = err.response.statusText || err ;
        res.statusCode = err.response.status || 0;
        res.ok = false;
        return res;
    }


	/* list the data items. results are returned in the form of standard 
       as per method returnStatus
	*/
    async list (path: string, headers: any) 
    {
        var revisedurl = this.url;
    
        if ( path )
            revisedurl = this.url + path ;

        logger.debug('APIHandler:list:: revisedurl is..', revisedurl);
        try {
            var response =  await axios.get(revisedurl, headers);
            var data = await response.data;
            return this.returnStatus(response, data);
        } catch (error)
        {
            return this.returnExceptionStatus(error);
        }
    }



    async get (path : string, id: string, headers: any)
    {
        //var data = {};
        let revisedurl = this.url;

        if ( path )
        {
            revisedurl = revisedurl + '/' + path ;
            logger.debug('get: revised url with path', revisedurl)
        }

        if ( id )
        {
            revisedurl = revisedurl + '/' + id ;
            logger.debug('get: revised url with id', revisedurl)
        }
        
        logger.debug('get:: revisedURL: ' + revisedurl);
        try {
            var response = await axios.get(revisedurl, headers)
            var result = await response.data;
            return this.returnStatus(response, result);
        } catch (error)
        {
            return this.returnExceptionStatus(error);
        }
    }

    async getWithPayload (path : string , id: string, payload: any, headers: any)
    {
        //var data = {};
        let revisedurl = this.url;

        if ( path )
        {
            revisedurl = revisedurl + '/' + path ;
            logger.debug('get: revised url with path', revisedurl)
        }

        if ( id )
        {
            revisedurl = revisedurl + '/' + id ;
            logger.debug('get: revised url with id', revisedurl)
        }
        
        logger.debug('get:: revisedURL: ' + revisedurl);
        try {
            var response = await axios.get(revisedurl, {params: payload}, headers)
            var result = await response.data;
            return this.returnStatus(response, result);
        } catch (error)
        {
            return this.returnExceptionStatus(error);
        }
    }

    async add (payload : any, path: string, headers: any) 
    {
        let revisedurl = this.url ;
        if ( path )
            revisedurl = this.url + path ;

        logger.debug('add: revised url with path: ', revisedurl);
        try {
            var response = await axios.post(revisedurl, payload, headers);
            var result = await response.data;
            return this.returnStatus(response, result);
        } catch (error)
        {
            return this.returnExceptionStatus(error);
        }
    }

    async update (payload: any, path: string, id: string, headers: any)
    {
        let revisedurl = this.url ;
        if ( path )
            revisedurl = this.url + '/' + path ;

        if ( id )
            revisedurl = revisedurl + '/' + id ;
        
        try {
            logger.debug('update: revised url with path and id: ' + revisedurl);
            var response = await axios.post(revisedurl, payload, headers);
            var result = await response.data;
            return this.returnStatus(response, result)
        } catch (error)
        {
            return this.returnExceptionStatus(error);
        }
    }
    
} /* end of class */

module.exports = {APIHandler}