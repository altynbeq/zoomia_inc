   const urlencoded = new URLSearchParams();
      urlencoded.append("field_id", shortId);
      urlencoded.append("field_name", changes[111]);
      fetch('/owners/field/', {
          headers:{accept:'application/json','X-CSRF-TOKEN':getCookie('XSRF-TOKEN')},
          method:'PATCH',
          body:urlencoded
      }).then(res=>res.json()).then(ans => {
          let type = currentFieldPicked.field_type_id == 'select' ? 2 : currentFieldPicked.field_type_id == 'float' ? 27 : currentFieldPicked.field_type_id == 'integer' ? 26 : 1

          localStorage.removeItem("ZoomiaFields_" + z_session_id + "_" + z_owner_id)

          z_fields[shortId] = {
              field_name: changes[111],
              field_id : String(shortId),
              field_type_id: type,
              profile_type_id: 10000,
              owner_id: z_owner_id,
          }

          userInfoForm.fields.find( el => el.id == shortId).label = changes[111]


          getZFields();
          editActionForm.close();
      }).catch(console.error);
