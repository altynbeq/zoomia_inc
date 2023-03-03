const options = []
	// request funnel deal types
	rapi('profiles.fieldValues',{
        type_id: 1001,
        fields_ids: [111],
        profiles_ids: z_dash_config.funnelTypeIDs
    },(ans)=>{    
        const data = ans.data.value
        // collect funnel deal types, turn into buttons, add to the form
        for(const i in data){
            options.push(
                data[i].profile_id = {
                    title: data[i].field_111,
                    value: data[i].profile_id,
                    icon: "fa fa-handshake-o",
                    btn_color: "lightBlue",
                    click:() => {
                      // receive  deal type id, close form for selecting type , display form for inserting excel file
                        zfun.dealId = data[i].profile_id.value
                        lf1.zModalApp.close().then(res =>{
                            form()
                        })
                    }
                }
            ) 
        }
      // check for the funnel deal type id
    	if(z_dash_config.funnelTypeIDs.length > 1){
            lf1 = zForm({ 
                zModal: 1,
                title: zLang('Choose the type of deal','Выберите тип сделки'),
                zButtons: options,
            }); 
     
        } else {
            zfun.dealId = z_dash_config.funnelTypeIDs[0]
            form()
        }  
    })
	
	
	// form settings
	function form() {
    	importModal = zModal({
    	    htmlContent: `<div style="width: 1000px;">
                <div id="funnel_title" style="height : 58px"></div>
                <div id="funnel_content" style="height : 70vh"> </div>
                <div id="funnel_btn" style="width : 300px; height : 52px; margin : 20px auto; float: right;"></div>
            </div>`,
            isFullScreen: true,
    	}).then(val => {
    	    importModal = val
    	})
    	
    	zForm({
    	    source_element: '#funnel_title',
    	    title: zLang('Insert selected data from table', 'Вставьте выбранные данные из таблицы')
    	})
    	// collect field names for excel
    	tableToArray({
            reset : false,
            source_element : '#funnel_content',
            fields : [
                {
                    title: zLang('Name', 'Наименование'),
                    field_id: 111,
                    required: 1
                },
                {
                    title: zLang('Surname', 'Фамилия'),
                    field_id: 112,
                },
            ]
        }).then(table=>{
            let table_to_array = table
            window.table_to_array = table
            // add more fields , from users additionall fields
            for( i in z_dash_config.contentFields ){
                let tableData = z_fields[ z_dash_config.contentFields[i] ];
                table_to_array.fields.push({
                    title: tableData.field_name,
                    field_id: tableData.field_id
                });
            }
            // add language field for default fields
            table_to_array.fields.push({
                title: zLang('Language', 'Язык'),
                field_id: 118,
            });
            
            // after importing excel data, on download action
            zButton({
                title : zLang('Download','Загрузить'),
                source_element : '#funnel_btn',
                btn_color : 'cyan',
                icon : 'fa fa-download',
                click : function () {
                    const tbl_result = table_to_array.$refs.widgetMethods.validateTable()
                    // data variable keeps data imported by user from excel 
                    const data = tbl_result.data
                    // if no data was entered , but user click download btn 
                    if (!data.length) {
                        zToasts.add({
                            type: 'error',
                            title: zLang('Error','Ошибка'),
                            message: zLang('Need to copy data from table', 'Нужно скопировать данные из таблицы') 
                        })
                        return
                    } 
                    // if table wasn't imported properly
                    if (tbl_result.error) {
                        zToasts.add({
                            type: 'error',
                            title: zLang('Error','Ошибка'),
                            message: zLang('You must select the required field "Name"', 'Нужно выбрать обязательное поле "Наименование"') 
                        })
                        return
                    } 
                  
                    const data_for_insert = []
                    // collect data from import , and send for inserting into funnel
                    data.forEach(item => {
                        let objLoc = {
                            type_id: 10000,
                            full_name: item[111],
                          // default fields for excel, ex: name, company name, email, number etc.
                            fields: {
                                111: item[111] ? item[111] : null,
                                112: item[112] ? item[112] : null,
                                114: item[114] ? item[114] : null,
                                121: item[121] ? item[121] : null,
                                120: item[120] ? item[120] : null,
                                118: item[118] ? item[118] : null,
                                1001: zfun.dealId
                            }
                        }
                        // language field, should be in propper format , ex: turn string 'English' into key ENg
                        if(item[118]){
                            for ( i in z_fields[118].settings.options ){
                                if( z_fields[118].settings.options[i] == item[118] ) {
                                    item[118] = i;
                                }
                            }
                        }
                      // check for other fields, that have been imported by excel, but are not in the fields list,if so, add them
                        z_dash_config.contentFields.forEach( elem => {
                            if(!objLoc.fields[elem]){
                                objLoc.fields[elem] = item[elem] ? item[elem] : null
                            }
                        })
                        // push data for sending 
                        data_for_insert.push(objLoc)
                    })
                  // send the data from excel 
                    rapi("profiles.createNewMass", {
                        data_for_insert : JSON.stringify(data_for_insert)
        			}, ans => {
                      // close the 'excel import' modal window, and run function for reactively display changes 
        			    zfun.welcomeHere()
        	            importModal.close()
        			   
        	        })
                }
            })
        })
	}
