function managerAnalytics(params) {
	
	// dates should be converted into unix when received
    if( params ){
        zfun.startDate = params.startDate;
        zfun.endDate = params.endDate;
    } else {
        zfun.startDate = moment().startOf('month').unix();
        zfun.endDate = moment().endOf('month').unix();
    }
	
	
	rapi('profiles.getRows', {
    type_id: 2,
    fields_ids: [111]
    }, (ans) => {
        // managers list
        let managersList = ans.data.value;
        for( i in managersList ){
            managersList[i].wins = 0;
            managersList[i].los = 0;
        }
        // count amount of leads won
        appwidget_success_listofleads.$options.list.forEach( item => {
           for( i in managersList ){
               if( Number(managersList[i].profile_id) == Number(item.field_19.rm[z_dashboard_alias]) && item.field_19.successful[z_dashboard_alias].time >= zfun.startDate && item.field_19.successful[z_dashboard_alias].time <= zfun.endDate ){
                   managersList[i].wins++;
               }
           }
        });
        
        // count amount of leads lost
        appwidget_excluded_listofleads.$options.list.forEach( item => {
           for( i in managersList ){
               if( Number(managersList[i].profile_id) == Number(item.field_19.rm[z_dashboard_alias]) && item.field_19.excludedFromPipeline[z_dashboard_alias].time >= zfun.startDate && item.field_19.excludedFromPipeline[z_dashboard_alias].time <= zfun.endDate ){
                   managersList[i].los++;
               }
           }
        });
        
    });
	
}
