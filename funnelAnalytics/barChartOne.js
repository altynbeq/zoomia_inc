function chartOneData(params) {
	
	// dates should be converted into unix when received
    if( params ){
        zfun.startDate = params.startDate;
        zfun.endDate = params.endDate;
    } else {
        zfun.startDate = moment().startOf('month').unix();
        zfun.endDate = moment().endOf('month').unix();
    }
	
	// holder for list of stages in a funnel
	let properData = [];
	
	// loop through config to collect ids of stages
	for( i in z_dash_config.funnelStages ){
	    properData[z_dash_config.funnelStages[i]] = {
	        count: 0,
	        sum: 0,
	        id: z_dash_config.funnelStages[i]
	    }
	}
	
	
	let listOfLeads = [];
	for( i in appwidget_sort.groups ){
	    let list = appwidget_sort.groups[i];
	    listOfLeads = [...listOfLeads, ...list.groupItems ];
	}
	
	

	
	
	// NEW LAST VERSION 
	

	// run through list of successful leads/deals to find amount of leads that became successful within the period
	let listOfSuccess = appwidget_success_listofleads.$options.list.filter( item => {
	    return item.field_19.successful[z_dashboard_alias].time >= zfun.startDate && item.field_19.successful[z_dashboard_alias].time <= zfun.endDate
	});
	// run through list of excluded leads/deals to find amount of leads that became excluded within the period
	let listOfExcluded = appwidget_excluded_listofleads.$options.list.filter( item => {
	    return item.field_19.excludedFromPipeline[z_dashboard_alias].time >= zfun.startDate && item.field_19.excludedFromPipeline[z_dashboard_alias].time <= zfun.endDate
	});
	
	listOfLeads.forEach( item => {
	    
        if( item.field_19['funnelStagesJumps_'+z_dashboard_alias] ){
            let jumps = item.field_19['funnelStagesJumps_'+z_dashboard_alias];
            let maxTime = 0;
            let stepId = 0;
            
            for( i in jumps ){
                if( jumps[i].time >= zfun.startDate && jumps[i].time <= zfun.endDate ){
                    if( jumps[i].time > maxTime ){
                        maxTime = jumps[i].time;
                        stepId = jumps[i].value
                    }
                }  
            }
            
            if( properData[stepId] ){
                properData[stepId].count++;
                properData[stepId].sum += Number(item.field_468);
            }
            
        } else if( !item.field_19['funnelStagesJumps_'+z_dashboard_alias] ){
            properData[ z_dash_config.funnelStages[0] ].count++;
            properData[ z_dash_config.funnelStages[0] ].sum += Number(item.field_468)
        }
    });
	
	
	// data holder for chartOne series
	let chartOneSeries = [];
	
	// collect only count values , for analytics chart
	for( i in properData ){ chartOneSeries.push( properData[i].count ); }
	
	// add number of successful/excluded leads/deals within the period
	
	if( listOfSuccess.length >= 0 ){
	    chartOneSeries.push( listOfSuccess.length );
	} else {
	     chartOneSeries.push( 0 );
	}
	if( listOfExcluded.length >= 0 ){
	    chartOneSeries.push( listOfExcluded.length );
	} else {
	    chartOneSeries.push( 0 );
	}
	
// 	chartOneSeries.push( listOfSuccess.length, listOfExcluded.length );
	
	// path series to the chart
	zfun.bar1.series[0].data = chartOneSeries;
	// update chart series 
	zfun.bar1.$refs.apexСhart.updateSeries(zfun.bar1.series);
	
	// dates for passing to the next chart ( timePeriod for report )
    let dataToPass = {
        startDate: zfun.startDate,
        endDate: zfun.endDate,
    }
    zfun.chartOneDataTT = properData;
    zfun.chartOneSucc = listOfSuccess;
    zfun.chartOneExcl = listOfExcluded;
    
	// call next chart functions
	zfun.chartTwoData(dataToPass);
	
}
