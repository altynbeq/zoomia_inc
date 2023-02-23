function preAction(params) {
  zfun.dashboard_id = dashboard_id;
	zfun.totalLeadsWithoutTasks = 0;
	
	zfun.facebookInit(); 
  
	zfun.autoclose = function (a) {
        let b = document.getElementById(`color_modal_${a}`);
        b.style.display = 'flex';
        window.addEventListener('click', function(e) {
          const allModals = document.querySelectorAll(`#color_modal_${a}`);
          if (!e.target.matches(`#color_modal_${a}`)) {
            allModals.forEach(x => x.style.display = 'none');
          }
        }, true);
    };
    
    zfun.markItem = function (item) {
        item.marked = !item.marked;
    };
    
    zfun.getItemDetails = function (item) {
        item.details_opened = !item.details_opened;
    };

    return new Promise((resolve, reject) => {
	    if ( is_integrator ) {
            window.zfun = zfun
        }
        
	    zfun.additionalFields =  Object.values(zArray(z_fields).filter(
            "item.profile_type_id==10000 && item.owner_id==" + z_owner_id
        ).obj).map(item => Number(item.field_id));
 
	     
	    zfun.listLayout()    
	    zfun.listLayoutCSS()
	    zfun.basicSettings()  
	    zfun.dashSettings()
	    zfun.getUsedFields();
	    
	    rapi('profiles.getRows',{
            type_id:1001,
            fields_ids:[111],
            profiles_ids:(z_dash_config.funnelTasksTemplates||[]).concat([-800])
        },(ans)=>{
            zfun.tasksTemplates = (ans.data.value);
            zfun.getDirectionsList({
    	        callback:()=>{
    	            zfun.getDirectoriesList({
                        callback:()=>{
                            zfun.getDirectoryValues({
                                callback:()=>{
                                    zfun.preActionDirsAppending({
                                        callback : function () {
                                            zfun.preActionDirsValuesAppending({
                                                callback : function () { 
                                                    zfun.afterPreActionSettings({
                                                        callback:()=>{
                                                            zfun.setPreliminarySettings({
                                                                callback:()=>{
                                                                    
                                                                    resolve();
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
    	        }
    	    })
        })
	});
}
