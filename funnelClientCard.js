 additionalFields.forEach(fld => {
        
        let field_id = fld.field_type_id == 2 ? 'select_' + fld.field_id : fld.field_id
        
        let additionalFld = {
            label : fld.field_name,
            hidden : zfun.usedFields && zfun.usedFields.indexOf(parseInt(fld.field_id)) != -1 ? false : true,
            type : fld.field_type_id == 2 ? 'select' : fld.field_type_id == 26 ? 'integer' : fld.field_type_id == 27 ? 'number' : 'text',
            prependIcon : fld.field_type_id == 2 ? 'ri-file-list-line' : 'ri-information-fill',
            id : field_id,
            value : zfun.profileFieldsDetails['field_'+fld.field_id]
        }
        
        if (fld.field_type_id == 2) {
            
            additionalFld.onClick = function () {
                
                zLoader({
                    source_element : `#${field_id} .z-select-options`,
                    transparent : 1
                })
                
                rapi('profiles.getRows',
                 {
                     type_id : 100,
                     // fields_ids:[5],
                     grouping : [''],
                     grouping_fields_ids : [fld.field_id],
                 },(ans)=>{
                     
                    let opts = Object.values(ans.data.value).filter(grp => grp['field_' + fld.field_id]).reduce( (accum,grp) => {
                        
                        accum[ grp['field_' + fld.field_id] ] = grp['field_' + fld.field_id]
                        
                        return accum
                    }, {} )
                    
                    let currentField = userInfoForm.fields.find(field => field.id == field_id)
                    currentField.options = {...opts,...currentField.options}
                    
                    zLoaderOff({
                        source_element : `#${field_id} .z-select-options`,
                        transparent : 1
                    })
                 })
            }
            additionalFld.prependSearchIcon = 'ri-search-line'
            additionalFld.appendSearchIcon = 'ri-add-line'
            additionalFld.onAppendSearchIconClick = function () {
                newFieldVal(field_id)
            }
            
            if (zfun.profileFieldsDetails['field_' + fld.field_id]) {
                additionalFld.options = {
                    [ zfun.profileFieldsDetails['field_' + fld.field_id] ] : zfun.profileFieldsDetails['field_' + fld.field_id]
                }
            } else {
                
                additionalFld.options = {}
            }
        }
        
        formSettings.fields.push(additionalFld)
    })
