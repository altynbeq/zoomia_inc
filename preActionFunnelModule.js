    zfun.isExclude = Object.values(zDashParams.item)[0]?.field_19?.excludedFromPipeline ? true : false;
    zfun.usedFields = zDashParams.usedFields || [];
    zfun.item       = zDashParams.item
    zfun.configAlias = zDashParams.configAlias
    zfun.dealTypeOptions = zDashParams.dealTypeOptions;
    z_URLSets.widgets.listInfo.settings.parentDashAlias = zDashParams.parent_dash_alias;
    
	return new Promise((resolve,reject) => {
	    
	    if (is_integrator) window.zfun = zfun 
    	
    	if ((zDashParams.questions||[]).length) {
    	    zfun.questions = zDashParams.questions
    	}
	    
	    const current_profile_id = zDashParams.profile_id ? zDashParams.profile_id : null; 
	    
	    zfun.currentProfile = zDashParams.item[current_profile_id];
	   
	    zfun.profile_id = current_profile_id
        
        zfun.pipeline_settings = zDashParams || {};
        
        zfun.check = true
       
        const additionalFields = []
        
        Object.values(zArray(z_fields).filter("item.profile_type_id==10000 && item.owner_id==" + z_owner_id).obj).forEach(item => {
            if (z_dash_config.contentFields.includes(Number(item.field_id))) {
                additionalFields.push({
                    title: item.field_name,
                    field_id: item.field_id,
                    keyup_as_onchange: 1
                })
            }
        })
        
        zfun.additionalFieldsGlobal = additionalFields;
        
        let activationDate = zDashParams.item[zDashParams.profile_id]?.field_4
        
        // default fields for users
        zfun.fields = [
            {
                title : zLang('Activation date','Дата активации'),
                hidden : z_owner_id && activationDate ? 0 : 1,
                disabled : 1,
                value : activationDate ? moment(parseInt(activationDate + '000')).format('DD MMM YYYY') : '-'
            },
            {
                title: zLang('Name','Наименование'),
                field_id: 111,
                keyup_as_onchange: 1
            },
            {
                title: zLang('Company','Компания'),
                field_id: 114,
                keyup_as_onchange: 1
            },
            {
                title: zLang('Phone','Телефон'),
                type: "string",
                field_id: 121,
                keyup_as_onchange: 1
            },
            {
                title: zLang('Email','Почтовый адрес'),
                field_id: 120,
                keyup_as_onchange: 1
            },
            {
                title: zLang('Address','Адрес'),
                field_id: 126,
                keyup_as_onchange: 1
            },
            {
                title: zLang('Budget','Бюджет'),
                type: "integer",
                field_id: 468,
                keyup_as_onchange: 1
            },
            ...additionalFields,
            {
                title: zLang('Comment', 'Комментарии'),
                field_id: 219,
                keyup_as_onchange: 1
            }
        ];
        // functions passed from renderDashboard
        zfun.newTask = zfun.pipeline_settings.renderFunctions.task  
        zfun.convertToClient = zfun.pipeline_settings.renderFunctions.convertClient  
        zfun.changeFunnel = zfun.pipeline_settings.renderFunctions.send  
        zfun.excludeFromFunnel = zfun.pipeline_settings.renderFunctions.exclude;
        zfun.changeRMOnServer = zfun.pipeline_settings.renderFunctions.changeRMOnServer;
        zfun.changeStep = zfun.pipeline_settings.renderFunctions.step
        zfun.includeToFunnel = zfun.pipeline_settings.renderFunctions.include   
        zfun.addHash = zfun.pipeline_settings.renderFunctions.addHash
        
        zfun.item = zDashParams.item 
        zfun.itemProfile = Object.values(zDashParams.item)[0]; 
        zfun.itemProfile.field_10 = ((zfun.itemProfile.field_19||{}).rm||{})['dash_'+zDashParams.parent_dash_alias]||zfun.itemProfile.field_10;

        zfun.config = zDashParams.config 
        
        zfun.parent_dash_alias = zDashParams.parent_dash_alias
        
        zfun.steps = zDashParams.item[current_profile_id].field_19 ? zDashParams.item[current_profile_id].field_19.steps ? zDashParams.item[current_profile_id].field_19.steps : {} : {}
        zfun.answers = zDashParams.item[current_profile_id].field_19 ? zDashParams.item[current_profile_id].field_19.answers ? zDashParams.item[current_profile_id].field_19.answers : {} : {}
        
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
          // funnel client data request
          rapi('profiles.getFieldsDetails',{
               profile_id: zfun.profile_id
          },(ans)=>{
              zfun.profileFieldsDetails = ans.data.value;  // data about client 
              zfun.profileFieldsDetails.field_19 = JSON.parse(zfun.profileFieldsDetails.field_19||'{}');

              rapi("profiles.fieldValues", {
            types_ids: [2,25],
            fields_ids: [111],
          },(ans) => {
    		    
    		    zfun.employees = ans.data.value;
    		    //request for funnel stages
    		    rapicache('profiles.fieldValues',{
                    type_id: 1001,
                    profiles_ids: z_dash_config.funnelStages,
                    fields_ids: [111],
                },(ans)=>{

                    zfun.stagesLength = ans.data.count;
                    zfun.stagesList = ans.data.value; // list of stages in funnel
                    zfun.orderedStages = [];
                    
                    zfun.profileManager({
                        callback: function(){
                            if ( !ZOOMIA.isMobileView() ) {
                	            zfun.layout();
                	        } else {
                    	        zfun.mobileLayout()
                    	    }
                    	    
                    	    zfun.layoutCss();
            	            zfun.completeTask();
            	            
            	            zfun.basicSettings({
                                callback : function () {
                                    resolve();
                                }
                            })
                    	    
                        }
                    });
                })
    		})
        })
    })
	});
