z_dash_config.contentFields = z_dash_config.contentFields.filter(el => el != shortId);
    currentAdditionalFields = (z_user_data.settings.dashboards[zfun.configAlias].configuration['contentFields']||{}).value || [];

    currentAdditionalFields = currentAdditionalFields.filter( el => el !== Number(shortId) );

    rapiplain('admin.saveOwnerDashboardConfiguratingValue', {
        el                  :   'contentFields',
        jsontext            :   JSON.stringify(currentAdditionalFields),
        dashboard_alias     :   zDashParams.parent_dash_alias,
    }, (ans) => {
        z_user_data.settings.dashboards[zDashParams.parent_dash_alias].configuration['contentFields'].value = currentAdditionalFields
//         z_user_data.settings.dashboards[zDashParams.parent_dash_alias].configuration['contentFields'] = {
//             value: currentAdditionalFields
//         }
        z_dash_config['contentFields'] = currentAdditionalFields
    });

    userInfoForm.fields.find( el => el.id == Number( shortId ) ).hidden == true;

    deleteFieldForm.close();
