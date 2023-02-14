if (typeof params == 'undefined'){
	    params = {};
	}
	
	let blankElement = {
	    profile_id:params.profile_id||null,
	    profile_type_id:10000,
	    active_task:{},
	    active_task_field_8008_display:'',
	    creation_datetime:moment.unix(z_unixTimeStamp()).format('YYYY-MM-DD H:m:s'),
	    creation_datetime_unix:z_unixTimeStamp(),
	    date:moment.unix(z_unixTimeStamp()).format('YYYY-MM-DD H:m'),
	    dealColor:'#ffc0cb',
	    excluded:false,
	    takenByOtherUser:false,
	    field_10_display:'',
	    field_102_display:'',
	    field_1001_display:'', 
	    field_order:moment.unix(z_unixTimeStamp()).format('YYYY-MM-DD H:m'),
	    full_name:'',
	    hashtags:[],
	    hashtagString: '',
	    icon:"fa fa-times-circle",
	    k:777,
	    message_for_user:'',
	    readmore:0,
	    searchline:'',
	    selected:0,
	    status:'task_not_set',
	    task:null,
	    title_bg:"#FB494D",
	    details_opened: false,
	};
	
	for ( let i in zfun.fieldsIDSOfElements ){
	    let field_id = zfun.fieldsIDSOfElements[i];
	    blankElement['field_'+field_id] = null;
	}
 
    if( params.field_19.hashtags ){
        let hashList = [];
        for( i in params.field_19.hashtags ){
            hashList.push( params.field_19.hashtags[i].hash )
        }
        let hashString = hashList.join(' ');
        blankElement.hashtagString = hashString;
    }
    
    
	for ( let i in params ){
	    let item = params[i];
	    if ( typeof item != 'function' ){
	        blankElement[i] = item;
	    }
	}
	if ( !blankElement.full_name ){
	    blankElement.full_name = getFullName(params);
	    if( !blankElement.field_111 ){
	        blankElement.field_111 = zLang('No Name','Без названия')
	    }
	}
	
	blankElement.field_19 = blankElement.field_19||'{}';
	if ( typeof blankElement.field_19 == 'string' ){
	    blankElement.field_19 = JSON.parse(blankElement.field_19||'{}');
	}
	
	if ( blankElement.field_1001 ){
	    blankElement.field_1001_display = ( (zfun.sourcesOfElements[blankElement.field_1001]||{}).full_name||'' );
	}
	
	if ( !blankElement.field_102 || !zfun.stagesData[blankElement.field_102] ){
	    blankElement.field_102 = z_dash_config.funnelStages[0];
	    blankElement.field_102_display = zfun.stagesData[blankElement.field_102].field_111;
	}
	
	let statusDetails = (zfun.taskStatuses[blankElement['status']]||{
        title:zLang('Satus is Undefined','Статус не определён'),
        icon:'fa fa-circle',
        color:'#000',
    });
    
    blankElement.title_bg = statusDetails.color;
    blankElement.message_for_user  = statusDetails.title
    blankElement.icon = statusDetails.icon;

	return blankElement;
