const zLang = window.zLang;

const basicContactContent = ` 
	<div style="width: 100%; padding: 20px 15px; cursor: pointer">
	            <div style="display: flex; flex-direction: row; justify-content : space-between;">
    	            <div style="flex-shrink: 1;">
    	                <div style="display: flex; align-items: center">
                        <div :style="{'background' : + item.field_7010 == 1 ? 'rgb(0, 183, 139)' : item.field_7010 == 2 ? 'rgb(248, 113, 113)' : 'rgba(0, 183, 139, 0.6)'}"
                              style="color : #FFFFFF; border-radius: 4px;  width: fit-content; height: 25px; padding:2px; font-size: 12px; display: flex; align-items: center; justify-content: space-around;">
        	                        ID
        	                <div :style="{'background' : + item.field_7010 == 1 ? 'rgba(0, 183, 139, 0.6)' : item.field_7010 == 2 ? 'rgba(248, 113, 113, 0.6)' : 'rgba(0, 183, 139, 0.6)'}" 
        	                        style="padding: 2px; border-radius: 2px; font-size: 12px; color: white; display: flex; align-items: center; width: fit-content;"> {{item.profile_id || ''}}
        	                    </div>
        	                </div>
        	            </div>   
    	                <div style="margin-top: 10px">
    	                    <div style="margin-bottom: 4px; color: rgba(1, 7, 36, 0.8); font-size: 20px;"><span>{{item.field_112}}</span></div>
                            <div style="margin-bottom: 4px; color: #777777;; font-size: 12px;" v-if="item.field_121"><span>{{item.field_468}}</span></div>
    	                </div>
    	            </div>
    	            <div style="flex-shrink: 0; display: grid; align-items: center;">
    	                
        	            <div style="margin-top : 0px;">
            	          <div>
                                <div><i v-if="item.field_872"> ${zLang('Barcode:','Штрихкод:')} <b style="font-size:15px;">{{item.field_872||''}}</b></i></div>
                                <div><i v-if="item.field_10024"> ${zLang('Vendor Code:','Артикул:')} <b style="font-size:15px;">{{item.field_10024||''}}</b></i></div>
                                <div><i v-if="item.field_1000589"> ${zLang('Serial number:','Серийный номер:')} <b style="font-size:15px;">{{item.field_1000589||''}}</b></i></div>
                                <div><i v-if="item.field_468"> ${zLang('Price:','Цена:')} <b style="font-size:15px;">{{item.field_468||''}}</b></i></div>
                                <div><i>{{item.field_219||''}}</i></div>
                            </div>
            	        </div>
    	            </div>
    	        </div>
    	        <div style="height: 1px; width: 100%; background: rgba(136, 159, 183, 0.15); margin-top : 8px">
	            </div>
	        <div>
`;

const SelectGoods = async function(params = {}, callback = () => {}) {
	if (typeof params == 'function')
	{
		callback = params;
		params = {};
	}
    const { default: initFastSelectList } = await importMarketHelper({ filePath: 'fastSelect/initFastSelectList.js' , branch: 3717 }); 
	const appendNew = () => {
		zInputsForm({
				type_id: 14,
				title: zLang('Enter good details', 'Введите данные товара'),
				fields: [
					{
						id: 111,
						label: zLang('Name *', 'Название *'),
						prependIcon: 'fa fa-user',
						value: '',
						required: true,
                        cols: 12
					},
					{
						id: 468,
						label: zLang('Price *', 'Стоимость *'),
						prependIcon: 'fa fa-money',
						type: 'number',
                        required: true,
						prefix: window.z_owner_data.main_currency,
						value: '',
                        cols: 12
					},  
                    {
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
						id: 112,
						label: zLang('Brand', 'Бренд'),
						prependIcon: 'fa fa-user',
						value: '',
                        cols: 12
					},
					{
						id: 872,
						label: zLang('Bar Code', 'Штрих-код'),
						prependIcon: 'fa fa-barcode',
						type:'integer',
						value: '',
                        cols: 12
					},
					{
						id: 10024,
						label: zLang('Vendor Сode', 'Артикул'),
						prependIcon: 'fa fa-hashtag',
						value: '',
                        cols: 12
					},
					{
						id: 1000589,
						label: zLang('Serial Number', 'Серийный номер'),
						prependIcon: 'fa fa-hashtag',
						value: '',
                        cols: 12
					},
				],
                buttons: [{
                    title: zLang('Add', 'Добавить'),
                    onClick: function(){
                        let changes = new_good_form.getChanges();
                        if(!changes){
                            return
                        }
                        new_good_form.close();
                            rapi('profiles.append',{
                                type_id: 14,
                                full_name: ( changes[111] || '' ) + ' ' + ( changes[112] || ''),
                                fields: changes,
                            }, (ans)=> {
                                if(!params.list){
                                    updateProfilesList( ()=> {
                                        if( listOfSelection.close ){
                                            listOfSelection.close();
                                            callback( ans.data.new_profile_id, listOfSelection.$options.list );
                                            
                                        } else {
                                            callback( ans.data.new_profile_id, listOfSelection.$options.list );
                                        }
                                    })
                                }
                            })
                    },
                }]
			    }).then( form => {
                window.new_good_form = form;
            });

            if( typeof params.beforeAppend === 'function' ){
                params.beforeAppend();
            }
    };

    
	const listOfSelection = await initFastSelectList(
		{
			//source_element	:	params.source_element || null,
			markable: params.markable,
			title: params.title || zLang('Select the good', 'Выберите товар'),
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
            appendButtonTitle: window.zLang('new'),
            emptyListParams: {
                icon: 'fa fa-user',
                title: zLang('Add first goods', 'Добавьте первый товар'),
                sub_title: zLang("Let's add first goods", "Давайте добавим первый товар"),
                click: appendNew
            }
		}, params,callback); 
	const updateProfilesList = (callback) => {
		window.rapi('profiles.fieldValues', {
			type_id: 14,
			fields_ids: [111, 112, 468,872,1000589,10024]
		}, (ans) => {
			const list = ans.data.value || [];
			if (Object.keys(list).length === 0) {
				listOfSelection.showEmptyListMessage = true;
                appendNew();
                return
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
export default SelectGoods;
