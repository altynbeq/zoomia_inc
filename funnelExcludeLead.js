  excludeReason = ans.data.value[i].profile_id.value
                        
  if (excludeReason) {

     serverProfile.setChanges(item.profile_id,{
            19:{
                    path:'excludedFromPipeline',
                    value:{[z_dashboard_alias]:{
                        time:'[SERVERTIMESTAMP]',
                        excludeReason:excludeReason,
                    }
                },
            },
            // 103:excludeReason,
        },(ans)=>{
            item.field_19.excludedFromPipeline = {
                    [z_dashboard_alias]: {
                    excludeReason:excludeReason,
                }
            }

            for( i in appwidget_sort.groups ){
                if( appwidget_sort.groups[i].group_id == Number(item.field_102) ){
                    let propperGroup = appwidget_sort.groups[i];
                    for( i in propperGroup.groupItems ){
                        if( propperGroup.groupItems[i].profile_id == item.profile_id ){
                        let properLead = propperGroup.groupItems[i];
                        properLead.excluded = true;
                        }
                    }
                }
            }


            item.excluded = true;
            let excluded_listofleads = appwidget_excluded_listofleads.$options.list;
            excluded_listofleads.unshift(item);
            appwidget_excluded_listofleads.setList(excluded_listofleads);
            let listofleads = appwidget_listofleads.$options.list.filter(widget_item => { return widget_item.profile_id !== item.profile_id })
            appwidget_listofleads.setList(listofleads);
            f1.close() 

            zfun.pipelineCardZModalApp.close()  //Altynbek comment

            if (typeof params.callback == 'function') {
                params.callback()
            }  
        })    
  }
