let taskTypes = zfun.dirsValues.filter(item => item.field_100 == zfun.taskDirId && (!((z_dash_config.taskTypes||[]).length) || z_dash_config.taskTypes.indexOf(item.profile_id) != -1))
	 zfun.taskTypesOptions = taskTypes.reduce((accum,item) => {
	    
	    accum[item.profile_id] = item.field_111
	    
	    return accum
	},{})
	
	
	zInputsForm({
	    fitView : 1,
	    zModal : 1,
	    title: zLang('Choose the type of task','Выберите тип задачи'),
	    fields : [
	        {
	            label : zLang('Task type', 'Тип задачи'),
	            prependIcon : 'ri-calendar-event-line',
	            type : 'select',
	            id : 'task_type',
	            options : zfun.taskTypesOptions,
	            prependSearchIcon : 'ri-search-line',
	            appendSearchIcon : 'ri-settings-2-line',
	            onAppendSearchIconClick : function () {
	                zfun.taskTypeSettings();
	            }
	        }    
	    ],
	    buttons : [
	        {
	            title : zLang('Choose','Выбрать'),
	            cols  : 12,
	            onClick : function(){
	                
	               zfun.addTaskForm.getFieldValue('task_type');
	               
	               zInputsForm({
                        fitView : 1,
                        zModal : 1,
                        title: zLang('Choose the date of task','Выберите время задачи'),
                    	    buttons : [
                    	        {
                    	            title : zLang('After one hour', 'Через час'),
                    	            cols: 12,
                    	            //color : 'green',
                    	            onClick : function () {
                    	               zInputsForm({
                                    	    fitView : 1,
                                    	    zModal : 1,
                                    	    title: zLang('Assign a new task','Установите новую задачу'),
                                    	        fields : [
                                    	            {
                                        	            id : 'time',
                                        	            label : zLang('Time', 'Время'),
                                        	           // prependIcon: 'fa fa-clock',
                                        	            type: 'text',
                                        	            value : moment().add(1, 'hour').format("HH:mm")
                                    	            },
                                    	            {
                                        	            id : 'text',
                                        	            label : zLang('task target', 'Цель задачи'),
                                        	            prependIcon: 'fa fa-target',
                                        	            type: 'textarea',
                                        	            value : ''
                                    	            },
                                    	            ],
                                        	    buttons : [
                                        	        {
                                        	            title : zLang('Add a new task', 'Добавить новую задачу'),
                                        	            icon : 'fa fa-plus',
                                        	            cols: 12,
                                        	            //color : 'green',
                                        	            onClick : function () {
                                        	                
                                        	            }
                                        	        },
                                        	    ]
                                        }) 
                    	            }
                    	        },
                    	        {
                    	            title : zLang('After two houes', 'Через два часа'),
                    	            cols: 12,
                    	            //color : 'blue',
                    	            onClick : function () {
                    	                zInputsForm({
                                    	    fitView : 1,
                                    	    zModal : 1,
                                    	    title: zLang('Assign a new task','Установите новую задачу'),
                                    	        fields : [
                                    	            {
                                        	            id : 'time',
                                        	            label : zLang('Time', 'Время'),
                                        	           // prependIcon: 'fa fa-clock',
                                        	            type: 'text',
                                        	            value : moment().add(2, 'hour').format("HH:mm")
                                    	            },
                                    	            {
                                        	            id : 'text',
                                        	            label : zLang('task target', 'Цель задачи'),
                                        	            prependIcon: 'fa fa-target',
                                        	            type: 'textarea',
                                        	            value : ''
                                    	            },
                                    	            ],
                                        	    buttons : [
                                        	        {
                                        	            title : zLang('Add a new task', 'Добавить новую задачу'),
                                        	            icon : 'fa fa-plus',
                                        	            cols: 12,
                                        	            //color : 'green',
                                        	            onClick : function () {
                                        	                
                                        	            }
                                        	        },
                                        	    ]
                                        })
                    	            }
                    	        },
                    	        {
                    	            title : zLang('Tomorrow morning', 'Завтра утром'),
                    	            cols: 12,
                    	            //color : 'blue',
                    	            onClick : function () {
                    	                zInputsForm({
                                    	    fitView : 1,
                                    	    zModal : 1,
                                    	    title: zLang('Assign a new task','Установите новую задачу'),
                                    	        fields : [
                                    	            {
                                        	            id : 'time',
                                        	            label : zLang('Time', 'Время'),
                                        	           // prependIcon: 'fa fa-clock',
                                        	            type: 'text',
                                        	            value : '10:00'
                                    	            },
                                    	            {
                                        	            id : 'text',
                                        	            label : zLang('task target', 'Цель задачи'),
                                        	            prependIcon: 'fa fa-target',
                                        	            type: 'textarea',
                                        	            value : ''
                                    	            },
                                    	            ],
                                        	    buttons : [
                                        	        {
                                        	            title : zLang('Add a new task', 'Добавить новую задачу'),
                                        	            icon : 'fa fa-plus',
                                        	            cols: 12,
                                        	            //color : 'green',
                                        	            onClick : function () {
                                        	                
                                        	            }
                                        	        },
                                        	    ]
                                        })
                    	            }
                    	        },
                    	        {
                    	            title : zLang('Tomorrow afternoon', 'Завтра полсе обеда'),
                    	            cols: 12,
                    	            //color : 'blue',
                    	            onClick : function () {
                    	                zInputsForm({
                                    	    fitView : 1,
                                    	    zModal : 1,
                                    	    title: zLang('Assign a new task','Установите новую задачу'),
                                    	        fields : [
                                    	            {
                                        	            id : 'time',
                                        	            label : zLang('Time', 'Время'),
                                        	           // prependIcon: 'fa fa-clock',
                                        	            type: 'text',
                                        	            value : '15:00'
                                    	            },
                                    	            {
                                        	            id : 'text',
                                        	            label : zLang('task target', 'Цель задачи'),
                                        	            prependIcon: 'fa fa-target',
                                        	            type: 'textarea',
                                        	            value : ''
                                    	            },
                                    	            ],
                                        	    buttons : [
                                        	        {
                                        	            title : zLang('Add a new task', 'Добавить новую задачу'),
                                        	            icon : 'fa fa-plus',
                                        	            cols: 12,
                                        	            //color : 'green',
                                        	            onClick : function () {
                                        	                
                                        	            }
                                        	        },
                                        	    ]
                                        })
                    	            }
                    	        },
                    	        {
                    	            title : zLang('Choose date', 'Выбрать дату'),
                    	            cols: 12,
                    	            //color : 'blue',
                    	            onClick : function () {
                    	                zInputsForm({
                                    	    fitView : 1,
                                    	    zModal : 1,
                                    	    title: zLang('Assign a new task','Установите новую задачу'),
                                    	        fields : [
                                    	            {
                                        	            id : 'date',
                                        	            label : zLang('Calendar', 'Календарь'),
                                        	           // prependIcon: 'fa fa-clock',
                                        	            type: 'calendar',
                                    	            },
                                    	            {
                                        	            id : 'time',
                                        	            label : zLang('Time', 'Время'),
                                        	           // prependIcon: 'fa fa-clock',
                                        	            type: 'text',
                                        	            value : '15:00'
                                    	            },
                                    	            {
                                        	            id : 'text',
                                        	            label : zLang('task target', 'Цель задачи'),
                                        	            prependIcon: 'fa fa-target',
                                        	            type: 'textarea',
                                        	            value : ''
                                    	            },
                                    	            ],
                                        	    buttons : [
                                        	        {
                                        	            title : zLang('Add a new task', 'Добавить новую задачу'),
                                        	            icon : 'fa fa-plus',
                                        	            cols: 12,
                                        	            //color : 'green',
                                        	            onClick : function () {
                                        	                
                                        	            }
                                        	        },
                                        	    ]
                                        })
                    	            }
                    	        },
                    	        
                    	    ]
                    }) 
	            }
	        }
	        ]
	}).then( res => {
	    zfun.addTaskForm = res;
	})
