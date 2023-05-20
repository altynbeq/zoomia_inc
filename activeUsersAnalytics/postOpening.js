function postAction(params) {
	appwidget_first_date_send.disabled = true
    appwidget_second_date_send.disabled = true
    
    // dates for the analytics
    let startActivity = moment('2022-01-01').format('YYYY-MM-DD HH:mm:ss') 
    let endPrd = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    // list of enterences into the system within the period
    zfun.fullActivityList = [] 
    
    zLoader({
        source_element : '.modal-body',
        transparent : 1
    })
    
    // request data for the logs
    getPortionActivity = function (page) {
        fetch(`/owners/user_activity?after=${startActivity}&before=${endPrd}&perPage=50000${page ? '&cursor=' + page : ''}`, {headers: {"Accept": "application/json"}})
          .then(response => response.json())
          .then(result => {
              for(i in result.data){
                  result.data[i].timestamp = moment(result.data[i].timestamp).unix()*1000;
              }
              zfun.fullActivityList = [...zfun.fullActivityList,...result.data]
              if (result.next_cursor) {
                  getPortionActivity(result.next_cursor)
              }else {
              zLoaderOff({
                source_element : '.modal-body',
                transparent : 1
              })
                appwidget_first_date_send.disabled = false
                appwidget_second_date_send.disabled = false
              }
          })
        
    }
    
    getPortionActivity(false);
}
