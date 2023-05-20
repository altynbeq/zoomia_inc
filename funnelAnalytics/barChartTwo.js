function chartTwoData(params) {
	
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

	
	// loop through leads , cuz we want to count them for analysis
	zfun.listOfAllLeads.forEach( item => {
	    // if records of stagesJumps in current funnel
	    if( item.field_19['funnelStagesJumps_'+z_dashboard_alias] ) {
	        // list of jumps held in jumps
	        let jumps = item.field_19['funnelStagesJumps_'+z_dashboard_alias];
	        // run throguh each jump 
	        for( i in jumps ){
	            // for each jump find matching stage in list
	            properData.forEach(el => {
	                // if jump was made within the given time period , and to the counter
	                if( el.id == i && jumps[i].time >= zfun.startDate && jumps[i].time <= zfun.endDate ){
	                    el.count++;
	                    el.sum += JSON.parse(item.field_468);
	                }
	            })
	        }
	    }
	    if ( item.creation_datetime_unix >= zfun.startDate && item.creation_datetime_unix <= zfun.endDate ) {
	        properData[z_dash_config.funnelStages[0]].count++;
	        properData[z_dash_config.funnelStages[0]].sum += JSON.parse( item.field_468 );
	    }
	    
	    // check for all items creation_datetime , if was created within the time period, should add to the first step of the funnel by default
	   // if( item.creation_datetime_unix >= zfun.startDate && item.creation_datetime_unix <= zfun.endDate ){ properData[z_dash_config.funnelStages[0]].count++ }
	});
	
	// unfinished data holder for chartOne series
	let chartTwoPreSeries = [];
	
	// collect only count values , for analytics chart
	for( i in properData ){ chartTwoPreSeries.push( properData[i].count ); }
	
	// valid data holder for chartTwo
	let chartTwoSeries = [];
	// loop through list of values in quantity, and turn into conversion, and add to the proper list
	for( i in chartTwoPreSeries ){ 
	    // check for valid value, if num is negative, or wrong values display 0, else show proper value
	    let numb = ( (chartTwoPreSeries[i] * 100)/chartTwoPreSeries[0] ).toFixed(1) >= 0 ? ( (chartTwoPreSeries[i] * 100)/chartTwoPreSeries[0] ).toFixed(1) : 0;
	    
	    chartTwoSeries.push( numb );
	    
	}
	
	// run through list of successful leads/deals to find amount of leads that became successful within the period
	let listOfSuccess = appwidget_success_listofleads.$options.list.filter( item => {
	    return item.field_19.successful[z_dashboard_alias].time >= zfun.startDate && item.field_19.successful[z_dashboard_alias].time <= zfun.endDate
	});
	// run through list of excluded leads/deals to find amount of leads that became excluded within the period
	let listOfExcluded = appwidget_excluded_listofleads.$options.list.filter( item => {
	    return item.field_19.excludedFromPipeline[z_dashboard_alias].time >= zfun.startDate && item.field_19.excludedFromPipeline[z_dashboard_alias].time <= zfun.endDate
	});
	
	let succConver = ( (listOfSuccess.length * 100 )/chartTwoPreSeries[0] ).toFixed(1);
	
	let exclConver = ( (listOfExcluded.length * 100 )/chartTwoPreSeries[0] ).toFixed(1);
	
	if( succConver >= 0 ){
	    chartTwoSeries.push( succConver );
	} else {
	    chartTwoSeries.push( 0 );
	}
	if( exclConver >= 0 ){
	    chartTwoSeries.push( exclConver );
	} else {
	    chartTwoSeries.push( 0 );
	}
	// assign series to the chart 
	zfun.bar2.series[0].data = chartTwoSeries;
	// update series for the chart
	zfun.bar2.$refs.apexСhart.updateSeries(zfun.bar2.series);
	
	// dates for passing to the next chart ( timePeriod for report )
    let dataToPass = {
        startDate: zfun.startDate,
        endDate: zfun.endDate,
    }
    
    zfun.dataForSecChartToolTip = properData;
    
    zfun.convForSecChartToolTip = chartTwoSeries;
    
	// call next chart function
	zfun.chartThreeData();
}
