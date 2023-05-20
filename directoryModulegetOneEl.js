function getOneElem(params) {
	
	// Актуальные данные по одному элементу таблицы
    zFetch("/rapi/profiles.fieldValues", {
        type_id: 100,
        fields_ids: zfun.rapiFields,
        profiles_ids : [params],
        filter : [
            {
                field : 5,
                value : zfun.current_dash_alias
            },
            {
                field : 3,
                cond : '[DIFF]',
                value : 'deleted'
            }
        ],
        get_creation_datetime: 1
	}).then(ans => {
	    
	    let answer = ans.data.value[params]
	    
	    // Если элемент не удалён и возвращается
	    if (answer) {
	        
	        answer.creation_date = moment.utc(answer.creation_datetime).format('YYYY-MM-DD')
            answer.field_19 = JSON.parse(answer.field_19||'{}')
            answer.details_opened = false
            answer.itemColor = answer.field_19 ? (answer.field_19.itemColor ? answer.field_19.itemColor : '#4f5f6f') : '#4f5f6f';
            
            if (answer.field_10 && zfun.employees[answer.field_10]) { answer.field_10_display = zfun.employees[answer.field_10].full_name }
            
            let connectedFirsProfilesIds =  []
            let fldsSelect = (zfun.dash_config._cardFieldsDirectoryes||[])
            
            // Собрать все заполненные доп поля, где используются другие справочники
            fldsSelect.forEach(dir => {
                
                if (answer['field_' + dir.field_id]) {
                    
                    connectedFirsProfilesIds.push(answer['field_' + dir.field_id])
                }
            })
            
            // Если имеются данные заполненные поля, собираем их id для запроса по их названиям
            if (connectedFirsProfilesIds.length) {
                
                zFetch("/rapi/profiles.fieldValues", {
                    profiles_ids : connectedFirsProfilesIds,
                    fields_ids : [111,5]
                }).then(res => {
                    
                    let results = res.data.value
                    
                    // Подменяем id на имена
                    fldsSelect.forEach(dir => {
                
                        if (answer['field_' + dir.field_id]) {
                            
                            answer['field_' + dir.field_id] = results[ answer['field_' + dir.field_id] ].full_name
                        }
                    })
                    
                    updateItem(answer)
                })
                .catch(error => console.error('error', error));
            } else {
                
                updateItem(answer)
            }
	        
	    } else { // Если элемент был удалён
	        
	        let ind = zfun.listWidget.$options.list_origin.findIndex( item => item.profile_id == params)
            let list1 = zfun.listWidget.$options.list_origin
            
            list1.splice(ind, 1)
            
            zfun.listWidget.setList(list1)
	    }
	})
	
	// Замена каждого параметра у изменённого элемента таблицы
	let updateItem = function (answer) {
	    let item_index = zfun.listWidget.$options.list_origin.findIndex( item => item.profile_id == params)
        
        for (i in answer) {
            zfun.listWidget.$options.list_origin[item_index][i] = answer[i]   
        }
	}
}
