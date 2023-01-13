 rapi('profiles.getRows', {
        type_id: 3,
        fields_ids: zfun.usedFields,
        get_k: 1,
        get_creation_datetime: 1
        },(ans) => {
            
            zfun.listOfPartners = ans.data.value;
            
            for (i in zfun.listOfPartners) {
                
                let item = zfun.listOfPartners[i]
                
                item.field_19 = JSON.parse(item.field_19||'{}')
                
                item.itemColor = item.field_19 ? (item.field_19.itemColor ? item.field_19.itemColor : '#4f5f6f') : '#4f5f6f';
                item.details_opened = false
                if (item.field_1000610) { item.citizenship_name = z_fields[115].settings.options[item.field_1000610] }
                if (item.field_118) { item.lang_name = z_fields[118].settings.options[item.field_118] }
                if (item.field_119) { item.sex = item.field_119 == 1 ? zLang('Male','Мужской') : item.field_119 == 2 ? zLang('Female', 'Женский') : ''}
                if (item.field_10 && zfun.employees[item.field_10]) { item.field_10_display = zfun.employees[item.field_10].full_name }
               
                item.details_opened = false
            }
            console.log(zfun.listOfPartners)
            appwidget_partners_list.setList(Object.values(zfun.listOfPartners).reverse())
        
        });
