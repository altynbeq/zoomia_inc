	if (!zfun.zInvest) {
        return
	}
	
	
	rapi("profiles.fieldValues", {
			type_id: 27,
			fields_ids: [111, 1000603, 19, 126, 120, 121, 219, 3, 860, 7099, 1000605, 1000606, 1000604],
			get_k: 1,
		},
		function (ans) {
			let data = ans.data.value;
			
			data = Object.values(data).filter(item=> {
			    
			    let fld_19 = item.field_19 || {}
			    
			    if (typeof fld_19 == 'string') {fld_19 = JSON.parse(fld_19)}
			    
			    if ( (fld_19.participants || []).find(part => parseInt(part.id) == zfun.profile_id ) )  {
			        item.amount = (fld_19.participants || []).find(part => parseInt(part.id) == zfun.profile_id ).amount
			        item.status = 'not_paid'
			        item.balance = 0
			        
			        return true
			    }
			    
			    return false
			    
			})
			
			for (let i in data) {
				if (data[i].field_3 == "in_process") {
					data[i].field_3_display = zLang("In process", "В процессе");
				}
				if (data[i].field_3 == "edit") {
					data[i].field_3_display = zLang("On editing", "На редактировании");
				}
				if (data[i].field_3 == "complete") {
					data[i].field_3_display = zLang("Completed", "Завершён");
				}
				data[i].members_count = JSON.parse(data[i].field_19).participants ? JSON.parse(data[i].field_19).participants.length : 0;
				data[i].project_type = JSON.parse(data[i].field_19).project_type.title;
				data[i].commission_amount = data[i].field_1000604 == "amount" && data[i].field_1000606 ? data[i].field_1000606 : 0;
				data[i].commission_percent = data[i].field_1000604 == "percent" && data[i].field_1000605 ? data[i].field_1000605 : 0;

				if (data[i].commission_amount && data[i].field_1000603) {
					data[i].commission_percent = parseFloat((parseFloat(data[i].commission_amount) * 100) / parseInt(data[i].field_1000603)).toFixed(4);
				} else if (data[i].commission_percent && data[i].field_1000603) {
					data[i].commission_amount = parseFloat((parseFloat(data[i].commission_percent) * parseFloat(data[i].field_1000603)) / 100).toFixed(2);
				}
			}
			
			if (data.length) {
			    
			    let projects_id = data.map(item => item.profile_id)
			    
			    rapi(
    				"profiles.fieldValues", 
    				{
    					type_id: 70,
    					fields_ids: [889, 7001, 7002, 7003, 7004, 7027, 7017, 7010, 7011],
    					get_creation_datetime: 1,
    					filter: [
    						{
    							field : 7027,
    							value : projects_id,
    						},
    						{
    						    field : 7011,
    						    value : zfun.projectInvestmentCategory
    						},
    						{
    						    field : 7017,
    						    value : zfun.profile_id
    						}
    					],
    				},
    				function (ans) {
    					let transations = ans.data.value
    				
    				    for (i in data) {
    				        
    				        let project = data[i]
    				        
    				        for ( let tr in transations ) {
    				            let tr_item =  transations[tr]
    				            
    				            if (parseInt(tr_item.field_7027) == parseInt(project.profile_id) && (zfun.accounts[tr_item.field_7001] || {}).field_7099 == project.field_7099 ) {
    				                
    				                project.balance += parseInt(tr_item.field_7003)
    				                
    				            }
    				            
    				        }
    				        
    				        if (project.balance >= project.amount) {
                                project.status = 'paid'
                            } else if (project.balance > 0 && project.balance < project.amount) {
                                project.status = 'part'
                            }
    				        
    				    }
    					
    					appwidget_projects.list = data;
			            appwidget_projects.list_origin = data;
                      
            
    				}
    			);
			} 
		}
	);
	
