let start = moment('2022-11-01').unix()
let end = moment().unix()
//var for storing number of invoices in period
let data = {
    sent_invoices:0,
    cancelled_invoices:0,
    paid_invoices:0,
    part_paid_invoices:0,
}
//total amount of money for partial payment
let partialPaymentSum = 0;
//paid amount of money from partial payment
let paidPartialPayment = 0;

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


for( i in all_invoices ) {
    if( all_invoices[i].lastAction.type == "cancelled" ){
        data.cancelled_invoices++;
    } else if( all_invoices[i].lastAction.type == "sent" ){
        data.sent_invoices++;
    } else if( all_invoices[i].lastAction.type == "part_paid" || all_invoices[i].lastAction.type == "TRANSACTION_part_paid"  ){
        data.part_paid_invoices++;
        partialPaymentSum += Number(all_invoices[i].field_468);
    } else if( all_invoices[i].lastAction.type == "paid" ){
        data.paid_invoices++;
    }
}


all_invoices.forEach( item => {
   for( i in item.field_19.history ){
       if( item.field_19.history[i].type == "TRANSACTION_part_paid" || item.field_19.history[i].type == "part_paid" ){
           paidPartialPayment += Number(item.field_19.history[i].transaction_amount)
       }
   }
});
