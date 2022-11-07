let start = moment('2022-11-06').unix()
let end = moment().unix()
//var for storing number of invoices in period
let data = {
    sent_invoices:0,
    cancelled_invoices:0,
    paid_invoices:0,
    part_paid_invoices:0,
}

//filter invoices by type and time
let all_invoices = appwidget_invoices_list.$options.list_origin.filter(item => {

    let invoice_cond = item.field_5 == 'invoice' && item.field_3 != 'draft' && item.field_3 != 'reissued'
    let date_cond = item.creation_datetime_unix > start && item.creation_datetime_unix < end 

    return (invoice_cond && date_cond)
})

//get last status change of invoice
all_invoices.forEach(item => {
    item.lastAction = {};
    item.lastAction.time = 0;
    item.lastAction.type = "";
        
    for(i in item.field_19.history) {
        
        
        if( Number(item.field_19.history[i].time) > item.lastAction.time && Number(item.field_19.history[i].time) > start && Number(item.field_19.history[i].time) <  end){
            item.lastAction.time = Number(item.field_19.history[i].time);
            item.lastAction.type = item.field_19.history[i].type;
        }
    }
});

console.log(all_invoices)
// count status changes
for( i in all_invoices ) {
    if( all_invoices[i].lastAction.type == "cancelled" ){
        data.cancelled_invoices++;
    } else if( all_invoices[i].lastAction.type == "sent" ){
        data.sent_invoices++;
    } else if( all_invoices[i].lastAction.type == "part_paid" ){
        data.part_paid_invoices++;
    } else if( all_invoices[i].lastAction.type == "paid" ){
        data.paid_invoices++;
    }
}

console.log(data)
