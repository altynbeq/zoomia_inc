function pieOneData(params) {
// params contains given time period (startDate, endDate) 
    if( params ){
        zfun.startDate = params.startDate;
        zfun.endDate = params.endDate;
    } else {
      // if time is not given, take this month as default
        zfun.startDate = moment().startOf('month').unix();
        zfun.endDate = moment().endOf('month').unix();
    }
    
    // return list of deal types
    rapi('profiles.fieldValues',{
        type_id : 1001,
        filter : [
            {
                field : 100,
                value : zfun.leadsDirectory
            }
        ],
        fields_ids : [111]
    },  (ans) => {
        // list of dealTypes
        let data = ans.data.value;
        // keep data in global var to use in other modules
        zfun.listOfDealTypes = data;
        // main data storage, with counts of dealTypes
        zfun.pieOneProperData = [];
        
        // push list of dealTypes with count prop into the main data storage
        for( i in data ){
            data[i].count = 0;
            zfun.pieOneProperData.push( data[i] );
        }
        
        
        // filter list of all leads, if it is within the given period
        let listForCount = zfun.listOfAllLeads.filter( item => item.creation_datetime_unix > zfun.startDate && item.creation_datetime_unix < zfun.endDate );
        
        // loop through all the deals/leads and count number of each dealTypes
        for( i in listForCount ){
            if( listForCount[i].field_1001 ){
                zfun.pieOneProperData.find( elem => elem.profile_id == listForCount[i].field_1001 ).count++;
            }
        }
        
        // holder for pie series later to be passed
        let pieOneSeries = [];
        // collect data for series in order CAN USE MAP HERE 
        for( i in zfun.pieOneProperData ){
            pieOneSeries.push( zfun.pieOneProperData[i].count );
        }
        
        // update pieOne series 
        zfun.pie1.series = pieOneSeries;
        
        let dataToPass = {
            startDate: zfun.startDate,
            endDate: zfun.endDate,
        }
        
        // after finishing with pieOne go to pieTwo, and pass the date period in unix
        zfun.secondPieData(dataToPass);
        
    })
}
