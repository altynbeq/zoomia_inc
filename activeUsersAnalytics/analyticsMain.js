function getMainData(params) {
	let startPdr = params?.user_peek_start_date || moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'); // Начало периода
    let endPrd = params?.user_peek_last_date || moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'); // Конец периода
    let current_date = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    
    let startActivity = moment('2022-01-01').format('YYYY-MM-DD HH:mm:ss') // Начальная дата, от которой запрашиваем записи о входе в систему
    
    
    let registeredBusinessAccs = 0; // Пункт 1. Количество зареганых бизнес аккаунтов с 01.01 по сегодня
    let registeredUsers = 0; // Пункт 2. Количество зареганых пользователей за заданное время
    let allModules = 0; // Пункт 3. Количество модулей установленных оунерами с 01.01 по сегодня
    let activeUsers = [] // Пункт 4. Все активные пользователи за заданное время
    let newActiveUsers = [] // Пункт 5. Юзеры которые стали активными в заданное время
    let userActivityWithInPeriod = [] // Пункт 6. Входы активных юзеров в заданное время
    let activeBusinessAccs = 0; // Пункт 7. Количество активных бизнес аккаунтов в заданное время
    let payingBusAccsList = []; // Пункт 8. Платящие бизнес аккаунты за весь период
    let paidLicense = 0; // Пункт 9. Количество оплаченных лицензий за период
    let paidModules = 0; // Пункт 10. Количество оплаченных модулей за период
    let activeUserActions = 0; // Пункт 11. Целевые действия активных пользователей
    let activeInvoiceUsers = 0; //Пункт 12. Количество активных юзеров инвойсинга
    let data = {}; // Объект для хранения всех данных и передачи их
    let totalUserAmount = 0; //Общее количество юзеров в системе 
    
    
    function dataLoader() {
    //Сбор Активных пользователей
        let startPdr_unix = moment(startPdr).unix() *1000;
        let endPrd_unix = moment(endPrd).unix() *1000;
    
        let firstEntery = {} // Первый вход в систему каждого юзера
        // let periodActivity = zfun.fullActivityList.filter(item => moment(item.timestamp).unix() > moment(startPdr).unix() && moment(item.timestamp).unix() < moment(endPrd).unix() ) //Активность за указанный период
        let periodActivity = zfun.fullActivityList.filter(item => {
        
            if ( item.timestamp > startPdr_unix && item.timestamp < endPrd_unix ) {
                return true
            } else {
                return false
            }
            
        })
        let firstUserActivity = {} // Самая первая активность юзера
        
        zfun.fullActivityList.forEach(item => {
            if (!firstEntery[item.user_id] || moment(firstEntery[item.user_id]).unix() > moment(item.timestamp).unix()) {
                firstEntery[item.user_id] = item.timestamp;
            }
        })
        
        periodActivity.forEach(item => {
            if ( moment(item.timestamp).diff(moment(firstEntery[item.user_id]), 'hours') > 5 && activeUsers.indexOf(item.user_id) == -1) {
                activeUsers.push(item.user_id)
            }
        })
    
        zfun.fullActivityList.forEach(item => {
            
            if ( moment(item.timestamp).diff(moment(firstEntery[item.user_id]), 'hours') > 5 ) {
    
                if (firstUserActivity[item.user_id] && firstUserActivity[item.user_id] > item.timestamp) {
                    firstUserActivity[item.user_id] = item.timestamp
                } else if (!firstUserActivity[item.user_id]) {
                     firstUserActivity[item.user_id] = item.timestamp
                }
            }
        })
    
        for(i in firstUserActivity) {
            if(firstUserActivity[i] > startPdr_unix && firstUserActivity[i] < endPrd_unix ) {
                newActiveUsers.push(i);
            }
            
        }
        
        let listfoEnter = []
        let properItems = []
        let listOfEnterActiveUsers = []
        
        // входы активных юзеров(за все время) за указанное время
        activeUsers.forEach(item => {
                listfoEnter.push(zfun.fullActivityList.filter(el => el.user_id == item && el.timestamp > startPdr_unix && el.timestamp < endPrd_unix ) )
            })
        

        listfoEnter.forEach(item => {
            let ourDiff = 0;
            let lastEnt = item[0].timestamp
            listOfEnterActiveUsers.push(item[0])
            item.forEach((el,i)=> {
                if ( moment(el.timestamp).diff(lastEnt, 'hours') > 5 ) {
                    lastEnt = el.timestamp
                    userActivityWithInPeriod.push(el)
                }
            })
        })
        
        
        

        $.get(`owners/analytics/market_activity?has_name=1&count=1&dateAfter=${startActivity}&dateBefore=${endPrd}`,
        (ans)=> {
            registeredBusinessAccs = ans;
            $.get(`/owners/analytics/users?count=1&dateAfter=${startActivity}&dateBefore=${endPrd}`, 
            (ans)=> {
                registeredUsers = ans;
                $.get(`/owners/analytics/dashboards?count=1&dateAfter=${startActivity}&dateBefore=${endPrd}`, 
                (ans)=> {
                    allModules = ans;
                    $.get(`/owners/analytics/owner_activity?count=1&dateAfter=${startPdr}&dateBefore=${endPrd}`, 
                    (ans)=> {
                        activeBusinessAccs = ans;
                        $.get(`/owners/analytics/user_activity?user_action_aliases[]=market_invoices_v2&jsonFilter[or][][action_name]=invoice_print&jsonFilter[or][][action_name]=document_share&jsonFilter[or][][action_name]=email_sent&jsonFilter[or][][action_name]=copy_link&jsonFilter[or][][action_name]=invoice_template_change_before_issue&after=${startPdr}&before=${endPrd}`, 
                            (ans)=> {
                                let listofMainActions = [];
                                let listofInvoiceChange = [];
                                let rightUser = [];
                                let uniqueUserList = [];
                                let finalAns = [];
                                let userActionElev = [];
                                
                                for(i in ans.rows){
                                let val = JSON.parse(ans.rows[i].f[4].v || '{}').action_name
                                let idVal = JSON.parse(ans.rows[i].f[4].v || '{}').user_id

                                    if(ans.rows[i].f[2].v !== null && val == "invoice_print" || ans.rows[i].f[2].v !== null && val == "copy_link" || ans.rows[i].f[2].v !== null && val == "email_sent" ||  val == "document_share") {
                                        listofMainActions.push(Number(ans.rows[i].f[2].v));
                                        userActionElev.push(Number(ans.rows[i].f[2].v))
                                        listofMainActions.push(Number(idVal));
                                        
                                    } else if( ans.rows[i].f[2].v !== null && val == "invoice_template_change_before_issue" ){
                                        listofInvoiceChange.push(Number(ans.rows[i].f[2].v))
                                        userActionElev.push(Number(idVal));
                                    } else if(idVal && idVal !==0){
                                        userActionElev.push(Number(idVal));
                                    }
                                }
                                
                                function onlyUnique(value, index, self) {
                                    return self.indexOf(value) === index;
                                    }
                                    
                                listofInvoiceChange.forEach(item => {
                                   let matchIds = listofMainActions.find(el => el == item);
                                   if(matchIds){rightUser.push(item)}
                                })  
                                
                                uniqueUserList = rightUser.filter(onlyUnique);
                                uniqueUserList.forEach( item => {
                                   let activeMatch = activeUsers.find(el => el == item);
                                   if(activeMatch){finalAns.push(item)};
                                })
                                
                                activeUserUniqAction = userActionElev.filter(onlyUnique);
                                
                                activeInvoiceUsers = finalAns.length;
                                activeUserActions = activeUserUniqAction.length;
                                
                                
                                $.get(`/owners/analytics/subscriptions?&dateAfter=2022-01-01 07:25:04`, 
                                    (ans)=> {
                                        //moment(ans[i].created_at).unix() < moment(endPrd).unix() &&
                                        let quoteCount = 0;
                                        for( i in ans ){
                                            if(  moment(ans[i].expired_at).unix() > moment(startPdr).unix() ) {
                                               payingBusAccsList.push(ans[i]) 
                                            }
                                            if(moment(ans[i].purchased_at).unix() > moment(startPdr).unix() && moment(ans[i].purchased_at).unix() < moment(endPrd).unix() ){
                                                quoteCount += ans[i].quote;
                                            }
                                        }
                                        
                                        paidLicense = quoteCount;
                                      
                           
                                    $.get(`/owners/analytics/transactions?status=paid&dashboards_count=1&dateAfter=${startActivity}&dateBefore=${endPrd}`, 
                                        (ans)=>{
                                            let paidModulesList = [];
                                            for( i in ans ){
                                                if(moment(ans[i].updated_at).unix() < moment(endPrd).unix() && moment(ans[i].updated_at).add(ans[i].month_count, 'months').unix() > moment(startPdr).unix() ) {
                                                    paidModulesList.push(ans[i]);
                                                }
                                            }
                                            paidModules = paidModulesList.length;
                                            
                                            
                                            data.registeredBusinessAccs = registeredBusinessAccs; // пункт 1
                                            data.registeredUsers = registeredUsers; // пункт 2
                                            data.allModules = allModules; // Пункт 3
                                            data.activeUsers = activeUsers.length; // Пункт 4
                                            data.newActiveUsers = newActiveUsers.length; // Пункт 5
                                            data.userActivityWithInPeriod = userActivityWithInPeriod.length; // Пункт 6
                                            data.activeBusinessAccs = activeBusinessAccs; // Пункт 7
                                            data.payingBusAccsList = payingBusAccsList.length; // Пункт 8
                                            data.paidLicense = paidLicense; // Пункт 9
                                            data.paidModules = paidModules; // Пункт 10
                                            data.activeUserActions = activeUserActions; // Пункт 11 
                                            data.activeInvoiceUsers = activeInvoiceUsers; // Пункт 12

                                            params.callback(data);
                                            
                                    }, 'json');
                                     
                                      
                                }, 'json');
                                
                            })
                    }, 'json')
                }, 'json');
            }, 'json');
        } ,'json')
        
    } setTimeout(dataLoader, 100);
}
