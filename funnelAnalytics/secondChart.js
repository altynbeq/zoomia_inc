function secondPieData(params) {
	
	// dates should be converted into unix when received
    if( params ){
        zfun.startDate = params.startDate;
        zfun.endDate = params.endDate;
    } else {
        zfun.startDate = moment().startOf('month').unix();
        zfun.endDate = moment().endOf('month').unix();
    }
	
	
	// list of all exclude reasons
	zfun.pieTwoProperData = [];
    
    // return list of deal types
    rapi('profiles.fieldValues',{
        type_id : 1001,
        filter : [
            {
                field : 100,
                value : zfun.mainExcludeReasonsTemplatesDirectory
            }
        ],
        fields_ids : [111]
    },  (ans) => {
        let data = ans.data.value;
        zfun.listOfCancell = data;
        // add counter , and push to the list
        for( i in data ){
            data[i].count = 0;
            zfun.pieTwoProperData.push( data[i] );
        }
        
        // appwidget_excluded_listofleads.$options.list.filter( item => item.field_19.excludedFromPipeline[z_dashboard_alias] && item.field_19.excludedFromPipeline[z_dashboard_alias].time >= zfun.startDate && item.field_19.excludedFromPipeline[z_dashboard_alias].time <= zfun.endDate )
        
        let listForCounting = appwidget_excluded_listofleads.$options.list.filter( item => item.field_19.excludedFromPipeline[z_dashboard_alias] && item.field_19.excludedFromPipeline[z_dashboard_alias].time >= zfun.startDate && item.field_19.excludedFromPipeline[z_dashboard_alias].time <= zfun.endDate );
        // appwidget_excluded_listofleads.$options.list.filter( item => item.creation_datetime_unix > zfun.startDate && item.creation_datetime_unix < zfun.endDate );
        
        // loop and count exclude reasons in excluded list
        listForCounting.forEach( item => {
            zfun.pieTwoProperData.find( elem => elem.profile_id == item.field_19.excludedFromPipeline.pipeline_market.excludeReason).count++;
        })
        
        // storage for secondPie series
        let pieTwoSeries = [];
        // collect counts for secondPie in order
        for( i in zfun.pieTwoProperData ){
            pieTwoSeries.push( zfun.pieTwoProperData[i].count );
        }
        // update secondPie series
        zfun.pie2.series = pieTwoSeries;
        // dates for passing to the next chart ( timePeriod for report )
        let dataToPass = {
            startDate: zfun.startDate,
            endDate: zfun.endDate,
        }
        
        // call next chart function, with date for filtering
        zfun.thirdPieData( dataToPass );
    })
}
