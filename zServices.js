const zLang = window.zLang;

const basicContactContent = ` 
	<div style="width: 100%; padding: 20px 15px; cursor: pointer">
	            <div style="display: flex; flex-direction: row; justify-content : space-between;">
    	            <div style="flex-shrink: 1;">
    	                <div style="display: flex; align-items: center">
                        <div style="background: rgba(0, 183, 139, 0.6); padding: 2px; border-radius: 4px; display: flex; align-items: center; width: fit-content;">
        	                    <div style="color : #FFFFFF; background: rgb(0, 183, 139); border-radius: 2px; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: space-around;">
        	                        ID
        	                    </div>
        	                    <span style="color : #FFFFFF; font-size: 12px; line-height: 120%; margin: 0 4px">
        	                        {{item.profile_id}}
        	                    </span>
        	                </div>
        	            </div>
                        <div><span style="font-size: 14px;">{{item.field_111||''}}</span></div>
                        <div><span style="font-size: 12px;">{{item.field_219||''}}</span></div>
    	               
    	            </div>
    	            <div style="flex-shrink: 0; display: grid; align-items: center;">
    	                
                        <div>
            	          <div>
                            <div><i v-if="item.field_468">  <span style="font-size:15px;">{{item.field_468 ||''}} {{z_owner_data.main_currency}} </span></i></div>
                        </div>
            	           
                            
        	            </div>
        	           
    	            </div>
    	        </div>
    	        <div style="height: 1px; width: 100%; background: rgba(136, 159, 183, 0.15); margin-top : 8px">
	            </div>
	           
	        <div>
`;

const SelectServices = async function (params = {}, callback = () => {}) {
	if (typeof params == 'function')
	{
		callback = params;
		params = {};
	}
    const { default: initFastSelectList } = await importMarketHelper({ filePath: 'fastSelect/initFastSelectList.js' }); 
	const appendNew = () => {
		zInputsForm({
				type_id: 41,
				title: zLang('Enter service details', 'Введите данные услуги'),
				fields: [
					{
						id: 111,
						label: zLang('Name *', 'Название *'),
						prependIcon: 'fa fa-user',
						value: '',
						required: true
					},
                    {
						id: 468,
						label: zLang('Price *', 'Стоимость *'),
						prependIcon: 'fa fa-money',
						type: 'integer',
						prefix: window.z_owner_data.main_currency,
						value: '',
                        required: true
					},
                    {
                    id: 'grey_line',
                    type: 'html',
                    html: `<div style="width : 100%; display: flex; justify-content : space-between">
                        <div style="width: 100%; height: 16px; border-bottom: 1px solid rgba(0, 0, 0, 0.1)">
        
                        </div>
                        <div style="color: #A5ABBD; font-size: 12px; padding: 4px 19px;">
                            ${zLang('Additionally', 'Дополнительно')}
                        </div>
                        <div style="width: 100%; height: 16px; border-bottom: 1px solid rgba(0, 0, 0, 0.1)">
            
                        </div>
                        </div>`,
                        cols: 12
                    },
					{
						id: 219,
						label: zLang('Description', 'Описание'),
                        type: 'textarea',
						value: '',
					}
					
				],
                    buttons: [{
                        title: zLang('Add', 'Добавить'),
                        onClick: function(){
                            let changes = new_service_form.getChanges();
                            if(!changes){
                                return
                            }
                            new_service_form.close();
                            delete changes.grey_line
                                rapi('profiles.append',{
                                    type_id: 41,
                                    full_name: ( changes[111] || '' ),
                                    fields: changes,
                                }, (ans)=> {
                                    if(!params.list){
                                        updateProfilesList( ()=> {
                                            if( listOfSelection.close ){
                                                listOfSelection.close();
                                                callback( ans.data.new_profile_id, listOfSelection.list );

                                            } else {
                                                callback( ans.data.new_profile_id, listOfSelection.list );
                                            }
                                        })
                                    }
                                })
                        },
                    }]
                        }).then( form => {
                        window.new_service_form = form;
                });

                if( typeof params.beforeAppend === 'function' ){
                    params.beforeAppend();
                }
            };
            
            const listOfSelection = await initFastSelectList(
                {
                    source_element	:	params.source_element || null, 
                    markable: params.markable,
                    title: params.title || zLang('Select the service', 'Выберите услугу'),
                    fields: [{
                        title: '',
                        content: basicContactContent
                    }],
                    list: (params.list || {}),
                    searchLineButtons : [
                        {
                            fa_icon: 'fa fa-plus',
                            click: appendNew,
                            btn_color: 'lightBlue'
                        }
                    ],
                    emptyListParams: {
                        icon: 'fa fa-user',
                        title: zLang('Add first services', 'Добавьте первый сервис'),
                        sub_title: zLang("Let's add first service", "Давайте добавим первый сервис"),
                        click: appendNew
                    }
                }, params,callback);
            const updateProfilesList = (callback) => {
                window.rapi('profiles.getRows', {
                    type_id: 41,
                    fields_ids: [111, 219, 468]
                }, (ans) => {
                    const list = ans.data.value || [];
                    if (Object.keys(list).length === 0) {
                        listOfSelection.showEmptyListMessage = true;
                    }
                    // window.Vue.set(listOfSelection, 'list', list);
                    listOfSelection.setList(Object.values(list))
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            };
            if (!params.list) {
                updateProfilesList(params.onListLoadCallback || (()=>{}));
            }
            return listOfSelection;
        };
        export default SelectServices;
