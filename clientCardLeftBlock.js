zInputsForm(formSettings).then(ans => {
        userInfoForm = ans;
        
        document.querySelector('#createNewtask').onclick = zfun.addNewTask;
        
        document.querySelector('#save_info_block').onclick = function () {
            let changes = userInfoForm.getChanges()
            
            if (changes) {
                
                for ( i in changes ) {
                    
                    if (String(i).split('_').length > 1) {
                        
                        changes[String(i).split('_')[1]] = changes[i]
                        
                        delete changes[i]
                    }
                }
                
                document.querySelector('#save_info_block').style.display = 'none'
                document.querySelector('#save_info_block_disabled').style.display = 'none'
                document.querySelector('#createNewtask').style.display = 'flex'; 
                
                rapi('fields.setChanges', {
                    profile_id : zfun.profileFieldsDetails.profile_id,
                    changes
                    
                })
                
                data = changes;
                
                appwidget_sort.groups.forEach(item => {
                    item.groupItems.forEach(elem => {
                        if (elem.profile_id == zfun.profile_id) {
                            
                            
                            let dataKeys = Object.keys(data);
                            dataKeys.forEach(item => {
                                for( i in formSettings.fields ) {
                                    if( formSettings.fields[i].id == Number(item) && formSettings.fields[i].hidden == false ){
                                   let numId = Number(item);
                                    formSettings.fields[i].numId = data.numId
                                    }
                                } 
                            })
                            
                          Object.values(zArray(z_fields).filter(
                                "item.profile_type_id==10000 && item.owner_id==" + z_owner_id
                            ).obj).forEach(subItem => { 
                                if (z_dash_config.contentFields.includes(Number(subItem.field_id))) {  
                                    elem['field_'+subItem.field_id] = appwidget_formInfo.fields['field_'+subItem.field_id].value
                                }
                                 
                            })
                            
                        }  
                    }) 
        	    })
	    
                	    appwidget_listofleads.$options.list.forEach(item => {  
                            if (item.profile_id == zfun.profile_id) {
                               
                                 for( i in data ){
                                        let key = Object.keys(elem[i]);
                                        let id = 'field_' + key
                                        
                                        item[id] = appwidget_formInfo.fields[id].value;
                      }

                        Object.values(zArray(z_fields).filter(
                                "item.profile_type_id==10000 && item.owner_id==" + z_owner_id
                            ).obj).forEach(subItem => {  
                                if (z_dash_config.contentFields.includes(Number(subItem.field_id))) {    
                                    item['field_'+subItem.field_id] = appwidget_formInfo.fields['field_'+subItem.field_id].value
                                }
                            })
                        } 
                	    })
            }
        }
        
        window.hashElems =  new Vue({
            el: '#hashButtonsBlock',
            data : {    
                colAmount: zfun.properList,
                steps : Object.values(zfun.stagesList),
                currentStageIndex,
                currentStageTitle : currentStageData.field_111,
                hastagsList : zfun.profileFieldsDetails.field_19.hashtags
            },
            methods: {
                addHasTag(){
                    zfun.addHash( {item:zfun.profileFieldsDetails, callback: function(list){
                        hashElems.hastagsList = list;
                    }} );
                }
            },
        });
        
        window.stepsElem =  new Vue({
            el: '#secondBlockElement',
            data : {    
                colAmount: zfun.properList,
                steps : Object.values(zfun.stagesList),
                currentStageIndex,
                currentStageTitle : currentStageData.field_111,
            },
            methods: {
                buttonClick(elem){
                    
                    stepsElem.currentStageIndex = stepsElem.steps.findIndex(step => step.profile_id == elem.profile_id)
                    
                    stepsElem.currentStageTitle = elem.field_111;
                    
                    zfun.changeStep({
                        
                        item : zfun.item[zfun.profile_id],
                        stepId : elem.profile_id,
                        stepName : elem.field_111
                    });
                },
                buttonHover(elem){
                    document.querySelector('#stageText').innerText = elem.field_111;
                },
                buttonHoverLeave(){
                    document.querySelector('#stageText').innerText = stepsElem.currentStageTitle;
                }
            },
        });
    })
