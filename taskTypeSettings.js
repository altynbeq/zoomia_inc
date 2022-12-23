let taskSettings
    
	allTaskTypes = zfun.dirsValues.filter(item => item.field_100 == zfun.taskDirId);
	
	    for( i in allTaskTypes ){
	       if( (z_dash_config.tasksTypes || []).indexOf(allTaskTypes[i].profile_id) != -1 ){
	           allTaskTypes[i].marked = true;
	       }
	       if( !(z_dash_config.tasksTypes || []).length ){
	           allTaskTypes[i].marked = true;
	       }
	    }
	
	saveClickHandle = () => {
	    markedItemsList = [];
	    formOption = {}
	    peremen = taskSettings.$options.list
	    for ( i in peremen ){
	        if( peremen[i].marked == true ){
	            markedItemsList.push(peremen[i].profile_id);
	            formOption[peremen[i].profile_id] = peremen[i].field_111;
	        }
	    }
	    
	    rapiplain('admin.saveOwnerDashboardConfiguratingValue', {
            el                  :   'taskTypes',
            jsontext            :   JSON.stringify(markedItemsList),
            dashboard_alias     :   z_dashboard_alias,
        }, (ans) => {
            
            if( !z_user_data.settings.dashboards[z_dashboard_alias].configuration ) {
                z_user_data.settings.dashboards[z_dashboard_alias].configuration = {}
            }
            z_user_data.settings.dashboards[z_dashboard_alias].configuration['taskTypes'] = {
                value: markedItemsList   
            }
            z_dash_config['taskTypes'] = markedItemsList
        })
        
        zfun.taskTypesOptions =  formOption
        
        
        zfun.addTaskForm.fields.find( el => el.id == 'task_type').options = zfun.taskTypesOptions;
        taskSettings.$options.list = allTaskTypes;
        modalForm.close();
        debugger
	}
	
	zModalView({
        htmlContent: `
        <div style="display: flex; flex-direction: column; gap: 10px; height: 100%">
            <div id="taskSettingsBlock"></div>
            <div style="display:flex; flex-direction: row;">
       
                <button id="markedItemsSaveBtn" style=" display: flex; align-items: center; justify-content: center; gap: 3px; width: 100%; height: 40px; border-radius: 7px; background-color: #03a9f4;"><i style="margin-top: 3px;"class="ri-save-line"></i>Save</button>
            </div>
        </div>`,
        title : zLang('Task settings','Настройка заданий'),
        // isFullScreen: true
    }).then(res => {
        modalForm = res;
        document.querySelector('#markedItemsSaveBtn').onclick = saveClickHandle;
        
  
	zRows({
	    source_element: '#taskSettingsBlock',
	    searchLine: 1,
	    markable_fields: 1,
        searchLineButtons: [
            {
                title: "Add",
                fa_icon: "fa-plus",
                btn_color: 'lightBlue',
                click: ()=> {
                    zInputsForm({
                        title : zLang('Adding new task type', 'Добавления нового типа задачи'),
                        fitView:1,
                        zModal:1,
                        fields : [
                            {
                                id:'type',
                                label:zLang('Name','Название'),
                                required: 1,
                                type: 'text'
                            },
                        ],
                        buttons: [
                            {
                                fa_icon:'fa fa-send',
                                title:zLang('Add','Добавить'),
                                cols: 12,
                                onClick:()=>{
                                
                                   let ch =  form.getChanges(); 
                                   if(!ch){
                                       return
                                   }
                                   form.close();
                                   
                                    rapi('profiles.append',{
                                        type_id : 1001,
                                        full_name : ch.type,
                                        fields : {
                                            100  : zfun.taskDirId,
                                            111 : ch.type
                                        }
                                    }, function (ans) {
                                        let newTaskTypeId = ans.data.new_profile_id
                                        
                                        let newItem = {
                                            profile_id : String(newTaskTypeId),
                                            field_100 : String(zfun.taskDirId),
                                            field_111 : ch.type,
                                            marked : 1
                                        }
                                        
                                        taskSettings.addListItem(newItem);
                                        
                                        zfun.dirsValues.push(newItem);
                                      
                                       
                                    })    
                            
                                }
                            }
                        ]
                    }).then( res => {
                        form = res;
                    })
                }
            }
        ],
	    field:`
	        <div style="display:inline; padding-top: 10px; ">
	           <h3 style=" font-size: 18px; font-weight: 400; "> {{item.field_111}} </h3>
	        </div>
	    `,
	    onClick : () => {
	        console.log(item);
	    },
	    list : allTaskTypes
	}).then(mod => {
	    
	    taskSettings = mod
	})
    })
