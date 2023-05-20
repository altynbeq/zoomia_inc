function getMainData(params) {
	
	let start_date = params?.user_peek_start_date || moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
    let end_date = params?.user_peek_last_date || moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
	
	properUsersList = []; 
	datalist = [];
	
	$.get(`/owners/analytics/user_activity?user_action_aliases[]=market_accounting&jsonFilter[or][][action_name]=income_click&jsonFilter[or][][action_name]=outcome_click&jsonFilter[or][][action_name]=transfer_click&after=${start_date}&before=${end_date}`, 
	    (ans)=> {
	        let moduleLaunchList = [];
	        let userModuleLaunchList = []; 
	        let userActionList = [];
	        let rawList = [];
	        let actionAns = [];
	        
	        
            for(i in ans.rows){
                if(!properUsersList[Number(Object.values(ans.rows[i].f[1]))]){
                    rawList.push(Number(Object.values(ans.rows[i].f[1])));
                    actionAns.push(ans.rows[i]);
                }
            }
            
            function onlyUnique(value, index, self) {
              return self.indexOf(value) === index;
            }
                                
            properUsersList = rawList.filter(onlyUnique);
            
                $.get(`/owners/analytics/market_activity`, 
                      (ans)=> {
                          zfun.properList = [];
                          for(i in ans){
                             properUsersList.forEach(item => {
                                 if(item == ans[i].owner_id){
                                     for( j in ans[i].market_dashboards ) {
                                          if(ans[i].market_dashboards[j].market_dashboard_alias == 'accounting') {
                                          ans[i].activated_at = moment(ans[i].market_dashboards[j].created_at).format("YYYY MM DD");
                                          zfun.properList.push( ans[i] ) 
                                          }
                                     }
                                 }
                             }) 
                              
                          }
                        
                         $.get(`/owners/analytics/user_activity?user_action_aliases[]=market_accounting&jsonFilter[or][][action_name]=accounting_launch&after=${start_date}&before=${end_date}`, 
                                (ans)=> {
                                    for(i in ans.rows){
                                        moduleLaunchList.push(Number(Object.values(ans.rows[i].f[1])));
                                    }
                                    
                                    properUsersList.forEach(item => {
                                
                                        let count = 0;
                                        for(i in moduleLaunchList){
                                            if(item == moduleLaunchList[i]){
                                                count++;
                                            }
                                        }
                                        
                                        for(i in zfun.properList){
                                            if(zfun.properList[i].owner_id == item){
                                                zfun.properList[i].visit_count = count;
                                                zfun.properList[i].income_click = 0;
                                                zfun.properList[i].outcome_click = 0;
                                                zfun.properList[i].transfer_click = 0;
                                                zfun.properList[i].income_action = 0;
                                                zfun.properList[i].outcome_action = 0;
                                                zfun.properList[i].transfer_action = 0;
                                                zfun.properList[i].invoice_related = 0;
                                                zfun.properList[i].client_related = 0;
                                               // zfun.properList[i].properActivated_at = moment(item.activated_at).format("YYYY MM DD");
                                            }
                                        }
                                });
                                
                               zfun.properList.forEach(item => {
                
                                    for(i in actionAns){
                                        
                                        let actionType = JSON.parse(actionAns[i].f[4].v).action_name;
                                        let userID = Number(Object.values(actionAns[i].f[1]));
                                        
                                        if(item.owner_id == userID && actionType == 'income_click'){
                                            item.income_click++;
                                        } else if(item.owner_id == userID && actionType == 'outcome_click'){
                                            item.outcome_click++;
                                        } else if(item.owner_id == userID && actionType == 'transfer_click'){
                                            item.transfer_click++
                                        }
                                    }
                                    
                                }) 
                                
                                $.get(`/owners/analytics/user_activity?user_action_aliases[]=market_accounting&jsonFilter[or][][action_name]=income&jsonFilter[or][][action_name]=outcome&jsonFilter[or][][action_name]=transfer&after=${start_date}&before=${end_date}`, 
                            	    (ans)=> {
                            	        
                                        zfun.properList.forEach(item => {
                                            for(i in ans.rows){
                                                let actionType = JSON.parse(ans.rows[i].f[4].v).action_name;
                                                let relatedAction = JSON.parse(ans.rows[i].f[4].v).invoice_id;
                                                let relatedClientAct = JSON.parse(ans.rows[i].f[4].v).client_id;
                                                let ownerID = JSON.parse(ans.rows[i].f[1].v);
                                                
                                                if(item.owner_id == ownerID && actionType == 'income'){
                                                    item.income_action++;
                                                } else if( item.owner_id == ownerID && actionType == 'outcome' ){
                                                    item.outcome_action++
                                                } else if( item.owner_id == ownerID && actionType == 'transfer' ){
                                                    item.transfer_action++;
                                                }
                                                if( item.owner_id == ownerID && relatedAction) {
                                                    item.invoice_related++;
                                                } 
                                                if( item.owner_id == ownerID && relatedClientAct){
                                                    item.client_related++;
                                                }
                                            }
                                        })
                                        
                                       console.log(zfun.properList);
                                        params.callback(zfun.properList);
                                })
                                 
                            },)
            })
            
    },)
    
}
