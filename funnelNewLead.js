let options = [],
        dealId,
        newItem,
        descValue,
        companyValue,
        priceValue;
    
    let dealTypeOptions = {}; 
     
    rapi('profiles.fieldValues',{
        type_id:1001,
        fields_ids:[111],
        profiles_ids:z_dash_config.funnelTypeIDs
    },(ans)=>{    
        const data = ans.data.value;
        
        zfun.leadTypeData = data;
        let listOfTypes = [];
        for (let i in data) {
            let ids = data[i].profile_id;
            let val = data[i].field_111;
                listOfTypes.push( {
                    id : ids,
                    value: val,
                   })  
        
           
          dealTypeOptions = listOfTypes.reduce((acc, item) => {
          acc[item.id] = item.value;
          return acc;
          }, {});
        }
        zfun.dealTypeOptions = dealTypeOptions;
        form();
    })


    

                    onClick: function(){
                        if (inputInfoForm.getChanges()) {
                            
                            let id = "#"+inputInfoForm.id
                         
                            changes = inputInfoForm.getChanges();
                             
                            // dealId = data[i].profile_id.value;
                            
                            for( i in zfun.leadTypeData ){
                                let idOfLeadTYpe = Number(changes.select_118);
                              if( zfun.leadTypeData[i].profile_id == idOfLeadTYpe){
                                  dealId = zfun.leadTypeData[i];
                              }  
                            }
                            delete changes.select_118;
                            
                            changes[3] = 'Created'
                            // changes[5] = z_dashboard_alias;
                            changes[10] = z_user_profile_id;
                            changes[1001] = dealId.profile_id
                            changes[102] = z_dash_config.funnelStages[0]
                            changes[19] = {
                                funnelStages: {
                                    ['dash_'+z_dashboard_alias]: z_dash_config.funnelStages[0]
                                },
                                rm: {
                                    ['dash_'+z_dashboard_alias]: z_user_profile_id
                                }
                            }
                               
                            if (descValue) {
                                changes[219] = descValue
                            }
                            if (companyValue) {
                                changes[114] = companyValue
                            }
                            if (priceValue) {
                                changes[468] = priceValue
                            }
                        
                        rapi('profiles.append', {
                            type_id: 10000,
                            full_name: (changes[111] ? changes[111]+' ':'')+(changes[112] ? changes[112]+' ':'')+(changes[114] ? changes[114] : ''),
                            fields: changes
                        },(ans) => {
                            
                            inputInfoForm.close()
                            let element = zfun.getElementFromAppendParams({
                                profile_id:ans.data.new_profile_id,
                                changes:changes
                            })
                            let newEl = zfun.getBlankElement(element);
                              
                            appwidget_sort.groups[0].groupItems.unshift(newEl)
                            zfun.listLeads[newEl.profile_id]=newEl;
                        })
                            
                        }
                    }
