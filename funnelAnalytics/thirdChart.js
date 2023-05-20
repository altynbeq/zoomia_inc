function thirdPieData(params) {
	
	// dates should be converted into unix when received
    if( params ){
        zfun.startDate = params.startDate;
        zfun.endDate = params.endDate;
    } else {
        zfun.startDate = moment().startOf('month').unix();
        zfun.endDate = moment().endOf('month').unix();
    }
	
	
	// request list of managers
	rapi('profiles.getRows', {
    type_id: 2,
    fields_ids: [111]
    }, (ans) => {
        // managers list
        let managersList = ans.data.value;
        
        
        // create a property for each manager to count amount of deals/leads they created
        for( i in managersList ){
            managersList[i].count = 0;
            managersList[i].sum = 0;
        }
        
        
        // filter list of all leads, if it is within the given period
        let listForCount = zfun.listOfAllLeads.filter( item => item.creation_datetime_unix > zfun.startDate && item.creation_datetime_unix < zfun.endDate );
        
        // loop through the full list of leads/deals
        listForCount.forEach( item => {
            // check if the item in the list is proper
            if( item.field_19 && item.field_19.rm ){
                
                // managersList.find( elem => elem.profile_id == item.field_19.rm.dash_pipeline_market).count++;
                
                // if ids match with the manager and lead , count it
                for( i in managersList ){
                    if( managersList[i].profile_id == item.field_19.rm['dash_'+z_dashboard_alias] ){
                        managersList[i].count++;
                        managersList[i].sum += Number(item.field_468); 
                    }
                }
            }
        })
        
        // thirdPie series holder
        let thirdPieSeries = [];
        // collect manager couts for thirdPie series
        for( i in managersList ){
            thirdPieSeries.push( managersList[i].count );
        }
        // update series
        zfun.pie3.series = thirdPieSeries;
        
        // dates for passing to the next chart ( timePeriod for report )
        let dataToPass = {
            startDate: zfun.startDate,
            endDate: zfun.endDate,
        }
        
        zfun.listOfAllMng = managersList;
        
        // call next chart with date period provided
        zfun.lastPieData( dataToPass );
    })
}
